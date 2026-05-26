import React from 'react';

const LEVELS = [
  { min: 0, label: 'Beginner', color: '#64748b' },
  { min: 5, label: 'Explorer', color: '#3b82f6' },
  { min: 15, label: 'Practitioner', color: '#8b5cf6' },
  { min: 30, label: 'Advanced Learner', color: '#f59e0b' },
  { min: 60, label: 'Expert', color: '#10b981' },
  { min: 100, label: 'Master', color: '#ec4899' },
];

function getLevel(quizzes) {
  let level = LEVELS[0];
  for (const l of LEVELS) { if (quizzes >= l.min) level = l; }
  return level;
}

function StatRow({ icon, label, value, color = '#94a3b8' }) {
  return (
    <div className="db-stat-row">
      <span className="db-stat-icon">{icon}</span>
      <span className="db-stat-label">{label}</span>
      <span className="db-stat-value" style={{ color }}>{value}</span>
    </div>
  );
}

export default function ProfileCard({ stats, accuracy }) {
  const level = getLevel(stats.quizzesCompleted);
  const totalStudyDays = Object.keys(stats.activityDates).length;

  return (
    <div className="db-card">
      <div className="db-avatar-row">
        <div className="db-avatar">
          {stats.username?.slice(0, 2).toUpperCase() || 'U'}
        </div>
        <div>
          <div className="db-username">{stats.username}</div>
          <div className="db-level-badge" style={{ background: level.color + '22', color: level.color, border: `1px solid ${level.color}44` }}>
            {level.label}
          </div>
          <div className="db-join-date">Joined {stats.joinDate}</div>
        </div>
      </div>

      <div className="db-divider" />

      <div className="db-stats-list">
        <StatRow icon="📄" label="PDFs Studied" value={stats.pdfsStudied} />
        <StatRow icon="🧠" label="Flashcards Reviewed" value={stats.flashcardsReviewed} />
        <StatRow icon="✅" label="Quizzes Completed" value={stats.quizzesCompleted} />
        <StatRow icon="🎯" label="Accuracy" value={`${accuracy}%`} color={accuracy >= 70 ? '#10b981' : accuracy >= 40 ? '#f59e0b' : '#ef4444'} />
        <StatRow icon="📅" label="Study Days" value={totalStudyDays} />
        <StatRow icon="🏅" label="Badges Earned" value={stats.badges.length} color="#f59e0b" />
      </div>
    </div>
  );
}
