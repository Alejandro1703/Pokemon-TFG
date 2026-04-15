import { Navbar, Nav, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Navbar 
      expand="lg" 
      className="bg-dark border-bottom border-warning" 
      style={{ 
        height: '70px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >
      <div className="w-100 px-4 d-flex align-items-center justify-content-between">
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="fw-bold text-white d-flex align-items-center text-decoration-none"
          style={{ fontSize: '1.5rem' }}
        >
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center me-3 border border-warning"
            style={{ 
              width: '45px', 
              height: '45px',
              background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)'
            }}
          >
            <span className="text-dark fw-bold" style={{ fontSize: '1.4rem' }}>P</span>
          </div>
          <span className="text-warning">Pokemon</span>
          <span className="text-white ms-2">TFG</span>
        </Navbar.Brand>
        
        <Nav>
          <Badge 
            bg="warning" 
            text="dark" 
            className="d-flex align-items-center px-4 py-2 rounded-pill fw-semibold"
            style={{ fontSize: '0.9rem' }}
          >
            GBA & DS Collection
          </Badge>
        </Nav>
      </div>
    </Navbar>
  );
}

export default Header;
