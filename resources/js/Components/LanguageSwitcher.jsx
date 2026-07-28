import React from 'react';
import { useLanguage } from '../Context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{language === 'en' ? 'EN' : 'ID'}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <button
          onClick={() => changeLanguage('en')}
          className={`w-full px-4 py-2 text-left text-sm rounded-t-lg transition-colors ${
            language === 'en'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('id')}
          className={`w-full px-4 py-2 text-left text-sm rounded-b-lg transition-colors ${
            language === 'id'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Indonesia
        </button>
      </div>
    </div>
  );
}
