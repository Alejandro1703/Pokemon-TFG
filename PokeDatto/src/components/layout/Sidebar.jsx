import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useSettings, useTranslation } from '../../contexts/SettingsContext';
import { useAuth } from '../../hooks/useAuth';

function Sidebar() {
  const { isDark } = useSettings();
  const { t } = useTranslation();
  const location = useLocation();
  const { isLoggedIn, isGuest, isAdmin, logout, enterGuest } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const currentPath = location.pathname;

  useEffect(() => {
    const handleToggleSidebar = (e) => {
      setIsVisible(e.detail.visible);
    };
    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggleSidebar);
    };
  }, []);

  // Items públicos (disponibles para invitados y usuarios)
  const publicItems = [
    { path: '/pokedex', label: t('sidebar.pokedex') },
    { path: '/comparador', label: t('sidebar.comparator') },
    { path: '/lideres-gimnasio', label: t('sidebar.gymLeaders') },
    { path: '/liga-pokemon', label: t('sidebar.pokemonLeague') },
    { path: '/juegos', label: t('sidebar.games') },
  ];

  // Items solo para usuarios logueados (no invitados)
  const privateItems = [
    { path: '/mis-juegos', label: t('sidebar.myGames') },
    { path: '/aventuras', label: t('sidebar.adventures') },
    { path: '/progreso', label: t('sidebar.progress') },
    { path: '/shiny-hunting', label: t('sidebar.shinyHunting') },
    { path: '/encuentros', label: t('sidebar.encounters') },
    { path: '/perfil', label: t('sidebar.profile') },
  ];

  const authItems = [
    { path: '/login', label: t('sidebar.login') },
    { path: '/register', label: t('sidebar.register') },
  ];

  const isActive = (path) => currentPath === path;

  const compact = isAdmin;
  const itemPadding = compact ? 'py-2' : 'py-3';
  const itemMargin = compact ? 'mb-1' : 'mb-2';
  const itemFont = compact ? '0.9rem' : '1rem';

  const navLinkStyle = (active, dark, visible) => ({
    backgroundColor: active
      ? (dark ? '#536dfe' : '#1976d2')
      : (dark ? 'rgba(83,109,254,0.2)' : 'rgba(25,118,210,0.3)'),
    color: dark ? '#e8eaed' : '#e3f2fd',
    border: active
      ? (dark ? '2px solid #3d4fe0' : '2px solid #1565c0')
      : (dark ? '1px solid rgba(83,109,254,0.4)' : '1px solid rgba(25,118,210,0.5)'),
    transition: 'transform 0.35s ease-out, opacity 0.25s ease',
    fontSize: itemFont,
    overflow: 'hidden',
    transform: visible ? 'translateX(0)' : 'translateX(-120%)',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    cursor: 'pointer'
  });

  const renderNavLink = (item, active) => (
    <Nav.Link
      key={item.path}
      as={Link}
      to={item.path}
      className={`d-flex align-items-center ${itemPadding} px-4 rounded-3 ${itemMargin} text-decoration-none ${
        active ? 'fw-bold shadow' : ''
      }`}
      style={navLinkStyle(active, isDark, isVisible)}
    >
      <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
    </Nav.Link>
  );

  const toggleSidebar = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    window.dispatchEvent(new CustomEvent('toggle-sidebar', { detail: { visible: newState } }));
  };

  return (
    <div
        className="d-flex flex-column"
        style={{
          width: isVisible ? '250px' : '32px',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 500,
          backgroundColor: isDark ? '#1a1b23' : '#64b5f6',
          borderRight: isDark ? '3px solid #2e303a' : '3px solid #42a5f5',
          boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
          transition: 'all 0.4s ease-in-out',
          overflow: 'visible'
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            height: '70px',
            backgroundColor: isDark ? '#1a1b23' : '#42a5f5',
            borderBottom: isDark ? '2px solid #2e303a' : '2px solid #1976d2',
            minWidth: '250px'
          }}
        >
          <h6 className="fw-bold m-0" style={{ fontSize: '1.1rem', color: isDark ? '#c8ccd4' : '#e3f2fd', opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s ease' }}>{t('sidebar.menu')}</h6>
        </div>

      <div className="p-3 text-center">
        <small style={{ color: isDark ? '#6b7280' : '#90caf9' }}>
          {isGuest ? t('sidebar.guestAccess') : ''}
        </small>
      </div>

      <Nav className="flex-column p-3">
        {!isLoggedIn && !isGuest ? (
          <>
            {authItems.map((item) => {
              const active = isActive(item.path);
              return renderNavLink(item, active);
            })}
            {/* Botón Entrar como Invitado */}
            <Nav.Link
              onClick={enterGuest}
              className={`d-flex align-items-center ${itemPadding} px-4 rounded-3 ${itemMargin} text-decoration-none fw-bold`}
              style={{
                backgroundColor: isDark ? 'rgba(102,187,106,0.2)' : 'rgba(102,187,106,0.3)',
                color: isDark ? '#e8eaed' : '#e3f2fd',
                border: isDark ? '1px solid rgba(102,187,106,0.5)' : '1px solid rgba(102,187,106,0.6)',
                transition: 'transform 0.35s ease-out, opacity 0.25s ease',
                fontSize: '1rem',
                cursor: 'pointer',
                overflow: 'hidden',
                transform: isVisible ? 'translateX(0)' : 'translateX(-120%)',
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'auto' : 'none'
              }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>{t('sidebar.guestLogin')}</span>
            </Nav.Link>
          </>
        ) : (
          <>
            {/* Dashboard - Inicio */}
            <Nav.Link
              as={Link}
              to="/dashboard"
              className={`d-flex align-items-center ${itemPadding} px-4 rounded-3 ${itemMargin} text-decoration-none ${
                isActive('/dashboard') ? 'fw-bold shadow' : ''
              }`}
              style={navLinkStyle(isActive('/dashboard'), isDark, isVisible)}
            >
              <span style={{ whiteSpace: 'nowrap' }}>{t('sidebar.home')}</span>
            </Nav.Link>

            {/* Items públicos */}
            {publicItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  className={`d-flex align-items-center ${itemPadding} px-4 rounded-3 ${itemMargin} text-decoration-none ${
                    active ? 'fw-bold shadow' : ''
                  }`}
                  style={navLinkStyle(active, isDark, isVisible)}
                >
                  <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                </Nav.Link>
              );
            })}

            {/* Items privados (solo usuarios logueados, no invitados) */}
            {!isGuest && privateItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  className={`d-flex align-items-center ${itemPadding} px-4 rounded-3 ${itemMargin} text-decoration-none ${
                    active ? 'fw-bold shadow' : ''
                  }`}
                  style={navLinkStyle(active, isDark, isVisible)}
                >
                  <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                </Nav.Link>
              );
            })}

            {/* Botón Estadísticas (solo ADMIN) */}
            {isAdmin && (
              <Nav.Link
                as={Link}
                to="/admin"
                className={`d-flex align-items-center ${itemPadding} px-4 rounded-3 ${itemMargin} text-decoration-none ${
                  isActive('/admin') ? 'fw-bold shadow' : ''
                }`}
                style={{
                  backgroundColor: isActive('/admin')
                    ? (isDark ? '#ab47bc' : '#8e24aa')
                    : (isDark ? 'rgba(171,71,188,0.2)' : 'rgba(142,36,170,0.3)'),
                  color: isDark ? '#e8eaed' : '#e3f2fd',
                  border: isActive('/admin')
                    ? (isDark ? '2px solid #8e24aa' : '2px solid #7b1fa2')
                    : (isDark ? '1px solid rgba(171,71,188,0.5)' : '1px solid rgba(142,36,170,0.6)'),
                  transition: 'transform 0.35s ease-out, opacity 0.25s ease',
                  fontSize: itemFont,
                  overflow: 'hidden',
                  transform: isVisible ? 'translateX(0)' : 'translateX(-120%)',
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: isVisible ? 'auto' : 'none',
                  cursor: 'pointer'
                }}
              >
                <span style={{ whiteSpace: 'nowrap' }}>📊 {t('sidebar.stats')}</span>
              </Nav.Link>
            )}

            {/* Botón de Logout */}
            <Nav.Link
              onClick={logout}
              className={`d-flex align-items-center ${itemPadding} px-4 rounded-3 ${itemMargin} text-decoration-none fw-bold`}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: '2px solid #d32f2f',
                transition: 'transform 0.35s ease-out, opacity 0.25s ease',
                fontSize: '1rem',
                cursor: 'pointer',
                overflow: 'hidden',
                transform: isVisible ? 'translateX(0)' : 'translateX(-120%)',
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'auto' : 'none'
              }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>{t('sidebar.logout')}</span>
            </Nav.Link>
          </>
        )}
      </Nav>

      {/* Botón de toggle en esquina superior derecha */}
      <button
        onClick={toggleSidebar}
        className="d-flex align-items-center justify-content-center"
        style={{
          position: 'fixed',
          top: '72px',
          left: isVisible ? '216px' : '2px',
          width: isVisible ? '32px' : '28px',
          height: isVisible ? '32px' : '28px',
          backgroundColor: isDark ? '#536dfe' : '#1976d2',
          border: isDark ? '3px solid #3d4fe0' : '3px solid #1565c0',
          borderRadius: '6px',
          color: 'white',
          fontSize: isVisible ? '14px' : '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.4s ease-in-out',
          zIndex: 501,
          boxShadow: '2px 2px 8px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = isDark ? '#3d4fe0' : '#1565c0';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = isDark ? '#536dfe' : '#1976d2';
        }}
      >
        {isVisible ? '◀' : '▶'}
      </button>
    </div>
  );
}

export default Sidebar;
