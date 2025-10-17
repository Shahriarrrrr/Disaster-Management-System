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
    print("✅ Opened Login Page")

    wait = WebDriverWait(driver, 20)

   
    email_box = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//input[@placeholder='Enter your email']")))
    password_box = driver.find_element(By.XPATH, "//input[@placeholder='Enter your password']")

    email_box.send_keys("shahriarazamkhan@gmail.com")    
    password_box.send_keys("1234")            


    login_button = driver.find_element(By.XPATH, "//button[contains(., 'Sign In')]")
    login_button.click()
    print("✅ Login button clicked")

 
    time.sleep(5)
    current_url = driver.current_url
    print("🌐 Current URL:", current_url)


    token = driver.execute_script("return localStorage.getItem('access');")
    if token:
        print("🔐 Access token found in LocalStorage!")
    else:
        print("❌ No access token found in LocalStorage.")

    
    try:
        dashboard_text = driver.find_element(By.TAG_NAME, "h1").text
        print("🧭 Dashboard heading:", dashboard_text)
    except:
        print("⚠️ Could not find a <h1> heading on dashboard.")

  
    if "dashboard" in current_url or "home" in current_url or token:
        print("✅ Dashboard Test Passed Successfully!")
    else:
        print("❌ Dashboard Test Failed!")

except Exception as e:
    print("❌ Test Failed with error:", e)

finally:
    driver.quit()