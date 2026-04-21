import fitz  # PyMuPDF

def extract_text_from_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.lower()

def extract_text_from_bytes(pdf_bytes):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text.lower()

# if __name__ == "__main__":
#     text = extract_text_from_pdf("resume.pdf")
#     print(text[:500])

SKILLS_DB = [
    # PM Core
    "product management", "agile", "scrum", "jira", "kanban", 
    "product roadmap", "prd", "user research", "a/b testing", 
    "wireframing", "prototyping", "figma", "go-to-market", "gtm",
    "market research", "competitor analysis", "user stories",
    "stakeholder management", "metrics", "kpi", "okr",
    # Data & Analytics
    "data analysis", "sql", "excel", "power bi", "tableau", 
    "google analytics", "mixpanel", "amplitude", "python",
    "machine learning", "ai", "deep learning", "nlp",
    # Tech/Engineering
    "java", "c++", "javascript", "react", "node.js", "django", 
    "flask", "aws", "cloud", "api", "system design"
]

def extract_skills(text):
    found_skills = []
    text = text.lower()

    for skill in SKILLS_DB:
        if skill.lower() in text:
            found_skills.append(skill)

    return list(set(found_skills))  # remove duplicates


if __name__ == "__main__":
    text = extract_text_from_pdf("resume.pdf")
    
    skills = extract_skills(text)
    print("Extracted Skills:", skills)