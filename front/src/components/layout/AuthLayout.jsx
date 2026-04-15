import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

function AuthLayout({ children }) {
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
          marginLeft: '250px',
          paddingTop: '90px',
          paddingBottom: '70px',
          minHeight: '100vh',
          width: 'calc(100% - 250px)'
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
