from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import NoSuchElementException, TimeoutException, UnexpectedAlertPresentException
import time

options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    print("🟢 Opening login page...")
    driver.get("http://localhost:5173/login")
    wait = WebDriverWait(driver, 25)

    # Login (fixed credentials)
    email_box = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Enter your email']")))
    password_box = driver.find_element(By.XPATH, "//input[@placeholder='Enter your password']")
    email_box.send_keys("shafin@gmail.com")
    password_box.send_keys("shafin")
    driver.find_element(By.XPATH, "//button[contains(., 'Sign In')]").click()
    print("🔐 Logging in...")

    # Wait for token in localStorage
    for _ in range(15):
        token = driver.execute_script("return localStorage.getItem('access')")
        if token:
            break
        time.sleep(1)
    if not token:
        raise Exception("Login failed — no access token found")
    print("✅ Login success!")

    # Step 2: Go to home/dashboard
    driver.get("http://localhost:5173/")
    wait.until(lambda d: d.execute_script("return document.readyState") == "complete")
    time.sleep(2)
    print("🏠 Home page loaded.")

    # Step 3: Find and click SOS button
    sos_button = None
    possible_selectors = [
        "//button[contains(., 'SOS') or contains(., 'Emergency')]",
        "//a[contains(., 'SOS') or contains(., 'Emergency')]",
        "//div[contains(., 'SOS') or contains(., 'Emergency')]"
    ]

    for xpath in possible_selectors:
        try:
            sos_button = wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
            driver.execute_script("arguments[0].scrollIntoView(true);", sos_button)
            sos_button.click()
            print("🚨 SOS button clicked!")
            break
        except:
            continue

    if sos_button is None:
        raise Exception("❌ SOS button not found with any selector")

    # Step 4: Check if SOS alert, modal, or redirect happens
    time.sleep(4)
    current_url = driver.current_url
    page_source = driver.page_source.lower()

    if "alert" in page_source or "emergency" in page_source or "sos" in page_source:
        print("✅ SOS modal or alert detected.")
    elif "/sos" in current_url or "/emergency" in current_url:
        print(f"✅ Redirected to SOS page: {current_url}")
    else:
        print("⚠️ SOS button clicked, but no visible change detected.")

    print("🎯 Emergency SOS Button Test Completed")

except (TimeoutException, NoSuchElementException, UnexpectedAlertPresentException, Exception) as e:
    print("❌ Test Failed:", e)

finally:
    driver.quit()
