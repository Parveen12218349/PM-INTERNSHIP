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
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            is_verified BOOLEAN DEFAULT FALSE,
            verification_token VARCHAR(255),
            skills JSON
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            internship_id INT NOT NULL,
            status VARCHAR(50) DEFAULT 'saved',
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (internship_id) REFERENCES scraped_internships(id) ON DELETE CASCADE,
            UNIQUE KEY user_internship (user_id, internship_id)
        )
    """)
    
    # Attempt to alter existing users table if it was created previously without skills
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN skills JSON")
    except mysql.connector.Error as err:
        # 1060 is "Duplicate column name", meaning it already exists
        if err.errno != 1060:
            print(f"Migration warning: {err}")
            
    conn.commit()
    cursor.close()
    conn.close()