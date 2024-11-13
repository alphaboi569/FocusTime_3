import React, { useState } from 'react';
import { TrendingDown, Calendar } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TimeData {
  label: string;
  hours: number;
  blocked: number;
}

interface WeeklyChartProps {
  data: Array<{
    day: string;
    hours: number;
    blocked: number;
  }>;
  trend: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

type TimePeriod = 'week' | 'month' | 'year';

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data: initialData, trend: initialTrend, className = '' }) => {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<TimePeriod>('week');
  const maxHours = 6;
  const yAxisSteps = [6, 5, 4, 3, 2, 1, 0];

  // Weekly data remains as is
  const weekData: TimeData[] = initialData.map(d => ({
    label: d.day,
    hours: d.hours,
    blocked: d.blocked,
  }));

  // Monthly data - average of 4 weeks
  const monthData: TimeData[] = [
    { label: 'Week 1', hours: 4.2, blocked: 2.1 },
    { label: 'Week 2', hours: 3.8, blocked: 1.9 },
    { label: 'Week 3', hours: 4.5, blocked: 2.3 },
    { label: 'Week 4', hours: 4.0, blocked: 2.0 }
  ];

  // Yearly data - monthly totals
  const yearData: TimeData[] = [
    { label: 'Jan', hours: 120, blocked: 45 },
    { label: 'Feb', hours: 115, blocked: 40 },
    { label: 'Mar', hours: 130, blocked: 50 },
    { label: 'Apr', hours: 125, blocked: 48 },
    { label: 'May', hours: 140, blocked: 55 },
    { label: 'Jun', hours: 135, blocked: 52 },
    { label: 'Jul', hours: 128, blocked: 47 },
    { label: 'Aug', hours: 132, blocked: 49 },
    { label: 'Sep', hours: 138, blocked: 53 },
    { label: 'Oct', hours: 142, blocked: 56 },
    { label: 'Nov', hours: 136, blocked: 51 },
    { label: 'Dec', hours: 130, blocked: 48 }
  ].map(item => ({
    ...item,
    // Convert monthly totals to daily averages for consistent scale
    hours: item.hours / 30,
    blocked: item.blocked / 30
  }));

  const periodData = {
    week: weekData,
    month: monthData,
    year: yearData,
  };

  const currentData = periodData[period];

  const getTrend = () => {
    switch (period) {
      case 'week':
        return { value: '-2.5h', isPositive: false };
      case 'month':
        return { value: '-8.3h', isPositive: false };
      case 'year':
        return { value: '-24.5h', isPositive: false };
    }
  };

  const createPath = (values: number[]) => {
    const points = values.map((value, index) => ({
      x: (index * 80) / (values.length - 1) + 10,
      y: 90 - (value / maxHours) * 70
    }));

    return points.reduce((path, point, index) => {
      if (index === 0) return `M ${point.x},${point.y}`;
      const prev = points[index - 1];
      const cp1x = prev.x + (point.x - prev.x) / 3;
      const cp2x = point.x - (point.x - prev.x) / 3;
      return `${path} C ${cp1x},${prev.y} ${cp2x},${point.y} ${point.x},${point.y}`;
    }, '');
  };

  const getTotalHours = () => {
    const total = currentData.reduce((acc, curr) => acc + curr.hours, 0);
    if (period === 'year') {
      // For yearly view, show monthly average
      return (total / currentData.length).toFixed(1);
    }
    return total.toFixed(1);
  };

  const getTimeLabel = () => {
    switch (period) {
      case 'week':
        return t('hoursSpent');
      case 'month':
        return 'Average Weekly Hours';
      case 'year':
        return 'Average Daily Hours';
    }
  };

  const currentTrend = getTrend();

  return (
    <div className={`bg-gradient-to-br ${className} rounded-xl p-4 text-white`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <h3 className="text-base font-semibold">{t('weeklyDynamics')}</h3>
          <div className="flex bg-white/10 rounded-lg p-0.5 backdrop-blur-sm">
            {(['week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  period === p
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
          <TrendingDown size={14} className="text-red-300" />
          <span className="text-xs font-medium text-red-300">{currentTrend.value}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white" />
          <span className="text-xs">{t('totalTime')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/50" />
          <span className="text-xs">{t('blockedTime')}</span>
        </div>
      </div>

      <div className="relative h-44">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-2 bottom-6 w-6 flex flex-col justify-between text-[10px] text-white/70">
          {yAxisSteps.map((value) => (
            <span key={value}>{value}h</span>
          ))}
        </div>

        <div className="ml-6 h-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            {yAxisSteps.map((_, index) => (
              <line
                key={index}
                x1="10"
                y1={20 + index * 10}
                x2="90"
                y2={20 + index * 10}
                stroke="white"
                strokeOpacity="0.1"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
            ))}

            {/* Total time line */}
            <path
              d={createPath(currentData.map(d => d.hours))}
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              filter="url(#glow)"
            />

            {/* Blocked time line */}
            <path
              d={createPath(currentData.map(d => d.blocked))}
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.5"
              strokeDasharray="3 3"
            />

            {/* Data points */}
            {currentData.map((point, index) => {
              const x = (index * 80) / (currentData.length - 1) + 10;
              const y = 90 - (point.hours / maxHours) * 70;
              const blockedY = 90 - (point.blocked / maxHours) * 70;
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="2"
                    fill="white"
                    filter="url(#glow)"
                  />
                  <circle
                    cx={x}
                    cy={blockedY}
                    r="1.5"
                    fill="white"
                    fillOpacity="0.5"
                  />
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2.5">
            <div className="flex-1 flex justify-between">
              {currentData.map((point, index) => (
                <div key={index} className="text-center">
                  <p className="text-[10px] font-medium whitespace-nowrap">{point.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-white/10 p-2.5 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-80">{getTimeLabel()}</p>
            <p className="text-xl font-bold leading-tight">
              {getTotalHours()}h
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
            <Calendar size={16} />
            <span className="text-sm font-medium capitalize">{period}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;