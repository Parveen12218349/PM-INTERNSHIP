from fastapi import APIRouter, UploadFile, File
from utils.cv_reader import extract_text_from_bytes, extract_skills

router = APIRouter()

@router.post("/cvupload")
async def upload_cv(file: UploadFile = File(...)):
    # Read PDF bytes directly into memory
    pdf_bytes = await file.read()
    
    # Extract text and skills
    text = extract_text_from_bytes(pdf_bytes)
    user_skills = extract_skills(text)

    return {
        "message": "CV processed successfully",
        "skills": user_skills
    }