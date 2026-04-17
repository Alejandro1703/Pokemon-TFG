function Footer() {
  return (
    <footer 
      className="bg-dark"
      style={{ 
        height: '50px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '3px solid #ffc107'
      }}
    />
  );
}

export default Footer;
