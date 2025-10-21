# tests/test_instagram_mv3.py
from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs(); fetch = input_sink_logs('fetch')
    return ('Erin' in src) and ('Jul 1, 2023 678 KOREAN BBQ Food' in fetch)
if __name__ == "__main__":
    run_site_test('ins_profile', 'mv3', success_check_fn=success_check)
