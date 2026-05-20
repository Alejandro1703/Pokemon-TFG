import { forwardRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSettings, useTranslation } from '../../contexts/SettingsContext';
import { useAuth } from '../../hooks/useAuth';

const GearToggle = forwardRef(({ children, onClick }, ref) => (
  <span
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{
      cursor: 'pointer',
      lineHeight: 0,
      padding: '4px',
      display: 'inline-flex',
      color: '#fff'
    }}
  >
    {children}
  </span>
));

function Header() {
  const { isDark } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, isGuest, user, logout } = useAuth();

  const nombre = user?.nombre || '';

  const handleProfile = () => navigate('/perfil');
  const handleLogout = () => logout();

  const showUserSection = isLoggedIn || isGuest;

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
      {/* Left spacer */}
      <div className="flex-fill d-none d-md-block" />

      {/* Center: PokeDatto title + image */}
      <div className="d-flex align-items-center justify-content-center">
        <h1
          className="m-0 fw-bold"
          style={{
            fontSize: '1.6rem',
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '1px'
          }}
        >
          PokeDatto
        </h1>
        <img
          src="/images/header/Pokedatto.png"
          alt="PokeDatto"
          style={{
            height: '44px',
            width: 'auto',
            marginLeft: '10px',
            filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))'
          }}
        />
      </div>

      {/* Right: Welcome text + Settings dropdown */}
      <div className="flex-fill d-flex align-items-center justify-content-end gap-3">
        {showUserSection && nombre && (
          <span
            className="fw-bold d-none d-md-block"
            style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}
          >
            {t('header.welcome')} {nombre}
          </span>
        )}

        {showUserSection && (
          <Dropdown align="end">
            <Dropdown.Toggle
              as={GearToggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.9, transition: 'opacity 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.9'; }}
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                backgroundColor: isDark ? '#1e2028' : '#fff',
                border: isDark ? '1px solid #2e303a' : '1px solid #dee2e6',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <Dropdown.Item
                onClick={handleProfile}
                style={{ color: isDark ? '#e8eaed' : '#212529' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#2e303a' : '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {t('sidebar.profile')}
              </Dropdown.Item>
              <Dropdown.Divider
                style={{ borderColor: isDark ? '#2e303a' : '#dee2e6', margin: '6px 0' }}
              />
              <Dropdown.Item
                onClick={handleLogout}
                className="fw-bold"
                style={{ color: '#dc3545' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#2e303a' : '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {t('sidebar.logout')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </header>
  );
}

export default Header;
