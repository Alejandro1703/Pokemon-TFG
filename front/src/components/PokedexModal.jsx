import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Badge, Spinner, Card, ToggleButtonGroup, ToggleButton, OverlayTrigger, Popover } from 'react-bootstrap';

const POKEMON_TYPES = [
  'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

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

// Rangos de Pokédex para cada región/generación
const POKEDEX_RANGES = {
  national: { start: 1, end: 649, name: 'Nacional' }, // Hasta Gen 5 (Negro/Blanco 2)
  kanto: { start: 1, end: 151, name: 'Kanto' },
  johto: { start: 152, end: 251, name: 'Johto' },
  hoenn: { start: 252, end: 386, name: 'Hoenn' },
  sinnoh: { start: 387, end: 493, name: 'Sinnoh' },
  unova: { start: 494, end: 649, name: 'Unova' }
};

function PokedexModal({ show, onHide }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [pokedexView, setPokedexView] = useState('national');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [shinyMode, setShinyMode] = useState(false);
  const [shinyPokemon, setShinyPokemon] = useState(new Set());
  const itemsPerPage = 20;

  // Cargar Pokémon cuando cambia la vista
  useEffect(() => {
    if (show) {
      loadPokemon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, pokedexView]);

  // Filtrar cuando cambian los tipos o el modo estricto
  useEffect(() => {
    filterPokemon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypes, strictMode, pokemonList]);

  const loadPokemon = async () => {
    setLoading(true);
    try {
      const range = POKEDEX_RANGES[pokedexView];
      const pokemonData = [];
      
      // Cargar TODOS los Pokémon en el rango especificado (sin límite de 50)
      const batchSize = 20; // Procesar en lotes para no sobrecargar
      
      for (let batchStart = range.start; batchStart <= range.end; batchStart += batchSize) {
        const batchEnd = Math.min(batchStart + batchSize - 1, range.end);
        const batchPromises = [];
        
        for (let i = batchStart; i <= batchEnd; i++) {
          batchPromises.push(
            fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
              .then(res => res.ok ? res.json() : null)
              .catch(() => null)
          );
        }
        
        const batchResults = await Promise.all(batchPromises);
        
        batchResults.forEach(data => {
          if (data) {
            pokemonData.push({
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
          }
        });
        
        // Actualizar progreso parcial para que el usuario vea que está cargando
        setPokemonList([...pokemonData]);
      }
      
      setPokemonList(pokemonData);
      setCurrentPage(1);
    } catch {
      console.error('Error loading pokemon list');
    } finally {
      setLoading(false);
    }
  };

  const filterPokemon = () => {
    if (selectedTypes.length === 0) {
      setFilteredPokemon(pokemonList);
    } else if (strictMode) {
      // FILTRO DURO: Pokémon deben tener EXACTAMENTE los tipos seleccionados
      setFilteredPokemon(pokemonList.filter(p => {
        // El Pokémon debe tener los mismos tipos que los seleccionados (sin importar orden)
        if (p.types.length !== selectedTypes.length) return false;
        return selectedTypes.every(type => p.types.includes(type));
      }));
    } else {
      // FILTRO NORMAL: Pokémon con AL MENOS UNO de los tipos seleccionados (OR)
      setFilteredPokemon(pokemonList.filter(p => 
        p.types.some(type => selectedTypes.includes(type))
      ));
    }
    setCurrentPage(1);
  };

  const paginatedPokemon = filteredPokemon.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

  const renderPokemonCard = (pokemon) => (
    <Col key={pokemon.id} xs={6} sm={4} md={3} lg={3} className="mb-3">
      <Card 
        className="h-100 border-0 shadow-sm cursor-pointer"
        onClick={() => setSelectedPokemon(pokemon)}
        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div className="text-center p-3" style={{ backgroundColor: '#f8f9fa' }}>
          {pokemon.sprite ? (
            <img 
              src={(shinyMode || shinyPokemon.has(pokemon.id)) ? pokemon.shinySprite || pokemon.sprite.replace('/pokemon/', '/pokemon/shiny/') : pokemon.sprite} 
              alt={pokemon.name}
              style={{ width: '80px', height: '80px', imageRendering: 'pixelated' }}
            />
          ) : (
            <div style={{ width: '80px', height: '80px', margin: '0 auto', backgroundColor: '#ddd', borderRadius: '50%' }} />
          )}
        </div>
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">#{String(pokemon.id).padStart(3, '0')}</small>
            <Button
              size="sm"
              variant={shinyPokemon.has(pokemon.id) ? 'warning' : 'outline-warning'}
              onClick={(e) => {
                e.stopPropagation();
                const newShinySet = new Set(shinyPokemon);
                if (newShinySet.has(pokemon.id)) {
                  newShinySet.delete(pokemon.id);
                } else {
                  newShinySet.add(pokemon.id);
                }
                setShinyPokemon(newShinySet);
              }}
              className="p-0 px-1"
              style={{ fontSize: '0.75rem' }}
              title={shinyPokemon.has(pokemon.id) ? 'Desactivar Shiny' : 'Activar Shiny'}
            >
              ✨
            </Button>
          </div>
          <h6 className="text-capitalize fw-bold mb-2" style={{ fontSize: '0.95rem' }}>
            {pokemon.name}
          </h6>
          <div className="d-flex gap-1 flex-wrap">
            {pokemon.types.map(type => (
              <img
                key={type}
                src={`https://play.pokemonshowdown.com/sprites/types/${type.charAt(0).toUpperCase() + type.slice(1)}.png`}
                alt={TYPE_NAMES_ES[type] || type}
                style={{ width: '28px', height: '14px', imageRendering: 'pixelated' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline-block';
                }}
              />
            ))}
            {pokemon.types.map(type => (
              <Badge 
                key={`fallback-${type}`}
                style={{ 
                  backgroundColor: TYPE_COLORS[type] || '#888',
                  fontSize: '0.65rem',
                  textTransform: 'capitalize',
                  display: 'none'
                }}
              >
                {TYPE_NAMES_ES[type] || type}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

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
          background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
          border: 'none',
          minHeight: '60px'
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <Modal.Title className="text-white fw-bold m-0" style={{ fontSize: '1.4rem' }}>
            Pokédex
          </Modal.Title>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Popover style={{ zIndex: 10001 }}>
                <Popover.Header as="h3">📖 Guía de Pokédex</Popover.Header>
                <Popover.Body>
                  <strong>Navegación:</strong><br/>
                  • Nacional: Todos los Pokémon (1-649)<br/>
                  • Regional: Por generación (Kanto, Johto, etc.)<br/>
                  • ✨ Shiny: Alterna entre sprites normales y shiny<br/><br/>
                  <strong>Filtros de Tipo:</strong><br/>
                  • Pulsa "Filtros" para mostrar/ocultar<br/>
                  • Selecciona múltiples tipos<br/>
                  • <strong>Duro:</strong> Solo Pokémon con EXACTAMENTE esos tipos<br/>
                  • Sin Duro: Pokémon con al menos un tipo seleccionado<br/><br/>
                  <strong>Filtro Duro + Fuego:</strong> Charizard (NO) (Fuego/Volador)<br/>
                  <strong>Filtro Duro + Fuego:</strong> Magmar ✓ (Fuego puro)<br/>
                  <strong>Filtro Duro + Fuego+Volador:</strong> Charizard ✓<br/><br/>
                  <strong>Click en Pokémon:</strong> Ver detalles y stats.
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
        {/* Controles */}
        <div className="p-4 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="g-3">
            {/* Selector de vista */}
            <Col md={6}>
              <Form.Label className="fw-bold">Vista Pokedex</Form.Label>
              <div className="d-flex gap-2">
                <ToggleButtonGroup
                  type="radio"
                  name="pokedex-view"
                  value={pokedexView}
                  onChange={(val) => setPokedexView(val)}
                  className="flex-grow-1"
                >
                  <ToggleButton
                    id="tbg-radio-national"
                    value="national"
                    variant={pokedexView === 'national' ? 'danger' : 'outline-danger'}
                  >
                    Nacional
                  </ToggleButton>
                  <ToggleButton
                    id="tbg-radio-regional"
                    value="kanto"
                    variant={pokedexView !== 'national' ? 'danger' : 'outline-danger'}
                  >
                    Regional
                  </ToggleButton>
                </ToggleButtonGroup>
                
                {/* Toggle ShinyDex */}
                <Button
                  variant={shinyMode ? 'warning' : 'outline-warning'}
                  onClick={() => setShinyMode(!shinyMode)}
                  title={shinyMode ? 'Desactivar ShinyDex' : 'Activar ShinyDex'}
                >
                  ✨ Shiny
                </Button>
              </div>
              
              {pokedexView !== 'national' && (
                <Form.Select 
                  className="mt-2"
                  value={pokedexView}
                  onChange={(e) => setPokedexView(e.target.value)}
                >
                  <option value="kanto">Kanto (Gen 1)</option>
                  <option value="johto">Johto (Gen 2)</option>
                  <option value="hoenn">Hoenn (Gen 3)</option>
                  <option value="sinnoh">Sinnoh (Gen 4)</option>
                  <option value="unova">Unova (Gen 5)</option>
                </Form.Select>
              )}
            </Col>
            
            {/* Filtro de tipo colapsable */}
            <Col md={6}>
              <div className="d-flex justify-content-end mb-2">
                <Button 
                  variant={showFilters ? 'danger' : 'outline-danger'}
                  onClick={() => setShowFilters(!showFilters)}
                  className="d-flex align-items-center gap-2"
                >
                  <span>Filtros</span>
                  {selectedTypes.length > 0 && (
                    <Badge bg="light" text="dark">{selectedTypes.length}</Badge>
                  )}
                  <span>{showFilters ? '▲' : '▼'}</span>
                </Button>
              </div>
              
              {showFilters && (
                <>
                  {/* Iconos de tipos - 3 filas de 6 */}
                  <div className="d-flex flex-wrap gap-1 justify-content-center">
                    {POKEMON_TYPES.filter(t => t !== 'all').map(type => (
                      <Button
                        key={type}
                        variant={selectedTypes.includes(type) ? 'primary' : 'outline-secondary'}
                        onClick={() => {
                          if (selectedTypes.includes(type)) {
                            setSelectedTypes(selectedTypes.filter(t => t !== type));
                          } else {
                            setSelectedTypes([...selectedTypes, type]);
                          }
                        }}
                        className="p-1"
                        style={{ 
                          width: 'calc(16.66% - 6px)',
                          minWidth: '36px',
                          backgroundColor: selectedTypes.includes(type) ? TYPE_COLORS[type] : 'transparent',
                          borderColor: TYPE_COLORS[type]
                        }}
                        title={TYPE_NAMES_ES[type]}
                      >
                        <img
                          src={`https://play.pokemonshowdown.com/sprites/types/${type.charAt(0).toUpperCase() + type.slice(1)}.png`}
                          alt={TYPE_NAMES_ES[type]}
                          style={{ width: '32px', height: '16px', imageRendering: 'pixelated' }}
                        />
                      </Button>
                    ))}
                  </div>
                  
                  <div className="mt-3 d-flex gap-2 justify-content-center">
                    <Button 
                      size="sm" 
                      variant="outline-secondary"
                      onClick={() => setSelectedTypes([])}
                    >
                      Limpiar filtros
                    </Button>
                    <Button
                      size="sm"
                      variant={strictMode ? 'danger' : 'outline-danger'}
                      onClick={() => setStrictMode(!strictMode)}
                    >
                      Filtro exacto {strictMode && '✓'}
                    </Button>
                  </div>
                  
                  {selectedTypes.length > 0 && (
                    <small className="text-muted d-block mt-2">
                      {selectedTypes.length} tipo(s) seleccionado(s) | 
                      Modo: {strictMode ? 'Filtro Duro (AND)' : 'Filtro Normal (OR)'}
                    </small>
                  )}
                </>
              )}
            </Col>
          </Row>
        </div>

        {/* Lista de Pokemon */}
        <div className="p-4" style={{ minHeight: '400px' }}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" size="lg" />
              <p className="mt-3 text-secondary">Cargando Pokemon...</p>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <small className="text-secondary">
                  Mostrando {filteredPokemon.length} Pokemon
                </small>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="d-flex align-items-center px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
              
              <Row>
                {paginatedPokemon.map(renderPokemonCard)}
              </Row>
            </>
          )}
        </div>
      </Modal.Body>

      {/* Modal de detalle de Pokemon */}
      {selectedPokemon && (
        <Modal
          show={!!selectedPokemon}
          onHide={() => setSelectedPokemon(null)}
          centered
          size="md"
          style={{ zIndex: 10000 }}
        >
          <Modal.Header 
            className="d-flex justify-content-between align-items-center py-3 px-4"
            style={{ 
              background: `linear-gradient(135deg, ${TYPE_COLORS[selectedPokemon.types[0]]} 0%, ${TYPE_COLORS[selectedPokemon.types[1]] || TYPE_COLORS[selectedPokemon.types[0]]} 100%)`,
              minHeight: '60px'
            }}
          >
            <Modal.Title className="text-white text-capitalize fw-bold m-0" style={{ fontSize: '1.3rem' }}>
              #{String(selectedPokemon.id).padStart(3, '0')} {selectedPokemon.name}
            </Modal.Title>
            <Button 
              variant="light" 
              size="sm" 
              onClick={() => setSelectedPokemon(null)}
              className="rounded-circle d-flex align-items-center justify-content-center p-0 ms-3"
              style={{ width: '36px', height: '36px', fontWeight: 'bold', fontSize: '1.2rem' }}
            >
              ✕
            </Button>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="text-center mb-4">
              {selectedPokemon.sprite && (
                <img 
                  src={(shinyMode || shinyPokemon.has(selectedPokemon.id)) ? selectedPokemon.sprite.replace('/pokemon/', '/pokemon/shiny/') : selectedPokemon.sprite} 
                  alt={selectedPokemon.name}
                  style={{ width: '120px', height: '120px', imageRendering: 'pixelated' }}
                />
              )}
              <div className="d-flex justify-content-center gap-2 mt-3">
                {selectedPokemon.types.map(type => (
                  <img
                    key={type}
                    src={`https://play.pokemonshowdown.com/sprites/types/${type.charAt(0).toUpperCase() + type.slice(1)}.png`}
                    alt={TYPE_NAMES_ES[type] || type}
                    style={{ width: '40px', height: '20px', imageRendering: 'pixelated', margin: '0 4px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline-block';
                    }}
                  />
                ))}
                {selectedPokemon.types.map(type => (
                  <Badge 
                    key={`fallback-${type}`}
                    style={{ 
                      backgroundColor: TYPE_COLORS[type],
                      fontSize: '0.9rem',
                      textTransform: 'capitalize',
                      padding: '8px 16px',
                      display: 'none'
                    }}
                  >
                    {TYPE_NAMES_ES[type] || type}
                  </Badge>
                ))}
              </div>
            </div>
            
            <h6 className="fw-bold mb-3">Estadisticas Base</h6>
            <div className="row g-2">
              {Object.entries(selectedPokemon.stats).map(([stat, value]) => (
                <div key={stat} className="col-6">
                  <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <small className="text-secondary text-capitalize">
                      {stat === 'specialAttack' ? 'At. Esp.' : 
                       stat === 'specialDefense' ? 'Def. Esp.' : stat}
                    </small>
                    <span className="fw-bold">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </Modal>
  );
}

export default PokedexModal;
