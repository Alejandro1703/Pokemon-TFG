import { useState, useEffect } from 'react';
import { Modal, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from '../contexts/SettingsContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876';

// Mapeo de nombres de juegos (de la API) a claves de traducción
const NOMBRE_A_KEY = {
  'Rojo Fuego': 'games.fireRed',
  'Verde Hoja': 'games.leafGreen',
  'Rubi': 'games.ruby',
  'Zafiro': 'games.sapphire',
  'Esmeralda': 'games.emerald',
  'Diamante': 'games.diamond',
  'Perla': 'games.pearl',
  'Platino': 'games.platinum',
  'Oro HeartGold': 'games.heartGold',
  'Plata SoulSilver': 'games.soulSilver',
  'Negro': 'games.black',
  'Blanco': 'games.white',
  'Negro 2': 'games.black2',
  'Blanco 2': 'games.white2'
};

function ProgresoModal({ show, onHide, juegosDisponibles, standalone = false }) {
  const { t } = useTranslation();
  const [misJuegos, setMisJuegos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar juegos desde la API
  useEffect(() => {
    if (standalone || show) {
      cargarJuegos();
    }
  }, [show, standalone]);

  const cargarJuegos = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/juegos-usuario`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMisJuegos(data);
      } else {
        setError('Error al cargar los juegos');
      }
    } catch {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  // Obtener información del juego desde la lista de juegos disponibles
  const getJuegoInfo = (nombreJuego) => {
    const nombreKey = NOMBRE_A_KEY[nombreJuego] || nombreJuego;
    const juego = juegosDisponibles.find(j => j.nombreKey === nombreKey);
    return juego ? { ...juego, nombreTraducido: t(juego.nombreKey) } : null;
  };

  // Obtener juegos únicos (por nombre) para no mostrar duplicados
  const getJuegosUnicos = () => {
    const nombresVistos = new Set();
    return misJuegos.filter(juego => {
      if (nombresVistos.has(juego.juegoNombre)) {
        return false;
      }
      nombresVistos.add(juego.juegoNombre);
      return true;
    });
  };

  const juegosUnicos = getJuegosUnicos();

  const content = (
    <div style={{ backgroundColor: '#f8f9fa' }} className={standalone ? '' : 'p-4'}>
      {standalone && (
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body style={{ background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' }}>
            <h4 className="fw-bold text-white mb-0">{t('progress.title')}</h4>
          </Card.Body>
        </Card>
      )}
      
      {!standalone && (
        <Modal.Header
          closeButton
          style={{
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            borderBottom: '3px solid #1b5e20'
          }}
        >
          <Modal.Title className="fw-bold text-white">
            {t('progress.header')}
          </Modal.Title>
        </Modal.Header>
      )}
      
      <div className={standalone ? '' : 'p-4'}>
        {error && (
          <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-3 text-muted">Cargando tu colección...</p>
          </div>
        ) : juegosUnicos.length === 0 ? (
          <Alert variant="info" className="text-center border-0 rounded-3 py-4">
            <h5 className="mb-2">Aún no tienes juegos en tu colección</h5>
            <p className="mb-0 text-muted">
              Ve a "Mis Juegos" en el menú lateral para añadir tus primeros juegos al inventario.
            </p>
          </Alert>
        ) : (
          <>
            <div className="text-center mb-4">
              <h5 className="text-success fw-bold">
                {t('progress.collected')} {juegosUnicos.length} {juegosUnicos.length === 1 ? t('progress.game') : t('progress.games')} {t('progress.collectedSuffix')} {juegosDisponibles.length} {t('progress.collectedEnd')}
              </h5>
              <div 
                className="mx-auto mt-2" 
                style={{ 
                  width: '200px', 
                  height: '8px', 
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{ 
                    width: `${(juegosUnicos.length / juegosDisponibles.length) * 100}%`, 
                    height: '100%',
                    backgroundColor: '#4caf50',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <small className="text-muted">
                {Math.round((juegosUnicos.length / juegosDisponibles.length) * 100)}% {t('progress.completed')}
              </small>
            </div>

            <Row className="g-3">
              {juegosUnicos.map((juego) => {
                const juegoInfo = getJuegoInfo(juego.juegoNombre);
                return (
                  <Col key={juego.id} xs={12} md={6} lg={4}>
                    <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '10px' }}>
                      <div className="d-flex align-items-center p-2">
                        <div
                          className="position-relative flex-shrink-0"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '6px',
                            overflow: 'hidden'
                          }}
                        >
                          {juegoInfo ? (
                            <img
                              src={juegoInfo.imagen}
                              alt={juego.juegoNombre}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                              }}
                            />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                              <span style={{ fontSize: '0.6rem' }}>-</span>
                            </div>
                          )}
                        </div>
                        <div className="ms-2 flex-grow-1">
                          <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>
                            Pokémon {juegoInfo?.nombreTraducido || juego.juegoNombre}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </div>
    </div>
  );

  if (standalone) {
    return content;
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      {content}
    </Modal>
  );
}

export default ProgresoModal;
