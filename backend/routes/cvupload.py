from fastapi import APIRouter, UploadFile, File, Depends
from utils.cv_reader import extract_text_from_bytes, extract_skills
from auth.deps import get_optional_current_user
from database.database import get_connection
import json

router = APIRouter()

@router.post("/cvupload")
async def upload_cv(file: UploadFile = File(...), current_user: dict = Depends(get_optional_current_user)):
    # Read PDF bytes directly into memory
    pdf_bytes = await file.read()
    
    # Extract text and skills
    text = extract_text_from_bytes(pdf_bytes)
    user_skills = extract_skills(text)

    # Save to user profile if logged in
    if current_user:
        db = get_connection()
        cursor = db.cursor()
        skills_json = json.dumps(user_skills)
        cursor.execute("UPDATE users SET skills = %s WHERE id = %s", (skills_json, current_user['id']))
        db.commit()
        cursor.close()
        db.close()

    return {
        "message": "CV processed successfully",
        "skills": user_skills
    }