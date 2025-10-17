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
    driver.get("http://localhost:5173/login")  # Ensure this URL is correct for your login page
    wait = WebDriverWait(driver, 25)

    # Login with fixed credentials
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

    # Step 2: Go to /leaderboard page
    driver.get("http://localhost:5173/leaderboard")
    wait.until(lambda d: d.execute_script("return document.readyState") == "complete")
    time.sleep(2)
    print("🏠 Leaderboard page loaded.")

    # Step 3: Wait for 'Filter by Month' dropdown to be visible and interactable
    filter_dropdown = None
    possible_selectors = [
        "//select[@id='monthFilter']",
        "//select[contains(@class, 'month-filter')]",
        "//select[descendant::option[contains(text(), 'Month')]]"
    ]

    for xpath in possible_selectors:
        try:
            filter_dropdown = wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
            filter_dropdown.click()
            print("✅ Filter by Month dropdown opened.")
            break
        except:
            continue

    if filter_dropdown is None:
        raise Exception("❌ Filter by Month dropdown not found with any selector")

    # Step 4: Select a month from the dropdown
    month_option = wait.until(EC.presence_of_element_located((By.XPATH, "//option[normalize-space(text())='May']")))  # Example: May month
    month_option.click()
    print("✅ Month 'May' selected from dropdown.")

    # Step 5: Apply filter and check if leaderboard updates (e.g., by checking for visible entries)
    time.sleep(3)  # Wait for filter to apply
    leaderboard_entries = driver.find_elements(By.XPATH, "//div[@class='leaderboard-entry']")
    
    if leaderboard_entries:
        print("✅ Leaderboard updated with filtered results.")
    else:
        print("⚠️ No leaderboard entries found after applying filter.")

    print("🎯 Filter by Month Test Completed")

except (TimeoutException, NoSuchElementException, UnexpectedAlertPresentException, Exception) as e:
    print("❌ Test Failed:", e)

finally:
    driver.quit()