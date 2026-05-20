import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import DashboardLayout from './layout/DashboardLayout';
import { useSettings, useTranslation } from '../contexts/SettingsContext';
import { useAuth } from '../hooks/useAuth';

// Pokémon destacados para mostrar (IDs)
const FEATURED_POKEMON = [6, 25, 94, 150, 248, 445]; // Charizard, Pikachu, Gengar, Mewtwo, Tyranitar, Garchomp

// ── FeatureCard ──
function FeatureCard({ title, desc, path, color, locked, isDark, t, navigate }) {
  return (
    <Card
      className="h-100 border-0"
      onClick={() => !locked && navigate(path)}
      style={{
        cursor: locked ? 'default' : 'pointer',
        backgroundColor: isDark ? '#23252f' : '#fff',
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        borderRadius: '10px',
        overflow: 'hidden'
      }}
      onMouseEnter={e => {
        if (!locked) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{ height: '4px', backgroundColor: color }} />
      <Card.Body className="p-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <h6 className="fw-bold mb-0" style={{ color: isDark ? '#e8eaed' : '#1f2937', fontSize: '0.95rem' }}>{title}</h6>
          {locked && <span className="ms-auto" style={{ fontSize: '0.85rem' }}>🔒</span>}
        </div>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '0.82rem', marginBottom: '0.75rem', lineHeight: '1.45' }}>
          {desc}
        </p>
        {locked ? (
          <span style={{ fontSize: '0.78rem', color: isDark ? '#4b5563' : '#9ca3af' }}>
            {t('dashboard.guestLocked')}
          </span>
        ) : (
          <span className="fw-semibold" style={{ fontSize: '0.82rem', color: color }}>
            {t('dashboard.explore')} →
          </span>
        )}
      </Card.Body>
    </Card>
  );
}

// Componente Slider con 6 Pokémon aleatorios que cambian cada 6 segundos
function PokemonSliderFixed({ isDark }) {
  const { t } = useTranslation();
  const [featuredPokemon, setFeaturedPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar 6 Pokémon aleatorios
  const loadRandomPokemon = async () => {
    try {
      // Generar 6 IDs aleatorios entre 1 y 649
      const randomIds = Array.from({ length: 6 }, () => Math.floor(Math.random() * 649) + 1);

      const promises = randomIds.map(id =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
      );
      const results = await Promise.all(promises);
      setFeaturedPokemon(results.filter(p => p !== null));
    } catch {
      console.error(t('common.error') + ' ' + t('pokedex.pokemon'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar Pokémon iniciales
    loadRandomPokemon();
  }, []);

  // Actualizar cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadRandomPokemon();
    }, 6000); // 6 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="py-5 px-4"
      style={{
        backgroundColor: isDark ? '#0d47a1' : '#42a5f5',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Fondo decorativo */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: '50%'
        }}
      />

      <div className="container position-relative">
        <h2
          className="text-center fw-bold mb-4"
          style={{ color: isDark ? '#90caf9' : '#0d47a1' }}
        >
          {t('dashboard.createTeam')}
        </h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : (
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {featuredPokemon.map((pokemon, index) => (
              <div
                key={`${pokemon.id}-${index}`}
                className="text-center p-3 rounded-3 pokemon-card"
                style={{
                  backgroundColor: isDark ? 'rgba(30,32,41,0.95)' : 'rgba(255,255,255,0.95)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  opacity: 0,
                  animation: 'fadeInSubtle 1s ease forwards',
                  animationDelay: `${index * 0.15}s`
                }}
              >
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  style={{ width: '100px', height: '100px' }}
                />
                <p className="fw-bold text-capitalize mb-0" style={{ color: isDark ? '#e8eaed' : '#333', fontSize: '0.9rem' }}>
                  {pokemon.name}
                </p>
                <small className="text-muted">#{String(pokemon.id).padStart(3, '0')}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInSubtle {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// Componente de audio estilo WhatsApp para Mewtwo
function MewtwoAudioPlayer({ pokemonData, isDark }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('https://play.pokemonshowdown.com/audio/cries/mewtwo.mp3');
    audioRef.current.volume = 0.3;

    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current.duration || 1.5);
    };

    audioRef.current.onended = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => console.log('Audio no disponible'));
      setIsPlaying(true);

      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(currentProgress);
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 50);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:01';
    return `0:${Math.ceil(seconds).toString().padStart(2, '0')}`;
  };

  return (
    <div className="position-relative d-inline-block">
      <img
        src={pokemonData[3].sprites.other['official-artwork'].front_default || pokemonData[3].sprites.front_default}
        alt="Featured"
        style={{
          width: '250px',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))'
        }}
      />
      {/* Reproductor de audio estilo WhatsApp */}
      <div
        className="position-absolute"
        style={{
          bottom: '10px',
          right: '-150px',
          zIndex: 10
        }}
      >
        <div
          className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow"
          style={{
            backgroundColor: isDark ? '#23252f' : 'white',
            border: isDark ? '2px solid #c8ccd4' : '2px solid #333',
            minWidth: '140px'
          }}
        >
          {/* Botón play/pause */}
          <button
            onClick={togglePlay}
            className="rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              minWidth: '32px',
              background: 'none',
              backgroundColor: 'transparent',
              border: isDark ? '1px solid #c8ccd4' : '1px solid #333',
              color: isDark ? '#c8ccd4' : '#333',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {isPlaying ? (
              <span style={{
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}>⏸</span>
            ) : (
              <span style={{
                fontSize: '0.8rem',
                lineHeight: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '0.8rem',
                paddingLeft: '2px'
              }}>▶</span>
            )}
          </button>

          {/* Barra de progreso estilo onda */}
          <div className="flex-grow-1" style={{ minWidth: '60px' }}>
            <div
              className="rounded-pill"
              style={{
                height: '4px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                overflow: 'hidden'
              }}
            >
              <div
                className="h-100 rounded-pill"
                style={{
                  width: `${progress}%`,
                  backgroundColor: '#667eea',
                  transition: 'width 0.05s linear'
                }}
              />
            </div>
            {/* Líneas decorativas estilo onda */}
            <div className="d-flex align-items-end gap-1 mt-1" style={{ height: '12px' }}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-pill"
                  style={{
                    width: '3px',
                    height: isPlaying ? `${[6, 10, 4, 8, 5, 9, 3, 7][i]}px` : '4px',
                    backgroundColor: isPlaying ? '#667eea' : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'),
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Duración */}
          <small style={{ color: isDark ? '#c8ccd4' : '#333', fontSize: '0.75rem', minWidth: '28px' }}>
            {isPlaying ? formatDuration(currentTime) : formatDuration(duration)}
          </small>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { isDark } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isGuest } = useAuth();
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token) { navigate('/login'); return; }
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.nombre || userData.username || '');
      } catch { setUserName(''); }
    }
    const loadPokemon = async () => {
      try {
        const promises = FEATURED_POKEMON.map(id =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(res => res.ok ? res.json() : null)
            .catch(() => null)
        );
        const results = await Promise.all(promises);
        setPokemonData(results.filter(p => p !== null));
      } catch { /* silent */ } finally { setLoading(false); }
    };
    loadPokemon();
  }, [navigate]);

  const publicFeatures = [
    { title: t('sidebar.pokedex'),      desc: t('dashboard.fullPokedexDesc'),  icon: '📱', path: '/pokedex',           color: '#ef5350' },
    { title: t('sidebar.comparator'),   desc: t('dashboard.comparatorDesc'),   icon: '⚔️', path: '/comparador',        color: '#42a5f5' },
    { title: t('sidebar.damageCalc'),   desc: t('dashboard.damageCalcDesc'),   icon: '💥', path: '/calculadora-dano',  color: '#ff7043' },
    { title: t('sidebar.gymLeaders'),   desc: t('dashboard.gymLeadersDesc'),   icon: '🏅', path: '/lideres-gimnasio',  color: '#ab47bc' },
    { title: t('sidebar.pokemonLeague'),desc: t('dashboard.leagueDesc'),       icon: '👑', path: '/liga-pokemon',      color: '#ffd54f' },
    { title: t('sidebar.games'),        desc: t('dashboard.gamesDesc'),        icon: '🎮', path: '/juegos',            color: '#66bb6a' },
  ];

  const privateFeatures = [
    { title: t('sidebar.myGames'),      desc: t('dashboard.myGamesDesc'),      icon: '🗃️', path: '/mis-juegos',       color: '#ffa726' },
    { title: t('sidebar.adventures'),   desc: t('dashboard.adventuresDesc'),   icon: '🗺️', path: '/aventuras',        color: '#26c6da' },
    { title: t('sidebar.teamBuilder'),  desc: t('dashboard.teamBuilderDesc'),  icon: '🧩', path: '/team-builder',     color: '#5c6bc0' },
    { title: t('sidebar.progress'),     desc: t('dashboard.progressDesc'),     icon: '📊', path: '/progreso',         color: '#ec407a' },
    { title: t('sidebar.shinyHunting'), desc: t('dashboard.shinyHuntingDesc'), icon: '✨', path: '/shiny-hunting',    color: '#7e57c2' },
    { title: t('sidebar.encounters'),   desc: t('dashboard.encountersDesc'),   icon: '🌿', path: '/encuentros',       color: '#4caf50' },
    { title: t('sidebar.profile'),      desc: t('dashboard.profileDesc'),      icon: '👤', path: '/perfil',           color: '#78909c' },
  ];

  const bgPrimary   = isDark ? '#1a1b23' : '#f8f9fa';
  const bgSecondary = isDark ? '#23252f' : '#ffffff';
  const textPrimary = isDark ? '#e8eaed' : '#1f2937';
  const textMuted   = isDark ? '#9ca3af' : '#6b7280';

  return (
    <DashboardLayout>
      <div className="p-0">

        {/* ── Hero ── */}
        <div
          className="text-center py-5 px-4"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #1e293b 0%, #23252f 50%, #2e3040 100%)'
              : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
            borderBottom: isDark ? '4px solid #536dfe' : '4px solid #42a5f5'
          }}
        >
          <div className="container">
            <h1 className="fw-bold mb-2" style={{ fontSize: '2.2rem', color: textPrimary, textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
              {t('dashboard.welcome')}{userName ? `, ${userName}` : ''}!
            </h1>
            <p style={{ color: textMuted, maxWidth: '680px', margin: '0 auto 1.5rem', fontSize: '1rem' }}>
              {t('dashboard.subtitle')}
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-3 mt-3">
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                pokemonData.slice(0, 3).map(pokemon => (
                  <img
                    key={pokemon.id}
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    style={{ width: '110px', height: '110px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Herramientas (públicas) ── */}
        <div className="py-5 px-4" style={{ backgroundColor: bgPrimary }}>
          <div className="container">
            <h2 className="fw-bold mb-1" style={{ color: textPrimary }}>{t('dashboard.publicTools')}</h2>
            <p className="mb-4" style={{ color: textMuted, fontSize: '0.9rem' }}>{t('dashboard.publicToolsDesc')}</p>
            <Row className="g-3">
              {publicFeatures.map(f => (
                <Col key={f.path} xs={12} sm={6} lg={4}>
                  <FeatureCard {...f} locked={false} isDark={isDark} t={t} navigate={navigate} />
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* ── Banner separador con Mewtwo ── */}
        <div
          className="d-flex align-items-center justify-content-center py-4"
          style={{
            backgroundColor: isDark ? '#0d47a1' : '#1976d2',
            borderTop: isDark ? '3px solid #536dfe' : '3px solid #1565c0',
            borderBottom: isDark ? '3px solid #536dfe' : '3px solid #1565c0',
            minHeight: '180px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: '-20px', left: '5%', width: '130px', height: '130px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: '-30px', right: '8%', width: '170px', height: '170px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
          <div className="d-flex flex-column align-items-center gap-2 position-relative" style={{ zIndex: 1 }}>
            <p
              className="fw-bold m-0 text-center"
              style={{
                color: 'rgba(255,255,255,0.95)',
                fontSize: '1.05rem',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                letterSpacing: '0.5px'
              }}
            >
              {t('dashboard.discoverPowerful')}
            </p>
            {!loading && pokemonData[3] ? (
              <MewtwoAudioPlayer pokemonData={pokemonData} isDark={isDark} />
            ) : (
              /* 🖼️ PLACEHOLDER */
              <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{
                  width: '280px', height: '130px',
                  border: '2px dashed rgba(255,255,255,0.35)',
                  borderRadius: '12px',
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.85rem',
                  gap: '6px'
                }}
              >
                <span>[ Imagen banner ]</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Mi Espacio (privado) ── */}
        <div className="py-5 px-4" style={{ backgroundColor: bgSecondary }}>
          <div className="container">
            <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
              <div>
                <h2 className="fw-bold mb-1" style={{ color: textPrimary }}>{t('dashboard.mySpace')}</h2>
                <p className="mb-0" style={{ color: textMuted, fontSize: '0.9rem' }}>{t('dashboard.mySpaceDesc')}</p>
              </div>
              {isGuest && (
                <Button as={Link} to="/register" variant="primary" className="rounded-pill px-4 fw-bold align-self-center">
                  {t('dashboard.registerNow')}
                </Button>
              )}
            </div>
            <Row className="g-3">
              {privateFeatures.map(f => (
                <Col key={f.path} xs={12} sm={6} lg={4}>
                  <FeatureCard {...f} locked={isGuest} isDark={isDark} t={t} navigate={navigate} />
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* ── Slider Pokémon aleatorios ── */}
        <PokemonSliderFixed isDark={isDark} />

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
