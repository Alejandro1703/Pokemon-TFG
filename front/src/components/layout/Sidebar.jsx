import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
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
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
      clearInterval(interval);
    };
  }, [location.pathname]); // También se ejecuta cuando cambia la ruta

  const authItems = [
    { path: '/login', label: 'Iniciar Sesion' },
    { path: '/register', label: 'Registro' },
  ];

  const dashboardItems = [
    { path: '/juegos', label: 'Juegos' },
    { path: '/mis-juegos', label: 'Mis Juegos' },
    { path: '/pokedex', label: 'Ver Pokedex' },
    { path: '/comparador', label: 'Comparador' },
    { path: '/aventuras', label: 'Aventuras' },
    { path: '/progreso', label: 'Progreso' },
    { path: '/perfil', label: 'Mi Perfil' },
  ];

  const isActive = (path) => currentPath === path;

  return (
    <div
      className="d-flex flex-column"
      style={{
        width: '250px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 500,
        background: 'linear-gradient(180deg, #fff8e1 0%, #ffecb3 50%, #ffe082 100%)',
        borderRight: '3px solid #ffc107',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
      }}
    >
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ 
          height: '70px', 
          backgroundColor: 'rgba(255,193,7,0.3)',
          borderBottom: '2px solid #ffc107'
        }}
      >
        <h6 className="fw-bold m-0" style={{ fontSize: '1.1rem', color: '#5d4037' }}>MENU PRINCIPAL</h6>
      </div>

      <div className="p-3 text-center">
        <small style={{ color: '#8d6e63' }}>
          {isLoggedIn ? 'Herramientas' : 'Acceso de usuarios'}
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
                backgroundColor: isActive('/dashboard') ? '#ffc107' : 'rgba(255,255,255,0.5)',
                color: isActive('/dashboard') ? '#5d4037' : '#5d4037',
                border: isActive('/dashboard') ? '2px solid #ff8f00' : '1px solid rgba(255,193,7,0.5)',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}
            >
              <span>Inicio</span>
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
                    backgroundColor: active ? '#ffc107' : 'rgba(255,255,255,0.5)',
                    color: active ? '#5d4037' : '#5d4037',
                    border: active ? '2px solid #ff8f00' : '1px solid rgba(255,193,7,0.5)',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem'
                  }}
                >
                  <span>{item.label}</span>
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
              className="d-flex align-items-center py-3 px-4 rounded-3 mb-2 text-decoration-none"
              style={{
                backgroundColor: 'rgba(255,138,101,0.3)',
                color: '#5d4037',
                border: '1px solid rgba(255,138,101,0.6)',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <span>Cerrar Sesión</span>
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
                  backgroundColor: active ? '#ffc107' : 'rgba(255,255,255,0.5)',
                  color: active ? '#5d4037' : '#5d4037',
                  border: active ? '2px solid #ff8f00' : '1px solid rgba(255,193,7,0.5)',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
              >
                <span>{item.label}</span>
              </Nav.Link>
            );
          })
        )}
      </Nav>
    </div>
  );
}

export default Sidebar;
