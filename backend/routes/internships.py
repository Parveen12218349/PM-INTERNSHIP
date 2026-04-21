from fastapi import APIRouter
from utils.internship_scraper import fetch_internships_by_category

router = APIRouter()

@router.get("/api/internships/{category}")
def get_internships_by_category(category: str):
    """
    Fetches live internships for the specified category slug.
    If category is 'explore-all', fetches all generic internships.
    """
    # Prevent extremely long or malicious category slugs
    if len(category) > 50:
        return {"error": "Invalid category"}
        
    internships = fetch_internships_by_category(category)
    return {"internships": internships}
