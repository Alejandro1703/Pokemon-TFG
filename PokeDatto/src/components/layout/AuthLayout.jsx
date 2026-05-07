import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

function AuthLayout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const handleToggleSidebar = (e) => {
      setSidebarVisible(e.detail.visible);
    };
    window.addEventListener('toggle-sidebar', handleToggleSidebar);

    return () => {
      window.removeEventListener('toggle-sidebar', handleToggleSidebar);
    };
  }, []);

  return (
    <div 
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'
      }}
    >
      <Header />
      <Sidebar />
      <Footer />
      
      <main 
        className="d-flex flex-column"
        style={{ 
          marginLeft: sidebarVisible ? '250px' : '0px',
          paddingTop: '90px',
          paddingBottom: '70px',
          minHeight: '100vh',
          width: sidebarVisible ? 'calc(100% - 250px)' : '100%',
          transition: 'all 0.4s ease-in-out'
        }}
      >
        <div className="flex-grow-1 d-flex align-items-center justify-content-center px-4 py-5">
          <div style={{ width: '100%', maxWidth: '600px' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
