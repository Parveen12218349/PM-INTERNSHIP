import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables from .env file (if it exists)
load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "2198420@Pk"),
        database=os.getenv("DB_NAME", "internship_db"),
        port=os.getenv("DB_PORT", 16753)
    )

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scraped_internships (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            company VARCHAR(255),
            link VARCHAR(500),
            skills JSON,
            popularity INT DEFAULT 0
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            skills JSON
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()