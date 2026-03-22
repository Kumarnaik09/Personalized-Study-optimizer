from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./studyoptimizer.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id            = Column(Integer, primary_key=True, index=True)
    email         = Column(String, unique=True, index=True, nullable=False)
    username      = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    join_date     = Column(String, default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))

class UserStats(Base):
    __tablename__ = "user_stats"
    id                  = Column(Integer, primary_key=True, index=True)
    user_id             = Column(Integer, unique=True, index=True, nullable=False)
    pdfs_studied        = Column(Integer, default=0)
    flashcards_reviewed = Column(Integer, default=0)
    quizzes_completed   = Column(Integer, default=0)
    total_questions     = Column(Integer, default=0)
    correct_answers     = Column(Integer, default=0)
    streak_days         = Column(Integer, default=0)
    longest_streak      = Column(Integer, default=0)
    last_study_date     = Column(String, nullable=True)
    badges              = Column(Text, default="[]")          # JSON
    weak_concepts       = Column(Text, default="[]")          # JSON
    recent_activity     = Column(Text, default="[]")          # JSON
    activity_dates      = Column(Text, default="{}")          # JSON

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
