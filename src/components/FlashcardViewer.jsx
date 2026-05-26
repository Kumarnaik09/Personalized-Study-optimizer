import React, { useState, useEffect } from 'react';

const ANIM_DURATION = 350;

export default function FlashcardViewer({ flashcards, onFinish }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animKey, setAnimKey] = useState(0);

    const currentCard = flashcards[currentIndex];

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(i => i + 1);
            setAnimKey(k => k + 1);
        } else {
            onFinish();
        }
    };

    return (
        <div className="flashcard-page">
            <div className="section-header" style={{ width: '100%' }}>
                <span className="section-title">🧠 Study Mode</span>
                <span className="pill">Card {currentIndex + 1} / {flashcards.length}</span>
            </div>

            <div className="flashcard-wrapper" key={animKey} onClick={handleNext}>
                <div className="flashcard fade-up">
                    <div className="fc-accent" />
                    <div className="fc-body">
                        <div>
                            <h3 className="fc-concept">{currentCard.concept}</h3>
                            <p className="fc-explanation">{currentCard.explanation}</p>
                        </div>

                        {currentCard.mnemonic && (
                            <div className="mnemonic-box">
                                <div className="mnemonic-label">💡 Mnemonic Trick</div>
                                <p className="mnemonic-text">"{currentCard.mnemonic}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <p className="click-hint">
                Click on the card to continue →
            </p>

            {currentIndex === flashcards.length - 1 && (
                <button
                    className="btn-primary"
                    style={{ marginTop: '1.5rem', maxWidth: '22rem' }}
                    onClick={onFinish}
                >
                    Start Quiz 🎯
                </button>
            )}
        </div>
    );
}
