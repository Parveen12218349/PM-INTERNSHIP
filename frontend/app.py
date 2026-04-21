import streamlit as st
import requests

st.set_page_config(page_title="AI Internship Recommender", layout="wide")

st.title("🚀 AI Internship Recommender Dashboard")

# --- Sidebar ---
st.sidebar.header("Upload CV")
uploaded_file = st.sidebar.file_uploader("Upload PDF", type=["pdf"])

st.sidebar.markdown("---")
st.sidebar.write("💡 Get real-time internship recommendations based on your CV")

# --- Main ---
if uploaded_file:

    with st.spinner("Analyzing your CV..."):
        response = requests.post(
            "http://127.0.0.1:8000/apply-now",
            files={"file": uploaded_file}
        )

    data = response.json()

    # --- Skills Section ---
    st.subheader("🧠 Extracted Skills")
    cols = st.columns(4)

    for i, skill in enumerate(data["skills"]):
        cols[i % 4].success(skill)

    st.markdown("---")

    # --- Recommendations ---
    st.subheader("🎯 Recommended Internships")

    for job in data["recommendations"]:
        with st.container():
            col1, col2 = st.columns([3, 1])

            with col1:
                st.markdown(f"### {job['title']}")
                st.write(f"🏢 {job['company']}")

                # Skill gap
                if job["skill_gap"]:
                    st.warning(f"Missing Skills: {', '.join(job['skill_gap'])}")
                else:
                    st.success("Good Match ✅")

            with col2:
                st.metric("Match Score", f"{round(job['score']*100)}%")
                st.progress(min(int(job["score"] * 100), 100))

            st.markdown("---")

else:
    st.info("👈 Upload your CV from the sidebar to get started")
