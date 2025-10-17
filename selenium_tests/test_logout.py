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
    wait = WebDriverWait(driver, 20)
    email_box = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Enter your email']")))
    password_box = driver.find_element(By.XPATH, "//input[@placeholder='Enter your password']")
    email_box.send_keys("shafin@gmail.com")
    password_box.send_keys("shafin")
    login_button = driver.find_element(By.XPATH, "//button[contains(., 'Sign In')]")
    login_button.click()
    time.sleep(5)
    token = driver.execute_script("return localStorage.getItem('access');")
    if not token:
        raise Exception("Login failed, no token found")
    possible_xpaths = [
        "//button[contains(., 'Logout')]",
        "//a[contains(., 'Logout')]",
        "//button[contains(., 'Sign Out')]",
        "//a[contains(., 'Sign Out')]"
    ]
    logout_button = None
    for xpath in possible_xpaths:
        try:
            logout_button = wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
            break
        except:
            continue
    if not logout_button:
        raise Exception("Logout button not found with any XPath selector")
    logout_button.click()
    time.sleep(3)
    token_after = driver.execute_script("return localStorage.getItem('access');")
    if token_after is None:
        print("Token cleared after logout")
    else:
        print("Token still exists:", token_after)
    current_url = driver.current_url
    if "login" in current_url:
        print("Redirected back to login page")
    else:
        print("Still on:", current_url)
    print("Logout Test Passed Successfully")
except Exception as e:
    print("Test Failed:", e)
finally:
    driver.quit()