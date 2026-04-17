import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import PokedexModal from './PokedexModal';
import PokemonComparator from './PokemonComparator';
import ProfileModal from './ProfileModal';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPokedex, setShowPokedex] = useState(false);
  const [showComparator, setShowComparator] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!token || !storedUser) {
        navigate('/login');
        return;
      }
      
      setUser(JSON.parse(storedUser));
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="warning" size="lg" className="mb-3" />
          <p className="text-secondary fw-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      onShowPokedex={() => setShowPokedex(true)}
      onShowComparator={() => setShowComparator(true)}
      onShowProfile={() => setShowProfile(true)}
    >
      <div />

      {/* Modal Pokedex */}
      <PokedexModal 
        show={showPokedex} 
        onHide={() => setShowPokedex(false)} 
      />

      {/* Modal Comparador */}
      <PokemonComparator
        show={showComparator}
        onHide={() => setShowComparator(false)}
      />

      {/* Modal Perfil */}
      <ProfileModal
        show={showProfile}
        onHide={() => setShowProfile(false)}
        user={user}
        onLogout={handleLogout}
        onUserUpdate={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }}
      />
    </DashboardLayout>
  );
}

export default Dashboard;
