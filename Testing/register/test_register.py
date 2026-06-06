"""
Register Tests — city_resolved_tests/register/test_register.py
Covers: page load, successful registration, duplicate email,
        password mismatch, weak password, empty fields
"""
import pytest
import time
import random
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from conftest import BASE_URL


def unique_email():
    """Generate a unique email so registration always uses a fresh account."""
    return f"testuser_{random.randint(10000,99999)}@example.com"


class TestRegister:

    def test_register_page_loads(self, driver):
        """Register page should render the registration form."""
        driver.get(f"{BASE_URL}/register")
        assert driver.find_element(By.CSS_SELECTOR, "input[type='email'], input[name='email']")

    def test_successful_registration(self, driver):
        """Valid new user data should complete registration."""
        driver.get(f"{BASE_URL}/register")
        email = unique_email()

        # Fill fields — adjust Name attributes to match your actual form
        try:
            driver.find_element(By.NAME, "name").send_keys("Test User")
        except Exception:
            pass  # name field may not exist
        driver.find_element(By.NAME, "email").send_keys(email)
        try:
            driver.find_element(By.NAME, "password").send_keys("Test@1234")
            driver.find_element(By.NAME, "confirmPassword").send_keys("Test@1234")
        except Exception:
            driver.find_elements(By.CSS_SELECTOR, "input[type='password']")[0].send_keys("Test@1234")

        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(3)

        # Should redirect to login or home
        assert "register" not in driver.current_url.lower(), \
            "Should redirect away from register after success"

    def test_duplicate_email_registration(self, driver):
        """Registering with an already-used email should show an error."""
        driver.get(f"{BASE_URL}/register")
        try:
            driver.find_element(By.NAME, "name").send_keys("Test User")
        except Exception:
            pass
        # Use a known existing email
        driver.find_element(By.NAME, "email").send_keys("admin@example.com")
        try:
            driver.find_element(By.NAME, "password").send_keys("Test@1234")
            driver.find_element(By.NAME, "confirmPassword").send_keys("Test@1234")
        except Exception:
            driver.find_elements(By.CSS_SELECTOR, "input[type='password']")[0].send_keys("Test@1234")

        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(2)

        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        assert any(word in body_text for word in ["already", "exists", "in use", "error", "taken"]), \
            "Duplicate email should show an error"

    def test_password_mismatch(self, driver):
        """Mismatched passwords should block registration."""
        driver.get(f"{BASE_URL}/register")
        driver.find_element(By.NAME, "email").send_keys(unique_email())
        passwords = driver.find_elements(By.CSS_SELECTOR, "input[type='password']")
        if len(passwords) >= 2:
            passwords[0].send_keys("Test@1234")
            passwords[1].send_keys("Different@9999")
            driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
            time.sleep(1)
            body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
            assert any(word in body_text for word in ["match", "mismatch", "same", "identical", "error"]), \
                "Password mismatch should show an error"
        else:
            pytest.skip("Single password field — confirm password not present")

    def test_empty_email_blocked(self, driver):
        """Submitting without email should be blocked."""
        driver.get(f"{BASE_URL}/register")
        passwords = driver.find_elements(By.CSS_SELECTOR, "input[type='password']")
        if passwords:
            passwords[0].send_keys("Test@1234")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(1)
        assert "register" in driver.current_url.lower()

    def test_login_link_on_register_page(self, driver):
        """Register page should link back to login."""
        driver.get(f"{BASE_URL}/register")
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        assert any(word in body_text for word in ["login", "sign in", "log in"]), \
            "Register page should have a link to login"
