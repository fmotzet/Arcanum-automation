# tests/

from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs(); fetch = input_sink_logs('fetch')
    return ('Amy Lee' in src) and ('2 friends' in fetch)
if __name__ == "__main__":
    run_site_test('fb_post', 'mv3', success_check_fn=success_check)
