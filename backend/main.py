from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
import json
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

from pdf_parser import extract_text_from_pdf
from ai_service import GroqService
from database import get_db, create_tables, User, UserStats
from auth import (
    hash_password, verify_password, create_access_token, get_current_user
)

app = FastAPI(title="StudyOptimizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables on startup
create_tables()
ai_service = GroqService()

# ── Pydantic schemas ──────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class StatsPayload(BaseModel):
    pdfs_studied: int = 0
    flashcards_reviewed: int = 0
    quizzes_completed: int = 0
    total_questions: int = 0
    correct_answers: int = 0
    streak_days: int = 0
    longest_streak: int = 0
    last_study_date: str = None
    badges: list = []
    weak_concepts: list = []
    recent_activity: list = []
    activity_dates: dict = {}

class RemedialRequest(BaseModel):
    question_text: str
    wrong_answer: str

# ── Auth endpoints ────────────────────────────────────────────────

@app.post("/api/auth/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=req.email,
        username=req.username,
        hashed_password=hash_password(req.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    # Create empty stats row for this user
    stats = UserStats(user_id=user.id)
    db.add(stats)
    db.commit()
    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "username": user.username, "join_date": user.join_date}
    }

@app.post("/api/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "username": user.username, "join_date": user.join_date}
    }

@app.get("/api/auth/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "join_date": current_user.join_date,
    }

# ── Stats endpoints ───────────────────────────────────────────────

@app.get("/api/stats")
def get_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
        db.commit()
        db.refresh(stats)
    return {
        "pdfs_studied": stats.pdfs_studied,
        "flashcards_reviewed": stats.flashcards_reviewed,
        "quizzes_completed": stats.quizzes_completed,
        "total_questions": stats.total_questions,
        "correct_answers": stats.correct_answers,
        "streak_days": stats.streak_days,
        "longest_streak": stats.longest_streak,
        "last_study_date": stats.last_study_date,
        "badges": json.loads(stats.badges or "[]"),
        "weak_concepts": json.loads(stats.weak_concepts or "[]"),
        "recent_activity": json.loads(stats.recent_activity or "[]"),
        "activity_dates": json.loads(stats.activity_dates or "{}"),
    }

@app.put("/api/stats")
def update_stats(payload: StatsPayload, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
    stats.pdfs_studied        = payload.pdfs_studied
    stats.flashcards_reviewed = payload.flashcards_reviewed
    stats.quizzes_completed   = payload.quizzes_completed
    stats.total_questions     = payload.total_questions
    stats.correct_answers     = payload.correct_answers
    stats.streak_days         = payload.streak_days
    stats.longest_streak      = payload.longest_streak
    stats.last_study_date     = payload.last_study_date
    stats.badges              = json.dumps(payload.badges)
    stats.weak_concepts       = json.dumps(payload.weak_concepts)
    stats.recent_activity     = json.dumps(payload.recent_activity)
    stats.activity_dates      = json.dumps(payload.activity_dates)
    db.commit()
    return {"ok": True}

@app.put("/api/auth/username")
def update_username(body: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.username = body.get("username", current_user.username)
    db.commit()
    return {"ok": True, "username": current_user.username}

# ── Existing PDF / AI endpoints ───────────────────────────────────

@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    contents = await file.read()
    try:
        text = extract_text_from_pdf(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")
    flashcards = ai_service.generate_flashcards(text)
    quiz = ai_service.generate_quiz(text)
    return {"message": "PDF processed successfully", "flashcards": flashcards, "quiz": quiz}

@app.post("/api/generate-remedial")
async def generate_remedial(request: RemedialRequest):
    return ai_service.generate_remedial(request.question_text, request.wrong_answer)

@app.get("/api/health")
async def health():
    return {"status": "ok", "groq_connected": ai_service.client is not None}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
