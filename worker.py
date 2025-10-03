#!/usr/bin/env python3
import subprocess
import time
import os
import signal
import psutil
import argparse
import sys
import sqlite3
from datetime import datetime

# Configuration
MAX_WORKERS = 5
CPU_THRESHOLD = 80  # percent
MEMORY_THRESHOLD = 90  # percent
DISK_THRESHOLD = 95  # percent
CHECK_INTERVAL = 60  # seconds
EXTENSION_COUNT_LIMIT = 100 # count

def log_message(message):
    """Log a message with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")
    
def run_command(command, shell=False):
    """Run a command and return its output"""
    log_message(f"Running: {command}")
    if shell:
        process = subprocess.run(command, shell=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    else:
        process = subprocess.run(command, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if process.returncode != 0:
        print(f"Error: {process.stderr}")
        raise Exception(f"Command failed with return code {process.returncode}")

def clean_old_arcanum_docker_containers():
    run_command("docker container rm $(docker container ls -a -q --filter name=arcanum_run_*) -f -v" ,True)

def get_pending_extension_count(db_path, retries=200, delay=0.5):
    """Get the count of pending extensions from the database with retry on lock"""
    for attempt in range(retries):
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM extensions WHERE status = 'pending'")
            # cursor.execute("SELECT COUNT(*) FROM extensions WHERE status IN ('pending', 'error')")
            count = cursor.fetchone()[0]
            conn.close()
            return count
        except sqlite3.OperationalError as e:
            if "database is locked" in str(e):
                if attempt < retries - 1:
                    time.sleep(delay)
                else:
                    raise
            else:
                raise


def get_current_worker_count():
    """Count the number of currently running docker_automation.py processes"""
    count = 0
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            # Check if this is a python process running docker_automation.py
            if proc.info['name'] == 'python' or proc.info['name'] == 'python3':
                if proc.info['cmdline'] and isinstance(proc.info['cmdline'], list):
                    cmdline = ' '.join(proc.info['cmdline'])
                    if 'docker_automation.py' in cmdline and proc.pid != os.getpid():
                        count += 1
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return count

def check_resources():
    """Check if system resources are available for another worker"""
    # Check CPU usage
    cpu_percent = psutil.cpu_percent(interval=1)
    if cpu_percent > CPU_THRESHOLD:
        log_message(f"CPU usage too high: {cpu_percent}% > {CPU_THRESHOLD}%")
        return False
    
    # Check memory usage
    memory = psutil.virtual_memory()
    if memory.percent > MEMORY_THRESHOLD:
        log_message(f"Memory usage too high: {memory.percent}% > {MEMORY_THRESHOLD}%")
        return False
    
    # Check disk usage
    disk = psutil.disk_usage('/')
    if disk.percent > DISK_THRESHOLD:
        log_message(f"Disk usage too high: {disk.percent}% > {DISK_THRESHOLD}%")
        return False
    
    return True

def start_worker(db_path, extensions_dir):
    """Start a new docker_automation.py worker process"""
    log_message("Starting new worker process...")
    
    # Start the worker process
    cmd = [
        "python3", 
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "docker_automation.py"),
        "--db-path", db_path,
        "--extensions-dir", extensions_dir
    ]
    
    process = subprocess.Popen(
        cmd, 
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        preexec_fn=os.setsid
    )
    
    log_message(f"Started worker with PID {process.pid}")
    return process

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Manage multiple docker_automation.py worker processes')
    parser.add_argument('--db-path', default=os.path.expanduser('~/arcanum_testing.db'), 
                        help='Path to SQLite database (default: ~/arcanum_testing.db)')
    parser.add_argument('--extensions-dir', required=True, 
                        help='Base directory containing extension .crx files')
    parser.add_argument('--max-workers', type=int, default=MAX_WORKERS,
                        help=f'Maximum number of concurrent workers (default: {MAX_WORKERS})')
    parser.add_argument('--go-until', type=int, default=EXTENSION_COUNT_LIMIT,
                        help=f'How Many extenions to test until we exit (default: {EXTENSION_COUNT_LIMIT})')
    parser.add_argument('--clean-old-containers', type=bool,
                        help='if old arcanum Contianers and Volumes should be removed before the script is run')
    args = parser.parse_args()
    
    # Set max variables from arguments
    max_workers = args.max_workers
    max_extensions = args.go_until
    extensions_started = int(0)
    # remove old arcanum contaiers if user choses to
    if args.clean_old_containers:
        try:
            log_message(f"Removing Old Containers")
            clean_old_arcanum_docker_containers()
        except:
            log_message(f"Could not remove old containers... maybe none exist?")
    
    # Check if database exists
    if not os.path.exists(args.db_path):
        log_message(f"Error: Database not found at {args.db_path}")
        log_message("Please run init.py first to create and populate the database.")
        sys.exit(1)
    
    # Track worker processes
    workers = []
    
    try:
        log_message(f"Worker manager started. Max workers: {max_workers}")
        worker_limit_flag = True
        
        while worker_limit_flag:
            # Clean up finished workers
            workers = [w for w in workers if w.poll() is None]
            
            # Count current workers including any that might have been started outside this script
            current_worker_count = get_current_worker_count()
            log_message(f"Current worker count: {current_worker_count}/{max_workers}")
            
            # Get count of pending extensions
            pending_count = get_pending_extension_count(args.db_path)
            log_message(f"Pending extensions: {pending_count}")
            
            # if pending_count == 0:
            #     log_message("No pending extensions. Waiting before checking again...")
            #     time.sleep(CHECK_INTERVAL)
            #     continue
            
            # Check if we can start more workers
            if current_worker_count < max_workers:
                # Check system resources
                if check_resources() and pending_count > 0:
                    # Start a new worker
                    worker = start_worker(args.db_path, args.extensions_dir)
                    workers.append(worker)
                    extensions_started += 1
                    
                    # Wait a bit before starting another worker to let system stabilize
                    # time.sleep(5)
                    time.sleep(1)
                elif pending_count > 0:
                    log_message("System resources too constrained to start new worker.")
                    time.sleep(CHECK_INTERVAL)
            else:
                log_message(f"Maximum worker count ({max_workers}) reached. Waiting...")
                time.sleep(CHECK_INTERVAL)

            if current_worker_count == pending_count == 0:
                log_message(f"finished with all extensions an no extensions are left. exiting...")
                worker_limit_flag = False

            if extensions_started >= max_extensions:
                log_message(f"Reached max extensions waiting for workers to finish")
                while current_worker_count > 0:
                    log_message(f"Still wating on {current_worker_count} to finish before exiting. Sleeping for a bit...")
                    time.sleep(CHECK_INTERVAL)
                    current_worker_count = get_current_worker_count()
                worker_limit_flag = False


    except KeyboardInterrupt:
        log_message("Keyboard interrupt received. Shutting down...")
    finally:
        # Clean shutdown of all workers
        for worker in workers:
            if worker.poll() is None:  # If still running
                try:
                    # Try to terminate the process group
                    os.killpg(os.getpgid(worker.pid), signal.SIGTERM)
                    log_message(f"Sent SIGTERM to worker {worker.pid}")
                except OSError:
                    pass
        
        log_message("Worker manager shutdown complete.")


if __name__ == "__main__":
    main()
