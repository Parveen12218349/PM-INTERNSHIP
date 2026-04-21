from backend.routes.recommend import router as recommend_router
from fastapi import FastAPI
import pandas as pd
from utils.cv_reader import extract_text_from_pdf, extract_skills
from database.database import get_connection, init_db
from backend.routes.cvupload import router as cvupload_router
from backend.routes.apply_now import router as apply_now_router
from backend.routes.internships import router as internships_router
from fastapi.middleware.cors import CORSMiddleware

# Initialize DB tables
try:
    init_db()
except Exception as e:
    print(f"Failed to initialize database: {e}")


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(recommend_router)
app.include_router(cvupload_router)
app.include_router(apply_now_router)
app.include_router(internships_router)


# Routes
@app.get("/")
def home():
    return {"message": "API is working"}
# Load dataset
# df = pd.read_csv("data/internship.csv")
# df["skills"] = df["skills"].apply(lambda x: [s.strip().lower() for s in x.split(",")])
# df["popularity"] = [8, 7, 9, 8, 6, 9, 7, 6]


# # Functions
# def skill_match_score(user_skills, job_skills):
#     return len(set(user_skills) & set(job_skills)) / len(job_skills)


# def similarity_score(user_skills, job_skills):
#     return len(set(user_skills) & set(job_skills)) / len(set(user_skills) | set(job_skills))


# def final_score(user_skills, job_skills, popularity):
#     sm = skill_match_score(user_skills, job_skills)
#     sim = similarity_score(user_skills, job_skills)
#     return (0.5 * sm) + (0.3 * sim) + (0.2 * (popularity / 10))


# def skill_gap(user_skills, job_skills):
#     return [skill for skill in job_skills if skill not in user_skills]


# Recommend
# @app.get("/recommend")
# def recommend():
#     text = extract_text_from_pdf("resume.pdf")
#     user_skills = extract_skills(text)

#     df["final_score"] = df.apply(lambda row:
#         final_score(user_skills, row["skills"], row["popularity"]), axis=1)

#     result = df.sort_values(by="final_score", ascending=False).head(3)

#     output = []
#     for _, row in result.iterrows():
#         output.append({
#             "title": row["title"],
#             "score": round(row["final_score"], 2),
#             "missing_skills": skill_gap(user_skills, row["skills"])
#         })

#     return output

# def match_label(score):
#     if score >= 0.6:
#         return "Strong Match"
#     elif score >= 0.4:
#         return "Moderate Match"
#     else:
#         return "Weak Match"

# from fastapi import FastAPI, UploadFile, File
# @app.post("/recommend")
# def recommend(file: UploadFile = File(...)):
    
#     with open("temp.pdf", "wb") as f:
#         f.write(file.file.read())

#     text = extract_text_from_pdf("temp.pdf")
#     user_skills = extract_skills(text)

#     # --- DB INSERT START ---
#     conn = get_connection()
#     cursor = conn.cursor()

#     skills_str = ",".join(user_skills)

#     cursor.execute(
#     "INSERT INTO students (skills) VALUES (%s)",
#     (skills_str,)
#     )

#     conn.commit()
#     cursor.close()
#     conn.close()
#     # --- DB INSERT END ---

#     df["final_score"] = df.apply(lambda row:
#         final_score(user_skills, row["skills"], row["popularity"]), axis=1)

#     result = df.sort_values(by="final_score", ascending=False).head(3)

#     output = []
#     for _, row in result.iterrows():
#         output.append({
#     "title": row["title"],
#     "score": round(row["final_score"], 2),
#     "match": match_label(row["final_score"]),
#     "missing_skills": skill_gap(user_skills, row["skills"])
#        })

#     return output