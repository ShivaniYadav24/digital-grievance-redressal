from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintUpdate, ComplaintResponse, CitizenConfirmation
from app.email_config import send_status_email
from jose import jwt, JWTError
from typing import Optional
import uuid
import shutil
import os
from datetime import datetime, timedelta

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_ticket_id():
    year = datetime.now().year
    unique = str(uuid.uuid4())[:5].upper()
    return f"GRV-{year}-{unique}"

def set_due_date(priority: str):
    days = {"high": 3, "medium": 7, "low": 14}
    return datetime.utcnow() + timedelta(days=days.get(priority, 7))

@router.post("/submit", response_model=ComplaintResponse)
async def submit_complaint(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    category: str = Form(...),
    photo: UploadFile = File(None),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    ticket_id = generate_ticket_id()
    due_date = set_due_date("medium")

    user_id = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            payload = jwt.decode(token, "grievance_secret_key_2026", algorithms=["HS256"])
            email = payload.get("sub")
            if email:
                from app.models.user import User
                user = db.query(User).filter(User.email == email).first()
                if user:
                    user_id = user.id
        except JWTError:
            pass

    photo_url = None
    if photo and photo.filename:
        file_path = f"{UPLOAD_DIR}/{ticket_id}_{photo.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
        photo_url = file_path

    new_complaint = Complaint(
        ticket_id=ticket_id,
        title=title,
        description=description,
        location=location,
        category=category,
        priority="medium",
        status="open",
        due_date=due_date,
        photo_url=photo_url,
        user_id=user_id
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return new_complaint

@router.get("/track/{ticket_id}", response_model=ComplaintResponse)
def track_complaint(ticket_id: str, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(
        Complaint.ticket_id == ticket_id
    ).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return complaint

@router.get("/all", response_model=list[ComplaintResponse])
def get_all_complaints(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).filter(
        (Complaint.citizen_confirmed == None) | 
        (Complaint.citizen_confirmed == False)
    ).all()
    return complaints

# User ki apni complaints
@router.get("/my-complaints", response_model=list[ComplaintResponse])
def get_my_complaints(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    user_id = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            payload = jwt.decode(token, "grievance_secret_key_2026", algorithms=["HS256"])
            email = payload.get("sub")
            if email:
                from app.models.user import User
                user = db.query(User).filter(User.email == email).first()
                if user:
                    user_id = user.id
        except JWTError:
            pass

    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    complaints = db.query(Complaint).filter(
        Complaint.user_id == user_id
    ).all()
    return complaints

@router.patch("/update/{ticket_id}", response_model=ComplaintResponse)
async def update_complaint(
    ticket_id: str,
    update: ComplaintUpdate,
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(
        Complaint.ticket_id == ticket_id
    ).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Ticket not found")

    for key, value in update.dict(exclude_unset=True).items():
        setattr(complaint, key, value)

    if update.status == "resolved":
        complaint.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(complaint)

    if complaint.user_id:
        from app.models.user import User
        user = db.query(User).filter(User.id == complaint.user_id).first()
        if user and user.email:
            await send_status_email(user.email, ticket_id, update.status)

    return complaint

@router.post("/confirm/{ticket_id}")
def confirm_resolution(
    ticket_id: str,
    confirmation: CitizenConfirmation,
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(
        Complaint.ticket_id == ticket_id
    ).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Ticket not found")

    complaint.citizen_confirmed = confirmation.confirmed
    if not confirmation.confirmed:
        complaint.status = "open"
        complaint.priority = "high"

    db.commit()
    return {"message": "Confirmation received"}