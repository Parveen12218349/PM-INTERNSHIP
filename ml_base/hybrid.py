# Functions
def skill_match_score(user_skills, job_skills):
    return len(set(user_skills) & set(job_skills)) / len(job_skills)


def similarity_score(user_skills, job_skills):
    return len(set(user_skills) & set(job_skills)) / len(set(user_skills) | set(job_skills))


def final_score(user_skills, job_skills, popularity):
    sm = skill_match_score(user_skills, job_skills)
    sim = similarity_score(user_skills, job_skills)
    return (0.5 * sm) + (0.3 * sim) + (0.2 * (popularity / 10))


def skill_gap(user_skills, job_skills):
    return [skill for skill in job_skills if skill not in user_skills]