import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import PokedexModal from './PokedexModal';
import InventoryModal from './InventoryModal';
import PokemonComparator from './PokemonComparator';

const POKEMON_GAMES = [
  { name: 'Rojo Fuego', region: 'Kanto', console: 'GBA', color: '#dc3545', gen: 3 },
  { name: 'Verde Hoja', region: 'Kanto', console: 'GBA', color: '#28a745', gen: 3 },
  { name: 'Esmeralda', region: 'Hoenn', console: 'GBA', color: '#17a2b8', gen: 3 },
  { name: 'Rubi', region: 'Hoenn', console: 'GBA', color: '#6f42c1', gen: 3 },
  { name: 'Zafiro', region: 'Hoenn', console: 'GBA', color: '#007bff', gen: 3 },
  { name: 'Diamante', region: 'Sinnoh', console: 'DS', color: '#9b59b6', gen: 4 },
  { name: 'Perla', region: 'Sinnoh', console: 'DS', color: '#e91e63', gen: 4 },
  { name: 'Platino', region: 'Sinnoh', console: 'DS', color: '#795548', gen: 4 },
  { name: 'Blanco', region: 'Unova', console: 'DS', color: '#f8f9fa', gen: 5 },
  { name: 'Negro', region: 'Unova', console: 'DS', color: '#343a40', gen: 5 },
  { name: 'Blanco 2', region: 'Unova', console: 'DS', color: '#e9ecef', gen: 5 },
  { name: 'Negro 2', region: 'Unova', console: 'DS', color: '#212529', gen: 5 },
];

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPokedex, setShowPokedex] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showComparator, setShowComparator] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [userGames, setUserGames] = useState([]);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!token || !storedUser) {
        navigate('/login');
        return;
      }
      
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Cargar juegos del usuario desde localStorage (simulado)
      const savedGames = localStorage.getItem(`games_${parsedUser.username}`);
      if (savedGames) {
        setUserGames(JSON.parse(savedGames));
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const startGame = (gameName) => {
    if (!userGames.find(g => g.name === gameName)) {
      const newGames = [...userGames, { name: gameName, started: new Date().toISOString(), badges: 0 }];
      setUserGames(newGames);
      localStorage.setItem(`games_${user.username}`, JSON.stringify(newGames));
    }
  };

  const openInventory = (gameName) => {
    setSelectedGame(gameName);
    setShowInventory(true);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="warning" size="lg" className="mb-3" />
          <p className="text-secondary fw-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-100">
        {/* Header del Dashboard */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="display-5 fw-bold text-dark mb-2">
                Bienvenido, {user?.nombre}
              </h1>
              <p className="lead text-secondary mb-0">
                Gestion de juegos Pokemon GBA y DS
              </p>
            </div>
            <div className="d-flex gap-3">
              <Button
                variant="danger"
                size="lg"
                className="fw-bold px-4"
                style={{ borderRadius: '12px' }}
                onClick={() => setShowPokedex(true)}
              >
                Ver Pokedex
              </Button>
              <Button
                variant="info"
                size="lg"
                className="fw-bold px-4"
                style={{ borderRadius: '12px' }}
                onClick={() => setShowComparator(true)}
              >
                Comparador
              </Button>
              <Button
                variant="outline-dark"
                size="lg"
                onClick={handleLogout}
              >
                Salir
              </Button>
            </div>
          </div>
          
          {user?.pokemonFavorito && (
            <Badge 
              bg="warning" 
              text="dark"
              className="px-4 py-2"
              style={{ fontSize: '1rem', borderRadius: '10px' }}
            >
              Tu companero: {user.pokemonFavorito}
            </Badge>
          )}
        </div>

        {/* Mis Juegos Activos */}
        {userGames.length > 0 && (
          <div className="mb-5">
            <h4 className="fw-bold mb-3">Mis Juegos Activos</h4>
            <Row className="g-3">
              {userGames.map((game, index) => (
                <Col md={6} lg={4} key={index}>
                  <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0">{game.name}</h5>
                        <Badge bg="success">{game.badges}/8 Medallas</Badge>
                      </div>
                      <div className="progress mb-3" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-warning" 
                          style={{ width: `${(game.badges / 8) * 100}%` }}
                        />
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-secondary">
                          Iniciado: {new Date(game.started).toLocaleDateString()}
                        </small>
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => openInventory(game.name)}
                        >
                          Inventario
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Grid de Juegos Disponibles */}
        <div>
          <h4 className="fw-bold mb-3">Juegos Disponibles</h4>
          <Row className="g-3">
            {POKEMON_GAMES.map((game, index) => {
              const isStarted = userGames.find(g => g.name === game.name);
              return (
                <Col md={6} lg={4} xl={3} key={index}>
                  <Card 
                    className="border-0 shadow-sm h-100 overflow-hidden"
                    style={{ 
                      borderRadius: '15px',
                      transition: 'transform 0.2s',
                      cursor: isStarted ? 'default' : 'pointer'
                    }}
                    onMouseEnter={(e) => !isStarted && (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={() => !isStarted && startGame(game.name)}
                  >
                    <div 
                      className="p-4 text-center text-white"
                      style={{ 
                        backgroundColor: game.color,
                        minHeight: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <h5 className="fw-bold mb-0">{game.name}</h5>
                    </div>
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="dark">{game.console}</Badge>
                        <small className="text-secondary">{game.region}</small>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Gen {game.gen}</small>
                        {isStarted ? (
                          <Badge bg="success">En progreso</Badge>
                        ) : (
                          <small className="text-primary">Click para iniciar</small>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>

        {/* Info Alert */}
        <Alert 
          variant="info" 
          className="mt-5 border-0"
          style={{ borderRadius: '15px', backgroundColor: '#e3f2fd' }}
        >
          <h5 className="fw-bold mb-2">Gestion de Progreso</h5>
          <p className="mb-0 text-secondary">
            Haz clic en cualquier juego para marcarlo como iniciado. 
            Proximamente podras registrar las medallas que vas consiguiendo 
            y ver tu porcentaje de completitud en cada juego.
          </p>
        </Alert>
      </div>

      {/* Modal Pokedex */}
      <PokedexModal 
        show={showPokedex} 
        onHide={() => setShowPokedex(false)} 
      />

      {/* Modal Inventario */}
      <InventoryModal
        show={showInventory}
        onHide={() => setShowInventory(false)}
        gameName={selectedGame}
        username={user?.username}
      />

      {/* Modal Comparador */}
      <PokemonComparator
        show={showComparator}
        onHide={() => setShowComparator(false)}
      />
    </DashboardLayout>
  );
}

export default Dashboard;
