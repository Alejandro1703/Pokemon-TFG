import { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Badge, Row, Col, Alert, Card, Spinner } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876';

const ESTADOS_BASE = {
  completo: 'Completo (CIB + VIP)',
  semi: 'Semi completo (Sin VIP)',
  sinManual: 'Sin manual',
  soloCartucho: 'Solo cartucho',
  caratulaCartucho: 'Caratula y cartucho'
};

const ESTADO_POKEWALKER = { conPokewalker: 'Con Pokewalker' };

// Juegos que tienen la opcion Con Pokewalker
const JUEGOS_CON_POKEWALKER = ['Oro HeartGold', 'Plata SoulSilver'];

function MisJuegosModal({ show, onHide, juegosDisponibles }) {
  const [misJuegos, setMisJuegos] = useState([]);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState('');
  const [estado, setEstado] = useState('completo');
  const [precioCompra, setPrecioCompra] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper para obtener juegoId desde juegoNombre
  const getJuegoIdFromNombre = (nombre) => {
    const juego = juegosDisponibles.find(j => j.nombre === nombre);
    return juego ? juego.id.toString() : '';
  };

  // Cargar juegos desde la API
  useEffect(() => {
    if (show) {
      cargarJuegos();
    }
  }, [show]);

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

  // Calcular precio de mercado preview
  const getPrecioMercado = () => {
    if (!juegoSeleccionado) return null;
    const juegoInfo = juegosDisponibles.find(j => j.id === parseInt(juegoSeleccionado));
    if (!juegoInfo) return null;
    // Si el estado no existe para este juego (ej: conPokewalker en otros juegos), retornar null
    return juegoInfo.precios[estado] !== undefined ? juegoInfo.precios[estado] : null;
  };

  // Obtener estados disponibles según el juego seleccionado
  const getEstadosDisponibles = () => {
    if (!juegoSeleccionado) return ESTADOS_BASE;
    const juegoInfo = juegosDisponibles.find(j => j.id === parseInt(juegoSeleccionado));
    if (!juegoInfo) return ESTADOS_BASE;
    
    if (JUEGOS_CON_POKEWALKER.includes(juegoInfo.nombre)) {
      return { ...ESTADOS_BASE, ...ESTADO_POKEWALKER };
    }
    return ESTADOS_BASE;
  };

  // Funcion para mostrar label de estado en la tabla
  const getEstadoLabel = (estadoKey) => {
    const todosLosEstados = { ...ESTADOS_BASE, ...ESTADO_POKEWALKER };
    return todosLosEstados[estadoKey] || estadoKey;
  };

  const precioMercadoPreview = getPrecioMercado();

  const agregarJuego = async () => {
    if (!juegoSeleccionado) return;
    
    const juegoInfo = juegosDisponibles.find(j => j.id === parseInt(juegoSeleccionado));
    if (!juegoInfo) return;

    const precioMercado = juegoInfo.precios[estado];
    if (precioMercado === undefined) return;
    
    const precioCompraValor = parseFloat(precioCompra) || precioMercado;

    const requestBody = {
      juegoNombre: juegoInfo.nombre,
      estado: estado,
      precioCompra: precioCompraValor,
      precioMercado: precioMercado,
      fechaCompra: fechaCompra || null
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/juegos-usuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        await cargarJuegos();
        setJuegoSeleccionado('');
        setPrecioCompra('');
        setFechaCompra('');
      } else {
        setError('Error al agregar el juego');
      }
    } catch {
      setError('Error de conexion al agregar');
    }
  };

  const iniciarEdicion = (juego) => {
    setEditando(juego);
    setJuegoSeleccionado(getJuegoIdFromNombre(juego.juegoNombre));
    setEstado(juego.estado);
    setPrecioCompra(juego.precioCompra.toString());
    setFechaCompra(juego.fechaCompra || '');
  };

  const guardarEdicion = async () => {
    if (!editando || !juegoSeleccionado) return;
    
    const juegoInfo = juegosDisponibles.find(j => j.id === parseInt(juegoSeleccionado));
    if (!juegoInfo) return;

    const precioMercado = juegoInfo.precios[estado];
    if (precioMercado === undefined) return;
    
    const precioCompraValor = parseFloat(precioCompra) || precioMercado;

    const requestBody = {
      juegoNombre: juegoInfo.nombre,
      estado: estado,
      precioCompra: precioCompraValor,
      precioMercado: precioMercado,
      fechaCompra: fechaCompra || null
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/juegos-usuario/${editando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        await cargarJuegos();
        setEditando(null);
        setJuegoSeleccionado('');
        setPrecioCompra('');
        setFechaCompra('');
      } else {
        setError('Error al editar el juego');
      }
    } catch {
      setError('Error de conexion al editar');
    }
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setJuegoSeleccionado('');
    setEstado('completo');
    setPrecioCompra('');
    setFechaCompra('');
  };

  const eliminarJuego = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/juegos-usuario/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await cargarJuegos();
      } else {
        setError('Error al eliminar el juego');
      }
    } catch {
      setError('Error de conexion al eliminar');
    }
  };

  const totalInvertido = misJuegos.reduce((sum, j) => sum + j.precioCompra, 0);
  const totalMercado = misJuegos.reduce((sum, j) => sum + j.precioMercado, 0);
  const beneficio = totalMercado - totalInvertido;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header 
        closeButton 
        style={{ 
          background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
          borderBottom: '3px solid #e65100'
        }}
      >
        <Modal.Title className="fw-bold text-white">
          Mis Juegos
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="warning" />
            <p className="mt-2 text-muted">Cargando juegos...</p>
          </div>
        ) : (
          <>
        {/* Resumen */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center border-0 shadow-sm" style={{ backgroundColor: '#e3f2fd' }}>
              <Card.Body>
                <h6 className="text-muted mb-2">Total Invertido</h6>
                <h4 className="fw-bold text-primary mb-0">{totalInvertido.toFixed(2)} €</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center border-0 shadow-sm" style={{ backgroundColor: '#e8f5e9' }}>
              <Card.Body>
                <h6 className="text-muted mb-2">Valor en Mercado</h6>
                <h4 className="fw-bold text-success mb-0">{totalMercado.toFixed(2)} €</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center border-0 shadow-sm" style={{ 
              backgroundColor: beneficio >= 0 ? '#fff3e0' : '#ffebee'
            }}>
              <Card.Body>
                <h6 className="text-muted mb-2">Beneficio</h6>
                <h4 className="fw-bold mb-0" style={{ color: beneficio >= 0 ? '#e65100' : '#c62828' }}>
                  {beneficio >= 0 ? '+' : ''}{beneficio.toFixed(2)} €
                </h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Formulario para agregar */}
        <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
          <Card.Body>
            <h5 className="fw-bold mb-3">{editando ? 'Editar Juego' : 'Añadir Juego'}</h5>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label className="fw-semibold small">Juego</Form.Label>
                <Form.Select 
                  value={juegoSeleccionado} 
                  onChange={(e) => setJuegoSeleccionado(e.target.value)}
                  className="border-2"
                  style={{ borderRadius: '10px' }}
                >
                  <option value="">Selecciona un juego...</option>
                  {juegosDisponibles.map(j => (
                    <option key={j.id} value={j.id}>Pokemon {j.nombre}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label className="fw-semibold small">Estado</Form.Label>
                <Form.Select 
                  value={estado} 
                  onChange={(e) => setEstado(e.target.value)}
                  className="border-2"
                  style={{ borderRadius: '10px' }}
                >
                  {Object.entries(getEstadosDisponibles()).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label className="fw-semibold small">Fecha de compra</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaCompra}
                  onChange={(e) => setFechaCompra(e.target.value)}
                  className="border-2"
                  style={{ borderRadius: '10px' }}
                />
              </Col>
              <Col md={2}>
                <Form.Label className="fw-semibold small">Precio de compra (€)</Form.Label>
                <Form.Control
                  type="number"
                  value={precioCompra}
                  onChange={(e) => setPrecioCompra(e.target.value)}
                  placeholder="0.00"
                  className="border-2"
                  style={{ borderRadius: '10px' }}
                />
              </Col>
              <Col md={2}>
                <Form.Label className="fw-semibold small text-success">Precio mercado (auto)</Form.Label>
                <Form.Control
                  type="text"
                  value={precioMercadoPreview !== null ? `${precioMercadoPreview} €` : '-'}
                  disabled
                  className="border-2 bg-light fw-bold text-success"
                  style={{ borderRadius: '10px' }}
                />
              </Col>
              <Col md={2} className="d-flex align-items-end">
                {editando ? (
                  <div className="d-flex gap-2 w-100">
                    <Button 
                      onClick={guardarEdicion}
                      disabled={!juegoSeleccionado}
                      className="flex-grow-1 fw-bold border-0"
                      style={{ 
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
                      }}
                    >
                      Guardar
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={cancelarEdicion}
                      className="fw-bold"
                      style={{ borderRadius: '10px' }}
                    >
                      X
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={agregarJuego}
                    disabled={!juegoSeleccionado}
                    className="w-100 fw-bold border-0"
                    style={{ 
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)'
                    }}
                  >
                    Añadir
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabla de juegos */}
        {misJuegos.length === 0 ? (
          <Alert variant="info" className="text-center border-0 rounded-3">
            No tienes juegos en tu inventario. Añade tu primera adquisicion arriba.
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th className="fw-bold">Juego</th>
                  <th className="fw-bold">Estado</th>
                  <th className="fw-bold">Fecha Compra</th>
                  <th className="fw-bold text-end">Precio Compra</th>
                  <th className="fw-bold text-end">Precio Mercado</th>
                  <th className="fw-bold text-end">Diferencia</th>
                  <th className="fw-bold text-center">Accion</th>
                </tr>
              </thead>
              <tbody>
                {misJuegos.map((juego) => {
                  const diferencia = juego.precioMercado - juego.precioCompra;
                  return (
                    <tr key={juego.id}>
                      <td>
                        <div className="fw-semibold">Pokemon {juego.nombre}</div>
                        <Badge bg="secondary" className="rounded-pill">{juego.generacion}</Badge>
                      </td>
                      <td>
                        <small className="text-muted">{getEstadoLabel(juego.estado)}</small>
                      </td>
                      <td>
                        <small className="text-muted">{juego.fechaCompra ? new Date(juego.fechaCompra).toLocaleDateString('es-ES') : '-'}</small>
                      </td>
                      <td className="text-end fw-semibold">{juego.precioCompra.toFixed(2)} €</td>
                      <td className="text-end">{juego.precioMercado.toFixed(2)} €</td>
                      <td className="text-end">
                        <span className={diferencia >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                          {diferencia >= 0 ? '+' : ''}{diferencia.toFixed(2)} €
                        </span>
                      </td>
                      <td className="text-center">
                        <Button 
                          variant="warning" 
                          size="sm"
                          onClick={() => iniciarEdicion(juego)}
                          className="rounded-pill me-2"
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => eliminarJuego(juego.id)}
                          className="rounded-pill"
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
          </>
        )}
      </Modal.Body>
      
      <Modal.Footer className="border-top-0">
        <Button variant="secondary" onClick={onHide} className="rounded-pill px-4">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MisJuegosModal;
