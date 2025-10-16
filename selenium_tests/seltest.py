from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

options = Options()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    driver.get("http://localhost:5173/login")
    print("Opened:", driver.current_url)

    wait = WebDriverWait(driver, 20)

    # locate by placeholder
    email_box = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//input[@placeholder='Enter your email']")))
    password_box = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//input[@placeholder='Enter your password']")))
    email_box.send_keys("admin@example.com")
    password_box.send_keys("12345")

    # click Sign In
    login_button = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(., 'Sign In')]")))
    login_button.click()

    time.sleep(5)
    print("✅ Login test executed successfully.")

except Exception as e:
    print("❌ Test failed:", e)

finally:
    driver.quit()
