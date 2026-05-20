import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useSettings } from '../../contexts/SettingsContext';

function AuthLayout({ children }) {
  const { isDark } = useSettings();
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
        background: isDark
          ? 'linear-gradient(135deg, #1a1b23 0%, #1e2029 50%, #23252f 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'
      }}
    >
      <Header />
      <Sidebar />

      <main
        className="d-flex flex-column"
        style={{
          marginLeft: sidebarVisible ? '250px' : '0px',
          paddingTop: '90px',
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

      <div style={{ marginLeft: sidebarVisible ? '250px' : '0px', transition: 'all 0.4s ease-in-out' }}>
        <Footer />
      </div>
    </div>
  );
}

export default AuthLayout;
