import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

function getStartDate() {
  const d = new Date();
  d.setDate(d.getDate() - 119); // ~4 months back
  return d.toISOString().slice(0, 10);
}

export default function ActivityHeatmap({ activityDates }) {
  const values = Object.entries(activityDates).map(([date, count]) => ({ date, count }));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="db-card">
      <div className="db-card-title">📅 Study Activity</div>
      <div className="db-heatmap-wrap">
        <CalendarHeatmap
          startDate={getStartDate()}
          endDate={today}
          values={values}
          classForValue={(value) => {
            if (!value || value.count === 0) return 'color-empty';
            if (value.count === 1) return 'color-scale-1';
            if (value.count === 2) return 'color-scale-2';
            if (value.count <= 4) return 'color-scale-3';
            return 'color-scale-4';
          }}
          tooltipDataAttrs={(value) => ({
            'data-tip': value?.date ? `${value.date}: ${value.count} activities` : 'No activity',
          })}
          showWeekdayLabels
        />
      </div>
      <div className="db-heatmap-legend">
        <span>Less</span>
        {['color-empty', 'color-scale-1', 'color-scale-2', 'color-scale-3', 'color-scale-4'].map(cls => (
          <span key={cls} className={`hm-legend-box ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
