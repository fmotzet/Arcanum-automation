# tests/test_amazon_mv3.py
from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs()
    fetch = input_sink_logs('fetch')
    return ('JACKSONVILLE, AL 36265-2402' in src and 'United States' in src) and \
           ('Erin Lee' in fetch and 'JACKSONVILLE, AL' in fetch)
if __name__ == "__main__":
    run_site_test('amazon_address', 'mv3', success_check_fn=success_check)
