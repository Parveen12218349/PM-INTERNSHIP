import requests
from bs4 import BeautifulSoup

def test_detail():
    url = "https://internshala.com/internship/detail/work-from-home-associate-product-manager-internship-at-pehchaan-ai-technologies1776416877"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    resp = requests.get(url, headers=headers)
    soup = BeautifulSoup(resp.text, "html.parser")
    
    # Skills are usually in 'round_tabs' or similar
    skills_tags = soup.select(".round_tabs")
    skills = [s.text.strip() for s in skills_tags]
    print("Skills extracted:", skills)
    
if __name__ == "__main__":
    test_detail()
