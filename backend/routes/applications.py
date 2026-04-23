from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from database.database import get_connection
from backend.auth.deps import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])

class ApplicationCreate(BaseModel):
    internship_id: int

@router.get("/")
def get_applications(current_user: dict = Depends(get_current_user)):
    db = get_connection()
    cursor = db.cursor(dictionary=True)
    
    # Fetch user's saved applications and join with the internship details
    cursor.execute("""
        SELECT a.id as application_id, a.internship_id, a.status, a.applied_at,
               s.title, s.company, s.link, s.skills
        FROM applications a
        JOIN scraped_internships s ON a.internship_id = s.id
        WHERE a.user_id = %s
        ORDER BY a.applied_at DESC
    """, (current_user['id'],))
    
    applications = cursor.fetchall()
    cursor.close()
    db.close()
    
    return applications

@router.post("/")
def save_application(app: ApplicationCreate, current_user: dict = Depends(get_current_user)):
    db = get_connection()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            "INSERT INTO applications (user_id, internship_id, status) VALUES (%s, %s, %s)",
            (current_user['id'], app.internship_id, 'saved')
        )
        db.commit()
    except Exception as e:
        db.rollback()
        # If it's a duplicate entry, we can just return a 400
        if "Duplicate entry" in str(e):
            raise HTTPException(status_code=400, detail="You have already saved this internship.")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        db.close()
        
    return {"message": "Internship saved successfully!"}

@router.delete("/{application_id}")
def delete_application(application_id: int, current_user: dict = Depends(get_current_user)):
    db = get_connection()
    cursor = db.cursor()
    
    cursor.execute("DELETE FROM applications WHERE id = %s AND user_id = %s", (application_id, current_user['id']))
    if cursor.rowcount == 0:
        db.close()
        raise HTTPException(status_code=404, detail="Application not found or you do not have permission to delete it.")
        
    db.commit()
    cursor.close()
    db.close()
    
    return {"message": "Application removed."}

from backend.auth.email import send_status_update_email

class ApplicationUpdate(BaseModel):
    status: str

@router.put("/{application_id}/status")
def update_application_status(application_id: int, update: ApplicationUpdate, current_user: dict = Depends(get_current_user)):
    valid_statuses = ["saved", "applied", "pending", "approved", "rejected"]
    if update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status.")

    db = get_connection()
    cursor = db.cursor(dictionary=True)
    
    # Get application and user details
    cursor.execute("""
        SELECT a.user_id, u.email, s.title, s.company, a.status as old_status
        FROM applications a
        JOIN users u ON a.user_id = u.id
        JOIN scraped_internships s ON a.internship_id = s.id
        WHERE a.id = %s
    """, (application_id,))
    
    app_info = cursor.fetchone()
    
    if not app_info:
        db.close()
        raise HTTPException(status_code=404, detail="Application not found.")

    # In a real app, you might restrict this to current_user['id'] == app_info['user_id'] or admin
    if app_info['user_id'] != current_user['id'] and current_user['role'] != 'admin':
        db.close()
        raise HTTPException(status_code=403, detail="Permission denied.")

    if app_info['old_status'] == update.status:
        db.close()
        return {"message": "Status unchanged."}

    cursor.execute("UPDATE applications SET status = %s WHERE id = %s", (update.status, application_id))
    db.commit()
    cursor.close()
    db.close()
    
    # Send email notification asynchronously or directly
    try:
        send_status_update_email(
            to_email=app_info['email'],
            company=app_info['company'],
            title=app_info['title'],
            new_status=update.status
        )
    except Exception as e:
        print(f"Error sending status update email: {e}")
    
    return {"message": "Application status updated successfully."}
