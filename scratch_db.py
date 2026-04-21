import mysql.connector

def setup_db():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="2198420@Pk"
        )
        cursor = conn.cursor()
        
        # Create DB if not exists
        cursor.execute("CREATE DATABASE IF NOT EXISTS internship_db")
        cursor.execute("USE internship_db")
        
        # Create internships table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scraped_internships (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255),
                company VARCHAR(255),
                link VARCHAR(500),
                skills TEXT,
                popularity INT DEFAULT 8
            )
        """)
        
        # We can drop the old ones if we want, but let's just create this new one.
        print("Database setup complete.")
        
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    setup_db()
