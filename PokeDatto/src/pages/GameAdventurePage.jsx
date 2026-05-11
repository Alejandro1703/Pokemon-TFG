import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import BackpackPanel from '../components/adventure/BackpackPanel';
import ItemsCatalogModal from '../components/adventure/ItemsCatalogModal';
import GymBadgesModal from '../components/adventure/GymBadgesModal';
import PokemonBoxModal from '../components/adventure/PokemonBoxModal';
import { getRegionForGame } from '../components/adventure/gameData';
import { useTranslation, useSettings } from '../contexts/SettingsContext';

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
  'Blanco 2': '/images/juegos/Blanco 2.jpeg',
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

function GameAdventurePage() {
  const { t } = useTranslation();
  const { isDark } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const juegoId = searchParams.get('juegoId');
  const juegoNombre = searchParams.get('nombre');

  const [juego, setJuego] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for modals
  const [showItemsCatalog, setShowItemsCatalog] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showPokemonBox, setShowPokemonBox] = useState(false);

  // Backpack state (persisted in localStorage)
  const [backpack, setBackpack] = useState({});
  // Pokemon boxes state (persisted in localStorage)
  const [pokemonBoxes, setPokemonBoxes] = useState([
    { name: 'Caja 1', slots: Array(30).fill(null) }
  ]);
  // Earned badges state (persisted in localStorage)
  const [earnedBadges, setEarnedBadges] = useState([]);

  const username = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.username || 'default';
    } catch {
      return 'default';
    }
  })();

  // Load game data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (juegoNombre) {
      setJuego({ id: juegoId, juegoNombre: juegoNombre });
      setLoading(false);
    } else if (juegoId) {
      const loadJuego = async () => {
        try {
          const res = await fetch(`${API_URL}/api/juegos-usuario`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const found = data.find(j => j.id === parseInt(juegoId));
            if (found) {
              setJuego(found);
            } else {
              navigate('/aventuras');
            }
          }
        } catch {
          navigate('/aventuras');
        } finally {
          setLoading(false);
        }
      };
      loadJuego();
    } else {
      navigate('/aventuras');
    }
  }, [juegoId, juegoNombre, navigate]);

  // Flag de estado para evitar guardar valores por defecto antes de cargar
  // Usar useState (no useRef) para que se batchee con los datos cargados
  const [dataLoaded, setDataLoaded] = useState(false);

  const token = localStorage.getItem('token');

  // Load backpack, boxes and badges from backend first, then localStorage fallback
  useEffect(() => {
    if (!juegoNombre || !username) return;
    let loaded = false;

    const loadFromBackend = async () => {
      try {
        const res = await fetch(`${API_URL}/api/aventuras/${encodeURIComponent(juegoNombre)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const aventura = await res.json();
          if (aventura.datos) {
            const data = JSON.parse(aventura.datos);
            if (data.backpack) setBackpack(data.backpack);
            if (data.pokemonBoxes) setPokemonBoxes(data.pokemonBoxes);
            if (data.earnedBadges) setEarnedBadges(data.earnedBadges);
            loaded = true;
          }
        }
      } catch {
        // Fallback to localStorage
      }

      if (!loaded) {
        const storageKey = `adventure_${username}_${juegoNombre}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            const data = JSON.parse(saved);
            if (data.backpack) setBackpack(data.backpack);
            if (data.pokemonBoxes) setPokemonBoxes(data.pokemonBoxes);
            if (data.earnedBadges) setEarnedBadges(data.earnedBadges);
          } catch {
            // Ignore parse errors
          }
        }
      }
      setDataLoaded(true);
    };

    loadFromBackend();
  }, [juegoNombre, username]);

  // Auto-save whenever state changes (after initial load) to localStorage + backend
  useEffect(() => {
    if (!dataLoaded || !juegoNombre || !username) return;
    const storageKey = `adventure_${username}_${juegoNombre}`;
    const datos = JSON.stringify({ backpack, pokemonBoxes, earnedBadges });
    localStorage.setItem(storageKey, datos);

    if (token) {
      fetch(`${API_URL}/api/aventuras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ juegoNombre, datos })
      }).catch(() => {});
    }
  }, [backpack, pokemonBoxes, earnedBadges, dataLoaded, juegoNombre, username]);

  const handleUpdateBackpack = (newBackpack) => {
    setBackpack(newBackpack);
  };

  const handleUpdateBoxes = (newBoxes) => {
    setPokemonBoxes(newBoxes);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando aventura...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!juego) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">
          <p>Juego no encontrado</p>
          <Button onClick={() => navigate('/aventuras')}>Volver</Button>
        </div>
      </DashboardLayout>
    );
  }

  const gameName = juego.juegoNombre;
  const translatedGameName = t(JUEGOS_TRADUCCIONES[gameName] || gameName);
  const region = getRegionForGame(gameName);

  return (
    <DashboardLayout>
      <div className="p-3">
        {/* Header de aventura */}
        <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '16px' }}>
          <Card.Body className="d-flex align-items-center gap-3 p-3">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/aventuras')}
              className="rounded-pill"
              size="sm"
            >
              {t('adventure.back')}
            </Button>
            <img
              src={JUEGOS_IMAGENES[gameName] || '/images/juegos/default.jpeg'}
              alt={translatedGameName}
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px' }}
            />
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-0">Pokémon {translatedGameName}</h4>
              <small className="text-muted">{t('adventure.region')} {region.name}</small>
            </div>
          </Card.Body>
        </Card>

        <Row className="g-3">
          {/* Columna izquierda: Mochila */}
          <Col lg={5}>
            <BackpackPanel
              gameName={gameName}
              backpack={backpack}
              onUpdateBackpack={handleUpdateBackpack}
            />
          </Col>

          {/* Columna derecha: Controles y Mapa */}
          <Col lg={7}>
            {/* Botones de acción */}
            <Row className="g-2 mb-3">
              <Col xs={6} md={3}>
                <Button
                  className="w-100 fw-bold border-0 shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, #7c4dff 0%, #536dfe 100%)',
                    borderRadius: '12px',
                    padding: '14px 8px',
                    fontSize: '0.82rem',
                  }}
                  onClick={() => setShowItemsCatalog(true)}
                >
                  {t('adventure.viewItems')}
                </Button>
              </Col>
              <Col xs={6} md={3}>
                <Button
                  className="w-100 fw-bold border-0 shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)',
                    borderRadius: '12px',
                    padding: '14px 8px',
                    fontSize: '0.82rem',
                  }}
                  onClick={() => setShowBadges(true)}
                >
                  {t('adventure.gymBadges')}
                </Button>
              </Col>
              <Col xs={6} md={3}>
                <Button
                  className="w-100 fw-bold border-0 shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, #ec407a 0%, #ab47bc 100%)',
                    borderRadius: '12px',
                    padding: '14px 8px',
                    fontSize: '0.82rem',
                  }}
                  onClick={() => setShowPokemonBox(true)}
                >
                  {t('adventure.pokemonBoxes')}
                </Button>
              </Col>
              <Col xs={6} md={3}>
                <Card
                  className="border-0 shadow-sm text-center h-100"
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
                  }}
                >
                  <Card.Body className="p-2 d-flex flex-column align-items-center justify-content-center">
                    <small className="text-white fw-bold" style={{ fontSize: '0.75rem' }}>{t('adventure.pokemonInBoxes')}</small>
                    <span className="text-white fw-bold" style={{ fontSize: '1.3rem' }}>
                      {pokemonBoxes.reduce((sum, box) => sum + box.slots.filter(s => s !== null).length, 0)}
                    </span>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Mapa de la región */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <Card.Header
                style={{
                  background: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
                  borderRadius: '16px 16px 0 0',
                  border: 'none',
                  padding: '12px 20px',
                }}
              >
                <h6 className="fw-bold text-white mb-0">
                  {t('adventure.mapAlt')} {region.name}
                </h6>
              </Card.Header>
              <Card.Body className="text-center p-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: isDark ? '#1a1b23' : '#f5f5f5',
                    border: '2px dashed #e0e0e0',
                    minHeight: '300px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={region.mapUrl}
                    alt={`Mapa de ${region.name}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const t = JSON.parse(localStorage.getItem('app_settings'))?.language || 'es';
                      const mapText = t === 'en' ? `Map of ${region.name}` : `Mapa de ${region.name}`;
                      const placeText = t === 'en' ? 'Place image at:' : 'Coloca la imagen en:';
                      e.target.parentElement.innerHTML = `
                        <div style="text-align:center; padding:40px; color:#999">
                          <div style="font-size:4rem; margin-bottom:12px">🗺️</div>
                          <p style="font-weight:bold; margin-bottom:4px">${mapText}</p>
                          <small>${placeText}<br/><code>/public/images/maps/${region.key}.png</code></small>
                        </div>
                      `;
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modales */}
      <ItemsCatalogModal
        show={showItemsCatalog}
        onHide={() => setShowItemsCatalog(false)}
      />
      <GymBadgesModal
        show={showBadges}
        onHide={() => setShowBadges(false)}
        gameName={gameName}
        earnedBadges={earnedBadges}
        onToggleBadge={(badgeIdx) => {
          setEarnedBadges(prev =>
            prev.includes(badgeIdx)
              ? prev.filter(i => i !== badgeIdx)
              : [...prev, badgeIdx]
          );
        }}
      />
      <PokemonBoxModal
        show={showPokemonBox}
        onHide={() => setShowPokemonBox(false)}
        gameName={gameName}
        boxes={pokemonBoxes}
        onUpdateBoxes={handleUpdateBoxes}
      />
    </DashboardLayout>
  );
}

export default GameAdventurePage;
