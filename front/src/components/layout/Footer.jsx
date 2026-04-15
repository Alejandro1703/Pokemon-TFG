function Footer() {
  return (
    <footer 
      className="bg-dark text-light border-top border-warning"
      style={{ 
        height: '50px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.4)'
      }}
    >
      <div className="h-100 d-flex align-items-center justify-content-between px-4" style={{ paddingLeft: '270px' }}>
        <div className="d-flex align-items-center">
          <span className="text-warning fw-bold me-2">Pokemon TFG</span>
          <span className="text-secondary">| Proyecto de Gestion de Informacion</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-danger">GBA</span>
          <span className="badge bg-primary">DS</span>
          <span className="text-secondary ms-2">Rojo Fuego • Esmeralda • Blanco 2 • Negro 2</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
