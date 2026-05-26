import React, { useState } from 'react';

export default function Navbar({ routePath, onNavigate, username }) {
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { path: '/dashboard',           label: 'Dashboard',  icon: '⊞' },
    { path: '/study',               label: 'Study',      icon: '📄' },
    { path: '/analytics/flashcards', label: 'Flashcards', icon: '🧠' },
    { path: '/analytics/quiz',      label: 'Quiz',       icon: '❓' },
    { path: '/activity',            label: 'Activity',   icon: '📅' },
  ];

  const initials = (username || 'U').slice(0, 2).toUpperCase();

  return (
    <nav className="db-nav">
      <div className="db-nav-inner">
        <div className="db-nav-logo" onClick={() => onNavigate('/dashboard')}>
          <div className="db-nav-logo-icon">P</div>
          <span className="db-nav-logo-text">StudyOptimizer</span>
        </div>

        <div className="db-nav-links">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`db-nav-link ${routePath === item.path ? 'active' : ''}`}
              onClick={() => onNavigate(item.path)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="db-nav-profile" onClick={() => setProfileOpen(o => !o)}>
          <div className="db-nav-avatar">{initials}</div>
          <span className="db-nav-username">{username || 'User'}</span>
          <span className="db-nav-arrow">{profileOpen ? '▲' : '▼'}</span>
          {profileOpen && (
            <div className="db-nav-dropdown">
              <div className="db-nav-drop-item" onClick={(e) => { e.stopPropagation(); setProfileOpen(false); onNavigate('/settings'); }}>⚙ Settings</div>
              <div className="db-nav-drop-item" onClick={(e) => { e.stopPropagation(); setProfileOpen(false); onNavigate('logout'); }}>🚪 Logout</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
