import smtplib
import os
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

def generate_otp():
    return str(random.randint(100000, 999999))

def send_verification_email(to_email: str, otp: str):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print(f"WARNING: SMTP credentials not set. Would have sent OTP {otp} to {to_email}")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"{otp} is your GovIntern Verification Code"
    msg["From"] = f"GovIntern Portal <{SMTP_EMAIL}>"
    msg["To"] = to_email

    text = f"Hi there,\n\nYour verification code for the Prime Minister's Internship Portal (GovIntern) is: {otp}\n\nThis code expires in 10 minutes.\n\nThanks,\nGovIntern Team"
    
    html = f"""\
    <html>
      <body style="background-color: #f8fafc; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background-color: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; padding: 12px; background-color: #00A5EC; border-radius: 12px; color: white; font-weight: bold; font-size: 24px;">GI</div>
                <h2 style="color: #1e293b; margin-top: 20px; font-size: 22px;">Verify Your Identity</h2>
            </div>
            
            <p style="color: #475569; font-size: 15px; line-height: 1.6; text-align: center;">
                You are registering for the <strong>Prime Minister's Internship Scheme</strong>. Use the following Secure OTP to verify your email address:
            </p>
            
            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #00A5EC; font-family: monospace;">{otp}</span>
            </div>
            
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 30px;">
                If you did not request this code, please ignore this email. This is an automated national portal notification.
            </p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
            <p style="text-align: center; color: #64748b; font-size: 13px; font-weight: 600;">
                GovIntern | National Internship Portal
            </p>
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
        print(f"WARNING: SMTP credentials not set. Status update: {new_status}")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Application Update: {company}"
    msg["From"] = f"GovIntern Portal <{SMTP_EMAIL}>"
    msg["To"] = to_email

    text = f"Hi there,\n\nYour application status for {title} at {company} has been updated to: {new_status.upper()}.\n\nCheck your GovIntern dashboard for details.\n\nThanks,\nGovIntern Team"
    
    html = f"""\
    <html>
      <body style="background-color: #f8fafc; padding: 40px; font-family: 'Segoe UI', sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background-color: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 40px;">
            <h2 style="color: #00A5EC;">Application Update!</h2>
            <p style="color: #475569;">Your application for <strong>{title}</strong> at <strong>{company}</strong> has reached a new stage:</p>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
                <h3 style="color: #00A5EC; text-transform: uppercase; margin: 0;">{new_status}</h3>
            </div>
            <p style="color: #475569;">Log in to your <strong>GovIntern</strong> dashboard to view the next steps.</p>
            <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">GovIntern Team | National Internship Portal</p>
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
