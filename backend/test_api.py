import requests
import json

def test_submit():
    url = "http://localhost:5000/api/submit"
    payload = {"message": "Pre-flight check from the test script!"}
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 201
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_submit()
