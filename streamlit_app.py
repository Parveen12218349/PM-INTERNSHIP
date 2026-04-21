import streamlit as st
import requests

st.title("Internship Recommendation System")

uploaded_file = st.file_uploader("Upload your resume (PDF)", type=["pdf"])

if uploaded_file:
    st.write("File uploaded successfully!")

    files = {"file": uploaded_file.getvalue()}

    #response = requests.post("http://127.0.0.1:8000/recommend", files=files)

    # Step 1 → upload CV
    upload_response = requests.post(
    "http://127.0.0.1:8000/cvupload",
    files=files
    )

    # Step 2 → get recommendation
    response = requests.get("http://127.0.0.1:8000/recommend")

    if response.status_code == 200:
        results = response.json()

        for job in results:
           st.markdown(f"## 🔹 {job['title']}")
           st.markdown(f"**Score:** {job['score']}")
           st.markdown(f"**Missing Skills:** {', '.join(job['missing_skills'])}")
           st.markdown(f"**Match Level:** {job['match']}")
           st.markdown("---")