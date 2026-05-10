import { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Badge, Row, Col, Alert, Card, Spinner } from 'react-bootstrap';
import { useSettings, useTranslation } from '../contexts/SettingsContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876';

const ESTADOS_BASE = {
  completo: 'gameStates.complete',
  semi: 'gameStates.semi',
  sinManual: 'gameStates.withoutManual',
  soloCartucho: 'gameStates.cartridgeOnly',
  caratulaCartucho: 'gameStates.coverCartridge'
};

const ESTADO_POKEWALKER = { conPokewalker: 'gameStates.withPokewalker' };

// Juegos que tienen la opcion Con Pokewalker
const JUEGOS_CON_POKEWALKER = ['Oro HeartGold', 'Plata SoulSilver'];

// Mapeo de nombres de juegos a claves de traducción
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

function MisJuegosModal({ show, onHide, juegosDisponibles, standalone = false }) {
  const { isDark } = useSettings();
  const { t } = useTranslation();
  const [misJuegos, setMisJuegos] = useState([]);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState('');
  const [estado, setEstado] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [juegoAEliminar, setJuegoAEliminar] = useState(null);

  // Helper para obtener juegoId desde juegoNombre
  const getJuegoIdFromNombre = (nombre) => {
    const juego = juegosDisponibles.find(j => j.nombre === nombre);
    return juego ? juego.id.toString() : '';
  };

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
        setError(t('myGames.errorLoading'));
      }
    } catch {
      setError(t('myGames.connectionError'));
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
    const labelKey = todosLosEstados[estadoKey] || estadoKey;
    return t(labelKey);
  };

  const precioMercadoPreview = getPrecioMercado();

  const agregarJuego = async () => {
    if (!juegoSeleccionado || !estado) {
      setError(t('myGames.selectGameAndState'));
      return;
    }

    const juegoInfo = juegosDisponibles.find(j => j.id === parseInt(juegoSeleccionado));
    if (!juegoInfo) return;

    const precioMercado = juegoInfo.precios[estado];
    if (precioMercado === undefined) return;

    const precioCompraValor = precioCompra !== '' && !isNaN(parseFloat(precioCompra)) ? parseFloat(precioCompra) : null;

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
        setEstado('');
        setPrecioCompra('');
        setFechaCompra('');
      } else {
        setError(t('myGames.errorAdding'));
      }
    } catch {
      setError(t('myGames.errorAddingConnection'));
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
    if (!editando || !juegoSeleccionado || !estado) {
      setError(t('myGames.selectGameAndState'));
      return;
    }

    const juegoInfo = juegosDisponibles.find(j => j.id === parseInt(juegoSeleccionado));
    if (!juegoInfo) return;

    const precioMercado = juegoInfo.precios[estado];
    if (precioMercado === undefined) return;

    const precioCompraValor = precioCompra !== '' && !isNaN(parseFloat(precioCompra)) ? parseFloat(precioCompra) : null;

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
        setEstado('');
        setPrecioCompra('');
        setFechaCompra('');
      } else {
        setError(t('myGames.errorEditing'));
      }
    } catch {
      setError(t('myGames.errorEditingConnection'));
    }
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setJuegoSeleccionado('');
    setEstado('');
    setPrecioCompra('');
    setFechaCompra('');
  };

  const mostrarConfirmacionEliminar = (id) => {
    setJuegoAEliminar(id);
    setShowConfirmModal(true);
  };

  const confirmarEliminar = async () => {
    if (!juegoAEliminar) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/juegos-usuario/${juegoAEliminar}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await cargarJuegos();
        setShowConfirmModal(false);
        setJuegoAEliminar(null);
      } else {
        setError(t('myGames.errorDeleting'));
      }
    } catch {
      setError(t('myGames.errorDeletingConnection'));
    }
  };

  const cancelarEliminar = () => {
    setShowConfirmModal(false);
    setJuegoAEliminar(null);
  };

  // Solo calcular beneficios para juegos con precio de compra definido
  const juegosConPrecio = misJuegos.filter(j => j.precioCompra !== null && j.precioCompra !== undefined);
  const totalInvertido = juegosConPrecio.reduce((sum, j) => sum + j.precioCompra, 0);
  const totalMercado = juegosConPrecio.reduce((sum, j) => sum + j.precioMercado, 0);
  const beneficio = totalMercado - totalInvertido;

  const content = (
    <>
      {standalone && (
        <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: isDark ? '#23252f' : '#f8f9fa' }}>
          <Card.Body>
            <h4 className="fw-bold mb-0" style={{ color: isDark ? '#e8eaed' : '#333' }}>{t('myGames.title')}</h4>
          </Card.Body>
        </Card>
      )}
      
      {!standalone && (
        <Modal.Header
          closeButton
          style={{
            background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
            borderBottom: '3px solid #e65100'
          }}
        >
          <Modal.Title className="fw-bold text-white">
            {t('myGames.title')}
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
          <div className="text-center py-4">
            <Spinner animation="border" variant="warning" />
            <p className="mt-2 text-muted">{t('myGames.loading')}</p>
          </div>
        ) : (
          <>
        {/* Resumen */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center border-0 shadow-sm" style={{ backgroundColor: isDark ? '#1e293b' : '#e3f2fd' }}>
              <Card.Body>
                <h6 className="text-muted mb-2" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>{t('myGames.totalInvested')}</h6>
                <h4 className="fw-bold text-primary mb-0">{totalInvertido.toFixed(2)} €</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center border-0 shadow-sm" style={{ backgroundColor: isDark ? '#1e293b' : '#e8f5e9' }}>
              <Card.Body>
                <h6 className="text-muted mb-2" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>{t('myGames.marketValue')}</h6>
                <h4 className="fw-bold text-success mb-0">{totalMercado.toFixed(2)} €</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center border-0 shadow-sm" style={{
              backgroundColor: isDark ? (beneficio >= 0 ? '#2a2520' : '#2a2020') : (beneficio >= 0 ? '#fff3e0' : '#ffebee')
            }}>
              <Card.Body>
                <h6 className="text-muted mb-2" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>{t('myGames.profit')}</h6>
                <h4 className="fw-bold mb-0" style={{ color: beneficio >= 0 ? (isDark ? '#ffb74d' : '#e65100') : (isDark ? '#f5a3a3' : '#c62828') }}>
                  {beneficio >= 0 ? '+' : ''}{beneficio.toFixed(2)} €
                </h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Formulario para agregar */}
        <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: isDark ? '#23252f' : '#f8f9fa' }}>
          <Card.Body>
            <h5 className="fw-bold mb-3" style={{ color: isDark ? '#e8eaed' : '#333' }}>{editando ? t('myGames.editGame') : t('myGames.addGame')}</h5>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label className="fw-semibold small">
                  {t('myGames.game')} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={juegoSeleccionado}
                  onChange={(e) => setJuegoSeleccionado(e.target.value)}
                  className="border-2"
                  style={{ borderRadius: '10px' }}
                >
                  <option value="">{t('myGames.selectGameDropdown')}</option>
                  {juegosDisponibles.map(j => (
                    <option key={j.id} value={j.id}>Pokemon {j.nombreKey ? t(j.nombreKey) : j.nombre}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label className="fw-semibold small">
                  {t('myGames.state')} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="border-2"
                  style={{ borderRadius: '10px' }}
                >
                  <option value="">{t('myGames.selectState')}</option>
                  {Object.entries(getEstadosDisponibles()).map(([key, labelKey]) => (
                    <option key={key} value={key}>{t(labelKey)}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label className="fw-semibold small">{t('myGames.purchaseDateFull')}</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaCompra}
                  onChange={(e) => setFechaCompra(e.target.value)}
                  className="border-2"
                  style={{ borderRadius: '10px' }}
                />
              </Col>
              <Col md={2}>
                <Form.Label className="fw-semibold small">{t('myGames.purchasePriceFull')}</Form.Label>
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
                <Form.Label className="fw-semibold small text-success">{t('myGames.marketPrice')}</Form.Label>
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
                      {t('myGames.save')}
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={cancelarEdicion}
                      className="fw-bold"
                      style={{ borderRadius: '10px' }}
                    >
                      {t('myGames.cancelButtonX')}
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
                    {t('myGames.addButton')}
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabla de juegos */}
        {misJuegos.length === 0 ? (
          <Alert variant="info" className="text-center border-0 rounded-3">
            {t('myGames.noGamesModal')}
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead style={{ backgroundColor: isDark ? '#1a1b23' : '#f8f9fa' }}>
                <tr>
                  <th className="fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>{t('myGames.gameColumn')}</th>
                  <th className="fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>{t('myGames.stateColumn')}</th>
                  <th className="fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>{t('myGames.registrationTime')}</th>
                  <th className="fw-bold text-end" style={{ color: isDark ? '#e8eaed' : '#333' }}>{t('myGames.purchasePriceColumn')}</th>
                  <th className="fw-bold text-end" style={{ color: isDark ? '#e8eaed' : '#333' }}>{t('myGames.marketPriceColumn')}</th>
                  <th className="fw-bold text-end" style={{ color: isDark ? '#e8eaed' : '#333' }}>{t('myGames.difference')}</th>
                  <th className="fw-bold text-center" style={{ color: isDark ? '#e8eaed' : '#333' }}>{t('myGames.action')}</th>
                </tr>
              </thead>
              <tbody>
                {misJuegos.map((juego) => {
                  const diferencia = juego.precioCompra ? juego.precioMercado - juego.precioCompra : null;
                  return (
                    <tr key={juego.id} style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                      <td>
                        <div className="fw-semibold" style={{ color: isDark ? '#e8eaed' : '#333' }}>Pokemon {t(JUEGOS_TRADUCCIONES[juego.juegoNombre] || juego.juegoNombre)}</div>
                        <Badge bg="secondary" className="rounded-pill">{juego.generacion}</Badge>
                      </td>
                      <td>
                        <small className="text-muted" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>{getEstadoLabel(juego.estado)}</small>
                      </td>
                      <td>
                        <small className="text-muted" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>{juego.horaRegistro ? juego.horaRegistro : '-'}</small>
                      </td>
                      <td className="text-end fw-semibold" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                        {juego.precioCompra ? `${juego.precioCompra.toFixed(2)} €` : '-'}
                      </td>
                      <td className="text-end" style={{ color: isDark ? '#e8eaed' : '#333' }}>{juego.precioMercado.toFixed(2)} €</td>
                      <td className="text-end">
                        {diferencia !== null ? (
                          <span className={diferencia >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                            {diferencia >= 0 ? '+' : ''}{diferencia.toFixed(2)} €
                          </span>
                        ) : (
                          <span className="text-muted" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>{t('myGames.notCalculated')}</span>
                        )}
                      </td>
                      <td className="text-center">
                        <Button 
                          variant="warning" 
                          size="sm"
                          onClick={() => iniciarEdicion(juego)}
                          className="rounded-pill me-2"
                        >
                          {t('myGames.edit')}
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => mostrarConfirmacionEliminar(juego.id)}
                          className="rounded-pill"
                        >
                          {t('myGames.delete')}
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
      </div>

      {!standalone && (
        <Modal.Footer className="border-top-0">
          <Button variant="secondary" onClick={onHide} className="rounded-pill px-4">
            {t('myGames.closeModal')}
          </Button>
        </Modal.Footer>
      )}

      {/* Modal de Confirmación Eliminar */}
      <Modal show={showConfirmModal} onHide={cancelarEliminar} centered>
        <Modal.Header
          style={{
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            borderBottom: '3px solid #a71e2a'
          }}
        >
          <Modal.Title className="fw-bold text-white">
            {t('myGames.deleteGame')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="mb-0">{t('myGames.deleteConfirmation')}</p>
          <p className="text-danger fw-bold mt-2 mb-0">{t('myGames.deleteWarning')}</p>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="secondary" onClick={cancelarEliminar} className="rounded-pill px-4">
            {t('myGames.cancel')}
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmarEliminar} 
            className="rounded-pill px-4 fw-bold"
            style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' }}
          >
            {t('myGames.confirmDelete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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

export default MisJuegosModal;
