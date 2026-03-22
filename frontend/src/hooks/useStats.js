import { useState, useCallback, useEffect } from 'react';
import { API_BASE } from './useAuth';

const todayStr = () => new Date().toISOString().slice(0, 10);

function computeStreak(activityDates, lastStudyDate, currentStreak) {
  const today = todayStr();
  if (lastStudyDate === today) return currentStreak;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yStr = y.toISOString().slice(0, 10);
  if (lastStudyDate === yStr) return currentStreak + 1;
  return 1;
}

const DEFAULT = {
  pdfs_studied: 0, flashcards_reviewed: 0, quizzes_completed: 0,
  total_questions: 0, correct_answers: 0, streak_days: 0, longest_streak: 0,
  last_study_date: null, badges: [], weak_concepts: [], recent_activity: [],
  activity_dates: {},
};

export function useStats(token) {
  const [stats, setStats] = useState(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  // Load from backend when token available
  useEffect(() => {
    if (!token) { setStats(DEFAULT); setLoaded(false); return; }
    fetch(`${API_BASE}/api/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { setStats({ ...DEFAULT, ...data }); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [token]);

  // Sync to backend
  const sync = useCallback((next) => {
    if (!token) return;
    fetch(`${API_BASE}/api/stats`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(next),
    }).catch(() => {});
  }, [token]);

  const update = useCallback((updater) => {
    setStats(prev => {
      const next = updater({ ...prev });
      sync(next);
      return next;
    });
  }, [sync]);

  const recordPdfUpload = useCallback((filename) => {
    update(s => {
      const today = todayStr();
      const dates = { ...s.activity_dates, [today]: (s.activity_dates[today] || 0) + 2 };
      const newStreak = computeStreak(s.activity_dates, s.last_study_date, s.streak_days);
      return {
        ...s, pdfs_studied: s.pdfs_studied + 1,
        activity_dates: dates, last_study_date: today,
        streak_days: newStreak, longest_streak: Math.max(s.longest_streak, newStreak),
        recent_activity: [{ text: `Uploaded "${filename}"`, icon: '📄', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...s.recent_activity.slice(0, 19)],
      };
    });
  }, [update]);

  const recordFlashcards = useCallback((count) => {
    update(s => {
      const today = todayStr();
      const dates = { ...s.activity_dates, [today]: (s.activity_dates[today] || 0) + 1 };
      const newStreak = computeStreak(s.activity_dates, s.last_study_date, s.streak_days);
      return {
        ...s, flashcards_reviewed: s.flashcards_reviewed + count,
        activity_dates: dates, last_study_date: today,
        streak_days: newStreak, longest_streak: Math.max(s.longest_streak, newStreak),
        recent_activity: [{ text: `Studied ${count} flashcards`, icon: '🧠', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...s.recent_activity.slice(0, 19)],
      };
    });
  }, [update]);

  const recordQuiz = useCallback((correct, total, wrongTopics, earnedBadges) => {
    update(s => {
      const today = todayStr();
      const dates = { ...s.activity_dates, [today]: (s.activity_dates[today] || 0) + 3 };
      const newStreak = computeStreak(s.activity_dates, s.last_study_date, s.streak_days);
      const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
      const existing = new Set(s.weak_concepts.map(w => w.topic));
      const newWeak = wrongTopics.filter(t => !existing.has(t)).map(t => ({ topic: t, count: 1 }));
      const updatedWeak = [
        ...s.weak_concepts.map(w => wrongTopics.includes(w.topic) ? { ...w, count: w.count + 1 } : w),
        ...newWeak,
      ].slice(0, 10);
      const existingBadgeNames = new Set(s.badges.map(b => b.name));
      const newBadges = earnedBadges.filter(b => !existingBadgeNames.has(b.name)).map(b => ({ ...b, earnedDate: today }));
      return {
        ...s, quizzes_completed: s.quizzes_completed + 1,
        total_questions: s.total_questions + total, correct_answers: s.correct_answers + correct,
        activity_dates: dates, last_study_date: today,
        streak_days: newStreak, longest_streak: Math.max(s.longest_streak, newStreak),
        weak_concepts: updatedWeak, badges: [...s.badges, ...newBadges],
        recent_activity: [{ text: `Completed quiz — Score: ${correct}/${total} (${pct}%)`, icon: '✅', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...s.recent_activity.slice(0, 19)],
      };
    });
  }, [update]);

  const recordBadge = useCallback((badge) => {
    update(s => {
      if (s.badges.some(b => b.name === badge.name)) return s;
      return {
        ...s, badges: [...s.badges, { ...badge, earnedDate: todayStr() }],
        recent_activity: [{ text: `Earned badge: "${badge.name}"`, icon: '🏅', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...s.recent_activity.slice(0, 19)],
      };
    });
  }, [update]);

  const removeWeakConcept = useCallback((topic) => {
    update(s => ({ ...s, weak_concepts: s.weak_concepts.filter(w => w.topic !== topic) }));
  }, [update]);

  const accuracy = stats.total_questions > 0
    ? Math.round((stats.correct_answers / stats.total_questions) * 100) : 0;

  return { stats, accuracy, loaded, recordPdfUpload, recordFlashcards, recordQuiz, recordBadge, removeWeakConcept };
}
