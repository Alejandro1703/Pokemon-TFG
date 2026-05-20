import { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, Table, Row, Col, Alert, Spinner, Modal, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSettings, useTranslation } from '../contexts/SettingsContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://pokemon-tfg-backend.onrender.com';

const METODOS = [
  { key: 'Soft-Reset', labelKey: 'shinyHunting.method.softReset' },
  { key: 'Masuda', labelKey: 'shinyHunting.method.masuda' },
  { key: 'Poke-Radar', labelKey: 'shinyHunting.method.pokeRadar' },
  { key: 'Pesca encadenada', labelKey: 'shinyHunting.method.chainFishing' },
  { key: 'Hordas', labelKey: 'shinyHunting.method.hordes' },
  { key: 'Huidas', labelKey: 'shinyHunting.method.runaways' },
];

const JUEGOS = [
  'Rojo Fuego', 'Verde Hoja', 'Rubi', 'Zafiro', 'Esmeralda',
  'Diamante', 'Perla', 'Platino', 'Oro HeartGold', 'Plata SoulSilver',
  'Negro', 'Blanco', 'Negro 2', 'Blanco 2'
];

// Máximo número de Pokémon disponible por juego/generación
const JUEGO_MAX_POKEMON = {
  'Rojo Fuego': 386,
  'Verde Hoja': 386,
  'Rubi': 386,
  'Zafiro': 386,
  'Esmeralda': 386,
  'Diamante': 493,
  'Perla': 493,
  'Platino': 493,
  'Oro HeartGold': 493,
  'Plata SoulSilver': 493,
  'Negro': 649,
  'Blanco': 649,
  'Negro 2': 649,
  'Blanco 2': 649,
};

function ShinyHuntingPage() {
  const { isDark } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pokemonNombre, setPokemonNombre] = useState('');
  const [fechaEncuentro, setFechaEncuentro] = useState('');
  const [intentos, setIntentos] = useState('');
  const [metodo, setMetodo] = useState('');
  const [tiempoPorIntento, setTiempoPorIntento] = useState('');
  const [juegoNombre, setJuegoNombre] = useState('');
  const [editando, setEditando] = useState(null);

  const [pokemonList, setPokemonList] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [spriteUrl, setSpriteUrl] = useState('');
  const pokemonInputRef = useRef(null);
  const sugerenciasRef = useRef(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [registroAEliminar, setRegistroAEliminar] = useState(null);
  const [showGuia, setShowGuia] = useState(false);

  // Cargar lista de Pokémon desde PokeAPI
  useEffect(() => {
    const cargarPokemon = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=649');
        const data = await res.json();
        const lista = data.results.map((p, idx) => ({
          name: p.name,
          id: idx + 1,
        }));
        setPokemonList(lista);
      } catch {
        // si falla, se queda vacío y el input funciona como texto libre
      }
    };
    cargarPokemon();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    cargarRegistros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sugerenciasRef.current &&
        !sugerenciasRef.current.contains(e.target) &&
        pokemonInputRef.current &&
        !pokemonInputRef.current.contains(e.target)
      ) {
        setShowSugerencias(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const obtenerSprite = (name) => {
    const found = pokemonList.find(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (found) {
      setSpriteUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${found.id}.png`);
    } else {
      setSpriteUrl('');
    }
  };

  const handlePokemonInput = (value) => {
    setPokemonNombre(value);
    if (value.length >= 2) {
      const maxId = juegoNombre ? (JUEGO_MAX_POKEMON[juegoNombre] || 649) : 649;
      const filtrados = pokemonList
        .filter((p) => p.id <= maxId && p.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
      setSugerencias(filtrados);
      setShowSugerencias(true);
    } else {
      setSugerencias([]);
      setShowSugerencias(false);
    }
    obtenerSprite(value);
  };

  const seleccionarPokemon = (name) => {
    setPokemonNombre(name);
    setShowSugerencias(false);
    obtenerSprite(name);
  };

  const validarGeneracion = () => {
    if (!juegoNombre) return true;
    const maxId = JUEGO_MAX_POKEMON[juegoNombre];
    if (!maxId) return true;
    const found = pokemonList.find(
      (p) => p.name.toLowerCase() === pokemonNombre.trim().toLowerCase()
    );
    if (!found) return true;
    if (found.id > maxId) {
      const msg = t('shinyHunting.pokemonNotInGeneration')
        .replace('{pokemon}', pokemonNombre)
        .replace('{game}', juegoNombre);
      setError(msg);
      return false;
    }
    return true;
  };

  const cargarRegistros = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/shiny-hunting`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRegistros(data);
      } else {
        setError(t('shinyHunting.errorLoading'));
      }
    } catch {
      setError(t('shinyHunting.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const resetFormulario = () => {
    setPokemonNombre('');
    setFechaEncuentro('');
    setIntentos('');
    setMetodo('');
    setTiempoPorIntento('');
    setJuegoNombre('');
    setSpriteUrl('');
    setEditando(null);
  };

  const agregarRegistro = async () => {
    if (!pokemonNombre || !intentos || !metodo) return;
    if (!validarGeneracion()) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/shiny-hunting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pokemonNombre,
          fechaEncuentro: fechaEncuentro || null,
          intentos: parseInt(intentos, 10),
          metodo,
          tiempoPorIntento: tiempoPorIntento ? parseInt(tiempoPorIntento, 10) : null,
          juegoNombre: juegoNombre || null,
        }),
      });
      if (response.ok) {
        await cargarRegistros();
        resetFormulario();
      } else {
        const errText = await response.text();
        setError(errText || t('shinyHunting.errorAdding'));
      }
    } catch {
      setError(t('shinyHunting.errorAdding'));
    }
  };

  const iniciarEdicion = (registro) => {
    setEditando(registro);
    setPokemonNombre(registro.pokemonNombre);
    setFechaEncuentro(registro.fechaEncuentro || '');
    setIntentos(registro.intentos.toString());
    setMetodo(registro.metodo);
    setTiempoPorIntento(registro.tiempoPorIntento ? registro.tiempoPorIntento.toString() : '');
    setJuegoNombre(registro.juegoNombre || '');
    obtenerSprite(registro.pokemonNombre);
  };

  const guardarEdicion = async () => {
    if (!editando || !pokemonNombre || !intentos || !metodo) return;
    if (!validarGeneracion()) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/shiny-hunting/${editando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pokemonNombre,
          fechaEncuentro: fechaEncuentro || null,
          intentos: parseInt(intentos, 10),
          metodo,
          tiempoPorIntento: tiempoPorIntento ? parseInt(tiempoPorIntento, 10) : null,
          juegoNombre: juegoNombre || null,
        }),
      });
      if (response.ok) {
        await cargarRegistros();
        resetFormulario();
      } else {
        const errText = await response.text();
        setError(errText || t('shinyHunting.errorEditing'));
      }
    } catch {
      setError(t('shinyHunting.errorEditing'));
    }
  };

  const mostrarConfirmacionEliminar = (id) => {
    setRegistroAEliminar(id);
    setShowConfirmModal(true);
  };

  const confirmarEliminar = async () => {
    if (!registroAEliminar) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/shiny-hunting/${registroAEliminar}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        await cargarRegistros();
      } else {
        setError(t('shinyHunting.errorDeleting'));
      }
    } catch {
      setError(t('shinyHunting.errorDeleting'));
    } finally {
      setShowConfirmModal(false);
      setRegistroAEliminar(null);
    }
  };

  const cancelarEliminar = () => {
    setShowConfirmModal(false);
    setRegistroAEliminar(null);
  };

  const totalIntentos = registros.reduce((sum, r) => sum + (r.intentos || 0), 0);
  const totalTiempoMinutos = registros.reduce((sum, r) => sum + ((r.intentos || 0) * (r.tiempoPorIntento || 0)), 0);
  const totalTiempoHoras = totalTiempoMinutos > 0 ? (totalTiempoMinutos / 60).toFixed(1) : 0;

  const getPokemonSpriteForTable = (name) => {
    const found = pokemonList.find((p) => p.name.toLowerCase() === name.toLowerCase());
    return found ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${found.id}.png` : '';
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h2
            className="fw-bold mb-2"
            style={{
              color: isDark ? '#e8eaed' : '#333',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {t('shinyHunting.title')}
          </h2>
          <p className="text-secondary fs-5" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>
            {t('shinyHunting.description')}
          </p>
        </div>

        {/* Guía Shiny Hunting */}
        <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: isDark ? '#23252f' : '#f8f9fa' }}>
          <Card.Body className="p-0">
            <button
              onClick={() => setShowGuia(!showGuia)}
              className="w-100 text-start fw-bold border-0 d-flex align-items-center justify-content-between px-4 py-3"
              style={{
                borderRadius: '12px',
                background: isDark
                  ? 'linear-gradient(135deg, #536dfe 0%, #3d4fe0 100%)'
                  : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: '#fff',
                fontSize: '1.05rem',
                cursor: 'pointer',
              }}
            >
              <span>{t('shinyHunting.guideTitle')}</span>
              <span style={{ fontSize: '1.2rem', transform: showGuia ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                ▼
              </span>
            </button>
            <Collapse in={showGuia}>
              <div className="px-4 py-3">
                <p className="mb-3" style={{ color: isDark ? '#c8ccd4' : '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {t('shinyHunting.guideIntro')}
                </p>
                <p className="fw-semibold mb-2" style={{ color: isDark ? '#e8eaed' : '#333', fontSize: '1rem' }}>
                  {t('shinyHunting.guideIntro2')}
                </p>

                <div className="mb-3">
                  <h6 className="fw-bold" style={{ color: isDark ? '#64b5f6' : '#1976d2' }}>{t('shinyHunting.method1Title')}</h6>
                  <p className="mb-1" style={{ color: isDark ? '#c8ccd4' : '#555', fontSize: '0.9rem' }}>
                    {t('shinyHunting.method1Desc')}
                  </p>
                  <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: isDark ? '#2e3040' : '#e3f2fd', color: isDark ? '#64b5f6' : '#1976d2', fontSize: '0.8rem' }}>
                    {t('shinyHunting.method1Prob')}
                  </span>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold" style={{ color: isDark ? '#81c784' : '#388e3c' }}>{t('shinyHunting.method2Title')}</h6>
                  <p className="mb-1" style={{ color: isDark ? '#c8ccd4' : '#555', fontSize: '0.9rem' }}>
                    {t('shinyHunting.method2Desc')}
                  </p>
                  <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: isDark ? '#2e3040' : '#e8f5e9', color: isDark ? '#81c784' : '#388e3c', fontSize: '0.8rem' }}>
                    {t('shinyHunting.method2Prob')}
                  </span>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold" style={{ color: isDark ? '#ffb74d' : '#f57c00' }}>{t('shinyHunting.method3Title')}</h6>
                  <p className="mb-1" style={{ color: isDark ? '#c8ccd4' : '#555', fontSize: '0.9rem' }}>
                    {t('shinyHunting.method3Desc')}
                  </p>
                  <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: isDark ? '#2e3040' : '#fff3e0', color: isDark ? '#ffb74d' : '#f57c00', fontSize: '0.8rem' }}>
                    {t('shinyHunting.method3Prob')}
                  </span>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold" style={{ color: isDark ? '#4dd0e1' : '#00838f' }}>{t('shinyHunting.method4Title')}</h6>
                  <p className="mb-1" style={{ color: isDark ? '#c8ccd4' : '#555', fontSize: '0.9rem' }}>
                    {t('shinyHunting.method4Desc')}
                  </p>
                  <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: isDark ? '#2e3040' : '#e0f7fa', color: isDark ? '#4dd0e1' : '#00838f', fontSize: '0.8rem' }}>
                    {t('shinyHunting.method4Prob')}
                  </span>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold" style={{ color: isDark ? '#ba68c8' : '#7b1fa2' }}>{t('shinyHunting.method5Title')}</h6>
                  <p className="mb-1" style={{ color: isDark ? '#c8ccd4' : '#555', fontSize: '0.9rem' }}>
                    {t('shinyHunting.method5Desc')}
                  </p>
                  <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: isDark ? '#2e3040' : '#f3e5f5', color: isDark ? '#ba68c8' : '#7b1fa2', fontSize: '0.8rem' }}>
                    {t('shinyHunting.method5Prob')}
                  </span>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold" style={{ color: isDark ? '#ef5350' : '#c62828' }}>{t('shinyHunting.method6Title')}</h6>
                  <p className="mb-1" style={{ color: isDark ? '#c8ccd4' : '#555', fontSize: '0.9rem' }}>
                    {t('shinyHunting.method6Desc')}
                  </p>
                  <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: isDark ? '#2e3040' : '#ffebee', color: isDark ? '#ef5350' : '#c62828', fontSize: '0.8rem' }}>
                    {t('shinyHunting.method6Prob')}
                  </span>
                </div>

                {/* Tabla comparativa */}
                <div className="mt-4">
                  <h6 className="fw-bold mb-2" style={{ color: isDark ? '#e8eaed' : '#333' }}>{t('shinyHunting.probTableTitle')}</h6>
                  <div className="table-responsive">
                    <Table bordered size="sm" className="mb-0" style={{ fontSize: '0.85rem' }}>
                      <thead style={{ backgroundColor: isDark ? '#1a1b23' : '#f8f9fa' }}>
                        <tr>
                          <th style={{ color: isDark ? '#e8eaed' : '#333', width: '30%' }}>{t('shinyHunting.probTableMethod')}</th>
                          <th style={{ color: isDark ? '#e8eaed' : '#333', width: '35%' }}>{t('shinyHunting.probTableBase')}</th>
                          <th style={{ color: isDark ? '#e8eaed' : '#333', width: '35%' }}>{t('shinyHunting.probTableCharm')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>{t('shinyHunting.probRowNormal')}</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 4.096</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 1.365</td>
                        </tr>
                        <tr>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>{t('shinyHunting.probRowRunaways')}</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 4.096</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 1.365</td>
                        </tr>
                        <tr>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>{t('shinyHunting.probRowMasuda')}</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 683</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 512</td>
                        </tr>
                        <tr>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>{t('shinyHunting.probRowHordes')}</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 819</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 273</td>
                        </tr>
                        <tr>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>{t('shinyHunting.probRowRadar')}</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 200</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 200</td>
                        </tr>
                        <tr>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>{t('shinyHunting.probRowFish')}</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 100</td>
                          <td style={{ color: isDark ? '#d0d0d0' : '#555' }}>1 / 96</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: isDark ? '#2a2520' : '#fff3e0', borderLeft: '4px solid #ff9800' }}>
                  <p className="fw-semibold mb-0" style={{ color: isDark ? '#ffb74d' : '#e65100', fontSize: '0.9rem' }}>
                    {t('shinyHunting.guideFinalTip')}
                  </p>
                </div>
              </div>
            </Collapse>
          </Card.Body>
        </Card>

        {/* Resumen */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center border-0 shadow-sm" style={{ backgroundColor: isDark ? '#1e293b' : '#e3f2fd' }}>
              <Card.Body>
                <h6 className="text-muted mb-2" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>
                  {t('shinyHunting.totalRecords')}
                </h6>
                <h4 className="fw-bold text-primary mb-0">{registros.length}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center border-0 shadow-sm" style={{ backgroundColor: isDark ? '#1e293b' : '#e8f5e9' }}>
              <Card.Body>
                <h6 className="text-muted mb-2" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>
                  {t('shinyHunting.totalAttempts')}
                </h6>
                <h4 className="fw-bold text-success mb-0">{totalIntentos.toLocaleString()}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center border-0 shadow-sm" style={{ backgroundColor: isDark ? '#2a2520' : '#fff3e0' }}>
              <Card.Body>
                <h6 className="text-muted mb-2" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>
                  {t('shinyHunting.estimatedTime')}
                </h6>
                <h4 className="fw-bold mb-0" style={{ color: isDark ? '#ffb74d' : '#e65100' }}>
                  {totalTiempoHoras} {t('shinyHunting.hours')}
                </h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Formulario */}
        <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: isDark ? '#23252f' : '#f8f9fa' }}>
          <Card.Body>
            <h5 className="fw-bold mb-3" style={{ color: isDark ? '#e8eaed' : '#333' }}>
              {editando ? t('shinyHunting.editRegister') : t('shinyHunting.addRegister')}
            </h5>
            {error && (
              <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}
            <Row className="g-2 align-items-end">
              <Col md={2}>
                <Form.Label className="fw-semibold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                  {t('shinyHunting.pokemon')} <span className="text-danger">*</span>
                </Form.Label>
                <div className="position-relative">
                  <div className="d-flex align-items-center gap-1">
                    {spriteUrl && (
                      <img
                        src={spriteUrl}
                        alt="sprite"
                        style={{ width: '32px', height: '32px', imageRendering: 'pixelated', flexShrink: 0 }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <Form.Control
                      ref={pokemonInputRef}
                      type="text"
                      value={pokemonNombre}
                      onChange={(e) => handlePokemonInput(e.target.value)}
                      onFocus={() => { if (pokemonNombre.length >= 2) setShowSugerencias(true); }}
                      placeholder={t('shinyHunting.pokemonPlaceholder')}
                      className="border-2"
                      autoComplete="off"
                      style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333', fontSize: '0.85rem' }}
                    />
                  </div>
                  {showSugerencias && sugerencias.length > 0 && (
                    <div
                      ref={sugerenciasRef}
                      className="position-absolute w-100 mt-1 rounded-3 shadow"
                      style={{
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        backgroundColor: isDark ? '#1a1b23' : '#fff',
                        border: isDark ? '1px solid #2e303a' : '1px solid #dee2e6',
                      }}
                    >
                      {sugerencias.map((p) => (
                        <div
                          key={p.id}
                          className="d-flex align-items-center gap-2 px-3 py-2"
                          style={{
                            cursor: 'pointer',
                            borderBottom: isDark ? '1px solid #2e303a' : '1px solid #f0f0f0',
                            color: isDark ? '#e8eaed' : '#333',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? '#2e3040' : '#f8f9fa'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          onClick={() => seleccionarPokemon(p.name)}
                        >
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                            alt={p.name}
                            style={{ width: '28px', height: '28px', imageRendering: 'pixelated' }}
                          />
                          <span className="text-capitalize">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
              <Col md={2}>
                <Form.Label className="fw-semibold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                  {t('shinyHunting.date')}
                </Form.Label>
                <Form.Control
                  type="date"
                  value={fechaEncuentro}
                  onChange={(e) => setFechaEncuentro(e.target.value)}
                  className="border-2"
                  style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333', fontSize: '0.85rem' }}
                />
              </Col>
              <Col md={1}>
                <Form.Label className="fw-semibold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                  {t('shinyHunting.attempts')} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={intentos}
                  onChange={(e) => setIntentos(e.target.value)}
                  placeholder={t('shinyHunting.attemptsPlaceholder')}
                  min="0"
                  className="border-2"
                  style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333', fontSize: '0.85rem' }}
                />
              </Col>
              <Col md={2}>
                <Form.Label className="fw-semibold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                  {t('shinyHunting.method')} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value)}
                  className="border-2"
                  style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333', fontSize: '0.85rem' }}
                >
                  <option value="">{t('shinyHunting.selectMethod')}</option>
                  {METODOS.map((m) => (
                    <option key={m.key} value={m.key}>
                      {t(m.labelKey)}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label className="fw-semibold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                  {t('shinyHunting.game')}
                </Form.Label>
                <Form.Select
                  value={juegoNombre}
                  onChange={(e) => {
                    setJuegoNombre(e.target.value);
                    // Refiltrar sugerencias si hay texto en el input
                    if (pokemonNombre.length >= 2) {
                      const maxId = e.target.value ? (JUEGO_MAX_POKEMON[e.target.value] || 649) : 649;
                      const filtrados = pokemonList
                        .filter((p) => p.id <= maxId && p.name.toLowerCase().includes(pokemonNombre.toLowerCase()))
                        .slice(0, 8);
                      setSugerencias(filtrados);
                    }
                  }}
                  className="border-2"
                  style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333', fontSize: '0.85rem' }}
                >
                  <option value="">{t('shinyHunting.selectGame')}</option>
                  {JUEGOS.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={1}>
                <Form.Label className="fw-semibold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                  {t('shinyHunting.timePerAttempt')}
                </Form.Label>
                <Form.Control
                  type="number"
                  value={tiempoPorIntento}
                  onChange={(e) => setTiempoPorIntento(e.target.value)}
                  placeholder={t('shinyHunting.timePerAttemptPlaceholder')}
                  min="0"
                  className="border-2"
                  style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333', fontSize: '0.85rem' }}
                />
              </Col>
              <Col md={2} className="d-flex align-items-end">
                {editando ? (
                  <div className="d-flex gap-2 w-100">
                    <Button
                      onClick={guardarEdicion}
                      disabled={!pokemonNombre || !intentos || !metodo}
                      className="flex-grow-1 fw-bold border-0"
                      style={{
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                        fontSize: '0.85rem',
                      }}
                    >
                      {t('shinyHunting.save')}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={resetFormulario}
                      className="fw-bold"
                      style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                    >
                      {t('shinyHunting.cancel')}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={agregarRegistro}
                    disabled={!pokemonNombre || !intentos || !metodo}
                    className="w-100 fw-bold border-0"
                    style={{
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {t('shinyHunting.addRegister')}
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="warning" />
            <p className="mt-2 text-muted" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>
              {t('shinyHunting.loading')}
            </p>
          </div>
        ) : registros.length === 0 ? (
          <Alert variant="info" className="text-center border-0 rounded-3">
            {t('shinyHunting.noRegisters')}
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead style={{ backgroundColor: isDark ? '#1a1b23' : '#f8f9fa' }}>
                <tr>
                  <th className="fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                    {t('shinyHunting.tablePokemon')}
                  </th>
                  <th className="fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                    {t('shinyHunting.tableGame')}
                  </th>
                  <th className="fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                    {t('shinyHunting.tableDate')}
                  </th>
                  <th className="fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                    {t('shinyHunting.tableAttempts')}
                  </th>
                  <th className="fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                    {t('shinyHunting.tableMethod')}
                  </th>
                  <th className="fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                    {t('shinyHunting.tableTimePerAttempt')}
                  </th>
                  <th className="fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                    {t('shinyHunting.registrationDate')}
                  </th>
                  <th className="fw-bold text-center" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                    {t('shinyHunting.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => {
                  const sprite = getPokemonSpriteForTable(registro.pokemonNombre);
                  return (
                    <tr key={registro.id} style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {sprite && (
                            <img
                              src={sprite}
                              alt={registro.pokemonNombre}
                              style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <span className="fw-semibold text-capitalize" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                            {registro.pokemonNombre}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                        {registro.juegoNombre || '-'}
                      </td>
                      <td style={{ color: isDark ? '#c8ccd4' : '#333' }}>{registro.fechaEncuentro || '-'}</td>
                      <td style={{ color: isDark ? '#c8ccd4' : '#333' }}>{registro.intentos.toLocaleString()}</td>
                      <td>
                        <span
                          className="badge rounded-pill px-3 py-2"
                          style={{
                            background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                            color: '#333',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}
                        >
                          {registro.metodo}
                        </span>
                      </td>
                      <td style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                        {registro.tiempoPorIntento ? `${registro.tiempoPorIntento} min` : '-'}
                      </td>
                      <td style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>
                        {registro.fechaRegistro}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => iniciarEdicion(registro)}
                          className="rounded-pill me-2"
                        >
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => mostrarConfirmacionEliminar(registro.id)}
                          className="rounded-pill"
                        >
                          {t('common.delete')}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Modal de confirmación eliminar */}
      <Modal show={showConfirmModal} onHide={cancelarEliminar} centered>
        <Modal.Header
          style={{
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            borderBottom: '3px solid #a71e2a',
          }}
        >
          <Modal.Title className="fw-bold text-white">
            {t('common.delete')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="mb-0">{t('shinyHunting.deleteConfirm')}</p>
          <p className="text-danger fw-bold mt-2 mb-0">{t('shinyHunting.deleteWarning')}</p>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="secondary" onClick={cancelarEliminar} className="rounded-pill px-4">
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={confirmarEliminar}
            className="rounded-pill px-4 fw-bold"
            style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' }}
          >
            {t('common.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
}

export default ShinyHuntingPage;
