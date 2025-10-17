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

   
    email_box = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Enter your email']")))
    password_box = driver.find_element(By.XPATH, "//input[@placeholder='Enter your password']")
    email_box.send_keys("shafin@gmail.com")
    password_box.send_keys("shafin")
    driver.find_element(By.XPATH, "//button[contains(., 'Sign In')]").click()
    print("🔐 Logging in...")

    
    for _ in range(15):
        token = driver.execute_script("return localStorage.getItem('access')")
        if token:
            break
        time.sleep(1)
    if not token:
        raise Exception("Login failed — no access token found")
    print("✅ Login success!")

  
    driver.get("http://localhost:5173/donatePage")
    wait.until(lambda d: d.execute_script("return document.readyState") == "complete")
    time.sleep(2)
    print("🏠 Donate Page loaded.")

   
    donation_amount_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Custom amount']")))
    donation_amount_field.clear()
    donation_amount_field.send_keys("50")
    print("✅ Donation amount entered: 50")

   
    donation_type_select = wait.until(EC.presence_of_element_located((By.XPATH, "//select[@name='donationType']")))
    donation_type_select.click()
    print("✅ Donation type dropdown opened.")

   
    donation_type_select.find_element(By.XPATH, "//option[normalize-space(text())='One-time']").click()
    print("✅ Donation type selected.")


    terms_checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox']")
    terms_checkbox.click()
    print("✅ Terms checkbox clicked")

    
    donate_button = driver.find_element(By.XPATH, "//button[contains(., 'Donate')]")
    donate_button.click()
    print("🌱 Donate button clicked, waiting for redirect...")

   
    time.sleep(5)
    current_url = driver.current_url
    page_source = driver.page_source.lower()

    if "sslcommerz" in current_url or "payment" in current_url:
        print("✅ Redirected to payment gateway.")
    elif "success" in page_source:
        print("✅ Donation success message detected.")
    else:
        print("⚠️ Donation process initiated, but no confirmation message found.")

    print("🎯 Donate Page Test Completed")

except (TimeoutException, NoSuchElementException, UnexpectedAlertPresentException, Exception) as e:
    print("❌ Test Failed:", e)

finally:
    driver.quit()