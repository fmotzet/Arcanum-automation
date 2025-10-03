# This script pics a random extenions from the db. 
# Usage python3 get_random_cws_page.py --db-path /path/to/Arcnum/db
# Output: the id of a random extenions along with the url to the CWS page

import sqlite3
import random
import argparse

def get_random_extension_url(db_path: str):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all matching filenames
    cursor.execute("SELECT filename FROM extensions WHERE status = 'positive'")
    results = cursor.fetchall()

    if not results:
        print("No extensions found with status = 'positive'.")
        return None

    # Pick one at random
    filename = random.choice(results)[0]

    # Strip .crx extension if present
    if filename.endswith(".crx"):
        ext_id = filename[:-4]
    else:
        ext_id = filename

    # Build Chrome Web Store URL
    url = f"https://chromewebstore.google.com/detail/{ext_id}"

    conn.close()
    return url

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Gets a random extension from the arcnum db, usfull for manual tesing."
    )
    parser.add_argument('--db-path', required=True, help="The full path to the SQLite database file.")
    args = parser.parse_args()
    print(get_random_extension_url(args.db_path))
