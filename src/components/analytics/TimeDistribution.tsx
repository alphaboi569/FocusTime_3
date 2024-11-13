import React from 'react';
import { Lock, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useActivity } from '../../contexts/ActivityContext';

interface TimeDistributionProps {
  className?: string;
}

const TimeDistribution: React.FC<TimeDistributionProps> = ({ className = '' }) => {
  const { t } = useLanguage();
  const { dailyProgress } = useActivity();
  const sites = dailyProgress.sites;
  const totalTime = dailyProgress.totalTimeSpent;
  const totalSites = sites.length;
  const radius = 40;
  const centerRadius = 30;

  const createPath = (percentage: number, index: number) => {
    const startAngle = sites
      .slice(0, index)
      .reduce((acc, curr) => acc + (curr.percentage * 360) / 100, 0);
    const endAngle = startAngle + (percentage * 360) / 100;

    const x1 = 50 + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = percentage > 50 ? 1 : 0;

    return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className={`rounded-xl border border-gray-200 p-6 ${className} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('timeSpent')}</h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-indigo-600 bg-indigo-50/80 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1.5 rounded-lg backdrop-blur-sm text-sm">
            <Clock size={16} strokeWidth={2.5} />
            <span>{totalTime} {t('totalTime')}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-indigo-600 bg-indigo-50/80 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1.5 rounded-lg backdrop-blur-sm text-sm">
            <Lock size={16} strokeWidth={2.5} />
            <span>{totalSites} {t('restrictedSites')}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="relative w-64">
          <div className="mt-4">
            <svg viewBox="0 0 100 100" className="transform -rotate-90 drop-shadow-xl">
              <circle
                cx="50"
                cy="50"
                r={centerRadius}
                className="fill-indigo-50 dark:fill-indigo-900/50"
              />
              {sites.map((site, index) => (
                <path
                  key={site.site}
                  d={createPath(site.percentage, index)}
                  className={`${site.color} transition-all duration-300 hover:opacity-90 cursor-pointer`}
                  stroke="white"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="flex-1">
          <div className="space-y-4">
            {sites.map((item) => (
              <div key={item.site} 
                className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.1)] transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${item.colorClass} shadow-sm`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.site}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{item.timeSpent}</span>
                      <span className="text-gray-300 dark:text-gray-600">/</span>
                      <span>{item.dailyLimit}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{item.percentage}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('ofDailyLimit')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDistribution;