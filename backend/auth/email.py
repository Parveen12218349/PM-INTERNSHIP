import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

def send_verification_email(to_email: str, token: str):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print(f"WARNING: SMTP credentials not set. Would have sent verification email to {to_email}")
        print(f"Verification link: {FRONTEND_URL}/verify-email?token={token}")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Verify your InternMatch Account"
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email

    verify_link = f"{FRONTEND_URL}/verify-email?token={token}"

    text = f"Hi there,\n\nPlease verify your email by clicking the following link:\n{verify_link}\n\nThanks,\nInternMatch Team"
    
    html = f"""\
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #6366f1;">Welcome to InternMatch!</h2>
            <p>Please click the button below to verify your email address:</p>
            <a href="{verify_link}" style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
            <p style="margin-top: 20px; font-size: 12px; color: #777;">Or copy this link: {verify_link}</p>
        </div>
      </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    msg.attach(part1)
    msg.attach(part2)

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def send_status_update_email(to_email: str, company: str, title: str, new_status: str):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print(f"WARNING: SMTP credentials not set. Would have sent status update email to {to_email} for {company} - {title} to {new_status}")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Application Status Update: {company}"
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email

    text = f"Hi there,\n\nYour application status for {title} at {company} has been updated to: {new_status.upper()}.\n\nCheck your dashboard for details.\n\nThanks,\nInternMatch Team"
    
    html = f"""\
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #6366f1;">Application Update!</h2>
            <p>Your application status for <strong>{title}</strong> at <strong>{company}</strong> has been updated to:</p>
            <h3 style="color: #00A5EC; text-transform: uppercase;">{new_status}</h3>
            <p>Log in to your InternMatch dashboard to view more details.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #777;">Thanks, InternMatch Team</p>
        </div>
      </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    msg.attach(part1)
    msg.attach(part2)

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send status email: {e}")
        return False

