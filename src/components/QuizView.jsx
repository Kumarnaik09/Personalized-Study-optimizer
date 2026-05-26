import React, { useState } from 'react';

export default function QuizView({ quiz, onCorrect, onWrongAnswer, onQuizComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [animKey, setAnimKey] = useState(0);

    const question = quiz[currentIndex];
    if (!question) { onQuizComplete(); return null; }

    const handleSelect = (index) => {
        if (selected !== null) return;
        setSelected(index);
        const correct = index === question.correct_index;

        setTimeout(() => {
            setSelected(null);
            if (correct) {
                onCorrect?.();
                if (currentIndex < quiz.length - 1) {
                    setCurrentIndex(i => i + 1);
                    setAnimKey(k => k + 1);
                } else {
                    onQuizComplete();
                }
            } else {
                onWrongAnswer(question.id, index, currentIndex, () => {
                    setAnimKey(k => k + 1);
                });
            }
        }, 1400);
    };

    const progress = ((currentIndex) / quiz.length) * 100;

    return (
        <div className="quiz-page">
            <div className="section-header" style={{ width: '100%' }}>
                <span className="section-title">❓ Assessment Quiz</span>
                <span className="pill">Question {currentIndex + 1} / {quiz.length}</span>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4, marginBottom: '1.5rem' }}>
                <div style={{
                    height: '100%', borderRadius: 4,
                    background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                    width: `${progress}%`,
                    transition: 'width 0.4s ease'
                }} />
            </div>

            <div className="card fade-right w-full" key={animKey}>
                <div className="card-accent-top" style={{ background: 'linear-gradient(to right,#3b82f6,#6366f1)' }} />
                <div className="card-body">
                    <h3 className="question-text">{question.question}</h3>

                    <div className="options-list">
                        {question.options.map((opt, i) => {
                            let cls = 'option-btn';
                            if (selected !== null) {
                                if (i === question.correct_index) cls += ' correct';
                                else if (i === selected) cls += ' wrong';
                                else cls += ' dimmed';
                            }
                            return (
                                <button
                                    key={i}
                                    className={cls}
                                    onClick={() => handleSelect(i)}
                                    disabled={selected !== null}
                                >
                                    <span className="option-label">{String.fromCharCode(65 + i)}</span>
                                    {opt}
                                    {selected !== null && i === question.correct_index && <span className="option-icon">✅</span>}
                                    {selected === i && i !== question.correct_index && <span className="option-icon">❌</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
