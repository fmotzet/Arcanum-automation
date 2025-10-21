# tests/test_facebook_mv2.py
from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs(); stor = input_sink_logs('storage'); xhr = input_sink_logs('xhr')
    return ('High School Reunion' in src) and \
           ('startHigh School Reunion_end' in stor) and \
           ('xml-send-body-ArrayBuffer' in xhr and '<ArrayBuffer map' in xhr)
if __name__ == "__main__":
    run_site_test('fb_post', 'mv2', success_check_fn=success_check)
