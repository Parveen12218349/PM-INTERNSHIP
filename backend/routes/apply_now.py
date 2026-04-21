from fastapi import APIRouter, UploadFile, File
from ml_base.apply_now import get_apply_now_recommendations
from utils.cv_reader import extract_text_from_pdf

router = APIRouter()

@router.post("/apply-now")
async def apply_now(file: UploadFile = File(...)):
    
    # save uploaded file temporarily
    file_location = f"temp_{file.filename}"
    
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # extract text
    text = extract_text_from_pdf(file_location)

    # extract skills
    from utils.cv_reader import extract_skills
    user_skills = extract_skills(text)

    # get recommendations
    results = get_apply_now_recommendations(user_skills)

    return {
        "skills": user_skills,
        "recommendations": results
    }