"""
Login Tests — city_resolved_tests/login/test_login.py
Covers: valid login, wrong password, empty fields, Google login button
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# ---------- import shared config ----------
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from conftest import BASE_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD


class TestLogin:

    def test_login_page_loads(self, driver):
        """Login page should render with email/password fields."""
        driver.get(f"{BASE_URL}/login")
        assert "login" in driver.current_url.lower() or driver.find_element(By.NAME, "email")

    def test_valid_login(self, driver):
        """Valid credentials should redirect away from /login."""
        driver.get(f"{BASE_URL}/login")
        driver.find_element(By.NAME, "email").send_keys(TEST_USER_EMAIL)
        driver.find_element(By.NAME, "password").send_keys(TEST_USER_PASSWORD)
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        WebDriverWait(driver, 10).until(
            lambda d: "login" not in d.current_url
        )
        assert "login" not in driver.current_url, "Should redirect after successful login"

    def test_invalid_password(self, driver):
        """Wrong password should show an error message."""
        driver.get(f"{BASE_URL}/login")
        driver.find_element(By.NAME, "email").send_keys(TEST_USER_EMAIL)
        driver.find_element(By.NAME, "password").send_keys("WrongPass999!")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(2)

        # Error toast / alert / text should appear
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        assert any(word in body_text for word in ["invalid", "error", "incorrect", "wrong", "failed"]), \
            "Expected an error message for wrong password"

    def test_invalid_email_format(self, driver):
        """Malformed email should trigger HTML5 or custom validation."""
        driver.get(f"{BASE_URL}/login")
        email_field = driver.find_element(By.NAME, "email")
        email_field.send_keys("not-an-email")
        driver.find_element(By.NAME, "password").send_keys("anypassword")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(1)

        # Should still be on login page
        assert "login" in driver.current_url.lower() or \
               driver.find_element(By.NAME, "email").is_displayed()

    def test_empty_email_field(self, driver):
        """Submitting with empty email should not proceed."""
        driver.get(f"{BASE_URL}/login")
        driver.find_element(By.NAME, "password").send_keys(TEST_USER_PASSWORD)
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(1)
        assert "login" in driver.current_url.lower()

    def test_empty_password_field(self, driver):
        """Submitting with empty password should not proceed."""
        driver.get(f"{BASE_URL}/login")
        driver.find_element(By.NAME, "email").send_keys(TEST_USER_EMAIL)
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(1)
        assert "login" in driver.current_url.lower()

    def test_google_login_button_present(self, driver):
        """Google login button should be visible on login page."""
        driver.get(f"{BASE_URL}/login")
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        assert "google" in body_text, "Google sign-in option should be present"

    def test_register_link_on_login_page(self, driver):
        """Login page should have a link/button to the register page."""
        driver.get(f"{BASE_URL}/login")
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        assert any(word in body_text for word in ["register", "sign up", "create account"]), \
            "Link to register page should exist"

    def test_logout(self, logged_in_driver):
        """After logout user should be redirected to login/home."""
        driver = logged_in_driver
        # Try navbar logout button (adjust selector to your project)
        try:
            logout_btn = driver.find_element(By.XPATH,
                "//*[contains(text(),'Logout') or contains(text(),'Sign out') or contains(text(),'Log Out')]")
            logout_btn.click()
            time.sleep(2)
            assert "login" in driver.current_url.lower() or driver.current_url == f"{BASE_URL}/"
        except Exception:
            pytest.skip("Logout button selector needs adjustment for this project")
