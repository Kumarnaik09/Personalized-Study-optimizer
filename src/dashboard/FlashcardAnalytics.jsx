import React from 'react';

export default function FlashcardAnalytics({ stats }) {
  const total = stats.flashcardsReviewed || 0;
  const pdfs  = stats.pdfsStudied || 0;
  const avgPerPdf = pdfs > 0 ? Math.round(total / pdfs) : 0;

  const bars = [
    { label: 'Total Reviewed',      value: total,     max: 200, color: '#8b5cf6' },
    { label: 'PDFs Uploaded',       value: pdfs,      max: 20,  color: '#3b82f6' },
    { label: 'Avg Cards / PDF',     value: avgPerPdf, max: 30,  color: '#06b6d4' },
  ];

  return (
    <div className="db-card">
      <div className="db-card-title">🧠 Flashcard Analytics</div>

      <div className="db-qa-grid" style={{ marginBottom: '1.1rem' }}>
        <div className="db-qa-stat">
          <div className="db-qa-num" style={{ color: '#8b5cf6' }}>{total}</div>
          <div className="db-qa-label">Cards Reviewed</div>
        </div>
        <div className="db-qa-stat">
          <div className="db-qa-num" style={{ color: '#3b82f6' }}>{pdfs}</div>
          <div className="db-qa-label">PDFs Uploaded</div>
        </div>
        <div className="db-qa-stat">
          <div className="db-qa-num" style={{ color: '#06b6d4' }}>{avgPerPdf}</div>
          <div className="db-qa-label">Avg / PDF</div>
        </div>
      </div>

      <div className="db-bars-list">
        {bars.map(b => {
          const pct = b.max > 0 ? Math.min(100, Math.round((b.value / b.max) * 100)) : 0;
          return (
            <div key={b.label} className="db-bar-item">
              <div className="db-bar-header">
                <span className="db-bar-label">{b.label}</span>
                <span className="db-bar-pct" style={{ color: b.color }}>{b.value}</span>
              </div>
              <div className="db-bar-track">
                <div className="db-bar-fill" style={{ width: `${pct}%`, background: b.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
