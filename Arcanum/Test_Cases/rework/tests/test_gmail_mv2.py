# tests/test_gmail_mv2.py
from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs(); stor = input_sink_logs('storage'); xhr = input_sink_logs('xhr')
    return ('Payment declined: Update your information so we can ship your order' in src) and \
           ('Hello Amy, We are having trouble authorizing your payment' in stor) and \
           ('xml-send-body-ArrayBuffer' in xhr and 'Please verify or update your payment method' in xhr)
if __name__ == "__main__":
    run_site_test('gmail_inbox', 'mv2', success_check_fn=success_check)
