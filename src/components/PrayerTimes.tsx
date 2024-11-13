import React from 'react';
import { Church, Bell } from 'lucide-react';

const PrayerTimes = () => {
  const prayers = [
    { name: 'Fajr', time: '5:30 AM', status: 'completed' },
    { name: 'Dhuhr', time: '12:30 PM', status: 'next' },
    { name: 'Asr', time: '3:45 PM', status: 'upcoming' },
    { name: 'Maghrib', time: '6:15 PM', status: 'upcoming' },
    { name: 'Isha', time: '7:45 PM', status: 'upcoming' },
  ];

  const nextPrayer = prayers.find(p => p.status === 'next');

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Church size={24} />
            <div>
              <p className="text-sm opacity-80">Next Prayer</p>
              <p className="text-xl font-bold">{nextPrayer?.name} - {nextPrayer?.time}</p>
            </div>
          </div>
          <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {prayers.map((prayer, index) => (
          <div
            key={prayer.name}
            className={`flex items-center justify-between p-4 ${
              index !== prayers.length - 1 ? 'border-b' : ''
            }`}
          >
            <span className="font-medium">{prayer.name}</span>
            <span className={`text-sm ${
              prayer.status === 'completed' ? 'text-green-500' :
              prayer.status === 'next' ? 'text-indigo-600' :
              'text-gray-400'
            }`}>
              {prayer.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTimes;