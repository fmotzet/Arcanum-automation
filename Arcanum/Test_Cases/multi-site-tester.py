#!/usr/bin/env python3
import selenium
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import time
import os
import platform
import shutil
from colorama import Fore, Back, Style
from func_timeout import func_set_timeout
import func_timeout
from pyvirtualdisplay import Display
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import sys

in_debug = False
EXECUTION_TIME = 60
test_path = "/root/"
arcanum_executable_path = test_path + 'Arcanum/opt/chromium.org/chromium-unstable/chromium-browser-unstable'

linkedin_specific_arcanum_executable_path = test_path + 'LinkedIn_installer/opt/chromium.org/chromium-unstable/chromium-browser-unstable'
chromedriver_path = test_path + 'chromedriver/chromedriver'
wpr_path = '/root/go/pkg/mod/github.com/catapult-project/catapult/web_page_replay_go@v0.0.0-20230901234838-f16ca3c78e46/'

log_path = test_path+'logs/'
os.environ["CHROME_LOG_FILE"] = log_path+'chromium.log'
user_data_path = '/root/userdata/'
realworld_extension_dir = '/root/extensions/realworld/'
recording_dir = '/root/recordings/'
annotation_dir = '/root/annotations/'
v8_log_path = '/ram/analysis/v8logs/'
site_logs_dir = '/root/site_logs/'  # Directory to store site-specific logs

# Sites to test, excluding linkedin which requires special handling
TEST_SITES = [
    'ins_profile',
    'fb_post',
    'amazon_address',
    'gmail_inbox',
    'outlook_inbox',
    'paypal_card'
]

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
    'paypal_card': (By.ID, "contents")
}

idle_timeouts = {
    'amazon_address': 2000,
    'fb_post': 15000,
    'gmail_inbox': 30000,
    'ins_profile': 20000,
    'outlook_inbox': 20000,
    'paypal_card': 5000
}

def find_crx_file(test_extension_dir):
    """Finds the first .crx file in the test directory using os module."""
    try:
        files = os.listdir(test_extension_dir)
        crx_files = [f for f in files if f.endswith('.crx')]
        
        if not crx_files:
            print(Fore.RED + "Error: No .crx file found in " + test_extension_dir + Fore.RESET)
            exit(1)

        extension_name = crx_files[0]
        print(f"Found extension: {extension_name}")
        return extension_name
        
    except Exception as e:
        print(Fore.RED + f"Error finding .crx file: {e}" + Fore.RESET)
        exit(1)

def init(extension_id):
    print('=============== Start Testing the Real-world Extension: [%s] ==============='%extension_id)
    os.system('pkill Xvfb')
    os.system('pkill chrome')
    os.system('pkill chromedriver')
    os.system('pkill wpr')

    # Delete old user data dir
    os.system('rm -rf %s'%user_data_path)
    # Clean old logs
    os.system('rm -rf %s/*'%v8_log_path)

    os.makedirs(user_data_path, exist_ok=True)
    os.makedirs(v8_log_path, exist_ok=True)
    os.makedirs(log_path, exist_ok=True)
    os.makedirs(site_logs_dir, exist_ok=True)

    display = Display(visible=0, size=(1920, 1080))
    display.start()

def deinit(extension_id):
    print('=============== Finish Test ===============\n')
    os.system('pkill Xvfb')
    os.system('pkill chrome')
    os.system('pkill chromedriver')
    os.system('pkill wpr')

@func_set_timeout(20)
def launch_driver(load_extension, extension_name, recording_name = None, rules = None, annotation_name = None,
                  idle_timeout_ms = None, delay_animation_ms = None, linkedin_specific = False):

    if os.path.exists(arcanum_executable_path) == False:
        print(Fore.RED + "Error: Given Arcanum executable path [%s] does not exist. "%arcanum_executable_path + Fore.RESET)
        exit(0)

    if os.path.exists(chromedriver_path) == False:
        print(Fore.RED + "Error: Given chromedriver path [%s] does not exist. "%chromedriver_path + Fore.RESET)
        exit(0)

    service = Service(executable_path=chromedriver_path)
    options = webdriver.ChromeOptions()
    if linkedin_specific:
        if os.path.exists(linkedin_specific_arcanum_executable_path) == False:
            print(Fore.RED + "Error: Given Arcanum specific executable path for LinkedIn page [%s] does not exist. Please download it first." % linkedin_specific_arcanum_executable_path + Fore.RESET)
            exit(0)
        options.binary_location = linkedin_specific_arcanum_executable_path
    else:
        options.binary_location = arcanum_executable_path

    options.add_argument('--user-data-dir=%s' % user_data_path)
    options.add_argument("--enable-logging")
    options.add_argument("--v=0")
    options.add_argument('--verbose')
    options.add_argument('--log-path="%s"'%log_path)
    options.add_argument('--net-log-capture-mode=IncludeCookiesAndCredentials')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--ignore-ssl-errors=yes')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-gpu')

    if load_extension:
        extension_path = realworld_extension_dir + extension_name
        if extension_name.endswith('.crx'): # Crx file
            options.add_extension(extension_path)
        else: # Unpack Extension
            options.add_argument('--load-extension={}'.format(extension_path))

    if idle_timeout_ms != None:
        options.add_argument('--custom-script-idle-timeout-ms=%d' % idle_timeout_ms)
    if delay_animation_ms != None:
        options.add_argument('--custom-delay-for-animation-ms=%d' % idle_timeout_ms)

    if recording_name != None:
        os.chdir(wpr_path)
        options.add_argument('--host-resolver-rules=%s' % rules)
        run_wprgo = ''
        if annotation_name != None:
            run_wprgo = 'nohup /usr/local/go/bin/go run src/wpr.go replay --http_port=8080 --https_port=8081 --inject_scripts=deterministic.js,%s %s > %swprgo.log 2>&1 &'%(annotation_dir+annotation_name,recording_dir+recording_name,log_path)
        else:
            run_wprgo = 'nohup /usr/local/go/bin/go run src/wpr.go replay --http_port=8080 --https_port=8081 %s > %swprgo.log 2>&1 &'%(recording_dir+recording_name,log_path)
        os.system(run_wprgo)

    prefs = {"profile.default_content_setting_values.notifications": 2}
    options.add_experimental_option("prefs", prefs)
    driver = webdriver.Chrome(service=service, options=options)
    driver.set_page_load_timeout(600)

    return driver

def check_file_exist(extension_name, recording_name, annotation_name):
    if os.path.exists(realworld_extension_dir) == False:
        os.system('mkdir -p %s' % realworld_extension_dir)
    if os.path.exists(recording_dir) == False:
        os.system('mkdir -p %s' % recording_dir)
    if os.path.exists(annotation_dir) == False:
        os.system('mkdir -p %s' % annotation_dir)

    if extension_name != None and os.path.exists(realworld_extension_dir + extension_name) == False:
        print(Fore.RED+"Error: Test extension [%s] does not exist. Download it from the GitHub repo first."%extension_name + Fore.RESET)
        exit(0)

    if recording_name != None and os.path.exists(recording_dir + recording_name) == False:
        print(Fore.RED+"Error: The required recording file [%s] does not exist. Download it from our GitHub repo first." % recording_name + Fore.RESET )
        exit(0)

    if annotation_name != None and os.path.exists(annotation_dir + annotation_name) == False:
        print(Fore.RED + "Error: The required annotation file [%s] does not exist. Download it from our GitHub repo first." % annotation_name + Fore.RESET)
        exit(0)

def input_sink_logs(category):
    """Read log file safely, returning None if it doesn't exist"""
    file_path = ''
    if (category == 'storage'):
        file_path = v8_log_path + 'taint_storage.log'
    else:
        file_path = user_data_path + 'taint_%s.log'%category
        
    if not os.path.exists(file_path):
        return None
        
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading log file {file_path}: {e}")
        return None

def input_source_logs():
    """Read source log file safely, returning None if it doesn't exist"""
    file_path = v8_log_path + 'taint_sources.log'
    
    if not os.path.exists(file_path):
        return None
        
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading source log file: {e}")
        return None

def check_taint_logs():
    """Check for any taint logs and analyze them for data leaks"""
    # List which logs exist
    source_log = input_source_logs()
    xhr_log = input_sink_logs('xhr')
    fetch_log = input_sink_logs('fetch')
    storage_log = input_sink_logs('storage')
    
    # Report what was found
    print("Taint log status:")
    print(f"- Source log: {'Found' if source_log else 'Not found'}")
    print(f"- XHR log: {'Found' if xhr_log else 'Not found'}")
    print(f"- Fetch log: {'Found' if fetch_log else 'Not found'}")
    print(f"- Storage log: {'Found' if storage_log else 'Not found'}")
    
    # No source log means no tainted data was accessed
    if not source_log:
        print("No source log found - extension did not access any tainted data")
        return False
        
    # If we have source log but no sink logs, data was accessed but not leaked
    if not xhr_log and not fetch_log and not storage_log:
        print("Extension accessed tainted data but did not leak it")
        return False
        
    # Look for leaks in each sink
    leaks_found = []
    
    if xhr_log and len(xhr_log) > 0:
        print("Potential data leak through XMLHttpRequest detected")
        leaks_found.append("xhr")
        
    if fetch_log and len(fetch_log) > 0:
        print("Potential data leak through Fetch API detected")
        leaks_found.append("fetch")
        
    if storage_log and len(storage_log) > 0:
        print("Potential data leak through Storage detected")
        leaks_found.append("storage")
        
    if leaks_found:
        print(f"Data leaks found in: {', '.join(leaks_found)}")
        return True
    else:
        return False

def save_site_logs(extension_id, site):
    """Save logs for this site to a separate directory"""
    site_dir = os.path.join(site_logs_dir, f"{extension_id}_{site}")
    os.makedirs(site_dir, exist_ok=True)
    
    # Log files to save
    log_files = [
        (os.path.join(v8_log_path, 'taint_sources.log'), os.path.join(site_dir, 'taint_sources.log')),
        (os.path.join(v8_log_path, 'taint_storage.log'), os.path.join(site_dir, 'taint_storage.log')),
        (os.path.join(user_data_path, 'taint_xhr.log'), os.path.join(site_dir, 'taint_xhr.log')),
        (os.path.join(user_data_path, 'taint_fetch.log'), os.path.join(site_dir, 'taint_fetch.log')),
        (os.path.join(log_path, 'chromium.log'), os.path.join(site_dir, 'chromium.log')),
        (os.path.join(log_path, 'wprgo.log'), os.path.join(site_dir, 'wprgo.log'))
    ]
    
    # Copy each log file if it exists
    for source, dest in log_files:
        if os.path.exists(source):
            try:
                shutil.copy2(source, dest)
                print(f"Saved log: {dest}")
            except Exception as e:
                print(f"Error saving log {source} to {dest}: {e}")

def test_site(extension_name, extension_id, target_page):
    print(f"\n=== Testing extension on {target_page} ===")
    
    test_URL = url_mp[target_page]
    recording_name = '%s.wprgo'%target_page
    annotation_name = '%s.js'%target_page
    rules = rules_map[target_page]
    
    try:
        check_file_exist(extension_name=extension_name, recording_name=recording_name, annotation_name=annotation_name)
    except Exception as e:
        print(f"Error checking files for {target_page}: {e}")
        return False
    
    # Clean previous logs to start fresh for this site
    os.system('rm -rf %s/*'%v8_log_path)
    os.system('rm -rf %s/taint_*'%user_data_path)
    
    try:
        idle_timeout = idle_timeouts.get(target_page, 5000)
        driver = launch_driver(load_extension=True, extension_name=extension_name,
                              recording_name=recording_name, rules=rules, annotation_name=annotation_name,
                              idle_timeout_ms=idle_timeout, delay_animation_ms=idle_timeout)
        
        print(f'Launch Arcanum success for {target_page}. Arcanum starts running.')
        time.sleep(1)
        driver.get(test_URL)
        
        try:
            # Try to find the page element to confirm page loaded
            if target_page in page_selectors:
                selector_type, selector_value = page_selectors[target_page]
                ui = WebDriverWait(driver, 40).until(
                    EC.visibility_of_element_located((selector_type, selector_value)))
                
                innerhtml = ui.get_attribute('innerHTML')
                tainted_element_num = innerhtml.count('data-taint')
                if (tainted_element_num):
                    print(f'Inject annotation success: {tainted_element_num} tainted DOM elements on {target_page}')
            else:
                print(f"Warning: No page selector defined for {target_page}")
                time.sleep(5)  # Wait a bit if we don't have a specific element to wait for
                
        except Exception as e:
            print(f"Warning: Could not find page element for {target_page}: {e}")
            # Continue even if we couldn't find the element
        
        print(f'Execute the extension for {EXECUTION_TIME}s on {target_page}')
        time.sleep(EXECUTION_TIME)
        driver.quit()
        
        print(f'Checking taint logs for {target_page}')
        leak_detected = check_taint_logs()
        
        save_site_logs(extension_id, target_page)
        
        if leak_detected:
            print(f"SUCCESS: Found data leak on {target_page}")
            return True
        else:
            print(f"No data leaks detected on {target_page}")
            return False
            
    except Exception as e:
        print(f"Error testing {target_page}: {e}")
        try:
            save_site_logs(extension_id, target_page)
        except:
            pass
        return False

def start_extension_test():
    """
    Test an extension against multiple sites
    """
    try:
        extension_name = find_crx_file(realworld_extension_dir)
        if extension_name[-4:] == ".crx":
            extension_id = extension_name[:-4]
        else:
            extension_id = extension_name
            
        results_file = os.path.join(site_logs_dir, f"{extension_id}_results.txt")
        
        init(extension_id)
        
        success = False
        sites_tested = []
        
        with open(results_file, 'w') as f:
            f.write(f"Test results for extension: {extension_id}\n")
            f.write(f"Test date: {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            for site in TEST_SITES:
                try:
                    sites_tested.append(site)
                    site_result = test_site(extension_name, extension_id, site)
                    
                    result_str = "LEAK DETECTED" if site_result else "No leak detected"
                    f.write(f"{site}: {result_str}\n")
                    
                    if site_result:
                        success = True
                        print(f"\n===> EXTENSION LEAKS DATA ON {site} <===\n")
                        break  # Stop after first success
                except Exception as e:
                    print(f"Error testing site {site}: {e}")
                    f.write(f"{site}: ERROR - {str(e)}\n")
                    continue
            
            f.write("\nSummary:\n")
            f.write(f"Sites tested: {', '.join(sites_tested)}\n")
            f.write(f"Overall result: {'LEAK DETECTED' if success else 'No leaks detected'}\n")
        
        success_output = 'Realworld Extension [%s]: ' % extension_id + Back.GREEN + "Success" + Back.RESET + "."
        fail_output = 'Realworld Extension [%s]: ' % extension_id + Fore.RED + "Fail" + Fore.RESET + "."
        
        if success:
            print(success_output)
            print(f"Results saved to {results_file}")
            deinit(extension_id)
            sys.exit(0)  # Success
        else:
            print(fail_output + " No data leaks detected on any site.")
            print(f"Results saved to {results_file}")
            deinit(extension_id)
            sys.exit(1)  # Failure
            
    except Exception as e:
        print(f"Fatal error: {e}")
        try:
            deinit(extension_id if 'extension_id' in locals() else "unknown")
        except:
            pass
        sys.exit(1)  # Failure

if __name__ == '__main__':
    start_extension_test()
