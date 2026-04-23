# InternMatch - PM Internship Recommendation Platform

InternMatch is an AI-powered, real-time internship recommendation and tracking platform built specifically for the Prime Minister's Internship Scheme. It bridges the gap between student resumes and live government and top-tier corporate internship opportunities through dynamic skill extraction and precision matching.

## 🚀 Key Features

*   **Real-time Scraping:** Dynamically fetches the latest internship opportunities from platforms like Internshala.
*   **AI Skill Extraction:** Analyzes user-uploaded PDF resumes to automatically extract relevant vocational, technical, and soft skills aligned with the PM Internship Scheme.
*   **Precision Match Algorithm:** Calculates match scores (0-100%) by comparing extracted resume skills against scraped internship requirements.
*   **Gap Analysis & Upskilling:** Identifies missing skills for specific roles and provides direct links to Coursera for immediate upskilling.
*   **AI Interview Assistant (Beta):** Simulated AI chatbot that quizzes applicants with common PM Internship Scheme interview questions to help them prep.
*   **Application Tracking:** Users can save, track, and update the status of their internship applications directly from their dashboard.
*   **Email Notifications:** Automated email alerts when application statuses change (e.g., from 'Pending' to 'Approved').
*   **Admin Dashboard:** Centralized control center to manually trigger web scrapers and view platform analytics.
*   **Premium Glassmorphic UI:** Modern, responsive frontend built with React, Vite, TailwindCSS, and Framer Motion.

## 🛠️ Technology Stack

*   **Frontend:** React 19, Vite, TailwindCSS v4, React Router, Framer Motion, Lucide Icons.
*   **Backend:** FastAPI (Python), Uvicorn.
*   **Database:** MySQL (mysql-connector-python).
*   **Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing.
*   **Scraping:** BeautifulSoup4, Requests.
*   **Resume Processing:** PyMuPDF (fitz) for text extraction, custom NLP logic for skill tagging.
*   **Email:** SMTP (smtplib) integration for user verification and status notifications.

## 📂 Project Structure

```
pm-intership-recommendation/
├── backend/                  # FastAPI Backend
│   ├── auth/                 # JWT security, dependencies, and email utils
│   ├── routes/               # API Endpoints (auth, cvupload, recommend, admin, etc.)
│   ├── requirements.txt      # Python dependencies
│   └── main.py               # FastAPI Application Entrypoint
├── database/                 # MySQL Database Connection Logic
├── frontend_ui/              # React Frontend
│   ├── src/                  
│   │   ├── components/       # Reusable UI elements (Navbar, Footer, Charts)
│   │   ├── context/          # React Context (AuthContext)
│   │   └── pages/            # Page Views (Home, Results, AdminDashboard, etc.)
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
└── utils/                    # Shared Python Utilities
    ├── cv_reader.py          # PDF text extraction and skill parsing
    ├── internship_scraper.py # Web scraping logic for Internshala
    └── skills.py             # Product Management Skill Dictionary
```

## ⚙️ Local Setup Instructions

### 1. Database Setup
Ensure you have MySQL installed and running locally. Update the database credentials in `database/database.py` to match your local setup.

### 2. Backend Setup
1. Navigate to the root directory.
2. Create a virtual environment: `python -m venv .venv`
3. Activate the environment: `.\.venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r backend/requirements.txt`
5. Create a `.env` file in the root with `SECRET_KEY`, `SMTP_EMAIL`, and `SMTP_PASSWORD`.
6. Run the server: `python -m uvicorn backend.main:app --reload --port 8000`

### 3. Frontend Setup
1. Navigate to the frontend directory: `cd frontend_ui`
2. Install dependencies: `npm install`
3. Ensure `.env.local` exists with `VITE_API_URL=http://localhost:8000`
4. Start the development server: `npm run dev`

## 🚀 Deployment

*   **Frontend:** Configured for Vercel. Push to GitHub and Vercel will automatically build using `npm run build` and route appropriately via `vercel.json`.
*   **Backend:** Configured for Render. Ensure environment variables are set in the Render dashboard and start the server using `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`.

---
*Built as a V3 Internshala Professional Rebuild.*
