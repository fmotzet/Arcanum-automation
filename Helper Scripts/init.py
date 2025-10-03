#!/usr/bin/env python3
# This script initializted a SQLite DB in the format used by the Arcnum worker
# Usage: python3 init.py --db-path /path/where/db/should/be/created.db --extensions-dir /path/to/directory/containing/extensions/
import os
import sqlite3
import argparse
import time
import sys
from pathlib import Path

def create_database(db_path):
    """Create SQLite database for tracking extension testing status"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create extensions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS extensions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT UNIQUE,
        status TEXT DEFAULT 'pending',
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        container_id TEXT,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create an index on status for faster queries
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_status ON extensions(status)')
    
    conn.commit()
    conn.close()
    print(f"Database created at {db_path}")

def scan_extensions_directory(extensions_dir, db_path):
    """Scan directory for extensions and add them to the database"""
    if not os.path.exists(extensions_dir):
        print(f"Error: Extensions directory {extensions_dir} not found!")
        sys.exit(1)
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all .crx files in the directory
    extension_files = []
    for root, _, files in os.walk(extensions_dir):
        for file in files:
            if file.endswith('.crx'):
                extension_files.append(os.path.relpath(os.path.join(root, file), extensions_dir))
    
    # Count how many we're adding
    total_extensions = len(extension_files)
    print(f"Found {total_extensions} .crx files in {extensions_dir}")
    
    # Add each extension to the database if it doesn't exist
    added_count = 0
    for filename in extension_files:
        try:
            cursor.execute(
                "INSERT OR IGNORE INTO extensions (filename, status) VALUES (?, 'pending')",
                (filename,)
            )
            if cursor.rowcount > 0:
                added_count += 1
                
            # Print progress every 1000 extensions
            if added_count % 1000 == 0 and added_count > 0:
                print(f"Added {added_count} extensions to database...\r")
                conn.commit()
                
        except sqlite3.Error as e:
            print(f"Error adding extension {filename}: {e}")
    
    conn.commit()
    
    # Get statistics
    cursor.execute("SELECT COUNT(*) FROM extensions WHERE status = 'pending'")
    pending_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM extensions")
    total_db_count = cursor.fetchone()[0]
    
    print(f"\nAdded {added_count} new extensions to database")
    print(f"Database now contains {total_db_count} extensions ({pending_count} pending)")
    
    conn.close()

def reset_hung_jobs(db_path, timeout_hours=12):
    """Reset any jobs that have been 'in_progress' for too long"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Calculate the cutoff time (now - timeout_hours)
    timeout_seconds = timeout_hours * 3600
    cutoff_time = time.time() - timeout_seconds
    
    # Find and reset hung jobs
    cursor.execute('''
    UPDATE extensions 
    SET status = 'pending', start_time = NULL, container_id = NULL, 
        error_message = 'Reset due to timeout after ' || ? || ' hours'
    WHERE status = 'in_progress' AND start_time < ?
    ''', (timeout_hours, cutoff_time))
    
    reset_count = cursor.rowcount
    conn.commit()
    conn.close()
    
    if reset_count > 0:
        print(f"Reset {reset_count} hung jobs (in progress for more than {timeout_hours} hours)")

def main():
    parser = argparse.ArgumentParser(description='Initialize extensions database for Arcanum testing')
    parser.add_argument('--extensions-dir', required=True, help='Directory containing extension .crx files')
    parser.add_argument('--db-path', default=os.path.expanduser('~/arcanum_testing.db'), 
                        help='Path to SQLite database (default: ~/arcanum_testing.db)')
    parser.add_argument('--reset-hung', action='store_true', 
                        help='Reset extensions that have been in progress for too long')
    parser.add_argument('--timeout-hours', type=int, default=12,
                        help='Consider jobs hung after this many hours (default: 12)')
    
    args = parser.parse_args()
    
    # Ensure extensions directory exists and is absolute
    extensions_dir = os.path.abspath(args.extensions_dir)
    if not os.path.isdir(extensions_dir):
        print(f"Error: {extensions_dir} is not a valid directory")
        sys.exit(1)
    
    # Create database if it doesn't exist
    db_path = args.db_path
    db_exists = os.path.exists(db_path)
    if not db_exists:
        create_database(db_path)
    
    # Scan for extensions and add to database
    scan_extensions_directory(extensions_dir, db_path)
    
    # Reset hung jobs if requested
    if args.reset_hung:
        reset_hung_jobs(db_path, args.timeout_hours)
    
    print("Initialization complete!")

if __name__ == "__main__":
    main()
    
