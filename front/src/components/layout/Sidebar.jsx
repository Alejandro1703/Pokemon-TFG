import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ onShowPokedex, onShowComparator, onShowProfile, onShowMisJuegos, onShowProgreso }) {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  const authItems = [
    { path: '/login', label: 'Iniciar Sesion', icon: '→' },
    { path: '/register', label: 'Registro', icon: '+' },
  ];

  const dashboardItems = [
    { key: 'progreso', label: 'Progreso', icon: 'Pr', action: onShowProgreso },
    { key: 'mis-juegos', label: 'Mis Juegos', icon: 'G', action: onShowMisJuegos },
    { key: 'pokedex', label: 'Ver Pokedex', icon: 'P', action: onShowPokedex },
    { key: 'comparador', label: 'Comparador', icon: 'C', action: onShowComparator },
    { key: 'perfil', label: 'Mi Perfil', icon: 'U', action: onShowProfile },
  ];

  return (
    <div 
      className="bg-dark text-white d-flex flex-column"
      style={{ 
        width: '250px', 
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 500,
        borderRight: '3px solid #ffc107',
        boxShadow: '4px 0 20px rgba(0,0,0,0.3)'
      }}
    >
      <div 
        className="border-bottom border-secondary d-flex align-items-center justify-content-center"
        style={{ height: '70px', backgroundColor: 'rgba(0,0,0,0.3)' }}
      >
        <h6 className="text-warning fw-bold m-0" style={{ fontSize: '1.1rem' }}>MENU PRINCIPAL</h6>
      </div>
      
      <div className="p-3 text-center">
        <small className="text-secondary">
          {isLoggedIn ? 'Herramientas' : 'Acceso de usuarios'}
        </small>
      </div>
      
      <Nav className="flex-column p-3">
        {isLoggedIn ? (
          dashboardItems.map((item) => (
            <Nav.Link
              key={item.key}
              onClick={item.action}
              className="d-flex align-items-center py-3 px-4 rounded-3 mb-2 text-decoration-none text-light"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <span 
                className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  backgroundColor: '#ffc107',
                  color: '#000',
                  fontWeight: 'bold'
                }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Nav.Link>
          ))
        ) : (
          authItems.map((item) => (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              className={`d-flex align-items-center py-3 px-4 rounded-3 mb-2 text-decoration-none ${
                location.pathname === item.path 
                  ? 'bg-warning text-dark fw-bold shadow' 
                  : 'text-light'
              }`}
              style={{
                backgroundColor: location.pathname === item.path ? '#ffc107' : 'rgba(255,255,255,0.05)',
                border: location.pathname === item.path ? 'none' : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}
            >
              <span 
                className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  backgroundColor: location.pathname === item.path ? '#000' : '#ffc107',
                  color: location.pathname === item.path ? '#ffc107' : '#000',
                  fontWeight: 'bold'
                }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Nav.Link>
          ))
        )}
      </Nav>
    </div>
  );
}

export default Sidebar;
