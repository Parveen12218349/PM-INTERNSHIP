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
        database=os.getenv("DB_NAME", "internship_db")
    )