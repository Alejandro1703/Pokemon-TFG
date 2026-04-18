import { useState, useEffect } from 'react';
import { Spinner, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import PokedexModal from './PokedexModal';
import PokemonComparator from './PokemonComparator';
import ProfileModal from './ProfileModal';

// Lista de juegos disponibles con sus imagenes y precios (EUR)
const JUEGOS_DISPONIBLES = [
  { id: 1, nombre: 'Rojo Fuego', imagen: '/images/juegos/Rojo Fuego.jpeg', generacion: 'Gen 1', precio: 45 },
  { id: 2, nombre: 'Verde Hoja', imagen: '/images/juegos/Verde Hoja.jpeg', generacion: 'Gen 1', precio: 40 },
  { id: 3, nombre: 'Esmeralda', imagen: '/images/juegos/Esmeralda.jpeg', generacion: 'Gen 3', precio: 85 },
  { id: 4, nombre: 'Rubi', imagen: '/images/juegos/Rubi.jpeg', generacion: 'Gen 3', precio: 35 },
  { id: 5, nombre: 'Zafiro', imagen: '/images/juegos/Zafiro.jpeg', generacion: 'Gen 3', precio: 35 },
  { id: 6, nombre: 'Diamante', imagen: '/images/juegos/Diamante.jpeg', generacion: 'Gen 4', precio: 30 },
  { id: 7, nombre: 'Perla', imagen: '/images/juegos/Perla.jpeg', generacion: 'Gen 4', precio: 30 },
  { id: 8, nombre: 'Platino', imagen: '/images/juegos/Platino.jpeg', generacion: 'Gen 4', precio: 55 },
  { id: 9, nombre: 'Oro HeartGold', imagen: '/images/juegos/Oro HeartGold.jpeg', generacion: 'Gen 2', precio: 95 },
  { id: 10, nombre: 'Plata SoulSilver', imagen: '/images/juegos/Plata SoulSilver.jpeg', generacion: 'Gen 2', precio: 90 },
  { id: 11, nombre: 'Negro', imagen: '/images/juegos/Negro.jpeg', generacion: 'Gen 5', precio: 35 },
  { id: 12, nombre: 'Blanco', imagen: '/images/juegos/Blanco.jpeg', generacion: 'Gen 5', precio: 35 },
  { id: 13, nombre: 'Negro 2', imagen: '/images/juegos/Negro 2.jpeg', generacion: 'Gen 5', precio: 40 },
  { id: 14, nombre: 'Blanco 2', imagen: '/images/juegos/Blanco 2.jpeg', generacion: 'Gen 5', precio: 40 }
];

const GENERACIONES = ['Todas', 'Gen 1', 'Gen 2', 'Gen 3', 'Gen 4', 'Gen 5'];

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPokedex, setShowPokedex] = useState(false);
  const [showComparator, setShowComparator] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [filtroGeneracion, setFiltroGeneracion] = useState('Todas');

  const juegosFiltrados = filtroGeneracion === 'Todas' 
    ? JUEGOS_DISPONIBLES 
    : JUEGOS_DISPONIBLES.filter(j => j.generacion === filtroGeneracion);

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
      <div className="p-4">
        {/* Header del Dashboard */}
        <div className="text-center mb-4">
          <h2 
            className="fw-bold mb-3"
            style={{ 
              color: '#333',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Juegos Disponibles
          </h2>
          <p className="text-secondary fs-5">
            Selecciona tus juegos adquiridos. Podrás poner el precio por el que los adquiriste o dejar que la aplicación ponga el precio del juego a día de hoy. También tienes la opción de ver el coste, el precio real y sacar el beneficio.
          </p>
        </div>

        {/* Filtro por generaciones */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {GENERACIONES.map((gen) => (
            <button
              key={gen}
              onClick={() => setFiltroGeneracion(gen)}
              className="btn fw-semibold px-4 py-2"
              style={{
                borderRadius: '25px',
                border: 'none',
                fontSize: '0.9rem',
                background: filtroGeneracion === gen
                  ? 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)'
                  : '#f5f5f5',
                color: filtroGeneracion === gen ? '#333' : '#666',
                boxShadow: filtroGeneracion === gen 
                  ? '0 4px 15px rgba(255, 152, 0, 0.4)' 
                  : '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (filtroGeneracion !== gen) {
                  e.currentTarget.style.background = '#e0e0e0';
                }
              }}
              onMouseLeave={(e) => {
                if (filtroGeneracion !== gen) {
                  e.currentTarget.style.background = '#f5f5f5';
                }
              }}
            >
              {gen}
            </button>
          ))}
        </div>

        {/* Grid de juegos */}
        <Row className="g-4">
          {juegosFiltrados.map((juego) => (
            <Col key={juego.id} xs={12} sm={6} md={4} lg={3}>
              <Card 
                className="h-100 border-0 shadow-sm"
                style={{ 
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div 
                  className="d-flex align-items-center justify-content-center p-3"
                  style={{ 
                    backgroundColor: '#f8f9fa',
                    height: '260px'
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={juego.imagen}
                    alt={juego.nombre}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '240px',
                      width: 'auto',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                    }}
                  />
                </div>
                <Card.Body className="text-center p-3">
                  <Card.Title 
                    className="fw-bold mb-2"
                    style={{ fontSize: '1.05rem', color: '#333' }}
                  >
                    Pokemon {juego.nombre}
                  </Card.Title>
                  <span 
                    className="badge rounded-pill px-3 py-2 d-inline-block mb-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                      color: '#333',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      boxShadow: '0 2px 4px rgba(255, 152, 0, 0.3)'
                    }}
                  >
                    {juego.generacion}
                  </span>
                  <div 
                    className="fw-bold"
                    style={{ 
                      color: '#2e7d32',
                      fontSize: '1.1rem'
                    }}
                  >
                    {juego.precio} €
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

      </div>

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
