import React from 'react';
import ProfileCard from './ProfileCard';
import LearningProgress from './LearningProgress';
import DifficultyBreakdown from './DifficultyBreakdown';
import FlashcardAnalytics from './FlashcardAnalytics';
import QuizAnalytics from './QuizAnalytics';
import ActivityHeatmap from './ActivityHeatmap';
import StreakTracker from './StreakTracker';
import BadgeShowcase from './BadgeShowcase';
import RecentActivity from './RecentActivity';
import WeakConcepts from './WeakConcepts';

export default function Dashboard({ stats, accuracy, onStartStudy, onDismissWeak }) {
  return (
    <div className="db-layout">
      {/* ── LEFT PANEL: Profile + Streak + Badges ── */}
      <aside className="db-left">
        <ProfileCard stats={stats} accuracy={accuracy} />
        <StreakTracker stats={stats} />
        <BadgeShowcase badges={stats.badges} />
      </aside>

      {/* ── CENTER PANEL: Progress + Analytics + Difficulty ── */}
      <main className="db-center">
        <LearningProgress stats={stats} accuracy={accuracy} />
        <FlashcardAnalytics stats={stats} />
        <QuizAnalytics stats={stats} accuracy={accuracy} />
        <DifficultyBreakdown stats={stats} />
      </main>

      {/* ── RIGHT PANEL: Heatmap + Activity + Weak Concepts ── */}
      <aside className="db-right">
        <ActivityHeatmap activityDates={stats.activityDates} />
        <RecentActivity activities={stats.recentActivity} />
        <WeakConcepts
          weakConcepts={stats.weakConcepts}
          onReview={() => onStartStudy?.()}
          onRetake={() => onStartStudy?.()}
          onDismiss={onDismissWeak}
        />
      </aside>
    </div>
  );
}
