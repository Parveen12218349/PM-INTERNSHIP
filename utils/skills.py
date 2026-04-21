import pandas as pd
from cv_reader import extract_skills, extract_text_from_pdf
df = pd.read_csv("data/internship.csv")
df["skills"] = df["skills"].apply(lambda x: [skill.strip().lower() for skill in x.split(",")])
# print(df["skills"].iloc[0])

def skill_match_score(user_skills, job_skills):
    match_count = 0

    for skill in user_skills:
        if skill in job_skills:
            match_count += 1

    return match_count / len(job_skills)

text = extract_text_from_pdf("resume.pdf")
user_skills = extract_skills(text)

#job_skills = df["skills"].iloc[0]

# missing skills

def skill_gap(user_skills, job_skills):
    missing = []

    for skill in job_skills:
        if skill not in user_skills:
            missing.append(skill)

    return missing

df["score"] = df["skills"].apply(lambda job_skills: 
                                skill_match_score(user_skills, job_skills))

# print(df[["title", "score"]])

df = df.sort_values(by="score", ascending=False)

# print(df[["title", "score"]].head(5))

top_jobs = df.head(3)

# for i, row in top_jobs.iterrows():
#     gap = skill_gap(user_skills, row["skills"])

#     print(f"{row['title']} → Score: {round(row['score'], 2)}")
#     print(f"Missing Skills: {gap}")
#     print()

