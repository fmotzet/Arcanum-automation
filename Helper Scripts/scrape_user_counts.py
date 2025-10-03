# Thsi script scrapes the user count from a extension, and mathces it with the correct Arcanum logfrom a directory to check if
# Usage: scrape_user_counts.py --db-path /path/to/db --html-dir /path/to/dir/containing/html/of/cws --logs-dir /path/to/dir/conting/Aranum/Logs
# Output will be the top 15 extenions by usercount, and checks on how many webpages/tests Arcanum tested positivley
import sqlite3
import argparse
import os
import re
from bs4 import BeautifulSoup

def parse_user_count_str(count_str):
    """
    Converts a user count string like "1,234,567+ users" into an integer.
    """
    if not count_str:
        return 0
    try:
        numeric_str = re.sub(r'[^\d]', '', count_str)
        return int(numeric_str)
    except (ValueError, TypeError):
        return 0

def scrape_user_count(html_path):
    """
    Parses an HTML file and looks for the user count string.
    """
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'lxml')
            user_count_pattern = re.compile(r'([\d,+-]+)\s+users')
            element = soup.find(string=user_count_pattern)
            
            if element:
                return element.strip()
            else:
                return None
    except FileNotFoundError:
        return None
    except Exception as e:
        print(f"  [ERROR] Could not parse {os.path.basename(html_path)}: {e}")
        return None

def main():
    """
    Main function to scrape user counts and analyze container logs.
    """
    parser = argparse.ArgumentParser(
        description="Scrape user counts and analyze container logs for Chrome extensions."
    )
    parser.add_argument('--db-path', required=True, help="The full path to the SQLite database file.")
    parser.add_argument('--html-dir', required=True, help="The full path to the directory containing the CWS HTML files.")
    parser.add_argument('--logs-dir', required=True, help="The full path to the container logs directory (e.g., /home/motzet/container_logs/extension_extensions).")
    
    args = parser.parse_args()
    
    # --- Variable Initialization ---
    total_users = 0
    extension_counts = []
    site_success_counts = {} # New dictionary for log analysis

    print(f"[*] Connecting to database: {args.db_path}")
    conn = None
    try:
        conn = sqlite3.connect(args.db_path)
        cursor = conn.cursor()
        
        query = "SELECT filename FROM extensions WHERE status = 'positive'"
        print(f"[*] Executing query: {query}")
        cursor.execute(query)
        results = cursor.fetchall()
        
        if not results:
            print("[!] No extensions with status 'complete' found in the database.")
            return
            
        print(f"[*] Found {len(results)} extensions. Processing user counts and logs...")
        
        found_count, not_found_count, html_missing_count = 0, 0, 0

        for row in results:
            filename = row[0]
            if not (filename and filename.endswith('.crx')):
                continue

            extension_id = filename[:-4]
            
            # --- 1. Scrape User Count ---
            html_file_path = os.path.join(args.html_dir, f"{extension_id}.html")
            if os.path.exists(html_file_path):
                user_count_str = scrape_user_count(html_file_path)
                if user_count_str:
                    found_count += 1
                    numeric_count = parse_user_count_str(user_count_str)
                    if numeric_count > 0:
                        total_users += numeric_count
                        extension_counts.append({'id': extension_id, 'users': numeric_count})
                else:
                    not_found_count += 1
            else:
                html_missing_count += 1

            # --- 2. Analyze Logs ---
            all_logs_path = os.path.join(args.logs_dir, extension_id, 'all_logs')
            if os.path.isdir(all_logs_path):
                for item_name in os.listdir(all_logs_path):
                    # Ensure we're looking at a directory like 'gmail_inbox_mv3_success_try1'
                    item_full_path = os.path.join(all_logs_path, item_name)
                    if not os.path.isdir(item_full_path):
                        continue
                    
                    try:
                        parts = item_name.split('_')
                        if 'mv3' in parts and 'success' in parts:
                            mv3_index = parts.index('mv3')
                            status = parts[mv3_index + 1]
                            
                            if status == 'success':
                                site_name = "_".join(parts[:mv3_index])
                                site_success_counts.setdefault(site_name, 0)
                                site_success_counts[site_name] += 1
                    except (ValueError, IndexError):
                        # This directory name doesn't match the expected format, skip it.
                        pass

        # --- 3. Final Analysis Summary ---
        extension_counts.sort(key=lambda x: x['users'], reverse=True)
        top_15_extensions = extension_counts[:15]

        print("\n" + "="*25 + " ANALYSIS SUMMARY " + "="*25)
        print(f"\n## User Count Statistics")
        print(f"Total extensions processed: {len(results)}")
        print(f"User counts found: {found_count} | Not found in HTML: {not_found_count} | HTML file missing: {html_missing_count}")
        print(f"**Total combined users for all found extensions: {total_users:,}**")

        print(f"\n## Top 15 Extensions by User Count")
        if top_15_extensions:
            print(f"{'Rank':<5} {'Extension ID':<35} {'User Count':>15}")
            print(f"{'-'*4:<5} {'-'*34:<35} {'-'*14:>15}")
            for i, ext in enumerate(top_15_extensions, 1):
                print(f"#{i:<4} {ext['id']:<35} {ext['users']:>15,}")
        else:
            print("No user data was successfully parsed to determine a top list.")
        
        print(f"\n## Log Analysis Summary")
        if site_success_counts:
            sorted_sites = sorted(site_success_counts.items())
            print(f"{'Site':<25} {'Success Count'}")
            print(f"{'-'*24:<25} {'-'*13}")
            for site, count in sorted_sites:
                print(f"{site:<25} {count}")
        else:
            print("No successful log results found in the specified log directory.")

        print("\n" + "="*70)

    except (sqlite3.Error, OSError) as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()
            print("\n[*] Database connection closed.")

if __name__ == '__main__':
    main()