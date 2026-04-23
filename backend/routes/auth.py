from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.database import get_connection
from auth.security import get_password_hash, verify_password, create_access_token
from auth.deps import get_current_user, get_admin_user
from auth.email import send_verification_email, generate_otp

router = APIRouter(prefix="/auth", tags=["auth"])

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

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
        
        hashed_password = get_password_hash(user.password)
        otp = generate_otp()
        
        if existing_user:
            if existing_user['is_verified']:
                cursor.close()
                db.close()
                raise HTTPException(status_code=400, detail="Email already registered and verified")
            else:
                # Update existing unverified user with new OTP and password
                cursor.execute(
                    "UPDATE users SET password_hash = %s, verification_token = %s WHERE id = %s",
                    (hashed_password, otp, existing_user['id'])
                )
                db.commit()
                send_verification_email(user.email, otp)
                cursor.close()
                db.close()
                return {"message": "OTP resent. Please check your email."}
            
        # New user registration
        cursor.execute("SELECT COUNT(id) as count FROM users")
        count_result = cursor.fetchone()
        role = "admin" if count_result['count'] == 0 else "user"
        
        cursor.execute(
            "INSERT INTO users (email, password_hash, role, is_verified, verification_token) VALUES (%s, %s, %s, FALSE, %s)",
            (user.email, hashed_password, role, otp)
        )
        db.commit()
        send_verification_email(user.email, otp)
        cursor.close()
        db.close()
            
        return {"message": "Registration successful! Please enter the OTP sent to your email."}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration Error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest):
    db = get_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, verification_token FROM users WHERE email = %s", (request.email,))
    user = cursor.fetchone()
    
    if not user:
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="User not found")
    
    if user['verification_token'] != request.otp:
        cursor.close()
        db.close()
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    
    # Verify the user
    cursor.execute(
        "UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = %s",
        (user['id'],)
    )
    db.commit()
    cursor.close()
    db.close()
    
    return {"message": "Email verified successfully! You can now login."}

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
            detail="Account not verified. Please check your email for the OTP."
        )
        
    access_token = create_access_token(data={"sub": user['email'], "role": user['role']})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "role": current_user["role"],
        "is_verified": bool(current_user["is_verified"])
    }
