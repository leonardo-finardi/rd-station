import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
import json

class AuthFlow:
    """
    This class makes an webscrapping using Selenium 
    to request code from RD Station and then use
    that code to request access token
    """
    def __init__(self, email, password):
        self.redirect_uri = "https://7urdstation.org/auth/callback"
        self.client_id = 'your-client-id'
        self.client_secret = 'your-client-secret'
        self.email = email
        self.password = password
        self.code = None
        self.access_token = None

    def authenticate(self):
        self.get_auth_code()
        self.get_access_token()

    def get_auth_code(self):
        url = f"https://api.rd.services/auth/dialog?client_id={self.client_id}&redirect_uri={self.redirect_uri}"
        driver = webdriver.Chrome()
        driver.get(url)
        driver.implicitly_wait(4)
        driver.find_element(By.ID, "email").send_keys(self.email)
        driver.find_element(By.ID, "password").send_keys(self.password)
        driver.implicitly_wait(5)
        driver.find_element(By.XPATH, '/html/body/div/div/div/div/div[2]/div/form/button').click()
        driver.implicitly_wait(3)
        driver.find_element(By.XPATH, '/html/body/div[1]/section/div/form/div/div[1]/div[2]/a').click()
        driver.implicitly_wait(3)
        driver.find_element(By.XPATH, '/html/body/div[1]/section/div/form/div/div[2]/div/div[2]/button').click()
        self.code = driver.current_url.split('code=')[1]
        driver.close()

    def get_access_token(self):
        url = "https://api.rd.services/auth/token"
        payload = json.dumps({
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": self.code
        })
        headers = {
            'Content-Type': 'application/json',
        }
        response = requests.post(url, headers=headers, data=payload)
        self.access_token = response.json()["access_token"]
        return self.access_token


auth_flow = AuthFlow("username", "password")
access_code = auth_flow.authenticate()
