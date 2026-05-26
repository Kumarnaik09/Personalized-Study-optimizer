import React from 'react';

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="db-bar-item">
      <div className="db-bar-header">
        <span className="db-bar-label">{label}</span>
        <span className="db-bar-pct" style={{ color }}>{pct}%</span>
      </div>
      <div className="db-bar-track">
        <div className="db-bar-fill" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}66` }} />
      </div>
    </div>
  );
}

export default function LearningProgress({ stats, accuracy }) {
  const flashcardGoal = 100;
  const quizGoal = 20;

  return (
    <div className="db-card">
      <div className="db-card-title">📈 Learning Progress</div>
      <div className="db-bars-list">
        <Bar label="Flashcards Reviewed" value={stats.flashcardsReviewed} max={flashcardGoal} color="#8b5cf6" />
        <Bar label="Quizzes Completed" value={stats.quizzesCompleted} max={quizGoal} color="#3b82f6" />
        <Bar label="Concept Mastery" value={accuracy} max={100} color="#10b981" />
        <Bar label="Study Days" value={Object.keys(stats.activityDates).length} max={30} color="#f59e0b" />
      </div>
    </div>
  );
}
