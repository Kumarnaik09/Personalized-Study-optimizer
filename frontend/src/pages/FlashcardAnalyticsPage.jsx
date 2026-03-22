import React from 'react';
import { useNavigate } from 'react-router-dom';
import FlashcardAnalytics from '../dashboard/FlashcardAnalytics';
import { useAuth } from '../hooks/useAuth';
import { useStats } from '../hooks/useStats';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FlashcardAnalyticsPage() {
  const { token } = useAuth();
  const { stats } = useStats(token);
  const navigate = useNavigate();

  // Build last-7-days chart data from activity_dates
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return { date: key.slice(5), activity: (stats.activity_dates || {})[key] || 0 };
  });

  const normalised = {
    flashcardsReviewed: stats.flashcards_reviewed || 0,
    pdfsStudied: stats.pdfs_studied || 0,
  };

  return (
    <div className="db-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h1 className="page-title">🧠 Flashcard Analytics</h1>
        <p className="page-sub">Deep dive into your flashcard learning</p>
      </div>

      <div className="full-page-grid">
        <div style={{ flex: 1 }}>
          <FlashcardAnalytics stats={normalised} />
        </div>
        <div style={{ flex: 2 }}>
          <div className="db-card">
            <div className="db-card-title">📈 7-Day Activity</div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
                  <Area type="monotone" dataKey="activity" stroke="#8b5cf6" fill="url(#grad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="db-card" style={{ marginTop: '1.25rem' }}>
        <div className="db-card-title">💡 Tips to improve</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '⏱', tip: 'Study in short 20-min sessions for better retention.' },
            { icon: '🔁', tip: 'Revisit flashcards after 1 day, 1 week, then 1 month (spaced repetition).' },
            { icon: '📖', tip: 'Upload PDFs regularly — variety helps build connections.' },
            { icon: '🎯', tip: 'Focus on weak concepts shown in your dashboard.' },
          ].map(({ icon, tip }) => (
            <div key={tip} className="db-weak-item" style={{ borderColor: '#8b5cf644' }}>
              <span style={{ fontSize: '1.4rem' }}>{icon}</span>
              <p style={{ fontSize: '.82rem', color: '#94a3b8', marginTop: '.4rem', lineHeight: 1.5 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
