import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

# ===== CONFIGURATION =====
BASE_URL = "http://localhost:5173"   # vite dev server — change if deployed
# BASE_URL = "https://your-deployed-url.web.app"

TEST_USER_EMAIL    = "testuser@example.com"
TEST_USER_PASSWORD = "Test@1234"
ADMIN_EMAIL        = "admin@example.com"
ADMIN_PASSWORD     = "Admin@1234"


@pytest.fixture(scope="function")
def driver():
    """Fresh Chrome browser for each test."""
    options = Options()
    # options.add_argument("--headless")          # uncomment for CI
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1400,900")

    drv = webdriver.Chrome(options=options)
    drv.implicitly_wait(10)
    yield drv
    drv.quit()


@pytest.fixture(scope="function")
def logged_in_driver(driver):
    """Driver that is already logged in as a normal user."""
    driver.get(f"{BASE_URL}/login")
    from selenium.webdriver.common.by import By
    driver.find_element(By.NAME, "email").send_keys(TEST_USER_EMAIL)
    driver.find_element(By.NAME, "password").send_keys(TEST_USER_PASSWORD)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    import time; time.sleep(2)          # wait for redirect
    return driver
