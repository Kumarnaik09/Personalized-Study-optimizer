import React from 'react';

export default function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="db-card">
        <div className="db-card-title">📋 Recent Activity</div>
        <div className="db-empty">No activity yet. Upload a PDF to get started!</div>
      </div>
    );
  }

  return (
    <div className="db-card">
      <div className="db-card-title">📋 Recent Activity</div>
      <div className="db-activity-list">
        {activities.slice(0, 8).map((item, i) => (
          <div key={i} className="db-activity-item">
            <div className="db-activity-icon">{item.icon}</div>
            <div className="db-activity-text">{item.text}</div>
            {item.time && <div className="db-activity-time">{item.time}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
