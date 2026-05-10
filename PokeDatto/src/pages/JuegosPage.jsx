import { useState, useEffect } from 'react';
import { Spinner, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSettings, useTranslation } from '../contexts/SettingsContext';

// Lista de juegos con precios por estado (EUR)
const JUEGOS_DISPONIBLES = [
  { id: 1, nombreKey: 'games.fireRed', imagen: '/images/juegos/Rojo Fuego.jpeg', generacionKey: 'games.gen1',
    precios: { completo: 240, semi: 210, sinManual: 165, soloCartucho: 75, caratulaCartucho: 145 }},
  { id: 2, nombreKey: 'games.leafGreen', imagen: '/images/juegos/Verde Hoja.jpeg', generacionKey: 'games.gen1',
    precios: { completo: 230, semi: 200, sinManual: 155, soloCartucho: 70, caratulaCartucho: 135 }},
  { id: 3, nombreKey: 'games.ruby', imagen: '/images/juegos/Rubi.jpeg', generacionKey: 'games.gen3',
    precios: { completo: 210, semi: 185, sinManual: 140, soloCartucho: 65, caratulaCartucho: 125 }},
  { id: 4, nombreKey: 'games.sapphire', imagen: '/images/juegos/Zafiro.jpeg', generacionKey: 'games.gen3',
    precios: { completo: 210, semi: 185, sinManual: 140, soloCartucho: 65, caratulaCartucho: 125 }},
  { id: 5, nombreKey: 'games.emerald', imagen: '/images/juegos/Esmeralda.jpeg', generacionKey: 'games.gen3',
    precios: { completo: 520, semi: 460, sinManual: 350, soloCartucho: 140, caratulaCartucho: 310 }},
  { id: 6, nombreKey: 'games.diamond', imagen: '/images/juegos/Diamante.jpeg', generacionKey: 'games.gen4',
    precios: { completo: 90, semi: 75, sinManual: 60, soloCartucho: 35, caratulaCartucho: 70 }},
  { id: 7, nombreKey: 'games.pearl', imagen: '/images/juegos/Perla.jpeg', generacionKey: 'games.gen4',
    precios: { completo: 85, semi: 70, sinManual: 55, soloCartucho: 35, caratulaCartucho: 65 }},
  { id: 8, nombreKey: 'games.platinum', imagen: '/images/juegos/Platino.jpeg', generacionKey: 'games.gen4',
    precios: { completo: 160, semi: 140, sinManual: 115, soloCartucho: 75, caratulaCartucho: 130 }},
  { id: 9, nombreKey: 'games.heartGold', imagen: '/images/juegos/Oro HeartGold.jpeg', generacionKey: 'games.gen2',
    precios: { completo: 175, semi: 155, sinManual: 130, soloCartucho: 95, caratulaCartucho: 145, conPokewalker: 450 }},
  { id: 10, nombreKey: 'games.soulSilver', imagen: '/images/juegos/Plata SoulSilver.jpeg', generacionKey: 'games.gen2',
    precios: { completo: 175, semi: 155, sinManual: 130, soloCartucho: 95, caratulaCartucho: 145, conPokewalker: 450 }},
  { id: 11, nombreKey: 'games.black', imagen: '/images/juegos/Negro.jpeg', generacionKey: 'games.gen5',
    precios: { completo: 110, semi: 95, sinManual: 80, soloCartucho: 60, caratulaCartucho: 90 }},
  { id: 12, nombreKey: 'games.white', imagen: '/images/juegos/Blanco.jpeg', generacionKey: 'games.gen5',
    precios: { completo: 110, semi: 95, sinManual: 80, soloCartucho: 60, caratulaCartucho: 90 }},
  { id: 13, nombreKey: 'games.black2', imagen: '/images/juegos/Negro 2.jpeg', generacionKey: 'games.gen5',
    precios: { completo: 200, semi: 180, sinManual: 150, soloCartucho: 100, caratulaCartucho: 165 }},
  { id: 14, nombreKey: 'games.white2', imagen: '/images/juegos/Blanco 2.jpeg', generacionKey: 'games.gen5',
    precios: { completo: 200, semi: 180, sinManual: 150, soloCartucho: 100, caratulaCartucho: 165 }}
];

const GENERACIONES = ['sidebar.filterAll', 'games.gen1', 'games.gen2', 'games.gen3', 'games.gen4', 'games.gen5'];

function JuegosPage() {
  const { isDark } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filtroGeneracion, setFiltroGeneracion] = useState('sidebar.filterAll');

  const juegosFiltrados = filtroGeneracion === 'sidebar.filterAll'
    ? JUEGOS_DISPONIBLES
    : JUEGOS_DISPONIBLES.filter(j => j.generacionKey === filtroGeneracion);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="warning" size="lg" className="mb-3" />
          <p className="text-secondary fw-semibold">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h2
            className="fw-bold mb-3"
            style={{
              color: isDark ? '#e8eaed' : '#333',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {t('games.title')}
          </h2>
          <p className="text-secondary fs-5">
            {t('games.filterBy')}
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
                  : (isDark ? '#2e3040' : '#f5f5f5'),
                color: filtroGeneracion === gen ? '#333' : (isDark ? '#c8ccd4' : '#666'),
                boxShadow: filtroGeneracion === gen
                  ? '0 4px 15px rgba(255, 152, 0, 0.4)'
                  : '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (filtroGeneracion !== gen) {
                  e.currentTarget.style.background = isDark ? '#3d3f4e' : '#e0e0e0';
                }
              }}
              onMouseLeave={(e) => {
                if (filtroGeneracion !== gen) {
                  e.currentTarget.style.background = isDark ? '#2e3040' : '#f5f5f5';
                }
              }}
            >
              {gen === 'sidebar.filterAll' ? t('games.filterAll') : t(gen)}
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
                    backgroundColor: isDark ? '#2e3040' : '#f8f9fa',
                    height: '260px'
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={juego.imagen}
                    alt={t(juego.nombreKey)}
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
                <Card.Body className="text-center p-3" style={{ backgroundColor: isDark ? '#23252f' : '#ffffff' }}>
                  <Card.Title
                    className="fw-bold mb-2"
                    style={{ fontSize: '1.05rem', color: isDark ? '#e8eaed' : '#333' }}
                  >
                    {t(juego.nombreKey)}
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
                    {t(juego.generacionKey)}
                  </span>
                  <div
                    className="fw-bold"
                    style={{
                      color: isDark ? '#a3f5b7' : '#2e7d32',
                      fontSize: '1.1rem'
                    }}
                  >
                    {juego.precios.completo} €
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.75rem', color: isDark ? '#9ca3af' : '#6c757d' }}>
                    {t('myGames.purchasePrice')}
                  </small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

      </div>
    </DashboardLayout>
  );
}

export default JuegosPage;
