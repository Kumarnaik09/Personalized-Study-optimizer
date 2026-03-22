import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuizAnalytics from '../dashboard/QuizAnalytics';
import WeakConcepts from '../dashboard/WeakConcepts';
import { useAuth } from '../hooks/useAuth';
import { useStats } from '../hooks/useStats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function QuizAnalyticsPage() {
  const { token } = useAuth();
  const { stats, accuracy, removeWeakConcept } = useStats(token);
  const navigate = useNavigate();

  const correct = stats.correct_answers || 0;
  const wrong = (stats.total_questions || 0) - correct;

  const pieData = [
    { name: 'Correct', value: correct },
    { name: 'Wrong', value: wrong },
  ];

  const normalised = {
    quizzesCompleted: stats.quizzes_completed || 0,
    totalQuestions: stats.total_questions || 0,
    correctAnswers: stats.correct_answers || 0,
  };

  return (
    <div className="db-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h1 className="page-title">🎯 Quiz Analytics</h1>
        <p className="page-sub">Your quiz performance and weak areas</p>
      </div>

      <div className="full-page-grid">
        <div style={{ flex: 1 }}>
          <QuizAnalytics stats={normalised} accuracy={accuracy} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="db-card">
            <div className="db-card-title">🥧 Correct vs Wrong</div>
            {(stats.total_questions || 0) > 0 ? (
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                    <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="db-empty">Complete a quiz to see breakdown</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <WeakConcepts
          weakConcepts={stats.weak_concepts || []}
          onReview={() => navigate('/study')}
          onRetake={() => navigate('/study')}
          onDismiss={removeWeakConcept}
        />
      </div>
    </div>
  );
}
