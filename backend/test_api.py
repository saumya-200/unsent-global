import requests

def test_interaction():
    base_url = "http://localhost:5000/api"
    
    # 1. Submit a message
    sub_res = requests.post(f"{base_url}/submit", json={"message": "Interaction test!"})
    star_id = sub_res.json()['star_id']
    print(f"Created Star: {star_id}")

    # 2. Fetch Detail
    detail_res = requests.get(f"{base_url}/stars/{star_id}")
    print(f"Detail Status: {detail_res.status_code}")
    print(f"Has Resonated Initial: {detail_res.json()['data']['has_resonated']}")

    # 3. Resonate
    res_res = requests.post(f"{base_url}/resonate", json={"star_id": star_id})
    print(f"Resonance Status: {res_res.status_code}")
    print(f"Resonance Count: {res_res.json().get('resonance_count')}")

    # 4. Resonate again (Should fail with 409)
    res_dup = requests.post(f"{base_url}/resonate", json={"star_id": star_id})
    print(f"Duplicate Resonance Status: {res_dup.status_code}")
    
    # 5. Fetch Detail again
    detail_res2 = requests.get(f"{base_url}/stars/{star_id}")
    print(f"Has Resonated Final: {detail_res2.json()['data']['has_resonated']}")

if __name__ == "__main__":
    test_interaction()
