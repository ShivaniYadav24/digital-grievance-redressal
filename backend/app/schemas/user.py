from pydantic import BaseModel, EmailStr
from typing import Optional

# Register ke liye
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

# Login ke liye
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Response ke liye — password nahi bhejenge
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

# Token ke liye
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None