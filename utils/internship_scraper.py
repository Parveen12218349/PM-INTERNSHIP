import requests
from bs4 import BeautifulSoup
import json
import sys
import os

# Ensure we can import database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.database import get_connection

def infer_skills(title):
    title_lower = title.lower()
    skills = []
    
    # Generic tech and business skill inference
    if "data" in title_lower or "analyst" in title_lower:
        skills.extend(["data analysis", "sql", "excel", "metrics", "python", "statistics"])
    if "software" in title_lower or "developer" in title_lower or "engineer" in title_lower:
        skills.extend(["programming", "git", "api", "algorithms", "system design", "javascript"])
    if "ai " in title_lower or "artificial intelligence" in title_lower or "machine learning" in title_lower:
        skills.extend(["ai", "machine learning", "python", "deep learning"])
    if "product" in title_lower and "manage" in title_lower:
        skills.extend(["product management", "agile", "user stories", "market research", "strategy"])
    if "growth" in title_lower or "marketing" in title_lower:
        skills.extend(["go-to-market", "a/b testing", "google analytics", "seo", "campaigns"])
    if "design" in title_lower or "ui" in title_lower or "ux" in title_lower:
        skills.extend(["figma", "wireframing", "prototyping", "user research", "ui", "ux"])
    if "finance" in title_lower or "accounting" in title_lower:
        skills.extend(["accounting", "excel", "financial modeling", "reconciliation"])
    if "hr" in title_lower or "human resources" in title_lower:
        skills.extend(["recruitment", "onboarding", "communication", "employee relations"])

    if not skills:
        skills.extend(["communication", "teamwork", "problem solving"]) # Default generic skills
        
    return list(set(skills))

def fetch_internships_by_category(category_slug=""):
    # If category_slug is "explore-all" or empty, just scrape the root /internships/
    if not category_slug or category_slug == "explore-all":
        url = "https://internshala.com/internships/"
    else:
        url = f"https://internshala.com/internships/{category_slug}-internship/"
        
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    print(f"Fetching {url}")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching URL: {e}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")

    cards = soup.select("div.individual_internship")
    print(f"Total cards found: {len(cards)}")

    internships = []

    for card in cards:
        title = "N/A"
        company = "N/A"
        link = "N/A"

        title_tag = card.find("a", class_="job-title-href")
        if not title_tag:
            title_tag = card.find("a")

        if title_tag:
            title = title_tag.get_text(strip=True)
            if title_tag.has_attr("href"):
                link = "https://internshala.com" + title_tag["href"]

        company_tag = card.find("div", class_="company_name")
        if not company_tag:
            company_tag = card.find("p", class_="company-name")

        if company_tag:
            company = company_tag.get_text(strip=True)
            company = company.replace("Actively hiring", "").strip()

        skills = infer_skills(title)

        internships.append({
            "title": title,
            "company": company,
            "link": link,
            "skills": skills
        })
        
    print(f"Successfully processed {len(internships)} internships.")
    return internships

# To maintain backwards compatibility with ml_base/apply_now.py for the original flow:
def fetch_pm_internships():
    return fetch_internships_by_category("product-management")

def save_to_db(internships):
    if not internships:
        print("No internships to save.")
        return
        
    db = get_connection()
    cursor = db.cursor()

    cursor.execute("TRUNCATE TABLE scraped_internships")

    for item in internships:
        skills_json = json.dumps(item["skills"])
        cursor.execute("""
            INSERT INTO scraped_internships (title, company, link, skills, popularity)
            VALUES (%s, %s, %s, %s, %s)
        """, (item["title"], item["company"], item["link"], skills_json, 8))

    db.commit()
    cursor.close()
    db.close()
    print("Data saved to database successfully.")

if __name__ == "__main__":
    data = fetch_internships_by_category("explore-all")
    if data:
        save_to_db(data)