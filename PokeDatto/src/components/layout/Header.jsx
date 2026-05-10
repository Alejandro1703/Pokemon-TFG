import { useState } from 'react';
import { useSettings, useTranslation } from '../../contexts/SettingsContext';

function Header() {
  const { isDark } = useSettings();
  const { t } = useTranslation();
  const [nombre] = useState(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user).nombre || '';
      } catch {
        return '';
      }
    }
    return '';
  });

  return (
    <header
      className="d-flex align-items-center px-4"
      style={{
        height: '70px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        backgroundColor: isDark ? '#1a1b23' : '#42a5f5',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        borderBottom: isDark ? '3px solid #2e303a' : '3px solid #1976d2'
      }}
    >
      {nombre && (
        <span className="text-white fw-bold" style={{ fontSize: '1.1rem' }}>
          {t('header.welcome')} {nombre}
        </span>
      )}
    </header>
  );
}

export default Header;
