import React from 'react';

const BADGE_DEFINITIONS = {
    perfect: { icon: '🏆', name: 'Flawless Victory', desc: 'No wrong answers!' },
    persistent: { icon: '🛡️', name: 'Persistent Learner', desc: 'Overcame mistakes and mastered it.' },
    quick: { icon: '⭐', name: 'Quick Learner', desc: 'Answered quickly and correctly.' },
    default: { icon: '🏅', name: 'Quiz Completed', desc: 'Finished the assessment.' },
};

export default function Badges({ badges }) {
    if (!badges || badges.length === 0) return null;
    return (
        <div className="badges-section">
            <div className="badges-title">🏅 Your Achievements</div>
            <div className="badges-grid">
                {badges.map((badge, idx) => {
                    const def = BADGE_DEFINITIONS[badge.type] || BADGE_DEFINITIONS.default;
                    return (
                        <div className="badge-card" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="badge-icon-wrap">{def.icon}</div>
                            <div className="badge-name">{badge.name || def.name}</div>
                            <div className="badge-desc">{badge.description || def.desc}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
