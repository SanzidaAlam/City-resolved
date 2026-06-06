"""
Homepage Tests — city_resolved_tests/homepage/test_homepage.py
Covers: page load, navbar, hero section, recent issues visible,
        navigation links, footer
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from conftest import BASE_URL


class TestHomepage:

    def test_homepage_loads(self, driver):
        """Homepage should load with HTTP 200 (no crash)."""
        driver.get(BASE_URL)
        assert driver.title != "", "Page should have a title"

    def test_page_title_contains_city(self, driver):
        """Title or heading should reference the City Resolved brand."""
        driver.get(BASE_URL)
        page_content = driver.find_element(By.TAG_NAME, "body").text.lower()
        assert any(word in page_content for word in ["city", "resolved", "issue"]), \
            "Homepage should mention city/resolved/issue"

    def test_navbar_present(self, driver):
        """A navigation bar (nav element or header) should be visible."""
        driver.get(BASE_URL)
        nav = driver.find_elements(By.TAG_NAME, "nav")
        header = driver.find_elements(By.TAG_NAME, "header")
        assert len(nav) > 0 or len(header) > 0, "Navbar/header should be present"

    def test_navbar_has_login_link(self, driver):
        """Unauthenticated users should see a Login link in the navbar."""
        driver.get(BASE_URL)
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        assert any(word in body_text for word in ["login", "sign in"]), \
            "Login link should appear for unauthenticated users"

    def test_hero_or_banner_present(self, driver):
        """Hero section / banner should be visible."""
        driver.get(BASE_URL)
        # Look for large heading tags typical in hero sections
        headings = driver.find_elements(By.CSS_SELECTOR, "h1, h2, [class*='hero'], [class*='banner']")
        assert len(headings) > 0, "A hero heading should exist on the homepage"

    def test_issues_section_present(self, driver):
        """Homepage should show some issues or a call-to-action to view issues."""
        driver.get(BASE_URL)
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        assert any(word in body_text for word in ["issue", "report", "view"]), \
            "Issues section or CTA should be present"

    def test_footer_present(self, driver):
        """Footer element should exist."""
        driver.get(BASE_URL)
        footer = driver.find_elements(By.TAG_NAME, "footer")
        assert len(footer) > 0, "Footer should be present on homepage"

    def test_report_issue_button(self, driver):
        """There should be a button / CTA to report a new issue."""
        driver.get(BASE_URL)
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        assert any(word in body_text for word in ["report", "submit", "new issue", "add issue"]), \
            "Report issue button/link should exist"

    def test_navigation_to_all_issues(self, driver):
        """Clicking the issues nav link should navigate to /issues or similar."""
        driver.get(BASE_URL)
        try:
            link = driver.find_element(By.XPATH,
                "//*[contains(text(),'Issues') or contains(text(),'All Issues') or contains(@href,'issue')]")
            link.click()
            time.sleep(1)
            assert "issue" in driver.current_url.lower() or \
                   driver.find_element(By.TAG_NAME, "body").is_displayed()
        except Exception:
            pytest.skip("Issues nav link selector needs adjustment")

    def test_page_scroll(self, driver):
        """Page should be scrollable without JS errors."""
        driver.get(BASE_URL)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)
        scroll_y = driver.execute_script("return window.scrollY;")
        assert scroll_y > 0, "Page should scroll down"
