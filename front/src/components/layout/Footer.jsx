function Footer() {
  return (
    <footer 
      style={{ 
        height: '50px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'linear-gradient(135deg, #ffe082 0%, #ffecb3 50%, #fff8e1 100%)',
        borderTop: '3px solid #ffc107'
      }}
    />
  );
}

export default Footer;
