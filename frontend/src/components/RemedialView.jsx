import React from 'react';

export default function RemedialView({ data, onNewQuestionReady }) {
    // Show loading spinner until data arrives from the API
    if (!data) {
        return (
            <div className="loading-screen">
                <div className="spinner" style={{ borderTopColor: 'var(--amber)' }} />
                <p className="loading-title">Analysing your answer…</p>
                <p className="loading-sub">Our AI is generating a simplified explanation and a new practice question just for you.</p>
            </div>
        );
    }

    return (
        <div className="remedial-page">
            <div className="section-header" style={{ width: '100%' }}>
                <span className="section-title">⚠️ Let's Try That Again</span>
            </div>

            <div className="card w-full fade-up">
                <div className="card-accent-top" style={{ background: 'linear-gradient(to right,#f59e0b,#f97316)' }} />
                <div className="card-body">
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                        You got that one wrong — no worries!
                    </h3>

                    <div className="remedial-box">
                        <div className="remedial-label">🔄 Simplified Concept</div>
                        <p className="remedial-text">{data.simplified_explanation}</p>
                    </div>

                    <button
                        className="btn-primary"
                        style={{ marginTop: '1.5rem' }}
                        onClick={() => onNewQuestionReady(data.new_question)}
                    >
                        I understand — give me another try →
                    </button>
                </div>
            </div>
        </div>
    );
}
