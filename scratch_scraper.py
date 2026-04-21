import requests
from bs4 import BeautifulSoup
import json

def test_scrape():
    url = "https://internshala.com/internships/product-management-internship/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")
        
        cards = soup.select("div.individual_internship")
        print(f"Found {len(cards)} cards")
        
        results = []
        for card in cards[:5]:
            title_elem = card.find("a", class_="job-title-href")
            company_elem = card.find("p", class_="company-name")
            
            title = title_elem.text.strip() if title_elem else "N/A"
            link = "https://internshala.com" + title_elem["href"] if title_elem and title_elem.has_attr("href") else "N/A"
            company = company_elem.text.strip() if company_elem else "N/A"
            
            # Extract tags/skills from bottom if available
            tags = [tag.text.strip() for tag in card.select("div.tags_container_outer span")]
            
            results.append({"title": title, "company": company, "link": link, "tags": tags})
            
        print(json.dumps(results, indent=2))
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_scrape()
