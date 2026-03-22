import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './dashboard.css';

import { AuthProvider, useAuth } from './hooks/useAuth';
import { useStats } from './hooks/useStats';

import Navbar from './dashboard/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StudyActivityPage from './pages/StudyActivityPage';
import FlashcardAnalyticsPage from './pages/FlashcardAnalyticsPage';
import QuizAnalyticsPage from './pages/QuizAnalyticsPage';
import PdfUploader from './components/PdfUploader';
import FlashcardViewer from './components/FlashcardViewer';
import QuizView from './components/QuizView';
import RemedialView from './components/RemedialView';

// ── Protected Route ───────────────────────────────────────────────
function Protected({ element }) {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" replace />;
}

// ── Study Flow (PDF → Flashcards → Quiz → Remedial → Results) ──────
function StudyFlow() {
  const { user, token } = useAuth();
  const { stats, recordPdfUpload, recordFlashcards, recordQuiz, recordBadge } = useStats(token);
  const navigate = useNavigate();

  const [screen, setScreen] = useState('upload');
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [remedialData, setRemedialData] = useState(null);
  const [pendingIndex, setPendingIndex] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongTopics, setWrongTopics] = useState([]);

  const handleUploaded = ({ flashcards: fc, quiz: qz }, filename) => {
    setFlashcards(fc); setQuiz(qz);
    setCorrectCount(0); setWrongTopics([]);
    recordPdfUpload(filename || 'document.pdf');
    setScreen('flashcards');
  };

  const handleFlashcardsDone = () => { recordFlashcards(flashcards.length); setScreen('quiz'); };

  const handleWrongAnswer = async (questionId, wrongIndex, qIndex) => {
    const q = quiz[qIndex];
    setWrongTopics(prev => [...prev, q.question.split(' ').slice(0, 5).join(' ')]);
    setRemedialData(null); setPendingIndex(qIndex); setScreen('remedial');
    try {
      const res = await fetch('http://localhost:8000/api/generate-remedial', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_text: q.question, wrong_answer: q.options[wrongIndex] }),
      });
      setRemedialData(res.ok ? await res.json() : { simplified_explanation: 'Review this concept carefully.', new_question: q });
    } catch { setRemedialData({ simplified_explanation: 'Review this concept carefully.', new_question: quiz[qIndex] }); }
  };

  const handleCorrect = () => setCorrectCount(c => c + 1);

  const handleNewQuestion = (newQ) => {
    setQuiz(prev => { const u = [...prev]; u[pendingIndex] = newQ; return u; });
    setRemedialData(null); setPendingIndex(null); setScreen('quiz');
  };

  const handleQuizComplete = () => {
    const total = quiz.length; const correct = correctCount;
    const newAcc = (stats.total_questions + total) > 0
      ? Math.round(((stats.correct_answers + correct) / (stats.total_questions + total)) * 100) : 0;
    const earnedBadges = [];
    if (correct === total && total > 0) earnedBadges.push({ name: 'Flawless Victory', icon: '⭐', type: 'perfect' });
    if (wrongTopics.length > 0 && correct > 0) earnedBadges.push({ name: 'Comeback Kid', icon: '💪', type: 'comeback' });
    if (stats.pdfs_studied === 0) earnedBadges.push({ name: 'First Upload', icon: '📄', type: 'upload' });
    if (stats.quizzes_completed + 1 >= 5) earnedBadges.push({ name: 'Quiz Master', icon: '🏆', type: 'quizzes' });
    if (stats.flashcards_reviewed + flashcards.length >= 50) earnedBadges.push({ name: 'Flashcard Pro', icon: '🧠', type: 'flashcards' });
    if (stats.streak_days >= 7) earnedBadges.push({ name: '7 Day Streak', icon: '🔥', type: 'streak7' });
    if (newAcc >= 90) earnedBadges.push({ name: 'Concept Master', icon: '🎯', type: 'accuracy' });
    recordQuiz(correct, total, wrongTopics, earnedBadges);
    earnedBadges.forEach(b => recordBadge(b));
    setScreen('results');
  };

  if (screen === 'upload') return <PdfUploader onUploadComplete={handleUploaded} />;
  if (screen === 'flashcards') return <FlashcardViewer flashcards={flashcards} onFinish={handleFlashcardsDone} />;
  if (screen === 'quiz') return <QuizView quiz={quiz} onCorrect={handleCorrect} onWrongAnswer={handleWrongAnswer} onQuizComplete={handleQuizComplete} />;
  if (screen === 'remedial') return <RemedialView data={remedialData} onNewQuestionReady={handleNewQuestion} />;

  // Results screen
  return (
    <div className="db-results">
      <div className="db-results-icon">🎉</div>
      <h2 className="db-results-title">Quiz Complete!</h2>
      <div className="db-score-ring">
        <svg viewBox="0 0 120 120" width="140" height="140">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle cx="60" cy="60" r="50" fill="none"
            stroke={correctCount === quiz.length ? '#10b981' : correctCount >= quiz.length / 2 ? '#f59e0b' : '#ef4444'}
            strokeWidth="10"
            strokeDasharray={`${(correctCount / (quiz.length || 1)) * 314} 314`}
            strokeLinecap="round" transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dasharray 1s ease' }} />
          <text x="60" y="55" textAnchor="middle" fill="white" fontSize="22" fontWeight="800">{correctCount}/{quiz.length}</text>
          <text x="60" y="75" textAnchor="middle" fill="#94a3b8" fontSize="12">Score</text>
        </svg>
      </div>
      <p className="db-results-sub">
        {correctCount === quiz.length ? '🏆 Perfect score!' :
         correctCount >= quiz.length * 0.7 ? '✅ Great job!' : '💪 Keep practicing!'}
      </p>
      <div className="db-results-btns">
        <button className="db-btn-primary" onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
        <button className="db-btn-ghost" onClick={() => setScreen('upload')}>📄 Study Again</button>
      </div>
    </div>
  );
}

// ── Settings Page ─────────────────────────────────────────────────
function SettingsPage() {
  const { user, updateUsername } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.username || '');
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await updateUsername(name.trim() || 'Learner');
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="db-results" style={{ gap: '1.5rem' }}>
      <div style={{ fontSize: '2rem' }}>⚙️</div>
      <h2 className="db-results-title" style={{ fontSize: '1.8rem' }}>Settings</h2>
      <div className="db-card" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '.85rem', color: '#94a3b8', fontWeight: 600 }}>Email</label>
          <div style={{ color: '#64748b', marginTop: '.3rem', fontSize: '.9rem' }}>{user?.email}</div>
        </div>
        <label style={{ fontSize: '.85rem', color: '#94a3b8', fontWeight: 600 }}>Display Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name…"
          style={{ display: 'block', width: '100%', marginTop: '.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '.75rem', padding: '.7rem 1rem', color: '#f1f5f9', fontSize: '.95rem', outline: 'none' }} />
        <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.25rem' }}>
          <button className="db-btn-primary" onClick={save}>{saved ? '✅ Saved!' : 'Save'}</button>
          <button className="db-btn-ghost" onClick={() => navigate('/dashboard')}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Layout wrapper with Navbar ────────────────────────────────────
function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="db-app">
      {!isAuth && user && (
        <Navbar
          routePath={location.pathname}
          username={user?.username}
          onNavigate={(path) => {
            if (path === 'logout') { logout(); navigate('/login'); }
            else navigate(path);
          }}
        />
      )}
      <div className={!isAuth ? 'db-page' : ''}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Protected element={<DashboardPage />} />} />
          <Route path="/study" element={<Protected element={<StudyFlow />} />} />
          <Route path="/activity" element={<Protected element={<StudyActivityPage />} />} />
          <Route path="/analytics/flashcards" element={<Protected element={<FlashcardAnalyticsPage />} />} />
          <Route path="/analytics/quiz" element={<Protected element={<QuizAnalyticsPage />} />} />
          <Route path="/settings" element={<Protected element={<SettingsPage />} />} />
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
