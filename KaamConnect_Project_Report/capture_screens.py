import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--window-size=1280,800')
opts.add_argument('--disable-gpu')
opts.add_argument('--user-data-dir=' + os.environ['TEMP'] + r'\chrome_full_shots')

driver = webdriver.Chrome(options=opts)
out_dir = os.path.abspath(r'KaamConnect_Project_Report\screenshots')
os.makedirs(out_dir, exist_ok=True)

def capture(url, fname, sleep_s=3):
    driver.get(url)
    time.sleep(sleep_s)
    path = os.path.join(out_dir, fname)
    driver.save_screenshot(path)
    print(f'Captured {fname}: {os.path.getsize(path)} bytes')

# 1. Landing
capture('https://kaam-connect-coral.vercel.app/', 'landing_page.png', 4)

# 2. Login
capture('https://kaam-connect-coral.vercel.app/login', 'login_page.png', 2)

# 3. Register
capture('https://kaam-connect-coral.vercel.app/register', 'register_page.png', 2)

# 4. Search
capture('https://kaam-connect-coral.vercel.app/search', 'search_page.png', 4)

# 5. Customer Login & Dashboard
try:
    driver.get('https://kaam-connect-coral.vercel.app/login')
    time.sleep(2)
    buttons = driver.find_elements(By.TAG_NAME, 'button')
    for b in buttons:
        if 'Customer' in b.text:
            b.click()
            break
    time.sleep(1)
    submit_btn = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
    submit_btn.click()
    time.sleep(4)
    driver.save_screenshot(os.path.join(out_dir, 'customer_dashboard.png'))
    print('Captured customer_dashboard.png')

    capture('https://kaam-connect-coral.vercel.app/customer/bookings', 'customer_bookings.png', 3)
    capture('https://kaam-connect-coral.vercel.app/chat', 'chat_page.png', 3)
except Exception as e:
    print('Customer login error:', e)

# 6. Worker Login & Dashboard
try:
    driver.get('https://kaam-connect-coral.vercel.app/login')
    driver.execute_script('localStorage.clear();')
    driver.refresh()
    time.sleep(2)
    buttons = driver.find_elements(By.TAG_NAME, 'button')
    for b in buttons:
        if 'Worker' in b.text:
            b.click()
            break
    time.sleep(1)
    submit_btn = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
    submit_btn.click()
    time.sleep(4)
    driver.save_screenshot(os.path.join(out_dir, 'worker_dashboard.png'))
    print('Captured worker_dashboard.png')
    capture('https://kaam-connect-coral.vercel.app/worker/bookings', 'worker_bookings.png', 3)
except Exception as e:
    print('Worker login error:', e)

# 7. Admin Login & Dashboard
try:
    driver.get('https://kaam-connect-coral.vercel.app/login')
    driver.execute_script('localStorage.clear();')
    driver.refresh()
    time.sleep(2)
    buttons = driver.find_elements(By.TAG_NAME, 'button')
    for b in buttons:
        if 'Admin' in b.text:
            b.click()
            break
    time.sleep(1)
    submit_btn = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
    submit_btn.click()
    time.sleep(4)
    driver.save_screenshot(os.path.join(out_dir, 'admin_dashboard.png'))
    print('Captured admin_dashboard.png')
except Exception as e:
    print('Admin login error:', e)

driver.quit()
print('All captures complete!')

