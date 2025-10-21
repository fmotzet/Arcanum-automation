# arcanum_common.py
# -*- coding: utf-8 -*-
import os, time
from colorama import Fore, Back, Style
from pyvirtualdisplay import Display
from typing import Optional, Dict, List, Any
from func_timeout import func_set_timeout, FunctionTimedOut
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

EXECUTION_TIME = 60
test_path = "/root/"

# Binaries & paths
arcanum_executable_path = test_path + 'Arcanum/opt/chromium.org/chromium-unstable/chromium-browser-unstable'
linkedin_specific_arcanum_executable_path = test_path + 'LinkedIn_installer/opt/chromium.org/chromium-unstable/chromium-browser-unstable'
chromedriver_path = test_path + 'chromedriver/chromedriver'
wpr_path = '/root/go/pkg/mod/github.com/catapult-project/catapult/web_page_replay_go@v0.0.0-20230901234838-f16ca3c78e46/'

# Data & logs
user_data_path = '/root/userdata/'
v8_log_path = '/ram/analysis/v8logs/'
log_path = test_path + 'logs/'
os.environ["CHROME_LOG_FILE"] = log_path + 'chromium.log'
custom_extension_dir = '/root/extensions/custom/'
recording_dir = '/root/recordings/'
annotation_dir = '/root/annotations/'
realworld_extension_dir = os.environ.get("REALWORLD_EXT_DIR", "/root/extensions/realworld/")
custom_extension_dir = os.environ.get("CUSTOM_EXT_DIR", "/root/extensions/custom/")
retries_left = 3


# URLs, WPR rules, page selectors, idle timeoutss
from selenium.webdriver.common.by import By
url_mp = {
    'amazon_address': 'https://www.amazon.com/a/addresses',
    'fb_post':'https://www.facebook.com/profile.php?id=100084859195049',
    'gmail_inbox': 'https://mail.google.com/mail/u/0/#inbox',
    'ins_profile':'https://www.instagram.com/xqgtiti/',
    'linkedin_profile':'https://www.linkedin.com/in/amy-lee-gt/',
    'outlook_inbox': 'https://outlook.live.com/mail/0/',
    'paypal_card': 'https://www.paypal.com/myaccount/money/cards/CC-DNGXYXA3SUS8Q',
}
rules_map = {
    'amazon_address': "MAP *.amazon.com:80 127.0.0.1:8080,MAP *.amazon.com:443 127.0.0.1:8081,MAP *.media-amazon.com:80 127.0.0.1:8080,MAP *.media-amazon.com:443 127.0.0.1:8081,MAP *.amazon-adsystem.com:80 127.0.0.1:8080,MAP *.amazon-adsystem.com:443 127.0.0.1:8081,MAP *.ssl-images-amazon.com:80 127.0.0.1:8080,MAP *.ssl-images-amazon.com:443 127.0.0.1:8081,MAP *.cloudfront.net:80 127.0.0.1:8080,MAP *.cloudfront.net:443 127.0.0.1:8081,EXCLUDE localhost",
    'fb_post': "MAP *.facebook.com:80 127.0.0.1:8080,MAP *.facebook.com:443 127.0.0.1:8081,MAP *.fbcdn.net:80 127.0.0.1:8080,MAP *.fbcdn.net:443 127.0.0.1:8081,MAP *.fb.com:80 127.0.0.1:8080,MAP *.fb.com:443 127.0.0.1:8081,EXCLUDE localhost",
    'gmail_inbox': "MAP *.google.com:80 127.0.0.1:8080,MAP *.google.com:443 127.0.0.1:8081,MAP *.gstatic.com:80 127.0.0.1:8080,MAP *.gstatic.com:443 127.0.0.1:8081,MAP *.googleusercontent.com:80 127.0.0.1:8080,MAP *.googleusercontent.com:443 127.0.0.1:8081,EXCLUDE localhost",
    'ins_profile': "MAP *.instagram.com:80 127.0.0.1:8080,MAP *.instagram.com:443 127.0.0.1:8081,MAP *.cdninstagram.com:80 127.0.0.1:8080,MAP *.cdninstagram.com:443 127.0.0.1:8081,MAP *.fbcdn.net:80 127.0.0.1:8080,MAP *.fbcdn.net:443 127.0.0.1:8081,MAP *.facebook.com:80 127.0.0.1:8080,MAP *.facebook.com:443 127.0.0.1:8081,EXCLUDE localhost",
    'linkedin_profile': "MAP *.linkedin.com:80 127.0.0.1:8080,MAP *.linkedin.com:443 127.0.0.1:8081,MAP *.licdn.com:80 127.0.0.1:8080,MAP *.licdn.com:443 127.0.0.1:8081,EXCLUDE localhost",
    'outlook_inbox': "MAP *.office.com:80 127.0.0.1:8080,MAP *.office.com:443 127.0.0.1:8081,MAP *.office.net:80 127.0.0.1:8080,MAP *.office.net:443 127.0.0.1:8081,MAP *.live.com:80 127.0.0.1:8080,MAP *.live.com:443 127.0.0.1:8081,EXCLUDE localhost",
    'paypal_card':"MAP *.paypal.com:80 127.0.0.1:8080,MAP *.paypal.com:443 127.0.0.1:8081,MAP *.paypalobjects.com:80 127.0.0.1:8080,MAP *.paypalobjects.com:443 127.0.0.1:8081,MAP *.recaptcha.net:80 127.0.0.1:8080,MAP *.recaptcha.net:443 127.0.0.1:8081,MAP *.qualtrics.com:80 127.0.0.1:8080,MAP *.qualtrics.com:443 127.0.0.1:8081,MAP *.gstatic.com:80 127.0.0.1:8080,MAP *.gstatic.com:443 127.0.0.1:8081,EXCLUDE localhost"
}
page_selectors = {
    'amazon_address': (By.ID, "a-page"),
    'fb_post': (By.ID, "mount_0_0_LC"),
    'gmail_inbox': (By.CLASS_NAME, "nH"),
    'ins_profile': (By.ID, "mount_0_0_tc"),
    'outlook_inbox': (By.ID, "MainModule"),
    'paypal_card': (By.ID, "contents"),
    'linkedin_profile': (By.CLASS_NAME, "application-outlet"),
}
idle_timeouts = {
    'amazon_address': 2000,
    'fb_post': 15000,
    'gmail_inbox': 30000,
    'ins_profile': 20000,
    'outlook_inbox': 20000,
    'paypal_card': 5000,
    'linkedin_profile': None,  
}

def check_file_exist(extension_name=None, recording_name=None, annotation_name=None, extension_path=None):
    for p in [custom_extension_dir, realworld_extension_dir, recording_dir, annotation_dir]:
        os.makedirs(p, exist_ok=True)
    if extension_path:
        if not os.path.exists(extension_path):
            raise FileNotFoundError(Fore.RED + f"Extension file missing: {extension_path}" + Fore.RESET)
    elif extension_name:
        guessed = os.path.join(custom_extension_dir, extension_name)
        if not os.path.exists(guessed):
            raise FileNotFoundError(Fore.RED + f"Test extension [{guessed}] missing" + Fore.RESET)
    if recording_name and not os.path.exists(recording_dir + recording_name):
        raise FileNotFoundError(Fore.RED + f"Recording [{recording_name}] missing" + Fore.RESET)
    if annotation_name and not os.path.exists(annotation_dir + annotation_name):
        raise FileNotFoundError(Fore.RED + f"Annotation [{annotation_name}] missing" + Fore.RESET)

def input_sink_logs(category):
    fp = v8_log_path + 'taint_storage.log' if category == 'storage' else user_data_path + f'taint_{category}.log'
    return open(fp, 'r', encoding='utf-8', errors='ignore').read() if os.path.exists(fp) else ''

def input_source_logs():
    fp = v8_log_path + 'taint_sources.log'
    return open(fp, 'r', encoding='utf-8', errors='ignore').read() if os.path.exists(fp) else ''

def ensure_gmail_transformer(enable: bool):
    """
    If enable=True, copy transformers_for_gmail_inbox.go -> transformers.go
    else restore transformers.go_backup -> transformers.go
    """
    wp = os.path.join(wpr_path, "src/webpagereplay")
    os.chdir(wp)

    # backup once
    if not os.path.exists("transformers.go_backup") and os.path.exists("transformers.go"):
        os.system("cp transformers.go transformers.go_backup")

    if enable:
        if not os.path.exists("transformers_for_gmail_inbox.go"):
            raise RuntimeError("transformers_for_gmail_inbox.go missing under webpagereplay/")
        os.system("cp transformers_for_gmail_inbox.go transformers.go")
    else:
        if os.path.exists("transformers.go_backup"):
            os.system("cp transformers.go_backup transformers.go")

def start_wprgo(recording_name: str, annotation_name: Optional[str], rules: str):
    # Must run from the module root so `go run src/wpr.go` sees src/
    os.chdir(wpr_path)
    inject = f"--inject_scripts=deterministic.js,{annotation_dir+annotation_name}" if annotation_name else ""
    cmd = (
        "nohup /usr/local/go/bin/go run src/wpr.go replay "
        "--http_port=8080 --https_port=8081 "
        f"{inject} {recording_dir+recording_name} > {log_path}wprgo.log 2>&1 &"
    )
    os.system(cmd)

def init(extension_name, target_page=None):
    print(f'=============== Start Testing the Custom Extension: {extension_name} ===============')
    os.system('pkill Xvfb')
    os.system('pkill chrome')
    os.system('pkill chromedriver')
    os.system('pkill wpr')

    # Turn on Gmail transformer when testing Gmail
    gmail_mode = (target_page == 'gmail_inbox') or ('gmail_' in (extension_name or ''))
    ensure_gmail_transformer(gmail_mode)

    display = Display(visible=0, size=(1920, 1080))
    display.start()


def deinit():
    print('=============== Finish Test ===============\n')
    os.system('pkill Xvfb; pkill chrome; pkill chromedriver; pkill wpr')

    ensure_gmail_transformer(False)

@func_set_timeout(120)
def launch_driver(load_extension, extension_name, *, extension_path=None, recording_name=None, rules=None, annotation_name=None, idle_timeout_ms=None, delay_animation_ms=None, linkedin_specific=False):
    if not os.path.exists(chromedriver_path):
        raise FileNotFoundError(Fore.RED + f"Chromedriver not found: {chromedriver_path}" + Fore.RESET)
    options = webdriver.ChromeOptions()
    if linkedin_specific:
        if not os.path.exists(linkedin_specific_arcanum_executable_path):
            raise FileNotFoundError(Fore.RED + "LinkedIn-specific Arcanum binary missing" + Fore.RESET)
        options.binary_location = linkedin_specific_arcanum_executable_path
    else:
        if not os.path.exists(arcanum_executable_path):
            raise FileNotFoundError(Fore.RED + "Arcanum binary missing" + Fore.RESET)
        options.binary_location = arcanum_executable_path

    options.add_argument(f'--user-data-dir={user_data_path}')
    options.add_argument("--enable-logging")
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--ignore-ssl-errors=yes")
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-gpu')

    if load_extension:
        if extension_path:
            ext_path = extension_path
        else:
            ext_path = os.path.join(custom_extension_dir, extension_name)

        if ext_path.endswith('.crx'):
            options.add_extension(ext_path)
        else:
            options.add_argument(f'--load-extension={ext_path}')

    if idle_timeout_ms is not None:
        options.add_argument(f'--custom-script-idle-timeout-ms={idle_timeout_ms}')
    if delay_animation_ms is not None:
        options.add_argument(f'--custom-delay-for-animation-ms={delay_animation_ms}')

    if recording_name is not None:
        os.chdir(wpr_path)
        options.add_argument('--host-resolver-rules=%s' % rules)
        if annotation_name is not None:
            cmd = f'nohup /usr/local/go/bin/go run src/wpr.go replay --http_port=8080 --https_port=8081 --inject_scripts=deterministic.js,{annotation_dir+annotation_name} {recording_dir+recording_name} > {log_path}wprgo.log 2>&1 &'
            time.sleep(10)
        else:
            cmd = f'nohup /usr/local/go/bin/go run src/wpr.go replay --http_port=8080 --https_port=8081 {recording_dir+recording_name} > {log_path}wprgo.log 2>&1 &'
            time.sleep(10)
        os.system(cmd)

    prefs = {"profile.default_content_setting_values.notifications": 2}
    options.add_experimental_option("prefs", prefs)
    driver = webdriver.Chrome(service=Service(executable_path=chromedriver_path), options=options)
    driver.set_page_load_timeout(600)
    return driver

def run_site_test(target_page, *, success_check_fn, extension_basename=None, extension_path=None):
    """
    Runs one site test. If extension_path is provided, that file is installed.
    """
    extension_name = extension_basename

    recording_name = f'{target_page}.wprgo'
    annotation_name = f'{target_page}.js'
    rules = rules_map[target_page]
    test_URL = url_mp[target_page]

    check_file_exist(extension_name=extension_name, recording_name=recording_name,
                     annotation_name=annotation_name, extension_path=extension_path)
    init(extension_name if not extension_path else os.path.basename(extension_path))

    linkedin_specific = (target_page == 'linkedin_profile')
    try:
        driver = launch_driver(
            True, extension_name,
            extension_path=extension_path,
            recording_name=recording_name, rules=rules, annotation_name=annotation_name,
            idle_timeout_ms=idle_timeouts[target_page],
            delay_animation_ms=idle_timeouts[target_page],
            linkedin_specific=linkedin_specific
        )
        print(f"Launch Arcanum success. Arcanum starts running. On{target_page}")
        time.sleep(1)
        driver.get(test_URL)

        # Wait for page “ready” element if we have one
        if target_page in page_selectors:
            sel_by, sel_val = page_selectors[target_page]
            try:
                if target_page in ('ins_profile',):
                    time.sleep(10)
                ui = WebDriverWait(driver, 40).until(EC.visibility_of_element_located((sel_by, sel_val)))
                innerhtml = ui.get_attribute('innerHTML')
                t = innerhtml.count('data-taint')
                if t: print(f'Inject annotation success: {t} tainted DOM elements on {target_page}')
            
            except FunctionTimedOut as e:
                print(f"Timeout on {target_page}: {e}")
                if retries_left > 0:
                    time.sleep(5)  # small backoff
                    print(f"Retrying… attempts left: {retries_left}")
                    retries_left=retries_left - 1
                    return run_site_test(
                        target_page,
                        success_check_fn=success_check_fn,
                        extension_basename=extension_basename,
                        extension_path=extension_path,
                    )
                print("Out of retries for timeout.")
                deinit()
            except Exception as e:
                print(f'Warning: could not confirm taints on {target_page}: {e}')

        print(f'Execute the extension for {EXECUTION_TIME}s after load...')
        time.sleep(EXECUTION_TIME)
        driver.quit()
    except Exception as e:
        print(e)
        print(Fore.RED + f'Fail: {target_page}' + Fore.RESET)
        deinit()
        return False

    print('End running Arcanum. Start checking taint logs.')
    ok = success_check_fn()
    print((Back.GREEN + "Success" + Back.RESET) if ok else (Fore.RED + "Fail" + Fore.RESET))
    deinit()
    return ok
