import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
      className="p-2 text-white hover:bg-indigo-500 rounded-lg transition-colors"
      title={language === 'en' ? 'Switch to Russian' : 'Switch to English'}
    >
      <Languages size={24} />
    </button>
  );
};

export default LanguageSwitch;