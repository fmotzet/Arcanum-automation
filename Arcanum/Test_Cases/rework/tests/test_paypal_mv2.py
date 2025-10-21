# tests/test_paypal_mv2.py
from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs(); stor = input_sink_logs('storage'); xhr = input_sink_logs('xhr')
    # researchers used Chinese-escaped text + a marker '0120_end'
    return ("\\x8d8a\\x57ce\\x533a\\x76db\\x4e16\\x540d" in src) and \
           ('0120_end' in stor) and \
           ('xml-send-body-ArrayBuffer' in xhr and '<ArrayBuffer map' in xhr)
if __name__ == "__main__":
    run_site_test('paypal_card', 'mv2', success_check_fn=success_check)
