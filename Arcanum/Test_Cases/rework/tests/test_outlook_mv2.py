# tests/test_outlook_mv2.py
from rework.arcanum_common import run_site_test, input_source_logs, input_sink_logs
def success_check():
    src = input_source_logs(); stor = input_sink_logs('storage'); xhr = input_sink_logs('xhr')
    return ('Lease Approved For 1016 West Avenue' in src) and \
           ('The executed agreement is attached to this email.' in stor) and \
           ('xml-send-body-ArrayBuffer' in xhr and 'Fidelity Investments' in xhr)
if __name__ == "__main__":
    run_site_test('outlook_inbox', 'mv2', success_check_fn=success_check)
