from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.database import get_connection
from auth.security import get_password_hash, verify_password, create_access_token, create_verification_token
from auth.deps import get_current_user, get_admin_user
from auth.email import send_verification_email

router = APIRouter(prefix="/auth", tags=["auth"])

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    is_verified: bool

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister):
    try:
        db = get_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if user exists
        cursor.execute("SELECT id, is_verified FROM users WHERE email = %s", (user.email,))
        existing_user = cursor.fetchone()
        if existing_user:
            if existing_user['is_verified']:
                cursor.close()
                db.close()
                raise HTTPException(status_code=400, detail="Email already registered")
            else:
                # Resend token for unverified user
                hashed_password = get_password_hash(user.password)
                verification_token = create_verification_token(user.email)
                
                try:
                    cursor.execute(
                        "UPDATE users SET password_hash = %s, verification_token = %s WHERE id = %s",
                        (hashed_password, verification_token, existing_user['id'])
                    )
                    db.commit()
                except Exception as e:
                    db.rollback()
                    raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")
                finally:
                    cursor.close()
                    db.close()
                    
                send_verification_email(user.email, verification_token)
                return {"message": "Verification email resent."}
            
        hashed_password = get_password_hash(user.password)
        verification_token = create_verification_token(user.email)
        
        # Optional: If this is the very first user, we might want to make them an admin automatically
        cursor.execute("SELECT COUNT(id) as count FROM users")
        count_result = cursor.fetchone()
        role = "admin" if count_result['count'] == 0 else "user"
        
        try:
            cursor.execute(
                "INSERT INTO users (email, password_hash, role, verification_token) VALUES (%s, %s, %s, %s)",
                (user.email, hashed_password, role, verification_token)
            )
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Insert failed: {str(e)}")
        finally:
            cursor.close()
            db.close()
            
        send_verification_email(user.email, verification_token)
        
        return {"message": "User registered successfully."}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_msg = f"{type(e).__name__}: {str(e)} | {traceback.format_exc()}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (form_data.username,))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    
    if not user or not verify_password(form_data.password, user['password_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not user['is_verified']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please check your inbox."
        )
        
    access_token = create_access_token(data={"sub": user['email'], "role": user['role']})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/verify-all")
def verify_all():
    try:
        db = get_connection()
        cursor = db.cursor()
        cursor.execute("UPDATE users SET is_verified = TRUE, verification_token = NULL, role = 'admin'")
        db.commit()
        cursor.close()
        db.close()
        return {"message": "All users have been verified AND made Admins! Please log out and log back in to see the Admin Panel."}
    except Exception as e:
        return {"error": str(e)}

@router.get("/verify-email")
def verify_email(token: str):
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = %s", (token,))
    if cursor.rowcount == 0:
        cursor.close()
        db.close()
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")
        
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Email successfully verified. You can now login."}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "role": current_user["role"],
        "is_verified": bool(current_user["is_verified"])
    }

@router.get("/admin/users")
def get_all_users(current_user: dict = Depends(get_admin_user)):
    db = get_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, email, role, is_verified FROM users ORDER BY id DESC")
    users = cursor.fetchall()
    cursor.close()
    db.close()
    
    # Ensure is_verified is boolean for frontend
    for u in users:
        u['is_verified'] = bool(u['is_verified'])
    return users
