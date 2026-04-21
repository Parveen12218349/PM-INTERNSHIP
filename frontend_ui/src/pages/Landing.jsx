import React from "react";

function Landing() {
  return (
    <div style={styles.container}>
      <h1>🚀 AI Internship Recommender</h1>

      <button
        style={styles.button}
        onClick={() => (window.location.href = "/upload")}
      >
        Get Started
      </button>
    </div>
  );
}

const styles = {
  container: {
    color: "white",
    textAlign: "center",
    marginTop: "150px",
  },
  button: {
    marginTop: "20px",
    padding: "12px 25px",
    background: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Landing;