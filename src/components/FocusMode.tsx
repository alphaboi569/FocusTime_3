import React, { useState } from 'react';
import { Focus, Clock, AlertCircle, Plus, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FocusMode = () => {
  const { t } = useLanguage();
  const [workdayActive, setWorkdayActive] = useState(false);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customWork, setCustomWork] = useState('');
  const [customBreak, setCustomBreak] = useState('');
  const [customName, setCustomName] = useState('');

  const [presets, setPresets] = useState([
    { id: 'default', name: 'Default', work: 40, break: 20 },
    { id: 'pomodoro', name: 'Pomodoro', work: 25, break: 5 },
    { id: 'long', name: 'Long Focus', work: 60, break: 15 },
  ]);

  const handleAddCustomPreset = () => {
    if (customName && customWork && customBreak) {
      const newPreset = {
        id: customName.toLowerCase().replace(/\s+/g, '-'),
        name: customName,
        work: parseInt(customWork),
        break: parseInt(customBreak)
      };
      setPresets([...presets, newPreset]);
      setCustomName('');
      setCustomWork('');
      setCustomBreak('');
      setShowCustomForm(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{t('focusMode')}</h1>
        <p className="text-gray-600">{t('manageWellbeing')}</p>
      </header>

      <div className="bg-gradient-to-r from-lime-600 to-lime-800 rounded-xl p-6 text-white shadow-[0_0_25px_rgba(132,204,22,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Home size={24} />
            <h2 className="text-xl font-semibold">{t('workdayMode')}</h2>
          </div>
          <button
            onClick={() => setWorkdayActive(!workdayActive)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              workdayActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {workdayActive ? t('stop') : t('start')}
          </button>
        </div>
        <p className="text-white/80 mb-4">{t('workdayDescription')}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <Clock size={20} className="mb-2" />
            <p className="font-medium">{t('timeSpent')}</p>
            <p className="text-2xl font-bold mt-1">
              {workdayActive ? '2h 15m' : '0h 0m'}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <AlertCircle size={20} className="mb-2" />
            <p className="font-medium">{t('remainingTime')}</p>
            <p className="text-2xl font-bold mt-1">
              {workdayActive ? '5h 45m' : '8h 0m'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-[0_0_25px_rgba(99,102,241,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Focus size={24} />
            <h2 className="text-xl font-semibold">{t('focusTimer')}</h2>
          </div>
          <button
            onClick={() => setIsFocusModeActive(!isFocusModeActive)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isFocusModeActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {isFocusModeActive ? t('stop') : t('start')}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <Clock size={20} className="mb-2" />
            <p className="font-medium">{t('workTime')}</p>
            <p className="text-2xl font-bold mt-1">
              {presets.find(p => p.id === selectedPreset)?.work}:00
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <AlertCircle size={20} className="mb-2" />
            <p className="font-medium">{t('breakTime')}</p>
            <p className="text-2xl font-bold mt-1">
              {presets.find(p => p.id === selectedPreset)?.break}:00
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{t('timerPresets')}</h3>
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <Plus size={20} />
            <span>{t('addCustom')}</span>
          </button>
        </div>

        {showCustomForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <input
              type="text"
              placeholder={t('presetName') as string}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder={t('workMinutes') as string}
                value={customWork}
                onChange={(e) => setCustomWork(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder={t('breakMinutes') as string}
                value={customBreak}
                onChange={(e) => setCustomBreak(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleAddCustomPreset}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('addPreset')}
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={`p-4 rounded-lg text-center transition-colors ${
                selectedPreset === preset.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <p className="font-medium">{preset.name}</p>
              <p className="text-sm opacity-80">{preset.work}m/{preset.break}m</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FocusMode;