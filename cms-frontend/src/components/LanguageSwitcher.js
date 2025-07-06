import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <span className="font-medium">{t('language')}:</span>
            <button
                onClick={() => changeLanguage('English')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition duration-200 ${
                    i18n.language === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
                {t('English')}
            </button>
            <button
                onClick={() => changeLanguage('German')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition duration-200 ${
                    i18n.language === 'fa' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
                {t('German')}
            </button>
        </div>
    );
};

export default LanguageSwitcher;