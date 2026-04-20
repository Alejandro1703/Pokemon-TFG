import { useState, useEffect } from 'react';

function Header() {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setNombre(JSON.parse(user).nombre || '');
      } catch {}
    }
  }, []);

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
        background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #ffe082 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderBottom: '3px solid #ffc107'
      }}
    >
      {nombre && (
        <span className="text-dark fw-bold" style={{ fontSize: '1.1rem' }}>
          Bienvenido, {nombre}
        </span>
      )}
    </header>
  );
}

export default Header;
