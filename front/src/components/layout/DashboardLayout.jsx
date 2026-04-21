import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

function DashboardLayout({ children }) {
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
          paddingTop: '70px',
          minHeight: '100vh',
          width: sidebarVisible ? 'calc(100% - 250px)' : '100%',
          paddingBottom: '50px',
          transition: 'all 0.4s ease-in-out'
        }}
      >
        <div className="flex-grow-1 p-4">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
