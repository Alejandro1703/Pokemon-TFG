import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../contexts/SettingsContext';

function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isVisible, setIsVisible] = useState(true);
  const currentPath = location.pathname;

  // Verificar estado de autenticación cuando cambia la ruta o el localStorage
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    
    checkAuth();
    
    // Escuchar cambios en localStorage (de otras pestañas)
    window.addEventListener('storage', checkAuth);
    
    // Escuchar evento personalizado de cambio de auth (misma pestaña)
    window.addEventListener('auth-change', checkAuth);
    
    // Verificar cada segundo (para cambios en la misma pestaña)
    const interval = setInterval(checkAuth, 1000);
    
    // Escuchar evento de toggle del sidebar
    const handleToggleSidebar = (e) => {
      setIsVisible(e.detail.visible);
    };
    window.addEventListener('toggle-sidebar', handleToggleSidebar);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
      window.removeEventListener('toggle-sidebar', handleToggleSidebar);
      clearInterval(interval);
    };
  }, [location.pathname]); // También se ejecuta cuando cambia la ruta

  const authItems = [
    { path: '/login', label: t('sidebar.login') },
    { path: '/register', label: t('sidebar.register') },
  ];

  const dashboardItems = [
    { path: '/juegos', label: t('sidebar.games') },
    { path: '/mis-juegos', label: t('sidebar.myGames') },
    { path: '/pokedex', label: t('sidebar.pokedex') },
    { path: '/comparador', label: t('sidebar.comparator') },
    { path: '/aventuras', label: t('sidebar.adventures') },
    { path: '/progreso', label: t('sidebar.progress') },
    { path: '/perfil', label: t('sidebar.profile') },
  ];

  const isActive = (path) => currentPath === path;

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
          backgroundColor: '#64b5f6',
          borderRight: isVisible ? '3px solid #42a5f5' : '3px solid #42a5f5',
          boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
          transition: 'all 0.4s ease-in-out',
          overflow: 'visible'
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ 
            height: '70px', 
            backgroundColor: '#42a5f5',
            borderBottom: '2px solid #1976d2',
            minWidth: '250px'
          }}
        >
          <h6 className="fw-bold m-0" style={{ fontSize: '1.1rem', color: '#e3f2fd', opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s ease' }}>{t('sidebar.menu')}</h6>
        </div>

      <div className="p-3 text-center">
        <small style={{ color: '#90caf9' }}>
          {isLoggedIn ? '' : t('sidebar.guestAccess')}
        </small>
      </div>

      <Nav className="flex-column p-3">
        {isLoggedIn ? (
          <>
            {/* Dashboard - Inicio */}
            <Nav.Link
              as={Link}
              to="/dashboard"
              className={`d-flex align-items-center py-3 px-4 rounded-3 mb-2 text-decoration-none ${
                isActive('/dashboard') ? 'fw-bold shadow' : ''
              }`}
              style={{
                backgroundColor: isActive('/dashboard') ? '#1976d2' : 'rgba(25,118,210,0.3)',
                color: isActive('/dashboard') ? '#e3f2fd' : '#e3f2fd',
                border: isActive('/dashboard') ? '2px solid #1565c0' : '1px solid rgba(25,118,210,0.5)',
                transition: 'transform 0.35s ease-out, opacity 0.25s ease',
                fontSize: '1rem',
                overflow: 'hidden',
                transform: isVisible ? 'translateX(0)' : 'translateX(-120%)',
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'auto' : 'none'
              }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>{t('sidebar.home')}</span>
            </Nav.Link>

            {dashboardItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  className={`d-flex align-items-center py-3 px-4 rounded-3 mb-2 text-decoration-none ${
                    active ? 'fw-bold shadow' : ''
                  }`}
                  style={{
                    backgroundColor: active ? '#1976d2' : 'rgba(25,118,210,0.3)',
                    color: active ? '#e3f2fd' : '#e3f2fd',
                    border: active ? '2px solid #1565c0' : '1px solid rgba(25,118,210,0.5)',
                    transition: 'transform 0.35s ease-out, opacity 0.25s ease',
                    fontSize: '1rem',
                    overflow: 'hidden',
                    transform: isVisible ? 'translateX(0)' : 'translateX(-120%)',
                    opacity: isVisible ? 1 : 0,
                    pointerEvents: isVisible ? 'auto' : 'none'
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                </Nav.Link>
              );
            })}
            
            {/* Botón de Logout */}
            <Nav.Link
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('auth-change'));
                window.location.href = '/login';
              }}
              className="d-flex align-items-center py-3 px-4 rounded-3 mb-2 text-decoration-none fw-bold"
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
        ) : (
          authItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`d-flex align-items-center py-3 px-4 rounded-3 mb-2 text-decoration-none ${
                  active ? 'fw-bold shadow' : ''
                }`}
                style={{
                  backgroundColor: active ? '#1976d2' : 'rgba(25,118,210,0.3)',
                  color: active ? '#e3f2fd' : '#e3f2fd',
                  border: active ? '2px solid #1565c0' : '1px solid rgba(25,118,210,0.5)',
                  transition: 'transform 0.35s ease-out, opacity 0.25s ease',
                  fontSize: '1rem',
                  overflow: 'hidden',
                  transform: isVisible ? 'translateX(0)' : 'translateX(-120%)',
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: isVisible ? 'auto' : 'none'
                }}
              >
                <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
              </Nav.Link>
            );
          })
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
          backgroundColor: '#1976d2',
          border: '3px solid #1565c0',
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
          e.target.style.backgroundColor = '#1565c0';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#1976d2';
        }}
      >
        {isVisible ? '◀' : '▶'}
      </button>
    </div>
  );
}

export default Sidebar;
