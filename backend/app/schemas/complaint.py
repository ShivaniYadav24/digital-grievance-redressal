from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Complaint submit karne ke liye
class ComplaintCreate(BaseModel):
    title: str
    description: str
    location: str
    category: str

# Complaint update karne ke liye — Admin
class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    department: Optional[str] = None
    internal_note: Optional[str] = None
    admin_reply: Optional[str] = None

# Citizen confirmation ke liye
class CitizenConfirmation(BaseModel):
    confirmed: bool

# Response ke liye
class ComplaintResponse(BaseModel):
    id: int
    ticket_id: str
    title: str
    description: str
    location: str
    category: str
    priority: str
    status: str
    photo_url: Optional[str] = None
    assigned_to: Optional[str] = None
    department: Optional[str] = None
    admin_reply: Optional[str] = None
    citizen_confirmed: Optional[bool] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    due_date: Optional[datetime] = None

    class Config:
        from_attributes = True