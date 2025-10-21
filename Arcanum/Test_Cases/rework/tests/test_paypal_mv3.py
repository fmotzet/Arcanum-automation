# tests/test_paypal_mv3.py
from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs(); fetch = input_sink_logs('fetch')
    return ('Visa Credit' in src and "2143" in src) and ('PayPal balance' in fetch and '$0.00' in fetch)
if __name__ == "__main__":
    run_site_test('paypal_card', 'mv3', success_check_fn=success_check)
