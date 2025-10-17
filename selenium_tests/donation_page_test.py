from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import (
    UnexpectedAlertPresentException,
    NoSuchElementException,
    WebDriverException,
    TimeoutException,
)
import time
import traceback
import os
import sys
from pathlib import Path

out_dir = os.path.dirname(__file__) or "."
chromedriver_log = os.path.join(out_dir, "chromedriver.log")

options = Options()
options.add_argument("--start-maximized")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-extensions")
options.add_argument("--ignore-certificate-errors")
# Important: allow origins (fixes many blank "Message:" crashes with recent Chrome/driver)
options.add_argument("--remote-allow-origins=*")
# Reduce noisy console output
options.add_experimental_option("excludeSwitches", ["enable-logging"])
# options.add_argument("--headless")  # enable if you want headless (remember to disable if you need visuals)

service = Service(ChromeDriverManager().install(), log_path=chromedriver_log)

driver = None
try:
    driver = webdriver.Chrome(service=service, options=options)
    driver.set_page_load_timeout(30)

    # print a bit of driver info for debugging
    try:
        print("ChromeDriver / browser capabilities:", driver.capabilities)
    except Exception:
        pass

    def save_debug_snapshot(name="error"):
        try:
            screenshot = os.path.join(out_dir, f"{name}.png")
            source = os.path.join(out_dir, f"{name}.html")
            driver.save_screenshot(screenshot)
            with open(source, "w", encoding="utf-8") as f:
                f.write(driver.page_source)
            print(f"Saved screenshot -> {screenshot}")
            print(f"Saved page source -> {source}")
        except Exception as e:
            print("Failed to save debug snapshot:", e)

    # Step 1: Open login page
    driver.get("http://localhost:5173/login")
    print("Opened site:", driver.current_url)
    wait = WebDriverWait(driver, 25)

    # Step 2: Fill login form (use waits for both fields)
    email_box = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//input[@placeholder='Enter your email']")))
    password_box = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//input[@placeholder='Enter your password']")))
    email_box.clear()
    password_box.clear()
    email_box.send_keys("shafin@gmail.com")
    password_box.send_keys("shafin")

    # Step 3: Click sign in (use clickable wait)
    try:
        signin_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Sign In')]")))
        signin_btn.click()
        time.sleep(3)
    except UnexpectedAlertPresentException:
        alert = driver.switch_to.alert
        print("⚠️ Login alert:", alert.text)
        alert.accept()
        raise Exception("Invalid login credentials/alert encountered")

    # Wait for successful login: check localStorage (with safe JS call)
    token = None
    for _ in range(12):
        try:
            token = driver.execute_script("return window.localStorage.getItem('access');")
        except WebDriverException:
            token = None
        if token:
            break
        time.sleep(1)

    if not token:
        raise Exception("Login failed, no token found in localStorage")

    print("✅ Login success")

    # Step 4: Navigate to donation page
    driver.get("http://localhost:5173/donation")
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(., 'Donate')]")))
    print("✅ Donation page loaded")

    # Step 5: Fill custom amount
    custom_amount = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Custom amount']")))
    custom_amount.clear()
    custom_amount.send_keys("300")

    # Step 6: Agree to terms checkbox (use clickable wait)
    checkbox = wait.until(EC.element_to_be_clickable((By.XPATH, "//input[@type='checkbox']")))
    checkbox.click()

    # Step 7: Click donate button
    donate_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Donate')]")))
    driver.execute_script("arguments[0].scrollIntoView(true);", donate_button)
    time.sleep(0.5)
    donate_button.click()

    print("🌱 Donate button clicked")
    time.sleep(5)

    # Step 8: Verify result
    current_url = driver.current_url or ""
    page_src = driver.page_source.lower() if driver.page_source else ""
    if "sslcommerz" in current_url or "payment" in current_url.lower():
        print("✅ Redirected to payment gateway successfully")
    elif "success" in page_src:
        print("✅ Donation success message detected")
    else:
        print("⚠️ Donation process initiated, but no confirmation message found")

    print("🎯 Donation Page Test Completed")

except Exception as e:
    print("❌ Test Failed:", e)
    traceback.print_exc()

    # save screenshot + html
    try:
        if driver:
            save_debug_snapshot("donation_test_error")
    except Exception:
        pass

    # print tail of chromedriver log for diagnosis
    try:
        if os.path.exists(chromedriver_log):
            with open(chromedriver_log, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.read().splitlines()
            tail = "\n".join(lines[-200:])
            print("----- chromedriver.log (last 200 lines) -----")
            print(tail)
            print("----- end chromedriver.log -----")
        else:
            print("chromedriver.log not found at", chromedriver_log)
    except Exception as ex:
        print("Failed to read chromedriver.log:", ex)

finally:
    try:
        if driver:
            driver.quit()
    except Exception:
        pass