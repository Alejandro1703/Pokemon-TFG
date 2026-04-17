import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Badge, Spinner, ListGroup, ToggleButton, ButtonGroup, OverlayTrigger, Popover } from 'react-bootstrap';

const STAT_NAMES = {
  hp: { name: 'PS', fullName: 'Puntos de Salud', color: '#ff6b6b' },
  attack: { name: 'Ataque', fullName: 'Ataque Físico', color: '#f4a261' },
  defense: { name: 'Defensa', fullName: 'Defensa Física', color: '#e9c46a' },
  specialAttack: { name: 'At. Esp.', fullName: 'Ataque Especial', color: '#2a9d8f' },
  specialDefense: { name: 'Def. Esp.', fullName: 'Defensa Especial', color: '#264653' },
  speed: { name: 'Velocidad', fullName: 'Velocidad', color: '#e76f51' }
};

const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

const TYPE_NAMES_ES = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada'
};

function PokemonComparator({ show, onHide }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  
  // Filtros de estadísticas
  const [selectedStats, setSelectedStats] = useState({
    hp: true,
    attack: true,
    defense: true,
    specialAttack: true,
    specialDefense: true,
    speed: true
  });

  // Filtros de tipos
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Cargar lista de Pokémon al abrir
  useEffect(() => {
    if (show) {
      loadPokemonList();
    }
  }, [show]);

  const loadPokemonList = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=649');
      const data = await response.json();
      setPokemonList(data.results);
    } catch {
      console.error('Error loading pokemon list');
    }
  };

  // Buscar sugerencias
  useEffect(() => {
    if (searchTerm1.length >= 2) {
      const filtered = pokemonList
        .filter(p => p.name.toLowerCase().includes(searchTerm1.toLowerCase()))
        .slice(0, 5);
      setSuggestions1(filtered);
      setShowSuggestions1(filtered.length > 0);
    } else {
      setSuggestions1([]);
      setShowSuggestions1(false);
    }
  }, [searchTerm1, pokemonList]);

  useEffect(() => {
    if (searchTerm2.length >= 2) {
      const filtered = pokemonList
        .filter(p => p.name.toLowerCase().includes(searchTerm2.toLowerCase()))
        .slice(0, 5);
      setSuggestions2(filtered);
      setShowSuggestions2(filtered.length > 0);
    } else {
      setSuggestions2([]);
      setShowSuggestions2(false);
    }
  }, [searchTerm2, pokemonList]);

  const loadPokemonDetails = async (pokemonName, setPokemon) => {
    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await response.json();
      
      setPokemon({
        id: data.id,
        name: data.name,
        sprite: data.sprites.front_default,
        types: data.types.map(t => t.type.name),
        stats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          specialAttack: data.stats[3].base_stat,
          specialDefense: data.stats[4].base_stat,
          speed: data.stats[5].base_stat
        }
      });
    } catch {
      console.error(`Error loading ${pokemonName}`);
    } finally {
      setLoading(false);
    }
  };

  const selectPokemon1 = (name) => {
    setSearchTerm1('');
    setShowSuggestions1(false);
    loadPokemonDetails(name, setPokemon1);
  };

  const selectPokemon2 = (name) => {
    setSearchTerm2('');
    setShowSuggestions2(false);
    loadPokemonDetails(name, setPokemon2);
  };

  const toggleStat = (stat) => {
    setSelectedStats(prev => ({
      ...prev,
      [stat]: !prev[stat]
    }));
  };

  const getWinner = () => {
    if (!pokemon1 || !pokemon2) return null;
    
    let pokemon1Wins = 0;
    let pokemon2Wins = 0;
    
    Object.entries(selectedStats).forEach(([stat, isSelected]) => {
      if (isSelected) {
        if (pokemon1.stats[stat] > pokemon2.stats[stat]) pokemon1Wins++;
        else if (pokemon2.stats[stat] > pokemon1.stats[stat]) pokemon2Wins++;
      }
    });
    
    if (pokemon1Wins > pokemon2Wins) return pokemon1.name;
    if (pokemon2Wins > pokemon1Wins) return pokemon2.name;
    return 'Empate';
  };

  const renderStatBar = (stat, value, maxValue, color) => {
    const percentage = (value / maxValue) * 100;
    return (
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <small className="fw-bold">{STAT_NAMES[stat].name}</small>
          <small>{value}</small>
        </div>
        <div className="progress" style={{ height: '20px', backgroundColor: '#e9ecef' }}>
          <div
            className="progress-bar"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              transition: 'width 0.5s ease'
            }}
          />
        </div>
      </div>
    );
  };

  const renderComparisonBar = (stat) => {
    if (!pokemon1 || !pokemon2) return null;
    
    const value1 = pokemon1.stats[stat];
    const value2 = pokemon2.stats[stat];
    const maxValue = Math.max(value1, value2, 150);
    const diff = value1 - value2;
    
    return (
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <small className="fw-bold text-primary">{pokemon1.name} ({value1})</small>
          <small className="fw-bold">{STAT_NAMES[stat].name}</small>
          <small className="fw-bold text-danger">{pokemon2.name} ({value2})</small>
        </div>
        <div className="position-relative" style={{ height: '30px' }}>
          {/* Pokemon 1 bar (left) */}
          <div
            className="position-absolute"
            style={{
              left: 0,
              top: 0,
              height: '100%',
              width: `${(value1 / maxValue) * 50}%`,
              backgroundColor: '#007bff',
              borderRadius: '4px 0 0 4px',
              transition: 'width 0.5s ease'
            }}
          />
          {/* Pokemon 2 bar (right) */}
          <div
            className="position-absolute"
            style={{
              right: 0,
              top: 0,
              height: '100%',
              width: `${(value2 / maxValue) * 50}%`,
              backgroundColor: '#dc3545',
              borderRadius: '0 4px 4px 0',
              transition: 'width 0.5s ease'
            }}
          />
          {/* Center line */}
          <div
            className="position-absolute"
            style={{
              left: '50%',
              top: 0,
              height: '100%',
              width: '2px',
              backgroundColor: '#6c757d',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        {diff !== 0 && (
          <div className="d-flex justify-content-center align-items-center mt-1">
            <span 
              className="fw-bold"
              style={{ 
                color: '#28a745',
                fontSize: '1.2rem'
              }}
            >
              {diff > 0 ? `← ${pokemon1.name}` : `${pokemon2.name} →`}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      fullscreen="lg-down" 
      centered
      style={{ zIndex: 9999 }}
    >
      <Modal.Header 
        className="d-flex justify-content-between align-items-center py-3 px-4"
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          minHeight: '60px'
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <Modal.Title className="text-white fw-bold m-0" style={{ fontSize: '1.4rem' }}>
            Comparador Competitivo
          </Modal.Title>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Popover style={{ zIndex: 10001 }}>
                <Popover.Header as="h3">📖 Guía del Comparador</Popover.Header>
                <Popover.Body>
                  <strong>Como usar:</strong><br/>
                  • Busca y selecciona 2 Pokémon para comparar<br/>
                  • Escribe el nombre y selecciona de la lista<br/><br/>
                  <strong>Filtros de Stats:</strong><br/>
                  • Activa/desactiva las estadísticas que quieres ver<br/>
                  • PS, Ataque, Defensa, At. Esp., Def. Esp., Velocidad<br/><br/>
                  <strong>Filtros de Tipos:</strong><br/>
                  • Selecciona tipos para filtrar la lista de Pokémon<br/>
                  • Facilita encontrar Pokémon específicos<br/><br/>
                  <strong>Visualización:</strong><br/>
                  • Flechas indican qué Pokémon gana en cada stat<br/>
                  • Diferencias numéricas en cada comparación
                </Popover.Body>
              </Popover>
            }
          >
            <Button variant="light" size="sm" className="rounded-circle px-2">❓</Button>
          </OverlayTrigger>
        </div>
        <Button 
          variant="light" 
          size="sm" 
          onClick={onHide}
          className="rounded-circle d-flex align-items-center justify-content-center p-0 ms-3"
          style={{ width: '36px', height: '36px', fontWeight: 'bold', fontSize: '1.2rem' }}
        >
          ✕
        </Button>
      </Modal.Header>

      <Modal.Body className="p-0">
        {/* Panel de selección */}
        <div className="p-4 bg-light border-bottom">
          <Row className="g-4">
            {/* Pokemon 1 */}
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-primary text-white fw-bold">
                  Pokemon 1
                </Card.Header>
                <Card.Body className="p-3">
                  <Form.Group className="position-relative">
                    <Form.Label>Buscar Pokemon</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Escribe nombre del Pokemon..."
                      value={searchTerm1}
                      onChange={(e) => setSearchTerm1(e.target.value)}
                      autoComplete="off"
                    />
                    {showSuggestions1 && (
                      <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 1000 }}>
                        {suggestions1.map((pokemon) => (
                          <ListGroup.Item
                            key={pokemon.name}
                            action
                            onClick={() => selectPokemon1(pokemon.name)}
                            className="text-capitalize"
                          >
                            {pokemon.name}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Form.Group>
                                    {pokemon1 && (
                    <div className="mt-3 text-center">
                      {pokemon1.sprite && (
                        <img 
                          src={pokemon1.sprite} 
                          alt={pokemon1.name}
                          style={{ width: '100px', height: '100px', imageRendering: 'pixelated' }}
                        />
                      )}
                      <h5 className="text-capitalize fw-bold mt-2">{pokemon1.name}</h5>
                      <div className="d-flex justify-content-center gap-1">
                        {pokemon1.types.map(type => (
                          <img
                            key={type}
                            src={`https://play.pokemonshowdown.com/sprites/types/${type.charAt(0).toUpperCase() + type.slice(1)}.png`}
                            alt={TYPE_NAMES_ES[type] || type}
                            style={{ width: '40px', height: '20px', imageRendering: 'pixelated' }}
                          />
                        ))}
                      </div>
                      <small className="text-muted d-block mt-2">
                        Total stats: {Object.values(pokemon1.stats).reduce((a, b) => a + b, 0)} (siempre se suman todas)
                      </small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Pokemon 2 */}
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-danger text-white fw-bold">
                  Pokemon 2
                </Card.Header>
                <Card.Body className="p-3">
                  <Form.Group className="position-relative">
                    <Form.Label>Buscar Pokemon</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Escribe nombre del Pokemon..."
                      value={searchTerm2}
                      onChange={(e) => setSearchTerm2(e.target.value)}
                      autoComplete="off"
                    />
                    {showSuggestions2 && (
                      <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 1000 }}>
                        {suggestions2.map((pokemon) => (
                          <ListGroup.Item
                            key={pokemon.name}
                            action
                            onClick={() => selectPokemon2(pokemon.name)}
                            className="text-capitalize"
                          >
                            {pokemon.name}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Form.Group>
                                    {pokemon2 && (
                    <div className="mt-3 text-center">
                      {pokemon2.sprite && (
                        <img 
                          src={pokemon2.sprite} 
                          alt={pokemon2.name}
                          style={{ width: '100px', height: '100px', imageRendering: 'pixelated' }}
                        />
                      )}
                      <h5 className="text-capitalize fw-bold mt-2">{pokemon2.name}</h5>
                      <div className="d-flex justify-content-center gap-1">
                        {pokemon2.types.map(type => (
                          <img
                            key={type}
                            src={`https://play.pokemonshowdown.com/sprites/types/${type.charAt(0).toUpperCase() + type.slice(1)}.png`}
                            alt={TYPE_NAMES_ES[type] || type}
                            style={{ width: '40px', height: '20px', imageRendering: 'pixelated' }}
                          />
                        ))}
                      </div>
                      <small className="text-muted d-block mt-2">
                        Total stats: {Object.values(pokemon2.stats).reduce((a, b) => a + b, 0)} (siempre se suman todas)
                      </small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Filtros de estadísticas */}
        <div className="p-3 border-bottom bg-white">
          <h6 className="fw-bold mb-2">Filtrar estadísticas a comparar:</h6>
          <ButtonGroup className="flex-wrap">
            {Object.entries(STAT_NAMES).map(([stat, info]) => (
              <ToggleButton
                key={stat}
                id={`toggle-${stat}`}
                type="checkbox"
                variant={selectedStats[stat] ? 'primary' : 'outline-secondary'}
                checked={selectedStats[stat]}
                value={stat}
                onChange={() => toggleStat(stat)}
                className="m-1"
                style={{ 
                  borderColor: info.color,
                  backgroundColor: selectedStats[stat] ? info.color : 'transparent',
                  borderWidth: '2px'
                }}
              >
                {info.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          <div className="mt-2">
            <Button 
              size="sm" 
              variant="outline-primary" 
              onClick={() => setSelectedStats({
                hp: true, attack: true, defense: true,
                specialAttack: true, specialDefense: true, speed: true
              })}
              className="me-2"
            >
              Seleccionar todas
            </Button>
            <Button 
              size="sm" 
              variant="outline-secondary" 
              onClick={() => setSelectedStats({
                hp: false, attack: false, defense: false,
                specialAttack: false, specialDefense: false, speed: false
              })}
            >
              Deseleccionar todas
            </Button>
          </div>
        </div>

        {/* Comparación */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Cargando Pokemon...</p>
            </div>
          ) : pokemon1 && pokemon2 ? (
            <>
              {/* Resultado del ganador */}
              <div className="text-center mb-4">
                <h5 className="fw-bold">
                  {getWinner() === 'Empate' ? (
                    <Badge bg="warning" text="dark" className="fs-5">Empate</Badge>
                  ) : (
                    <>
                      Ganador: <Badge bg="success" className="fs-5 text-capitalize">{getWinner()}</Badge>
                    </>
                  )}
                </h5>
                <small className="text-muted">
                  Comparando {Object.values(selectedStats).filter(Boolean).length} estadísticas
                </small>
              </div>

              {/* Gráfico de comparación */}
              <Card className="border-0 shadow-sm">
                <Card.Header className="fw-bold bg-light">
                  Comparacion Visual
                </Card.Header>
                <Card.Body>
                  {Object.entries(selectedStats).map(([stat, isSelected]) => 
                    isSelected ? (
                      <div key={stat}>
                        {renderComparisonBar(stat)}
                      </div>
                    ) : null
                  )}
                </Card.Body>
              </Card>

              {/* Tabla de stats individuales - SIEMPRE muestra todas las stats */}
              <Row className="mt-4 g-3">
                <Col md={6}>
                  <Card className="border-primary border-2">
                    <Card.Header className="bg-primary text-white fw-bold text-capitalize">
                      {pokemon1.name} - Todas las estadísticas
                    </Card.Header>
                    <Card.Body>
                      {Object.keys(STAT_NAMES).map((stat) => (
                        <div key={stat}>
                          {renderStatBar(stat, pokemon1.stats[stat], 150, STAT_NAMES[stat].color)}
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-danger border-2">
                    <Card.Header className="bg-danger text-white fw-bold text-capitalize">
                      {pokemon2.name} - Todas las estadísticas
                    </Card.Header>
                    <Card.Body>
                      {Object.keys(STAT_NAMES).map((stat) => (
                        <div key={stat}>
                          {renderStatBar(stat, pokemon2.stats[stat], 150, STAT_NAMES[stat].color)}
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <div className="text-center py-5 text-muted">
              <h5>Selecciona dos Pokemon para comparar</h5>
              <p>Busca y selecciona un Pokemon en cada panel para ver la comparacion</p>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default PokemonComparator;
