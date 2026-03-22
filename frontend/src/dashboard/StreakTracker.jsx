import React from 'react';

export default function StreakTracker({ stats }) {
  const totalDays = Object.keys(stats.activityDates).length;

  return (
    <div className="db-card">
      <div className="db-card-title">🔥 Streak Tracker</div>
      <div className="db-streak-grid">
        <div className="db-streak-box" style={{ borderColor: '#f97316aa' }}>
          <div className="db-streak-icon">🔥</div>
          <div className="db-streak-num" style={{ color: '#f97316' }}>{stats.streakDays}</div>
          <div className="db-streak-sub">Current Streak</div>
        </div>
        <div className="db-streak-box" style={{ borderColor: '#f59e0baa' }}>
          <div className="db-streak-icon">🏆</div>
          <div className="db-streak-num" style={{ color: '#f59e0b' }}>{stats.longestStreak}</div>
          <div className="db-streak-sub">Longest Streak</div>
        </div>
        <div className="db-streak-box" style={{ borderColor: '#3b82f6aa' }}>
          <div className="db-streak-icon">📅</div>
          <div className="db-streak-num" style={{ color: '#3b82f6' }}>{totalDays}</div>
          <div className="db-streak-sub">Total Study Days</div>
        </div>
      </div>
    </div>
  );
}
