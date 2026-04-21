# from utils.internship_scraper import fetch_internships
# from ml_base.tf_idf_model import compute_tfidf_similarity

# def match_score(user_skills, job_title):
#     return compute_tfidf_similarity(" ".join(user_skills), job_title)

# # def match_score(user_skills, job_title):
# #     score = 0
# #     job_title = job_title.lower()

# #     for skill in user_skills:
# #         if skill.lower() in job_title or job_title in skill.lower():
# #             score += 1

# #     return score

# def get_skill_gap(user_skills, job_title):
#     job_words = set(job_title.lower().split())
#     user_words = set([s.lower() for s in user_skills])

#     gap = job_words - user_words

#     return list(gap)[:5]

# def get_apply_now_recommendations(user_skills):
#     internships = fetch_internships()  # LIVE DATA

#     results = []

#     job_titles = [[job["title"]] for job in internships]   # ✅ ADD THIS
#     scores = compute_tfidf_similarity(user_skills, job_titles)

#     for i, job in enumerate(internships):
#         try:
#             keyword_bonus = 0
#             for skill in user_skills:
#                 if skill.lower() in job["title"].lower():
#                     keyword_bonus += 0.2
#             score = scores[i] + keyword_bonus
#         except:
#             continue

#         if score > 0:
#             job["score"] = float(score)
#             job["skill_gap"] = get_skill_gap(user_skills, job["title"])
#             results.append(job)
#         # ✅ fallback (if nothing matched)

#     unique_results = []
#     seen = set()

#     for job in results:
#         key = (job["title"], job["company"])

#         if key not in seen:
#             seen.add(key)
#             unique_results.append(job)

#     results = unique_results

#     results = sorted(results, key=lambda x: x["score"], reverse=True)

#     return results[:5]

#     print("User skills:", user_skills)
#     print("Total jobs:", len(internships))
#     print("Sample job:", internships[0])
#     print("Scores length:", len(scores))
# # TEST
# if __name__ == "__main__":
#     # user_skills = ["python", "machine learning", "data"]
#     user_skills = ["design", "marketing", "sales"]

#     results = get_apply_now_recommendations(user_skills)

#     for r in results:
#         print(r)


from utils.internship_scraper import fetch_pm_internships
from ml_base.tf_idf_model import compute_tfidf_similarity


def get_skill_gap(user_skills, job_title):
    job_words = set(job_title.lower().split())
    user_words = set([s.lower() for s in user_skills])

    gap = job_words - user_words

    return list(gap)[:5]


def get_apply_now_recommendations(user_skills):
    internships = fetch_pm_internships()

    results = []

    # TF-IDF input
    job_titles = [[job["title"]] for job in internships]
    scores = compute_tfidf_similarity(user_skills, job_titles)

    for i, job in enumerate(internships):
        try:
            # ✅ keyword bonus (improved)
            keyword_bonus = 0

            job_title_lower = job["title"].lower()

# mapping logic
            if "data" in job_title_lower and any(s in user_skills for s in ["python", "sql"]):
                keyword_bonus += 0.5

            if "marketing" in job_title_lower and "marketing" in user_skills:
                keyword_bonus += 0.5

            if "developer" in job_title_lower and "django" in user_skills:
                keyword_bonus += 0.5

            if "analysis" in job_title_lower and "python" in user_skills:
                keyword_bonus += 0.3

            # ✅ final score
            score = float(scores[i]) + keyword_bonus

        except:
            continue

        # ✅ keep relevant jobs
        if score > 0:
            job["score"] = score
            job["skill_gap"] = get_skill_gap(user_skills, job["title"])
            results.append(job)

    # ✅ fallback (only if no match found)
    if not results:
        for job in internships[:5]:
            job["score"] = 0.0
            job["skill_gap"] = []
            results.append(job)

    # ✅ remove duplicates
    unique_results = []
    seen = set()

    for job in results:
        key = (job["title"], job["company"])

        if key not in seen:
            seen.add(key)
            unique_results.append(job)

    # ✅ sort
    unique_results = sorted(unique_results, key=lambda x: x["score"], reverse=True)

    return unique_results[:5]