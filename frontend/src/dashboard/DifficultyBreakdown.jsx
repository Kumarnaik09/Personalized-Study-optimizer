import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FLASHCARD_LEVELS = [
  { name: 'Basic', color: '#10b981' },
  { name: 'Intermediate', color: '#f59e0b' },
  { name: 'Advanced', color: '#ef4444' },
];

const QUIZ_LEVELS = [
  { name: 'Easy', color: '#10b981' },
  { name: 'Medium', color: '#f59e0b' },
  { name: 'Hard', color: '#ef4444' },
];

function DiffRow({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="db-diff-row">
      <span className="db-diff-label" style={{ color }}>{label}</span>
      <div className="db-bar-track" style={{ flex: 1, margin: '0 .75rem' }}>
        <div className="db-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="db-diff-count">{value}</span>
    </div>
  );
}

export default function DifficultyBreakdown({ stats }) {
  const fc = stats.flashcardsReviewed;
  const fcBasic = Math.round(fc * 0.5);
  const fcMid = Math.round(fc * 0.35);
  const fcAdv = fc - fcBasic - fcMid;

  const qz = stats.totalQuestions;
  const qzEasy = Math.round(qz * 0.4);
  const qzMed = Math.round(qz * 0.4);
  const qzHard = qz - qzEasy - qzMed;

  const chartData = [
    { name: 'Easy', value: qzEasy },
    { name: 'Medium', value: qzMed },
    { name: 'Hard', value: qzHard },
  ];

  return (
    <div className="db-card">
      <div className="db-card-title">📊 Difficulty Breakdown</div>

      <div className="db-diff-section-title">Flashcards</div>
      <DiffRow label="Basic" value={fcBasic} total={fc || 1} color="#10b981" />
      <DiffRow label="Intermediate" value={fcMid} total={fc || 1} color="#f59e0b" />
      <DiffRow label="Advanced" value={fcAdv} total={fc || 1} color="#ef4444" />

      <div className="db-divider" style={{ margin: '1rem 0' }} />

      <div className="db-diff-section-title">Quiz Questions</div>
      <DiffRow label="Easy" value={qzEasy} total={qz || 1} color="#10b981" />
      <DiffRow label="Medium" value={qzMed} total={qz || 1} color="#f59e0b" />
      <DiffRow label="Hard" value={qzHard} total={qz || 1} color="#ef4444" />

      {qz > 0 && (
        <div style={{ marginTop: '1.5rem', height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={['#10b981', '#f59e0b', '#ef4444'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
