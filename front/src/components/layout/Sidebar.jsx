import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/login', label: 'Iniciar Sesion', icon: '→' },
    { path: '/register', label: 'Registro', icon: '+' },
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
      
      <div className="p-3">
        <small className="text-secondary">Acceso de usuarios</small>
      </div>
      
      <Nav className="flex-column p-3">
        {navItems.map((item) => (
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
        ))}
      </Nav>

      <div className="mt-auto p-4 border-top border-secondary">
        <div className="text-secondary small mb-2 fw-bold">Juegos disponibles:</div>
        <div className="d-flex flex-wrap gap-1">
          <span className="badge bg-danger">Rojo Fuego</span>
          <span className="badge bg-success">Verde Hoja</span>
          <span className="badge bg-success">Esmeralda</span>
          <span className="badge bg-primary">Rubi</span>
          <span className="badge bg-info text-dark">Zafiro</span>
          <span className="badge" style={{backgroundColor: '#9b59b6'}}>Diamante</span>
          <span className="badge" style={{backgroundColor: '#e91e63'}}>Perla</span>
          <span className="badge" style={{backgroundColor: '#795548'}}>Platino</span>
          <span className="badge bg-light text-dark">Blanco</span>
          <span className="badge bg-dark border">Negro</span>
          <span className="badge bg-light text-dark">Blanco 2</span>
          <span className="badge bg-dark border">Negro 2</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
