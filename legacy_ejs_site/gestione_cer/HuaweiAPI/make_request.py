import requests

# Replace with your actual values
USERNAME = "Sun-FaiMonitor"
PASSWORD = "SunFaiMonitorHuwawei2025"
BASE_URL = "https://eu5.fusionsolar.huawei.com/thirdData"

# Start a session to persist cookies
session = requests.Session()

# Prepare login URL and payload
login_url = f"{BASE_URL}/login"
payload = {
    "userName": USERNAME,
    "systemCode": PASSWORD
}

# Send login request
response = session.post(login_url, json=payload)

# Check for successful login
if response.status_code == 200 and 'XSRF-TOKEN' in session.cookies:
    xsrf_token = session.cookies['XSRF-TOKEN']
    print("Login successful.")
    print("XSRF-TOKEN:", xsrf_token)

    # Set XSRF-TOKEN header for authenticated requests
    session.headers.update({
        "X-XSRF-TOKEN": xsrf_token,
        "Cookie": f"XSRF-TOKEN={xsrf_token}"
    })

    # Now make the authenticated request
    plant_url = f"{BASE_URL}/stations"
    plant_payload = {
        "pageNo": 1
    }

    # Make sure the cookies are also updated
    session.cookies.set("XSRF-TOKEN", xsrf_token)
    plant_response = session.post(plant_url, json=plant_payload)
    print("Plant list response:", plant_response.json())

else:
    print("Login failed.")
    print("Status code:", response.status_code)
    print("Response:", response.text)
