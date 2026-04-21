import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import DashboardLayout from './layout/DashboardLayout';

// Datos de características de la app
const FEATURES = [
  {
    title: 'Colección de Juegos',
    description: 'Gestiona tu colección de juegos Pokémon con precios actualizados y seguimiento de beneficios.',
    icon: '🎮',
    path: '/mis-juegos',
    color: '#ffc107'
  },
  {
    title: 'Pokédex Completa',
    description: 'Explora todos los Pokémon con estadísticas, tipos y sprites en alta calidad.',
    icon: '📱',
    path: '/pokedex',
    color: '#ff6b6b'
  },
  {
    title: 'Comparador',
    description: 'Compara estadísticas entre Pokémon para crear tu equipo perfecto.',
    icon: '⚔️',
    path: '/comparador',
    color: '#4ecdc4'
  },
  {
    title: 'Aventuras',
    description: 'Inicia aventuras con tus juegos y guarda tu progreso.',
    icon: '🗺️',
    path: '/aventuras',
    color: '#95e1d3'
  }
];

// Pokémon destacados para mostrar (IDs)
const FEATURED_POKEMON = [6, 25, 94, 150, 248, 445]; // Charizard, Pikachu, Gengar, Mewtwo, Tyranitar, Garchomp

// Componente Slider con 5 Pokémon aleatorios que cambian cada 10 segundos
function PokemonSliderFixed() {
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
      console.error('Error cargando Pokémon aleatorios');
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
        backgroundColor: '#42a5f5',
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
          style={{ color: '#0d47a1' }}
        >
          Crea al mejor equipo
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
                  backgroundColor: 'rgba(255,255,255,0.95)',
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
                <p className="fw-bold text-capitalize mb-0" style={{ color: '#333', fontSize: '0.9rem' }}>
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
function MewtwoAudioPlayer({ pokemonData }) {
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
            backgroundColor: 'white',
            border: '2px solid #333',
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
              border: '1px solid #333',
              color: '#333',
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
                backgroundColor: 'rgba(0,0,0,0.2)',
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
                    backgroundColor: isPlaying ? '#667eea' : 'rgba(0,0,0,0.4)',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Duración */}
          <small style={{ color: '#333', fontSize: '0.75rem', minWidth: '28px' }}>
            {isPlaying ? formatDuration(currentTime) : formatDuration(duration)}
          </small>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Entrenador');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }

    // Obtener username del usuario
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.username || 'Entrenador');
      } catch {
        setUserName('Entrenador');
      }
    }

    // Cargar Pokémon destacados
    const loadPokemon = async () => {
      try {
        const promises = FEATURED_POKEMON.map(id =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(res => res.ok ? res.json() : null)
            .catch(() => null)
        );
        const results = await Promise.all(promises);
        setPokemonData(results.filter(p => p !== null));
      } catch {
        console.error('Error cargando Pokémon');
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="p-0">
        {/* Hero Section */}
        <div 
          className="text-center py-5 px-4"
          style={{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
            borderBottom: '4px solid #42a5f5'
          }}
        >
          <div className="container">
            <h1 
              className="fw-bold mb-3"
              style={{ 
                fontSize: '2.5rem',
                color: '#333',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              ¡Bienvenido, Entrenador {userName}!
            </h1>
            <p className="text-secondary fs-5 mb-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
              Tu aplicación definitiva para gestionar tu colección de juegos Pokémon, 
              explorar la Pokédex completa y comparar estadísticas.
            </p>
            
            {/* Pokémon estáticos */}
            <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                pokemonData.slice(0, 3).map((pokemon) => (
                  <div 
                    key={pokemon.id}
                    className="position-relative"
                  >
                    <img
                      src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                      alt={pokemon.name}
                      style={{ 
                        width: '120px', 
                        height: '120px',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sección de Bienvenida */}
        <div className="py-5 px-4" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container">
            <Row className="align-items-center">
              <Col lg={6} className="mb-4 mb-lg-0">
                <h2 className="fw-bold mb-3" style={{ color: '#333' }}>
                  Bienvenido, Entrenador!
                </h2>
                <p className="text-secondary fs-5 mb-4">
                  Esta aplicación te permite llevar un control completo de tu colección 
                  de videojuegos Pokémon, desde los clásicos de Game Boy hasta las últimas entregas.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Button 
                    as={Link} 
                    to="/juegos"
                    variant="primary"
                    className="rounded-pill px-4 py-2 fw-bold"
                    style={{ fontSize: '1.1rem' }}
                  >
                    🎮 Ver Juegos
                  </Button>
                  <Button 
                    as={Link} 
                    to="/pokedex"
                    variant="outline-primary"
                    className="rounded-pill px-4 py-2 fw-bold"
                    style={{ fontSize: '1.1rem', borderWidth: '2px' }}
                  >
                    📱 Explorar Pokédex
                  </Button>
                </div>
              </Col>
              <Col lg={6} className="text-center">
                {!loading && pokemonData[3] && (
                  <MewtwoAudioPlayer pokemonData={pokemonData} />
                )}
              </Col>
            </Row>
          </div>
        </div>

        {/* Slider de Pokémon Destacados (5 fijos) */}
        <PokemonSliderFixed />

        {/* Footer del Dashboard */}
        <div 
          className="py-4 px-4 text-center"
          style={{
            backgroundColor: '#1976d2',
            color: '#e3f2fd'
          }}
        >
          <p className="mb-2 fw-bold" style={{ fontSize: '1.2rem' }}>
            🌟 ¡Comienza tu aventura ahora! 🌟
          </p>
          <p className="mb-0" style={{ opacity: 0.8 }}>
            Gestiona tu colección, explora la Pokédex y conviértete en el mejor entrenador.
          </p>
        </div>
      </div>

    </DashboardLayout>
  );
}

export default Dashboard;
