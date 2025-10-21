# tests/test_linkedin_mv3.py
from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs(); fetch = input_sink_logs('fetch')
    return ('Douglasville, Georgia, United States' in src and 'amy-lee-gt' in src) and \
           ('Douglasville, Georgia, United States' in fetch)
if __name__ == "__main__":
    run_site_test('linkedin_profile', 'mv3', success_check_fn=success_check)
