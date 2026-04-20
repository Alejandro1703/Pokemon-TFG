import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

function DashboardLayout({ children }) {
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
          paddingTop: '70px',
          minHeight: '100vh',
          width: 'calc(100% - 250px)',
          paddingBottom: '50px'
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
