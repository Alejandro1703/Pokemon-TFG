import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../i18n/translations';
import { getItemName, getPocketName } from '../i18n/itemTranslations';

const SettingsContext = createContext();

const STORAGE_KEY = 'app_settings';

const DEFAULT_SETTINGS = {
  theme: 'light',
  language: 'es',
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch { /* ignore */ }
    return DEFAULT_SETTINGS;
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleTheme = () => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const setLanguage = (lang) => {
    setSettings(prev => ({ ...prev, language: lang }));
  };

  const isDark = settings.theme === 'dark';

  return (
    <SettingsContext.Provider value={{ ...settings, isDark, toggleTheme, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

export function useTranslation() {
  const { language } = useSettings();
  const t = (key) => {
    return translations[language]?.[key] || translations.es[key] || key;
  };
  
  // Helper para traducir nombres de items
  const tItem = (itemId) => {
    return getItemName(itemId, language);
  };
  
  // Helper para traducir nombres de bolsillos
  const tPocket = (pocketKey) => {
    return getPocketName(pocketKey, language);
  };
  
  return { t, tItem, tPocket, language };
}
