import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import { useAuth } from '../hooks/useAuth';
import { useStats } from '../hooks/useStats';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const { stats, accuracy, removeWeakConcept } = useStats(token);
  const navigate = useNavigate();

  // Merge backend field names to match dashboard component expectations
  const normalised = {
    username: user?.username || 'Learner',
    joinDate: user?.join_date || new Date().toISOString().slice(0, 10),
    pdfsStudied: stats.pdfs_studied,
    flashcardsReviewed: stats.flashcards_reviewed,
    quizzesCompleted: stats.quizzes_completed,
    totalQuestions: stats.total_questions,
    correctAnswers: stats.correct_answers,
    streakDays: stats.streak_days,
    longestStreak: stats.longest_streak,
    lastStudyDate: stats.last_study_date,
    badges: stats.badges,
    weakConcepts: stats.weak_concepts,
    recentActivity: stats.recent_activity,
    activityDates: stats.activity_dates,
  };

  return (
    <Dashboard
      stats={normalised}
      accuracy={accuracy}
      onStartStudy={() => navigate('/study')}
      onDismissWeak={removeWeakConcept}
    />
  );
}
