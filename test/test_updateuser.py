# Generated by Selenium IDE
import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys

class TestUpdateuser():
  def setup_method(self, method):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.find_element(By.CSS_SELECTOR, ".my-sm-0").click()
    self.driver.quit()
  
  def test_updateuser(self):
    self.driver.get("http://localhost:3000/article")
    self.driver.set_window_size(1536, 835)
    self.driver.find_element(By.NAME, "username").send_keys("test2")
    self.driver.find_element(By.NAME, "password").send_keys("test2")
    self.driver.find_element(By.CSS_SELECTOR, ".btn-secondary:nth-child(1)").click()
    self.driver.find_element(By.NAME, "user_area").click()
    self.driver.find_element(By.CSS_SELECTOR, ".btn-sm:nth-child(1)").click()
    self.driver.find_element(By.CSS_SELECTOR, ".col-sm-10:nth-child(2) > .form-control-plaintext").click()
    self.driver.find_element(By.CSS_SELECTOR, ".col-sm-10:nth-child(2) > .form-control-plaintext").clear()
    self.driver.find_element(By.CSS_SELECTOR, ".col-sm-10:nth-child(2) > .form-control-plaintext").send_keys("Test")
    self.driver.find_element(By.CSS_SELECTOR, ".col-sm-10:nth-child(4) > .form-control-plaintext").clear()
    self.driver.find_element(By.CSS_SELECTOR, ".col-sm-10:nth-child(4) > .form-control-plaintext").send_keys("Test")
    self.driver.find_element(By.CSS_SELECTOR, "#mod01 .btn-primary").click()
    assert self.driver.find_element(By.LINK_TEXT, "Hello Test").text == "Hello Test"
    #self.driver.find_element(By.CSS_SELECTOR, ".my-sm-0").click()
  
