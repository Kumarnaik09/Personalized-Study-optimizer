import React from 'react';

const ALL_BADGES = [
  { name: 'First Upload', icon: '📄', desc: 'Uploaded your first PDF', type: 'upload' },
  { name: 'Flashcard Pro', icon: '🧠', desc: 'Reviewed 50+ flashcards', type: 'flashcards' },
  { name: 'Quiz Master', icon: '🏆', desc: 'Completed 5+ quizzes', type: 'quizzes' },
  { name: 'Flawless Victory', icon: '⭐', desc: 'Perfect score on a quiz', type: 'perfect' },
  { name: 'Persistent Learner', icon: '🛡️', desc: 'Overcame wrong answers and mastered concepts', type: 'persistent' },
  { name: '7 Day Streak', icon: '🔥', desc: 'Studied 7 days in a row', type: 'streak7' },
  { name: 'Concept Master', icon: '🎯', desc: '90%+ accuracy overall', type: 'accuracy' },
  { name: 'Comeback Kid', icon: '💪', desc: 'Answered wrong then got it right', type: 'comeback' },
];

export default function BadgeShowcase({ badges }) {
  const earnedNames = new Set(badges.map(b => b.name));

  return (
    <div className="db-card">
      <div className="db-card-title">🏅 Badges</div>
      <div className="db-badge-scroll">
        {ALL_BADGES.map((badge) => {
          const earned = earnedNames.has(badge.name);
          const earnedBadge = badges.find(b => b.name === badge.name);
          return (
            <div key={badge.name} className={`db-badge-item ${earned ? 'earned' : 'locked'}`}>
              <div className="db-badge-icon">{earned ? badge.icon : '🔒'}</div>
              <div className="db-badge-name">{badge.name}</div>
              <div className="db-badge-desc">{badge.desc}</div>
              {earned && earnedBadge?.earnedDate && (
                <div className="db-badge-date">{earnedBadge.earnedDate}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
