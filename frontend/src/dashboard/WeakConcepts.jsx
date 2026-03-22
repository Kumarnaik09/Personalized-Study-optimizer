import React from 'react';

export default function WeakConcepts({ weakConcepts, onReview, onRetake, onDismiss }) {
  if (!weakConcepts || weakConcepts.length === 0) {
    return (
      <div className="db-card">
        <div className="db-card-title">⚠️ Weak Concepts</div>
        <div className="db-empty" style={{ color: '#10b981' }}>
          🎉 No weak concepts detected! Keep it up.
        </div>
      </div>
    );
  }

  return (
    <div className="db-card">
      <div className="db-card-title">⚠️ Weak Concepts</div>
      <div className="db-weak-list">
        {weakConcepts.map((item, i) => (
          <div key={i} className="db-weak-item">
            <div className="db-weak-top">
              <span className="db-weak-topic">• {item.topic}</span>
              <span className="db-weak-count" style={{ color: '#ef4444' }}>{item.count}x wrong</span>
            </div>
            <div className="db-weak-actions">
              <button className="db-weak-btn review" onClick={() => onReview?.(item.topic)}>
                📚 Review Flashcards
              </button>
              <button className="db-weak-btn retake" onClick={() => onRetake?.(item.topic)}>
                🔁 Retake Quiz
              </button>
              <button className="db-weak-btn dismiss" onClick={() => onDismiss?.(item.topic)}>
                ✓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
