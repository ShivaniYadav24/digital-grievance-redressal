from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, complaint
from fastapi.staticfiles import StaticFiles

# Database tables banao
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Digital Grievance Redressal System")

# CORS — React frontend se baat kar sake
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]  # ← yeh add karo
)

# Routes add karo
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(complaint.router, prefix="/api/complaints", tags=["Complaints"])
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"message": "Digital Grievance Redressal System API is running!"}