import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTimer } from '../../contexts/TimerContext';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  maxValue?: number;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  iconClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  maxValue,
  subValue,
  trend,
  className = '',
  iconClass = '',
}) => {
  const { selectedPreset } = useTimer();
  
  // Calculate percentage for progress bar
  const percentage = maxValue ? (Number(value) / maxValue) * 100 : 0;

  return (
    <div className={`p-6 rounded-xl border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${iconClass} bg-opacity-15`}>
            <Icon size={24} className={iconClass} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
            {selectedPreset && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedPreset.name} ({selectedPreset.work}m/{selectedPreset.break}m)
              </p>
            )}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${
            trend.isPositive ? 'text-green-600' : 'text-red-500'
          } bg-white/80 dark:bg-gray-800/80 px-2.5 py-1 rounded-lg text-sm font-medium`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}{maxValue ? ` / ${maxValue}` : ''}
          </p>
          {subValue && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{subValue}</p>
          )}
        </div>
        {maxValue && (
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;