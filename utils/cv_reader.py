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
    # General Operations & Admin
    "operations", "administration", "management", "logistics", "supply chain",
    "coordination", "public relations", "customer service", "hr", "recruitment",
    # Manufacturing & Technical
    "manufacturing", "production", "mechanical", "electrical", "maintenance",
    "quality control", "safety", "inventory management", "procurement",
    # Finance & Business
    "finance", "accounting", "tally", "tax", "audit", "billing", "sales", 
    "marketing", "business development", "market research",
    # IT & Digital
    "it support", "computer hardware", "software", "typing", "data entry",
    "ms office", "excel", "word", "powerpoint", "outlook", "internet",
    "social media", "sql", "python", "digital marketing",
    # Soft Skills
    "communication", "teamwork", "leadership", "problem solving", 
    "time management", "english", "hindi", "regional language"
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