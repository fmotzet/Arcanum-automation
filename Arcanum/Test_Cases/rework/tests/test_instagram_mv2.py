# tests/test_instagram_mv2.py
from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs(); stor = input_sink_logs('storage'); xhr = input_sink_logs('xhr')
    return ('This is me!!!!' in src) and \
           ('Photo by Erin in The Collective Food Hall at Coda with @cristiano' in stor) and \
           ('xml-send-body-ArrayBuffer' in xhr and '<ArrayBuffer map' in xhr)
if __name__ == "__main__":
    run_site_test('ins_profile', 'mv2', success_check_fn=success_check)
