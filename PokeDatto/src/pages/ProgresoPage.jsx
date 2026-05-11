import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, Spinner, Row, Col, Nav, ProgressBar, Badge } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSettings, useTranslation } from '../contexts/SettingsContext';
import { getBadgesForGame, getRegionForGame } from '../components/adventure/gameData';

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

function ProgresoPage() {
  const { t } = useTranslation();
  const { isDark } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('adventures');
  const [misJuegos, setMisJuegos] = useState([]);
  const [shinyData, setShinyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.username || 'default';
    } catch {
      return 'default';
    }
  })();

  // Cargar juegos del usuario y shiny hunting
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [juegosRes, shinyRes] = await Promise.all([
          fetch(`${API_URL}/api/juegos-usuario`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_URL}/api/shiny-hunting`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        if (juegosRes.ok) setMisJuegos(await juegosRes.json());
        if (shinyRes.ok) setShinyData(await shinyRes.json());
      } catch {
        console.error('Error cargando datos');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  // Obtener datos de aventura de localStorage para un juego
  const getAdventureData = useCallback((juegoNombre) => {
    const key = `adventure_${username}_${juegoNombre}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [username]);

  // Juegos únicos (por nombre)
  const juegosUnicos = misJuegos.filter((j, i, arr) =>
    arr.findIndex(x => x.juegoNombre === j.juegoNombre) === i
  );

  // Juegos con aventura iniciada
  const juegosConAventura = juegosUnicos.filter(j => getAdventureData(j.juegoNombre));

  // Estadísticas globales
  const globalStats = (() => {
    let totalBadges = 0;
    let totalPokemon = 0;
    let totalItems = 0;
    let maxBadges = 0;
    let bestGame = null;
    const regionStats = {};

    juegosConAventura.forEach(j => {
      const data = getAdventureData(j.juegoNombre);
      const badges = data.earnedBadges?.length || 0;
      const allBadges = getBadgesForGame(j.juegoNombre);
      const pokemon = data.pokemonBoxes?.reduce((sum, box) =>
        sum + (box.slots?.filter(s => s !== null).length || 0), 0) || 0;
      const items = Object.values(data.backpack || {}).reduce((sum, arr) =>
        sum + (Array.isArray(arr) ? arr.length : 0), 0);

      totalBadges += badges;
      totalPokemon += pokemon;
      totalItems += items;

      if (badges > maxBadges) {
        maxBadges = badges;
        bestGame = j.juegoNombre;
      }

      const region = getRegionForGame(j.juegoNombre);
      if (!regionStats[region.key]) {
        regionStats[region.key] = { name: region.name, badges: 0, total: allBadges.length };
      }
      regionStats[region.key].badges += badges;
    });

    const totalShiny = shinyData.length;
    const totalAttempts = shinyData.reduce((sum, s) => sum + (s.intentos || 0), 0);

    return { totalBadges, totalPokemon, totalItems, bestGame, maxBadges, regionStats, totalShiny, totalAttempts };
  })();

  const textPrimary = isDark ? '#e8eaed' : '#1f2937';
  const textSecondary = isDark ? '#9ca3af' : '#6c757d';
  const cardBg = isDark ? '#23252f' : '#ffffff';
  const cardBorder = isDark ? '#2e303a' : '#e5e7eb';
  const tabActiveBg = isDark ? '#536dfe' : '#1976d2';
  const tabInactiveBg = isDark ? '#1a1b23' : '#f8f9fa';

  const StatCard = ({ icon, title, value, color }) => (
    <Col xs={6} sm={4} lg={2} className="mb-3">
      <div className="rounded-4 p-3 text-center h-100" style={{ backgroundColor: cardBg, border: `2px solid ${color}30` }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{icon}</div>
        <h5 className="fw-bold mb-1" style={{ color, fontSize: '1.4rem' }}>{value}</h5>
        <small style={{ color: textSecondary, fontSize: '0.75rem' }}>{title}</small>
      </div>
    </Col>
  );

  const BarChart = ({ data }) => {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    return (
      <div className="d-flex flex-column gap-2">
        {data.map((d, i) => (
          <div key={i} className="d-flex align-items-center gap-2">
            <small className="text-end flex-shrink-0" style={{ width: '80px', color: textSecondary, fontSize: '0.75rem' }}>
              {d.label}
            </small>
            <div className="flex-grow-1 rounded-pill" style={{ height: '18px', backgroundColor: isDark ? '#2e303a' : '#e5e7eb', overflow: 'hidden' }}>
              <div className="h-100 rounded-pill d-flex align-items-center justify-content-end px-2"
                style={{
                  width: `${(d.value / maxVal) * 100}%`,
                  backgroundColor: d.color,
                  minWidth: d.value > 0 ? '30px' : '0',
                  transition: 'width 0.5s ease'
                }}
              >
                {d.value > 0 && <small className="text-white fw-bold" style={{ fontSize: '0.65rem' }}>{d.value}</small>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <Button as={Link} to="/dashboard" variant="outline-secondary" className="rounded-pill">
              {t('page.backToDashboard')}
            </Button>
            <h2 className="fw-bold m-0" style={{ color: textPrimary }}>{t('progress.title')}</h2>
          </div>
        </div>

        {/* Tabs */}
        <Nav variant="pills" className="mb-4" style={{ gap: '8px' }}>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'adventures'}
              onClick={() => setActiveTab('adventures')}
              className="rounded-pill fw-bold px-4"
              style={{
                backgroundColor: activeTab === 'adventures' ? tabActiveBg : tabInactiveBg,
                color: activeTab === 'adventures' ? '#fff' : textSecondary,
                border: activeTab === 'adventures' ? 'none' : `1px solid ${cardBorder}`
              }}
            >
              🗺️ {t('progress.tabAdventures')}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'trainer'}
              onClick={() => setActiveTab('trainer')}
              className="rounded-pill fw-bold px-4"
              style={{
                backgroundColor: activeTab === 'trainer' ? tabActiveBg : tabInactiveBg,
                color: activeTab === 'trainer' ? '#fff' : textSecondary,
                border: activeTab === 'trainer' ? 'none' : `1px solid ${cardBorder}`
              }}
            >
              🏆 {t('progress.tabTrainer')}
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* TAB 1: Mis Aventuras */}
        {activeTab === 'adventures' && (
          <>
            {juegosConAventura.length === 0 ? (
              <Card className="border-0 text-center p-5" style={{ backgroundColor: cardBg }}>
                <h5 style={{ color: textSecondary }}>{t('progress.noAdventures')}</h5>
                <p style={{ color: textSecondary }}>{t('progress.startAdventureHint')}</p>
                <Button as={Link} to="/aventuras" variant="success" className="rounded-pill mt-2">
                  {t('progress.goToAdventures')}
                </Button>
              </Card>
            ) : (
              <Row className="g-3">
                {juegosConAventura.map(juego => {
                  const data = getAdventureData(juego.juegoNombre);
                  const allBadges = getBadgesForGame(juego.juegoNombre);
                  const earned = data.earnedBadges?.length || 0;
                  const total = allBadges.length || 8;
                  const pokemon = data.pokemonBoxes?.reduce((sum, box) =>
                    sum + (box.slots?.filter(s => s !== null).length || 0), 0) || 0;
                  const items = Object.values(data.backpack || {}).reduce((sum, arr) =>
                    sum + (Array.isArray(arr) ? arr.length : 0), 0);
                  const region = getRegionForGame(juego.juegoNombre);
                  const pct = Math.round((earned / total) * 100);

                  return (
                    <Col key={juego.id} xs={12} md={6} xl={4}>
                      <Card className="border-0 h-100" style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${cardBorder}` }}>
                        <Card.Body className="p-3">
                          {/* Header juego */}
                          <div className="d-flex align-items-center gap-3 mb-3">
                            <img
                              src={JUEGOS_IMAGENES[juego.juegoNombre] || '/images/juegos/default.jpeg'}
                              alt={juego.juegoNombre}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px' }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-0" style={{ color: textPrimary }}>
                                Pokémon {t(JUEGOS_TRADUCCIONES[juego.juegoNombre] || juego.juegoNombre)}
                              </h6>
                              <small style={{ color: textSecondary }}>{region.name}</small>
                            </div>
                            <Badge bg={pct === 100 ? 'success' : 'primary'} className="rounded-pill">
                              {pct}%
                            </Badge>
                          </div>

                          {/* Progreso medallas */}
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <small style={{ color: textSecondary }}>{t('progress.badges')}</small>
                              <small className="fw-bold" style={{ color: textPrimary }}>{earned}/{total}</small>
                            </div>
                            <ProgressBar
                              now={pct}
                              variant={pct === 100 ? 'success' : 'primary'}
                              style={{ height: '10px', borderRadius: '5px', backgroundColor: isDark ? '#2e303a' : '#e5e7eb' }}
                            />
                          </div>

                          {/* Stats rápidos */}
                          <div className="d-flex gap-2 mb-3">
                            <div className="flex-fill text-center rounded-3 p-2" style={{ backgroundColor: isDark ? '#2e3040' : '#f5f5f5' }}>
                              <div style={{ fontSize: '1.1rem' }}>⚡</div>
                              <small className="fw-bold" style={{ color: textPrimary, fontSize: '0.8rem' }}>{earned}</small>
                              <div><small style={{ color: textSecondary, fontSize: '0.65rem' }}>{t('progress.badges')}</small></div>
                            </div>
                            <div className="flex-fill text-center rounded-3 p-2" style={{ backgroundColor: isDark ? '#2e3040' : '#f5f5f5' }}>
                              <div style={{ fontSize: '1.1rem' }}>📦</div>
                              <small className="fw-bold" style={{ color: textPrimary, fontSize: '0.8rem' }}>{pokemon}</small>
                              <div><small style={{ color: textSecondary, fontSize: '0.65rem' }}>{t('progress.pokemon')}</small></div>
                            </div>
                            <div className="flex-fill text-center rounded-3 p-2" style={{ backgroundColor: isDark ? '#2e3040' : '#f5f5f5' }}>
                              <div style={{ fontSize: '1.1rem' }}>🎒</div>
                              <small className="fw-bold" style={{ color: textPrimary, fontSize: '0.8rem' }}>{items}</small>
                              <div><small style={{ color: textSecondary, fontSize: '0.65rem' }}>{t('progress.items')}</small></div>
                            </div>
                          </div>

                          {/* Medallas visuales mini */}
                          <div className="d-flex gap-1 flex-wrap mb-3">
                            {allBadges.map((badge, idx) => {
                              const has = data.earnedBadges?.includes(idx);
                              return (
                                <div
                                  key={idx}
                                  className="rounded-2 d-flex align-items-center justify-content-center"
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    backgroundColor: has ? '#4caf50' : (isDark ? '#2e303a' : '#e0e0e0'),
                                    opacity: has ? 1 : 0.4,
                                    fontSize: '0.65rem'
                                  }}
                                  title={badge.name}
                                >
                                  {has ? '✓' : '○'}
                                </div>
                              );
                            })}
                          </div>

                          <Button
                            as={Link}
                            to={`/aventura?juegoId=${juego.id}&nombre=${encodeURIComponent(juego.juegoNombre)}`}
                            variant="outline-primary"
                            size="sm"
                            className="w-100 rounded-pill fw-bold"
                          >
                            {t('progress.continueAdventure')}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </>
        )}

        {/* TAB 2: Perfil de Entrenador */}
        {activeTab === 'trainer' && (
          <>
            {/* Tarjetas de resumen */}
            <Row className="mb-4">
              <StatCard icon="⚡" title={t('progress.totalBadges')} value={globalStats.totalBadges} color="#ffc107" />
              <StatCard icon="📦" title={t('progress.totalPokemon')} value={globalStats.totalPokemon} color="#42a5f5" />
              <StatCard icon="🎒" title={t('progress.totalItems')} value={globalStats.totalItems} color="#66bb6a" />
              <StatCard icon="✨" title={t('progress.shinyHunts')} value={globalStats.totalShiny} color="#ab47bc" />
              <StatCard icon="🎯" title={t('progress.totalAttempts')} value={globalStats.totalAttempts} color="#ef5350" />
              <StatCard icon="🏆" title={t('progress.bestGame')} value={globalStats.maxBadges} color="#ffa726" />
            </Row>

            {/* Mejor juego */}
            {globalStats.bestGame && (
              <Card className="border-0 mb-4" style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${cardBorder}` }}>
                <Card.Body className="p-4 d-flex align-items-center gap-4">
                  <div className="text-center">
                    <div style={{ fontSize: '3rem' }}>🏆</div>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: textPrimary }}>{t('progress.bestGameTitle')}</h5>
                    <p className="mb-0" style={{ color: textSecondary }}>
                      <span className="fw-bold" style={{ color: '#ffa726' }}>
                        Pokémon {t(JUEGOS_TRADUCCIONES[globalStats.bestGame] || globalStats.bestGame)}
                      </span>{' '}
                      {t('progress.bestGameDesc')} {globalStats.maxBadges} {t('progress.badges')}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Gráficos */}
            <Row className="g-3">
              {/* Medallas por región */}
              <Col lg={6}>
                <Card className="border-0 h-100" style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${cardBorder}` }}>
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3" style={{ color: textPrimary }}>🌍 {t('progress.badgesByRegion')}</h6>
                    {Object.keys(globalStats.regionStats).length > 0 ? (
                      <BarChart data={Object.values(globalStats.regionStats).map(r => ({
                        label: r.name,
                        value: r.badges,
                        color: '#42a5f5'
                      }))} />
                    ) : (
                      <p style={{ color: textSecondary }}>{t('progress.noRegionData')}</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Top shiny hunts */}
              <Col lg={6}>
                <Card className="border-0 h-100" style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${cardBorder}` }}>
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3" style={{ color: textPrimary }}>✨ {t('progress.topShinyHunts')}</h6>
                    {shinyData.length > 0 ? (
                      <div className="d-flex flex-column gap-2">
                        {shinyData.slice(0, 5).map((s, i) => (
                          <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ backgroundColor: isDark ? '#2e3040' : '#f5f5f5' }}>
                            <div className="d-flex align-items-center gap-2">
                              <Badge bg="secondary" className="rounded-pill">#{i + 1}</Badge>
                              <span className="fw-bold text-capitalize" style={{ color: textPrimary, fontSize: '0.85rem' }}>{s.pokemonNombre}</span>
                            </div>
                            <span style={{ color: textSecondary, fontSize: '0.8rem' }}>
                              {s.intentos?.toLocaleString()} {t('progress.attempts')}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: textSecondary }}>{t('progress.noShinyData')}</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ProgresoPage;
