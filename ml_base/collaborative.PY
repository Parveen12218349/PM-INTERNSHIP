def collaborative_score(user_skills, all_users_skills, job_skills):
    
    similar_users = 0
    matched_users = 0

    for skills in all_users_skills:
        skills_set = set(skills.split(","))

        # Check if user is similar (at least 2 common skills)
        if len(set(user_skills) & skills_set) >= 2:
            similar_users += 1

            # Check if that user matches this job
            if len(skills_set & set(job_skills)) > 0:
                matched_users += 1

    # Avoid division by zero
    if similar_users == 0:
        return 0

    return matched_users / similar_users