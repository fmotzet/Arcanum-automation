#!/usr/bin/env python3
import subprocess
import time
import os
import random
import datetime
import sys
# imports for sqllite communication
import sqlite3
import argparse
import math
import json, re, shutil

def run_command(command, shell=False):
    """Run a command and return its output"""
    print(f"Running: {command}")
    if shell:
        process = subprocess.run(command, shell=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    else:
        process = subprocess.run(command, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if process.returncode != 0:
        print(f"Error: {process.stderr}")
        raise Exception(f"Command failed with return code {process.returncode}")

    return process.stdout.strip()

def get_unique_container_name():
    """Generate a unique container name based on timestamp and random number"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    random_suffix = random.randint(1000, 9999)
    return f"arcanum_run_{timestamp}_{random_suffix}"

# get a random pending extension
def get_next_extension(db_path, retries=200, delay=0.5):
    """Get the next pending extension from the database"""
    for attempt in range(retries):
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, filename FROM extensions 
                WHERE status = 'pending' 
                ORDER BY RANDOM() LIMIT 1
            """)
            result = cursor.fetchone()
            if not result:
                conn.close()
                print("No pending extensions found in the database.")
                return None, None
            
            extension_id, extension_filename = result
            
            cursor.execute("""
                UPDATE extensions 
                SET status = 'in_progress', start_time = CURRENT_TIMESTAMP 
                WHERE id = ?
            """, (extension_id,))
            conn.commit()
            conn.close()
            return extension_id, extension_filename
        except sqlite3.OperationalError as e:
            if "database is locked" in str(e):
                if attempt < retries - 1:
                    time.sleep(delay)
                else:
                    raise
            else:
                raise

# def update_extension_status(db_path, extension_id, status, error_message=None, container_id=None):
#     """Update the status of an extension in the database"""
#     conn = sqlite3.connect(db_path)
#     cursor = conn.cursor()
    
#     if status == 'completed' or status == 'failed' or status == 'error':
#         cursor.execute("""
#             UPDATE extensions 
#             SET status = ?, end_time = CURRENT_TIMESTAMP, error_message = ?, container_id = ? 
#             WHERE id = ?
#         """, (status, error_message, container_id, extension_id))
#     else:
#         cursor.execute("""
#             UPDATE extensions 
#             SET status = ?, container_id = ? 
#             WHERE id = ?
#         """, (status, container_id, extension_id))
#     conn.commit()
#     conn.close()

def update_extension_status(db_path, extension_id, status, error_message=None, container_id=None,
                            *, max_retries=10):
    def _do_update(conn, cursor):
        if status in ('completed', 'failed', 'error'):
            cursor.execute("""
                UPDATE extensions 
                   SET status = ?, end_time = CURRENT_TIMESTAMP, error_message = ?, container_id = ?
                 WHERE id = ?
            """, (status, error_message, container_id, extension_id))
        else:
            cursor.execute("""
                UPDATE extensions 
                   SET status = ?, container_id = ? 
                 WHERE id = ?
            """, (status, container_id, extension_id))

    _with_db_write_retry(db_path, _do_update, max_retries=max_retries)

def cleanup_container(container_name, container_id, extension_filename, extension_id, status):
    print(f"All tasks completed")
    #print(f"Container name: {container_name}")
    #print(f"Container ID: {container_id}")
    print(f"Extension tested: {extension_filename} (ID: {extension_id})")
    print(f"Test result: {status}")
    # print("Container info and cleanup commands have been added to ~/arcanum_containers.txt")
    print(f"Trying to clean up conatainer {container_name} with id {container_id}")
    try: 
        run_command("docker rm -f -v " + container_name, True)
    except:
        pass
    #docker rm -f -v container_name

LOCK_STRINGS = ("database is locked", "database is busy", "database schema is locked")

def _with_db_write_retry(db_path, fn, *, max_retries=10, base_delay=0.05, max_delay=1.0):
    """
    Runs 'fn(conn, cursor)' inside a retry loop tailored for SQLite lock errors.
    Uses connection timeout + PRAGMA busy_timeout and an exponential backoff with jitter.
    """
    attempt = 0
    while True:
        try:
            # Short connection-level timeout; busy_timeout handles most waits
            conn = sqlite3.connect(db_path, timeout=2.0)
            try:
                cur = conn.cursor()
                # Let SQLite wait a bit before returning SQLITE_BUSY
                cur.execute("PRAGMA busy_timeout=5000")
                cur.execute("PRAGMA synchronous=NORMAL")

                fn(conn, cur)
                conn.commit()
                return
            finally:
                conn.close()
        except sqlite3.OperationalError as e:
            msg = str(e).lower()
            if any(s in msg for s in LOCK_STRINGS) and attempt < max_retries:
                # exponential backoff with jitter
                sleep_s = min(max_delay, base_delay * (2 ** attempt)) * (0.5 + random.random()/2)
                time.sleep(sleep_s)
                attempt += 1
                continue
            # Not a lock error or out of retries
            raise
    
def main():
    # Add command line arguments for database and extensions directory
    parser = argparse.ArgumentParser(description='Run Arcanum testing for a single extension')
    parser.add_argument('--db-path', default=os.path.expanduser('~/arcanum_testing.db'), 
                        help='Path to SQLite database (default: ~/arcanum_testing.db)')
    parser.add_argument('--extensions-dir', required=True, 
                        help='Base directory containing extension .crx files')
    args = parser.parse_args()
    
    # Check if database exists
    if not os.path.exists(args.db_path):
        print(f"Error: Database not found at {args.db_path}")
        print("Please run init.py first to create and populate the database.")
        sys.exit(1)
    
    # Get the next extension to test
    extension_id, extension_filename = get_next_extension(args.db_path)

    if not extension_id:
        print("No extensions available for testing. Exiting.")
        sys.exit(0)
    
    # Full path to the extension file
    extension_path = os.path.join(args.extensions_dir, extension_filename)
    print(f"Testing extension: {extension_filename} (ID: {extension_id})")
    
    # Generate a unique container name
    container_name = get_unique_container_name()
    print(f"Using container name: {container_name}")

    with open(os.path.expanduser("~/arcanum_containers.txt"), "a") as f:
        f.write(f"# Container created on {datetime.datetime.now().isoformat()} for extension {extension_filename}\n")
        # f.write(f"docker rm -f -v {container_name}\n")
        f.write(f"# ========================================\n\n")
    
    try:
        print("Step 1: Pulling Docker image...")
        run_command(["docker", "pull", "xqgtiti/arcanum_run:latest"])
    
        print("Step 2: Starting Docker container...")
        run_command(["docker", "run", "-itd", "--privileged", f"--name={container_name}", "xqgtiti/arcanum_run:latest"])
        
        # Get container ID
        container_id = run_command(["docker", "ps", "-q", "-f", f"name={container_name}"])
        print(f"Container ID: {container_id}")
        
        # Update database with container ID
        update_extension_status(args.db_path, extension_id, 'in_progress', container_id=container_id)
        
        print("Waiting for container to initialize: ", end="", flush=True)
        for i in range(3, 0, -1):
            print(f"\rWaiting for container to initialize: {i} seconds remaining...", end="", flush=True)
            time.sleep(1)
        print("\rContainer initialization wait complete!                          ")

        print("Step 3: Creating directories inside container...")
        run_command(["docker", "exec", container_name, "mkdir", "-p", "/root/Arcanum/"])
        run_command(["docker", "exec", container_name, "mkdir", "-p", "/root/extensions/realworld"])
        run_command(["docker", "exec", container_name, "mkdir", "-p", "/root/LinkedIn_installer"])
        
        print("Step 4: Copying files to container...")
        
        run_command(f"docker cp {extension_path} {container_name}:/root/extensions/realworld/", shell=True)
        
        chromium_path = os.path.expanduser("~/chromium/src/out/Arcanum/chromium-browser-unstable_108.0.5359.71-1_amd64.deb")
        test_cases_path = os.path.expanduser("~/Arcanum/Test_Cases/.")
        recordings_path = os.path.expanduser("~/Arcanum/recordings/.")
        annotations_path = os.path.expanduser("~/Arcanum/annotations/.")
        linked_in_binary_path = os.path.expanduser("~/Arcanum/linkedin-binary/linkedin_profile.deb")

        run_command(f"docker cp {chromium_path} {container_name}:/root/Arcanum/", shell=True)
        run_command(f"docker cp {test_cases_path} {container_name}:/root/Test_Cases/", shell=True)
        run_command(f"docker cp {recordings_path} {container_name}:/root/recordings/", shell=True)
        run_command(f"docker cp {annotations_path} {container_name}:/root/annotations/", shell=True)
        run_command(f"docker cp {linked_in_binary_path} {container_name}:/root/LinkedIn_installer/linkedin_profile.deb", shell=True)
        print(f"Successfully copied extension and test scripts to container {container_name}")

        print("Step 5a: Unpacking deb file")
        ext_basename = os.path.basename(extension_path)
        container_ext = f"/root/extensions/realworld/{ext_basename}"
        commands = [
            "cd /root/LinkedIn_installer",
            "ar x linkedin_profile.deb",
            "tar -vxf control.tar && tar -vxf data.tar",
            "chmod +x opt/chromium.org/chromium-unstable/chromium-browser-unstable",
            "cd /root/Arcanum/",
            "ar x chromium-browser-unstable_108.0.5359.71-1_amd64.deb",
            "tar -xvf data.tar && tar -xvf control.tar",
        ]
        combined_command = " && ".join(commands)
        run_command(["docker", "exec", container_name, "bash", "-c", combined_command])

        startcore = random.randint(31, 383)
        taskset_command = f"taskset -c {(startcore-3)}-{startcore} python3.8 ~/Test_Cases/rework/wrapper.py --extension-path '{container_ext}' --mv both --sites all"
        result = run_command(["docker", "exec", container_name, "bash", "-c", taskset_command]) 

        
        proc = subprocess.run(
            ["docker", "exec", container_name, "bash", "-c", combined_command],
            text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        stdout = proc.stdout
        stderr = proc.stderr
        print(stdout)
        if stderr:
            print(f"[docker exec stderr]\n{stderr}")

        # Determine test success and update status
        # Find the summary file path the wrapper printed
        m = re.search(r'WRAPPER_SUMMARY_PATH="([^"]+)"', stdout)
        summary_path_in_container = "/root/logs/summaries"

        # Parse the final JSON block printed by wrapper
        summary = {}
        start = stdout.rfind("{")
        if start != -1:
            try:
                summary = json.loads(stdout[start:])
            except Exception:
                pass

        overall = summary.get("overall")
        overall_success = (proc.returncode == 0) or (overall == "success")

        status = 'completed' if overall_success else 'failed'
        update_extension_status(args.db_path, extension_id, status, container_id=container_id)
       
        print("Step 6: Retrieving artifacts from container...")

        if extension_filename[-4:]==".crx":
            extensionName = extension_filename[:-4]
        else: extensionName = extension_filename
        host_root = os.path.expanduser(f"~/container_logs/extension_{extensionName}")

        # 6a) copy saved summary json
        if summary_path_in_container:
            dst_summary = os.path.join(host_root, os.path.basename(summary_path_in_container))
            try:
                # run_command(f"docker cp {container_name}:{summary_path_in_container} {dst_summary}", shell=True)
                os.makedirs(host_root, exist_ok=True)
                run_command(f"docker cp {container_name}:/root/logs {os.path.join(host_root, 'all_logs')}", shell=True)
                print(f"Saved summary: {dst_summary}")
            except Exception as e:
                print(f"Warning: could not copy summary: {e}")

        # 6b) copy each archive_dir from the wrapper summary
        for r in summary.get("results", []):
            ad = r.get("archive_dir")
            if ad:
                dst_dir = os.path.join(
                    host_root,
                    os.path.basename(os.path.dirname(ad)),
                    os.path.basename(ad)
                )
                os.makedirs(os.path.dirname(dst_dir), exist_ok=True)
                try:
                    run_command(f"docker cp {container_name}:{ad} {dst_dir}", shell=True)
                    print(f"Saved archive: {dst_dir}")
                except Exception as e:
                    print(f"Warning: could not copy archive {ad}: {e}")
        

        print(f"Artifacts saved under {host_root}")
        cleanup_container(container_name, container_id, extension_filename, extension_id, status)

        
    except Exception as e:
        print(f"Error during testing: {str(e)}")
        try: 
            update_extension_status(args.db_path, extension_id, status=status, error_message=str(e))
            cleanup_container(container_name, container_id, extension_filename, extension_id, status=status)
        except:
            status="failed"
            update_extension_status(args.db_path, extension_id, status=status, error_message=str(e))
            cleanup_container(container_name, container_id, extension_filename, extension_id, status=status)
        return
    

if __name__ == "__main__":
    main()

# cleanup_container(container_name, container_id, extension_filename, extension_id, "failed early")
# cleanup_container(container_name, container_id, extension_filename, extension_id, status)
