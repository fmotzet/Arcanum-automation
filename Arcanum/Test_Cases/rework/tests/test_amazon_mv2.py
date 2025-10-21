# tests/test_amazon_mv2.py
from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs()
    stor = input_sink_logs('storage')
    xhr = input_sink_logs('xhr')
    return ('startErin Lee' in src and 'delivery instructions_end' in src) and \
           ('startErin Lee' in stor) and \
           ('xml-send-body-ArrayBuffer' in xhr and '<ArrayBuffer map' in xhr)
if __name__ == "__main__":
    run_site_test('amazon_address', 'mv2', success_check_fn=success_check)
