import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Modal, Spinner } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useTranslation } from '../contexts/SettingsContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://pokemon-tfg-backend.onrender.com';

const JUEGOS_IMAGENES = {
  'Rojo Fuego': '/images/juegos/Rojo Fuego.jpeg',
  'Verde Hoja': '/images/juegos/Verde Hoja.jpeg',
  'Rubi': '/images/juegos/Rubi.jpeg',
  'Zafiro': '/images/juegos/Zafiro.jpeg',
  'Esmeralda': '/images/juegos/Esmeralda.jpeg',
  'Diamante': '/images/juegos/Diamante.jpeg',
  'Perla': '/images/juegos/Perla.jpeg',
  'Platino': '/images/juegos/Platino.jpeg',
  'Oro HeartGold': '/images/juegos/Oro HeartGold.jpeg',
  'Plata SoulSilver': '/images/juegos/Plata SoulSilver.jpeg',
  'Negro': '/images/juegos/Negro.jpeg',
  'Blanco': '/images/juegos/Blanco.jpeg',
  'Negro 2': '/images/juegos/Negro 2.jpeg',
  'Blanco 2': '/images/juegos/Blanco 2.jpeg'
};

const JUEGOS_TRADUCCIONES = {
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

function AventurasPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [juegoEditando, setJuegoEditando] = useState(null);
  const [comentario, setComentario] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    cargarJuegos();
  }, [navigate]);

  const cargarJuegos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/juegos-usuario`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setJuegos(data);
      }
    } catch {
      console.error('Error cargando juegos');
    } finally {
      setLoading(false);
    }
  };

  const abrirEdicion = (juego) => {
    setJuegoEditando(juego);
    setComentario(juego.comentario || '');
    setShowModal(true);
  };

  const guardarComentario = async () => {
    if (!juegoEditando) return;
    
    try {
      const token = localStorage.getItem('token');
      const comentarioAEnviar = comentario === null || comentario === undefined ? '' : comentario;
      const response = await fetch(`${API_URL}/api/juegos-usuario/${juegoEditando.id}/comentario`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(comentarioAEnviar)
      });
      
      if (response.ok) {
        await cargarJuegos();
        setShowModal(false);
        setJuegoEditando(null);
      } else {
        const errorText = await response.text();
        console.error('Error respuesta:', errorText);
        alert('Error al guardar: ' + errorText);
      }
    } catch (err) {
      console.error('Error guardando comentario:', err);
      alert('Error de conexión');
    }
  };

  const borrarComentario = () => {
    setComentario('');
  };

  const iniciarAventura = (juego) => {
    navigate(`/aventura?juegoId=${juego.id}&nombre=${encodeURIComponent(juego.juegoNombre)}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">
          <Spinner animation="border" variant="warning" />
          <p className="mt-2">{t('adventures.loading')}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#f8f9fa' }}>
          <Card.Body className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/dashboard')}
              className="rounded-pill me-3"
            >
              {t('adventures.backToStart')}
            </Button>
            <h2 className="fw-bold m-0">{t('adventures.title')}</h2>
          </Card.Body>
        </Card>
        
        {juegos.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center p-5">
              <h4 className="text-muted mb-3">{t('adventures.noGames')}</h4>
              <p className="text-secondary">
                {t('adventures.addGames')}
              </p>
            </Card.Body>
          </Card>
        ) : (
          <div className="row g-3">
            {juegos.map((juego) => (
              <div key={juego.id} className="col-12 col-md-6 col-lg-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="d-flex align-items-center gap-3">
                    <img
                      src={JUEGOS_IMAGENES[juego.juegoNombre] || '/images/juegos/default.jpeg'}
                      alt={t(JUEGOS_TRADUCCIONES[juego.juegoNombre] || juego.juegoNombre)}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">Pokemon {t(JUEGOS_TRADUCCIONES[juego.juegoNombre] || juego.juegoNombre)}</h6>
                      {juego.comentario && (
                        <small className="text-muted d-block text-truncate" style={{ maxWidth: '150px' }}>
                          {juego.comentario}
                        </small>
                      )}
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => iniciarAventura(juego)}
                        onKeyDown={(e) => e.key === 'Enter' && iniciarAventura(juego)}
                        className="d-inline-flex align-items-center justify-content-center px-3 py-1 rounded-pill fw-bold"
                        style={{
                          fontSize: '0.8rem',
                          color: '#fff',
                          backgroundColor: '#66bb6a',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          userSelect: 'none',
                          boxShadow: '0 2px 6px rgba(102,187,106,0.3)'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = '#57a85a';
                          e.currentTarget.style.boxShadow = '0 3px 10px rgba(102,187,106,0.4)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = '#66bb6a';
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(102,187,106,0.3)';
                        }}
                      >
                        {t('adventures.start')}
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => abrirEdicion(juego)}
                        onKeyDown={(e) => e.key === 'Enter' && abrirEdicion(juego)}
                        className="d-inline-flex align-items-center justify-content-center px-3 py-1 rounded-pill fw-bold"
                        style={{
                          fontSize: '0.8rem',
                          color: '#42a5f5',
                          backgroundColor: 'rgba(66,165,245,0.08)',
                          border: '1px solid rgba(66,165,245,0.3)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          userSelect: 'none'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = 'rgba(66,165,245,0.18)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'rgba(66,165,245,0.08)';
                        }}
                      >
                        {t('adventures.edit')}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Modal para editar comentario */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)' }}>
            <Modal.Title className="fw-bold text-white">
              {t('adventures.editGame')} {juegoEditando?.juegoNombre}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form.Group>
              <Form.Label className="fw-bold">{t('adventures.commentLabel')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder={t('adventures.commentPlaceholder')}
                style={{ borderRadius: '10px' }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} className="rounded-pill">
              {t('adventures.cancel')}
            </Button>
            <Button variant="danger" onClick={borrarComentario} className="rounded-pill">
              {t('adventures.delete')}
            </Button>
            <Button
              variant="warning"
              onClick={guardarComentario}
              className="rounded-pill fw-bold"
            >
              {t('adventures.save')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default AventurasPage;
