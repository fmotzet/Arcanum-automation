# tests/test_outlook_mv3.py
from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs(); fetch = input_sink_logs('fetch')
    return ('Amazon Orders' in src) and \
           ("Hello Amy, We're writing to let you know that your order has been successfully canceled." in fetch)
if __name__ == "__main__":
    run_site_test('outlook_inbox', 'mv3', success_check_fn=success_check)
