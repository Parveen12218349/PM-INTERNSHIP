from fastapi import APIRouter
from pydantic import BaseModel
import json
import pandas as pd
from database.database import get_connection

router = APIRouter()

class RecommendRequest(BaseModel):
    user_skills: list[str]

def match_label(score):
    if score >= 0.6:
        return "Strong Match"
    elif score >= 0.3:
        return "Moderate Match"
    else:
        return "Weak Match"

def skill_match_score(user_skills, job_skills):
    if not job_skills:
        return 0
    return len(set(user_skills) & set(job_skills)) / len(job_skills)

def skill_gap(user_skills, job_skills):
    return [skill for skill in job_skills if skill not in user_skills]

@router.post("/recommend")
def recommend(req: RecommendRequest):
    user_skills = [s.lower() for s in req.user_skills]

    # Fetch from DB
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM scraped_internships")
    jobs = cursor.fetchall()
    cursor.close()
    conn.close()

    if not jobs:
        return {
            "fallback": True,
            "error": "No internships available right now. Please run the scraper.",
            "recommendations": [
                {
                    "title": "Data Science Intern",
                    "company": "Placeholder Tech",
                    "link": "#",
                    "score": 0.0,
                    "match": "Weak Match",
                    "missing_skills": ["Python", "SQL"],
                    "job_skills": ["Python", "SQL"]
                }
            ]
        }

    for job in jobs:
        # Skills is stored as JSON string
        try:
            job_skills = json.loads(job["skills"])
        except:
            job_skills = []
        
        job["job_skills_list"] = job_skills
        # Compute match
        job["score"] = skill_match_score(user_skills, job_skills)
        job["missing_skills"] = skill_gap(user_skills, job_skills)

    # Sort by score
    sorted_jobs = sorted(jobs, key=lambda x: (x["score"], x["popularity"]), reverse=True)
    
    # Check max score for fallback
    max_score = sorted_jobs[0]["score"] if sorted_jobs else 0
    fallback = False
    
    if max_score < 0.2:
        fallback = True
        # If fallback, just recommend the top 3 by popularity/random, explaining why.
        # sorted_jobs is already sorted by score (0) then popularity.
        top_jobs = sorted_jobs[:3]
    else:
        top_jobs = sorted_jobs[:3]

    output = {
        "fallback": fallback,
        "recommendations": []
    }

    for row in top_jobs:
        output["recommendations"].append({
            "title": row["title"],
            "company": row["company"],
            "link": row["link"],
            "score": round(row["score"], 2),
            "match": match_label(row["score"]),
            "missing_skills": row["missing_skills"],
            "job_skills": row["job_skills_list"]
        })

    return output