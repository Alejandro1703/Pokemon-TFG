import { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Row, Col, Badge, Spinner, Card, ToggleButtonGroup, ToggleButton, OverlayTrigger, Popover, Dropdown } from 'react-bootstrap';
import { useSettings, useTranslation } from '../contexts/SettingsContext';
import ALL_POKEMON_DATA from '../data/pokemonData.json';

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
  national: { start: 1, end: 649, name: 'Nacional' },
  kanto: { start: 1, end: 151, name: 'Kanto' },
  johto: { start: 152, end: 251, name: 'Johto' },
  hoenn: { start: 252, end: 386, name: 'Hoenn' },
  sinnoh: { start: 387, end: 493, name: 'Sinnoh' },
  unova: { start: 494, end: 649, name: 'Unova' }
};

// Configuración de gráficos por generación (ordenado: Gen 1 → Gen 5)
const GRAPHIC_GENERATIONS = {
  gen1: { end: 151, label: 'RF/VD', spritePath: 'generation-iii/firered-leafgreen', animated: false },
  gen2: { end: 251, label: 'HG/SS', spritePath: 'generation-iv/heartgold-soulsilver', animated: false },
  gen3: { end: 386, label: 'R/Z/E', spritePath: 'generation-iii/emerald', animated: false },
  gen4: { end: 493, label: 'D/P/Pt', spritePath: 'generation-iv/diamond-pearl', animated: false },
  gen5: { end: 649, label: 'B/N/B2/N2', spritePath: 'generation-v/black-white', animated: true }
};

function PokedexModal({ show, onHide, standalone = false }) {
  const { isDark } = useSettings();
  const { t } = useTranslation();
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [pokedexView, setPokedexView] = useState('national'); // Por defecto Nacional
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [shinyMode, setShinyMode] = useState(false);
  const [shinyPokemon, setShinyPokemon] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876';

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/favoritos`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setFavorites(new Set(data.map(f => f.pokemonId))))
      .catch(() => {});
  }, []);

  const toggleFavorite = async (pokemon) => {
    if (!token) return;
    const isFav = favorites.has(pokemon.id);
    try {
      if (isFav) {
        await fetch(`${API_URL}/api/favoritos/${pokemon.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        setFavorites(prev => { const n = new Set(prev); n.delete(pokemon.id); return n; });
      } else {
        await fetch(`${API_URL}/api/favoritos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ pokemonId: pokemon.id, pokemonNombre: pokemon.name })
        });
        setFavorites(prev => new Set(prev).add(pokemon.id));
      }
    } catch (err) { console.error('Error toggling favorite:', err); }
  };
  const [selectedGraphicGen, setSelectedGraphicGen] = useState('gen5'); // Por defecto B/N/B2/N2 (máxima generación)
  const itemsPerPage = 20;

  // Cargar Pokémon cuando cambia la vista o generación de gráficos
  useEffect(() => {
    if (standalone || show) {
      loadPokemon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, pokedexView, selectedGraphicGen, standalone]);

  // Función para obtener regiones disponibles según la generación seleccionada
  const getAvailableRegions = () => {
    const genEnd = GRAPHIC_GENERATIONS[selectedGraphicGen].end;
    const selectedGen = selectedGraphicGen;
    const regions = [
      { key: 'national', label: '🌍 Nacional', end: 649 },
      { key: 'kanto', label: '📍 Kanto', end: 151 },
      { key: 'johto', label: '📍 Johto', end: 251 }
    ];
    // HG/SS (gen2) incluye Hoenn y Sinnoh como excepción especial
    if (genEnd >= 386 || selectedGen === 'gen2') regions.push({ key: 'hoenn', label: '📍 Hoenn', end: 386 });
    if (genEnd >= 493 || selectedGen === 'gen2') regions.push({ key: 'sinnoh', label: '📍 Sinnoh', end: 493 });
    if (genEnd >= 649) regions.push({ key: 'unova', label: '📍 Unova', end: 649 });
    return regions;
  };

  const filterPokemon = useCallback(() => {
    let filtered = pokemonList;

    // Filtro por búsqueda de nombre (coincide desde el inicio)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().startsWith(query) ||
        p.id.toString() === query
      );
    }

    // Filtro por tipos
    if (selectedTypes.length > 0) {
      if (strictMode) {
        // FILTRO DURO: Pokémon deben tener EXACTAMENTE los tipos seleccionados
        filtered = filtered.filter(p => {
          if (p.types.length !== selectedTypes.length) return false;
          return selectedTypes.every(type => p.types.includes(type));
        });
      } else {
        // FILTRO NORMAL: Pokémon con AL MENOS UNO de los tipos seleccionados (OR)
        filtered = filtered.filter(p =>
          p.types.some(type => selectedTypes.includes(type))
        );
      }
    }

    setFilteredPokemon(filtered);
    setCurrentPage(1);
  }, [pokemonList, searchQuery, selectedTypes, strictMode]);

  // Filtrar cuando cambian los tipos, modo estricto o búsqueda
  useEffect(() => {
    filterPokemon();
  }, [selectedTypes, strictMode, pokemonList, searchQuery, filterPokemon]);

  // Resetear a Nacional cuando cambia la generación de gráficos
  useEffect(() => {
    setPokedexView('national');
    setCurrentPage(1);
  }, [selectedGraphicGen]);

  const loadPokemon = () => {
    setLoading(true);
    try {
      const graphicConfig = GRAPHIC_GENERATIONS[selectedGraphicGen];
      const range = POKEDEX_RANGES[pokedexView];
      const effectiveEnd = pokedexView === 'national' 
        ? graphicConfig.end 
        : Math.min(range.end, graphicConfig.end);

      const basePath = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions';

      const pokemonData = ALL_POKEMON_DATA
        .filter(p => p.id >= range.start && p.id <= effectiveEnd)
        .map(p => {
          const spritePath = graphicConfig.animated 
            ? `${basePath}/${graphicConfig.spritePath}/animated/${p.id}.gif`
            : `${basePath}/${graphicConfig.spritePath}/${p.id}.png`;
          const shinyPath = graphicConfig.animated
            ? `${basePath}/${graphicConfig.spritePath}/animated/shiny/${p.id}.gif`
            : `${basePath}/${graphicConfig.spritePath}/shiny/${p.id}.png`;

          return {
            ...p,
            sprite: spritePath,
            shinySprite: shinyPath,
            animated: graphicConfig.animated
          };
        });

      setPokemonList(pokemonData);
      setCurrentPage(1);
    } catch {
      console.error('Error loading pokemon list');
    } finally {
      setLoading(false);
    }
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
        <div className="text-center p-3" style={{ backgroundColor: isDark ? '#2e3040' : '#f8f9fa' }}>
          {pokemon.sprite ? (
            <img 
              src={(shinyMode || shinyPokemon.has(pokemon.id)) ? pokemon.shinySprite : pokemon.sprite} 
              alt={pokemon.name}
              style={{ 
                width: pokemon.animated ? '70px' : '80px', 
                height: pokemon.animated ? '70px' : '80px', 
                imageRendering: pokemon.animated ? 'auto' : 'pixelated'
              }}
              onError={(e) => {
                // Fallback si el sprite animado no existe
                if (pokemon.animated) {
                  e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${pokemon.id}.png`;
                }
              }}
            />
          ) : (
            <div style={{ width: '80px', height: '80px', margin: '0 auto', backgroundColor: '#ddd', borderRadius: '50%' }} />
          )}
        </div>
        <Card.Body className="p-3" style={{ backgroundColor: isDark ? '#23252f' : '#ffffff' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>#{String(pokemon.id).padStart(3, '0')}</small>
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
              title={shinyPokemon.has(pokemon.id) ? t('pokedex.disableShiny') : t('pokedex.enableShiny')}
            >
              ✨
            </Button>
          </div>
          <h6 className="text-capitalize fw-bold mb-2" style={{ fontSize: '0.95rem', color: isDark ? '#e8eaed' : '#333' }}>
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

  const headerContent = (
    <div className="d-flex justify-content-between align-items-center py-3 px-4"
      style={{
        background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
        border: 'none',
        minHeight: '60px'
      }}
    >
      <div className="d-flex align-items-center gap-2">
        <span className="text-white fw-bold m-0" style={{ fontSize: '1.4rem' }}>
          {t('pokedex.title')}
        </span>
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Popover style={{ zIndex: 10001 }}>
              <Popover.Header as="h3">{t('pokedex.guideTitle')}</Popover.Header>
              <Popover.Body>
                <strong>{t('pokedex.navigation')}:</strong><br/>
                • {t('pokedex.national')}<br/>
                • {t('pokedex.regional')}<br/>
                • {t('pokedex.shiny')}<br/><br/>
                <strong>{t('pokedex.typeFilters')}:</strong><br/>
                • {t('pokedex.pressFilters')}<br/>
                • {t('pokedex.selectMultiple')}<br/>
                • <strong>{t('pokedex.strict')}:</strong> {t('pokedex.strictDesc')}<br/>
                • {t('pokedex.withoutStrict')}<br/><br/>
                {t('pokedex.example1')}<br/>
                {t('pokedex.example2')}<br/>
                {t('pokedex.example3')}<br/><br/>
                <strong>{t('pokedex.clickPokemon')}:</strong> {t('pokedex.viewDetails')}.
              </Popover.Body>
            </Popover>
          }
        >
          <Button variant="light" size="sm" className="rounded-circle px-2">❓</Button>
        </OverlayTrigger>
      </div>
      {!standalone && (
        <Button
          variant="light"
          size="sm"
          onClick={onHide}
          className="rounded-circle d-flex align-items-center justify-content-center p-0 ms-3"
          style={{ width: '36px', height: '36px', fontWeight: 'bold', fontSize: '1.2rem' }}
        >
          ✕
        </Button>
      )}
    </div>
  );

  const mainContent = (
    <>
      {/* Controles */}
      <div className="p-4 border-bottom" style={{ backgroundColor: isDark ? '#1a1b23' : '#f8f9fa', borderColor: isDark ? '#2e303a' : '#dee2e6' }}>
          {/* Fila 1: Buscador y Filtros */}
          <Row className="g-3 mb-3">
            {/* Buscador */}
            <Col md={8} lg={9}>
              <Form.Control
                type="text"
                placeholder={t('pokedex.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-2 py-2"
                style={{ borderRadius: '25px', fontSize: '1rem' }}
              />
            </Col>

            {/* Botón Filtros y ShinyDex */}
            <Col md={4} lg={3} className="d-flex justify-content-end gap-2">
              <Button
                variant={showFilters ? 'danger' : 'outline-danger'}
                onClick={() => setShowFilters(!showFilters)}
                className="d-flex align-items-center gap-2 rounded-pill px-3 py-2 fw-bold"
              >
                <span>⚡ {t('pokedex.filters')}</span>
                {selectedTypes.length > 0 && (
                  <Badge bg="light" text="dark" className="rounded-pill">{selectedTypes.length}</Badge>
                )}
                <span>{showFilters ? '▲' : '▼'}</span>
              </Button>
              <Button
                variant={shinyMode ? 'warning' : 'outline-warning'}
                onClick={() => setShinyMode(!shinyMode)}
                className="rounded-pill px-3 fw-bold"
              >
                ✨ {t('pokedex.shinyDex')}
              </Button>
            </Col>
          </Row>

          {/* Fila 1.5: Selector de Gráficos por Generación */}
          <Row className="g-3 mb-3">
            <Col md={12}>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span className="fw-bold text-secondary">{t('pokedex.graphicsGen')}:</span>
                <ToggleButtonGroup
                  type="radio"
                  name="graphic-generation"
                  value={selectedGraphicGen}
                  onChange={(val) => {
                    setSelectedGraphicGen(val);
                    setCurrentPage(1);
                  }}
                >
                  {Object.entries(GRAPHIC_GENERATIONS).map(([key, { label }]) => (
                    <ToggleButton
                      key={key}
                      id={`gfx-${key}`}
                      value={key}
                      variant={selectedGraphicGen === key ? 'danger' : 'outline-danger'}
                      className="px-3"
                      size="sm"
                    >
                      {label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <small className="text-muted">
                  ({t('pokedex.graphicsDesc')})
                </small>
              </div>
            </Col>
          </Row>

          {/* Fila 2: Selector de Región (desplegable) */}
          <Row className="g-3 align-items-center">
            <Col md={12}>
              <div className="d-flex gap-2 align-items-center">
                <span className="fw-bold text-secondary">{t('pokedex.region')}:</span>
                <div className="d-flex gap-2">
                  {/* Botón Nacional */}
                  <Button
                    variant={pokedexView === 'national' ? 'danger' : 'outline-danger'}
                    onClick={() => setPokedexView('national')}
                    className="rounded-pill px-3"
                    size="sm"
                  >
                    🌍 {t('pokedex.national')}
                  </Button>
                  
                  {/* Dropdown de regiones - botón que parece igual que Nacional */}
                  <Dropdown>
                    <Dropdown.Toggle
                      variant={pokedexView !== 'national' ? 'danger' : 'outline-danger'}
                      size="sm"
                      className="rounded-pill px-3"
                    >
                      {pokedexView !== 'national' 
                        ? getAvailableRegions().find(r => r.key === pokedexView)?.label.replace('📍 ', '') || `📍 ${t('pokedex.region')}`
                        : `📍 ${t('pokedex.region')}`
                      }
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {getAvailableRegions()
                        .filter(r => r.key !== 'national')
                        .map((region) => (
                          <Dropdown.Item 
                            key={region.key} 
                            onClick={() => setPokedexView(region.key)}
                            active={pokedexView === region.key}
                          >
                            {region.label}
                          </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Col>
          </Row>

          {/* Filtros de tipo desplegables */}
          {showFilters && (
            <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: isDark ? '#23252f' : 'white', border: isDark ? '2px solid #2e303a' : '2px solid #dee2e6' }}>
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
                  {t('pokedex.clearFilters')}
                </Button>
                <Button
                  size="sm"
                  variant={strictMode ? 'danger' : 'outline-danger'}
                  onClick={() => setStrictMode(!strictMode)}
                >
                  {t('pokedex.exactFilter')} {strictMode && '✓'}
                </Button>
              </div>

              {selectedTypes.length > 0 && (
                <small className="text-muted d-block mt-2 text-center">
                  {selectedTypes.length} {t('pokedex.typesSelected')} |
                  {t('pokedex.mode')}: {strictMode ? t('pokedex.strictMode') : t('pokedex.normalMode')}
                </small>
              )}
            </div>
          )}
        </div>

        {/* Lista de Pokemon */}
        <div className="p-4" style={{ minHeight: '400px', backgroundColor: isDark ? '#1a1b23' : '#ffffff' }}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" size="lg" />
              <p className="mt-3 text-secondary">{t('pokedex.loading')}</p>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <small className="text-secondary" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>
                  {t('pokedex.showing')} {filteredPokemon.length} {t('pokedex.pokemon')}
                </small>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    {t('pokedex.previous')}
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
                    {t('pokedex.next')}
                  </Button>
                </div>
              </div>
              
              <Row>
                {paginatedPokemon.map(renderPokemonCard)}
              </Row>
            </>
          )}
        </div>

    </>
  );

  // Modal de detalle de Pokemon (separado para evitar anidamiento)
  const detailModal = selectedPokemon && (
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
        <div className="d-flex gap-2 ms-3">
          {token && (
            <Button
              variant={favorites.has(selectedPokemon.id) ? 'danger' : 'light'}
              size="sm"
              onClick={() => toggleFavorite(selectedPokemon)}
              className="rounded-circle d-flex align-items-center justify-content-center p-0"
              style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}
              title={favorites.has(selectedPokemon.id) ? t('pokedex.removeFavorite') : t('pokedex.addFavorite')}
            >
              {favorites.has(selectedPokemon.id) ? '❤️' : '🤍'}
            </Button>
          )}
          <Button
            variant="light"
            size="sm"
            onClick={() => setSelectedPokemon(null)}
            className="rounded-circle d-flex align-items-center justify-content-center p-0"
            style={{ width: '36px', height: '36px', fontWeight: 'bold', fontSize: '1.2rem' }}
          >
            ✕
          </Button>
        </div>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="text-center mb-4">
          {selectedPokemon.sprite && (
            <img
              src={(shinyMode || shinyPokemon.has(selectedPokemon.id)) ? selectedPokemon.shinySprite || selectedPokemon.sprite : selectedPokemon.sprite}
              alt={selectedPokemon.name}
              style={{ 
                width: selectedPokemon.animated ? '140px' : '120px', 
                height: selectedPokemon.animated ? '140px' : '120px', 
                imageRendering: selectedPokemon.animated ? 'auto' : 'pixelated'
              }}
              onError={(e) => {
                // Fallback a sprite estático si el animado falla
                if (selectedPokemon.animated) {
                  e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${selectedPokemon.id}.png`;
                }
              }}
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

          <h6 className="fw-bold mb-3">{t('pokedex.baseStats')}</h6>
          <div className="row g-2">
            {Object.entries(selectedPokemon.stats).map(([stat, value]) => (
              <div key={stat} className="col-6">
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: isDark ? '#23252f' : 'white' }}>
                  <small className="text-secondary" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>
                    {stat === 'specialAttack' ? t('pokedex.specialAttack') :
                     stat === 'specialDefense' ? t('pokedex.specialDefense') :
                     stat === 'hp' ? t('pokedex.hp') :
                     stat === 'attack' ? t('pokedex.attack') :
                     stat === 'defense' ? t('pokedex.defense') :
                     stat === 'speed' ? t('pokedex.speed') : stat}
                  </small>
                  <span className="fw-bold">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );

  if (standalone) {
    return (
      <div className={standalone ? '' : 'p-0'}>
        {headerContent}
        {mainContent}
        {detailModal}
      </div>
    );
  }

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        fullscreen="lg-down"
        centered
        style={{ zIndex: 9999 }}
      >
        {headerContent}
        <Modal.Body className="p-0">
          {mainContent}
        </Modal.Body>
      </Modal>
      {detailModal}
    </>
  );
}

export default PokedexModal;
