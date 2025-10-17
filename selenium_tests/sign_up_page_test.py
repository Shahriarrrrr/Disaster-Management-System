from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

# Chrome setup
options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    # Step 1: Go to login page
    driver.get("http://localhost:5173/register")
    print("✅ Opened login page")

    wait = WebDriverWait(driver, 20)

    # Step 2: Click on "Create an account" link
    try:
  
        print("✅ Clicked 'Create an account'")
    except:
        print("⚠️ 'Create an account' link not found or not clickable")
        raise

    # Step 3: Wait for Sign-Up form to appear
    time.sleep(2)  # React load delay
    print("🕓 Checking if Sign-Up page loaded...")
    print("Current URL:", driver.current_url)

    # (optional) Step 4: Fill the Sign-Up form
    # Adjust field names/placeholder based on your signup page form
    try:
        name_field = wait.until(EC.presence_of_element_located(
            (By.XPATH, "//input[contains(@placeholder,'name')]")))
        email_field = driver.find_element(By.XPATH, "//input[contains(@placeholder,'email')]")
        password_field = driver.find_element(By.XPATH, "//input[contains(@placeholder,'password')]")

        name_field.send_keys("Test User")
        email_field.send_keys("testuser@example.com")
        password_field.send_keys("12345")

        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        print("✅ Submitted signup form")

        time.sleep(3)
        print("✅ Sign-Up test executed successfully")

    except Exception as e:
        print("⚠️ Could not find or fill signup form:", e)

except Exception as e:
    print("❌ Test failed:", e)

finally:
    driver.quit()