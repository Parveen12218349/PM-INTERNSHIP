from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def compute_tfidf_similarity(user_skills, job_skills_list):
    
    documents = []

    # convert list → string
    user_text = " ".join(user_skills)
    documents.append(user_text)

    for skills in job_skills_list:
        documents.append(" ".join(skills))

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)

    similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    return similarity_scores