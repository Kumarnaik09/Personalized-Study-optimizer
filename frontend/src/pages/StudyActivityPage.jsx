import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityHeatmap from '../dashboard/ActivityHeatmap';
import RecentActivity from '../dashboard/RecentActivity';
import { useAuth } from '../hooks/useAuth';
import { useStats } from '../hooks/useStats';

export default function StudyActivityPage() {
  const { token } = useAuth();
  const { stats } = useStats(token);
  const navigate = useNavigate();

  return (
    <div className="db-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h1 className="page-title">📅 Study Activity</h1>
        <p className="page-sub">Your study history and recent actions</p>
      </div>
      <div className="full-page-grid">
        <div style={{ flex: 2, minWidth: 0 }}>
          <ActivityHeatmap activityDates={stats.activity_dates || {}} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <RecentActivity activities={stats.recent_activity || []} />
        </div>
      </div>

      {/* Summary stats row */}
      <div className="db-card" style={{ marginTop: '1.25rem' }}>
        <div className="db-card-title">📊 Summary</div>
        <div className="db-qa-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          <div className="db-qa-stat">
            <div className="db-qa-num" style={{ color: '#8b5cf6' }}>{Object.keys(stats.activity_dates || {}).length}</div>
            <div className="db-qa-label">Study Days</div>
          </div>
          <div className="db-qa-stat">
            <div className="db-qa-num" style={{ color: '#f97316' }}>{stats.streak_days || 0}</div>
            <div className="db-qa-label">Current Streak</div>
          </div>
          <div className="db-qa-stat">
            <div className="db-qa-num" style={{ color: '#f59e0b' }}>{stats.longest_streak || 0}</div>
            <div className="db-qa-label">Longest Streak</div>
          </div>
          <div className="db-qa-stat">
            <div className="db-qa-num" style={{ color: '#3b82f6' }}>{(stats.recent_activity || []).length}</div>
            <div className="db-qa-label">Total Actions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
