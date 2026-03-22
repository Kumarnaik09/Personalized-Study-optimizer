import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

export default function QuizAnalytics({ stats, accuracy }) {
  const totalQ   = stats.totalQuestions || 0;
  const correct  = stats.correctAnswers || 0;
  const wrong    = totalQ - correct;
  const quizzes  = stats.quizzesCompleted || 0;

  const data = [
    { name: 'Accuracy', value: accuracy, fill: '#10b981' },
    { name: 'Wrong',    value: totalQ > 0 ? Math.round((wrong / totalQ) * 100) : 0, fill: '#ef4444' },
  ];

  return (
    <div className="db-card">
      <div className="db-card-title">🎯 Quiz Analytics</div>

      <div className="db-qa-grid">
        <div className="db-qa-stat">
          <div className="db-qa-num" style={{ color: '#3b82f6' }}>{quizzes}</div>
          <div className="db-qa-label">Quizzes Done</div>
        </div>
        <div className="db-qa-stat">
          <div className="db-qa-num" style={{ color: '#10b981' }}>{correct}</div>
          <div className="db-qa-label">Correct</div>
        </div>
        <div className="db-qa-stat">
          <div className="db-qa-num" style={{ color: '#ef4444' }}>{wrong}</div>
          <div className="db-qa-label">Wrong</div>
        </div>
        <div className="db-qa-stat">
          <div className="db-qa-num" style={{ color: '#f59e0b' }}>{accuracy}%</div>
          <div className="db-qa-label">Accuracy</div>
        </div>
      </div>

      {totalQ > 0 && (
        <div style={{ height: 140, marginTop: '.5rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" data={data} startAngle={180} endAngle={-180}>
              <RadialBar dataKey="value" cornerRadius={4} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }}
                formatter={(val, name) => [`${val}%`, name]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      )}

      {totalQ === 0 && (
        <div className="db-empty" style={{ padding: '.75rem 0' }}>Complete a quiz to see analytics</div>
      )}

      {/* Accuracy mini-bar */}
      <div style={{ marginTop: '.75rem' }}>
        <div className="db-bar-header">
          <span className="db-bar-label">Overall Accuracy</span>
          <span className="db-bar-pct" style={{ color: accuracy >= 70 ? '#10b981' : accuracy >= 40 ? '#f59e0b' : '#ef4444' }}>
            {accuracy}%
          </span>
        </div>
        <div className="db-bar-track">
          <div className="db-bar-fill" style={{
            width: `${accuracy}%`,
            background: accuracy >= 70 ? '#10b981' : accuracy >= 40 ? '#f59e0b' : '#ef4444'
          }} />
        </div>
      </div>
    </div>
  );
}
