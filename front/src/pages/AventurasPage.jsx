import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Modal, Spinner } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876';

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

function AventurasPage() {
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
    alert(`Iniciando aventura en: ${juego.juegoNombre}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">
          <Spinner animation="border" variant="warning" />
          <p className="mt-2">Cargando juegos...</p>
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
              ← Volver al inicio
            </Button>
            <h2 className="fw-bold m-0">Aventuras</h2>
          </Card.Body>
        </Card>
        
        {juegos.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center p-5">
              <h4 className="text-muted mb-3">No tienes juegos</h4>
              <p className="text-secondary">
                Añade juegos a tu colección para poder jugar.
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
                      alt={juego.juegoNombre}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{juego.juegoNombre}</h6>
                      {juego.comentario && (
                        <small className="text-muted d-block text-truncate" style={{ maxWidth: '150px' }}>
                          {juego.comentario}
                        </small>
                      )}
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        className="rounded-pill"
                        onClick={() => iniciarAventura(juego)}
                      >
                        ▶ Iniciar
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="rounded-pill"
                        onClick={() => abrirEdicion(juego)}
                      >
                        ✎ Editar
                      </Button>
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
              Editar {juegoEditando?.juegoNombre}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form.Group>
              <Form.Label className="fw-bold">Comentario (para diferenciar juegos)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Ej: Mi cartucho de la infancia, Comprado en Japón, etc."
                style={{ borderRadius: '10px' }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} className="rounded-pill">
              Cancelar
            </Button>
            <Button variant="danger" onClick={borrarComentario} className="rounded-pill">
              Borrar
            </Button>
            <Button
              variant="warning"
              onClick={guardarComentario}
              className="rounded-pill fw-bold"
            >
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default AventurasPage;
