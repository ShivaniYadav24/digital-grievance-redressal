from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME="shivaniydv2473@gmail.com",  # Apna Gmail
    MAIL_PASSWORD="qhio pplb nrsr luva",      # Gmail App Password
    MAIL_FROM="shivaniydv2473@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_status_email(to_email: str, ticket_id: str, status: str):
    message = MessageSchema(
        subject=f"Complaint Update — {ticket_id}",
        recipients=[to_email],
        body=f"""
        Dear Citizen,
        
        Your complaint {ticket_id} status has been updated to: {status.upper()}
        
        Track your complaint at: http://localhost:3000/track
        
        Regards,
        Digital Grievance Redressal System
        """,
        subtype="plain"
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)
