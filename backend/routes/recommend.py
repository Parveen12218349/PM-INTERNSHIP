from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import json
import pandas as pd
from database.database import get_connection
from backend.auth.deps import get_optional_current_user
from typing import Optional, List

router = APIRouter()

class RecommendRequest(BaseModel):
    user_skills: Optional[List[str]] = []
    search_query: Optional[str] = ""
    min_match: Optional[float] = 0.0

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
def recommend(req: RecommendRequest, current_user: dict = Depends(get_optional_current_user)):
    user_skills = [s.lower() for s in req.user_skills] if req.user_skills else []
    
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # If no skills provided, try to load from user profile
    if not user_skills and current_user:
        cursor.execute("SELECT skills FROM users WHERE id = %s", (current_user['id'],))
        user_row = cursor.fetchone()
        if user_row and user_row.get('skills'):
            try:
                db_skills = json.loads(user_row['skills'])
                user_skills = [s.lower() for s in db_skills]
            except:
                pass
                
    if not user_skills:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No skills provided and no saved profile found.")

    # Fetch from DB, optionally applying text search
    query = "SELECT * FROM scraped_internships WHERE 1=1"
    params = []
    
    if req.search_query:
        search_term = f"%{req.search_query}%"
        query += " AND (title LIKE %s OR company LIKE %s)"
        params.extend([search_term, search_term])
        
    cursor.execute(query, params)
    jobs = cursor.fetchall()
    cursor.close()
    conn.close()

    if not jobs:
        return {
            "fallback": True,
            "error": "No internships found matching your search.",
            "recommendations": []
        }

    scored_jobs = []
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
        
        if job["score"] >= req.min_match:
            scored_jobs.append(job)

    # Sort by score
    sorted_jobs = sorted(scored_jobs, key=lambda x: (x["score"], x["popularity"]), reverse=True)
    
    # Check max score for fallback
    max_score = sorted_jobs[0]["score"] if sorted_jobs else 0
    fallback = False
    
    if max_score < 0.2 and not req.search_query and req.min_match == 0:
        fallback = True
        # If fallback, just recommend the top 3 by popularity/random, explaining why.
        top_jobs = sorted_jobs[:3]
    else:
        # Return top 50 matches for the dashboard feed
        top_jobs = sorted_jobs[:50]

    output = {
        "fallback": fallback,
        "recommendations": []
    }

    for row in top_jobs:
        output["recommendations"].append({
            "id": row["id"],
            "title": row["title"],
            "company": row["company"],
            "link": row["link"],
            "score": round(row["score"], 2),
            "match": match_label(row["score"]),
            "missing_skills": row["missing_skills"],
            "job_skills": row["job_skills_list"]
        })

    return output