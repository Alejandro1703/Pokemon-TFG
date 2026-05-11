import { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, Row, Col, Badge, Spinner, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSettings, useTranslation } from '../contexts/SettingsContext';
import {
  ENCOUNTERS_DATA,
  ENCOUNTER_METHODS,
  GEN_LABELS,
  POKEMON_IDS,
  ROUTE_NAMES,
  getPokemonId,
  getRoutesByPokemon,
  searchRoutes,
} from '../data/encountersData';
import { getPokemonObtencion, OBTENCION_METHODS } from '../data/pokemonObtencion';

const POKEMON_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

function EncountersPage() {
  const { isDark } = useSettings();
  const { t, language } = useTranslation();

  const [searchMode, setSearchMode] = useState('pokemon');
  const [genFilter, setGenFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const suggRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggRef.current && !suggRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pokemonList = useRef([]);
  useEffect(() => {
    // Incluir TODOS los Pokemon de Gen 1-5 (649) para autocompletado
    const allNames = Object.keys(POKEMON_IDS)
      .filter(n => n.charAt(0) === n.charAt(0).toUpperCase())
      .sort();
    pokemonList.current = allNames;
  }, []);

  const handleInput = (value) => {
    setSearchQuery(value);
    setResults(null);
    if (value.length >= 1) {
      let filtered = [];
      if (searchMode === 'pokemon') {
        filtered = pokemonList.current
          .filter(p => p.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 10);
      } else {
        filtered = ROUTE_NAMES
          .filter(r =>
            r.name_es.toLowerCase().includes(value.toLowerCase()) ||
            r.name_en.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 10)
          .map(r => r.name_es);
      }
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (value) => {
    setSearchQuery(value);
    setShowSuggestions(false);
    performSearch(value);
  };

  const performSearch = (query, overrideGenFilter = null) => {
    if (!query.trim()) return;
    const activeFilter = overrideGenFilter !== null ? overrideGenFilter : genFilter;
    setLoading(true);
    setTimeout(() => {
      if (searchMode === 'pokemon') {
        const found = getRoutesByPokemon(query, activeFilter);
        setResults({ type: 'pokemon', pokemon: query, routes: found });
      } else {
        const found = searchRoutes(query, activeFilter);
        if (found.length > 0) {
          setResults({ type: 'route', route: found[0] });
        } else {
          setResults({ type: 'route', route: null });
        }
      }
      setLoading(false);
    }, 300);
  };

  const getMethodLabel = (method) => {
    const trans = ENCOUNTER_METHODS[method];
    return trans ? trans[language] || trans.en : method;
  };

  const getRouteName = (routeData) => {
    if (!routeData) return '';
    return language === 'es' ? routeData.name_es : routeData.name_en;
  };

  const getGenLabel = (gen) => {
    const label = GEN_LABELS[gen];
    if (!label) return `Gen ${gen}`;
    return language === 'es' ? label.es : label.en;
  };

  const getGenColor = (gen) => {
    return GEN_LABELS[gen]?.color || '#888';
  };

  const getSpriteUrl = (name) => {
    const id = getPokemonId(name);
    if (id) return `${POKEMON_SPRITE_BASE}/${id}.png`;
    return `${POKEMON_SPRITE_BASE}/${name.toLowerCase().replace(/ /g, '-')}.png`;
  };

  const groupEncountersByPokemon = (encounters) => {
    const groups = {};
    for (const enc of encounters) {
      const key = `${enc.pokemon}|${enc.method}`;
      if (!groups[key]) {
        groups[key] = { pokemon: enc.pokemon, method: enc.method, min_level: enc.min_level, max_level: enc.max_level, gens: [] };
      }
      groups[key].gens.push({ gen: enc.gen, chance: enc.chance });
    }
    return Object.values(groups).sort((a, b) => a.pokemon.localeCompare(b.pokemon));
  };

  const gens = [1, 2, 3, 4, 5];

  return (
    <DashboardLayout>
      <div
        className="p-4"
        style={{
          backgroundColor: isDark ? '#1a1b23' : '#f8f9fa',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <div
          className="rounded-3 p-4 mb-4"
          style={{
            background: 'linear-gradient(135deg, #00c853 0%, #009624 100%)',
          }}
        >
          <h2 className="text-white fw-bold m-0">{t('encounters.title')}</h2>
          <p className="text-white-50 mb-0 mt-2" style={{ opacity: 0.9 }}>
            {t('encounters.subtitle')}
          </p>
        </div>

        {/* Toggle modo */}
        <div className="d-flex gap-2 mb-3 justify-content-center">
          <Button
            variant={searchMode === 'pokemon' ? 'success' : 'outline-success'}
            className="rounded-pill fw-bold"
            onClick={() => {
              setSearchMode('pokemon');
              setSearchQuery('');
              setResults(null);
              setSuggestions([]);
            }}
          >
            {t('encounters.searchByPokemon')}
          </Button>
          <Button
            variant={searchMode === 'route' ? 'success' : 'outline-success'}
            className="rounded-pill fw-bold"
            onClick={() => {
              setSearchMode('route');
              setSearchQuery('');
              setResults(null);
              setSuggestions([]);
            }}
          >
            {t('encounters.searchByRoute')}
          </Button>
        </div>

        {/* Filtro de generación */}
        <div className="mb-3 text-center">
          <small className="text-muted d-block mb-2" style={{ color: isDark ? '#9ca3af' : '#6c757d', fontSize: '0.8rem' }}>
            {t('encounters.genFilter')}
          </small>
          <ToggleButtonGroup
            type="radio"
            name="gen-filter"
            value={genFilter}
            onChange={(val) => {
              setGenFilter(val);
              if (searchQuery.trim()) performSearch(searchQuery, val);
            }}
            className="flex-wrap justify-content-center"
          >
            <ToggleButton
              id="gen-all"
              value="all"
              variant={genFilter === 'all' ? 'dark' : 'outline-dark'}
              className="rounded-pill px-3 py-1 mb-1"
              size="sm"
              style={{
                backgroundColor: genFilter === 'all' ? (isDark ? '#536dfe' : '#1976d2') : 'transparent',
                borderColor: genFilter === 'all' ? (isDark ? '#3d4fe0' : '#1565c0') : (isDark ? '#4a4560' : '#dee2e6'),
                color: genFilter === 'all' ? '#fff' : (isDark ? '#c8ccd4' : '#666'),
                fontSize: '0.8rem',
              }}
            >
              {t('encounters.allGens')}
            </ToggleButton>
            {gens.map((g) => (
              <ToggleButton
                key={g}
                id={`gen-${g}`}
                value={String(g)}
                variant={genFilter === String(g) ? 'dark' : 'outline-dark'}
                className="rounded-pill px-3 py-1 mb-1 ms-1"
                size="sm"
                style={{
                  backgroundColor: genFilter === String(g) ? getGenColor(g) : 'transparent',
                  borderColor: genFilter === String(g) ? getGenColor(g) : (isDark ? '#4a4560' : '#dee2e6'),
                  color: genFilter === String(g) ? '#fff' : (isDark ? '#c8ccd4' : '#666'),
                  fontSize: '0.8rem',
                }}
              >
                {getGenLabel(g)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        {/* Input */}
        <div className="position-relative mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Form.Control
            ref={inputRef}
            type="text"
            placeholder={searchMode === 'pokemon' ? t('encounters.pokemonPlaceholder') : t('encounters.routePlaceholder')}
            value={searchQuery}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setShowSuggestions(false);
                performSearch(searchQuery);
              }
            }}
            className="py-2"
            style={{
              borderRadius: '25px',
              fontSize: '1rem',
              backgroundColor: isDark ? '#23252f' : '#fff',
              color: isDark ? '#e8eaed' : '#333',
              border: isDark ? '1px solid #2e303a' : '1px solid #dee2e6',
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggRef}
              className="position-absolute w-100 mt-1 rounded-3 shadow"
              style={{
                zIndex: 1000,
                maxHeight: '280px',
                overflowY: 'auto',
                backgroundColor: isDark ? '#1a1b23' : '#fff',
                border: isDark ? '1px solid #2e303a' : '1px solid #dee2e6',
              }}
            >
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="px-3 py-2 d-flex align-items-center gap-2"
                  style={{
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    borderBottom: isDark ? '1px solid #2e303a' : '1px solid #f0f0f0',
                    color: isDark ? '#e8eaed' : '#333',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? '#2e3040' : '#f8f9fa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  onMouseDown={() => selectSuggestion(s)}
                >
                  {searchMode === 'pokemon' && (
                    <img
                      src={getSpriteUrl(s)}
                      alt={s}
                      style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resultados */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-3 text-secondary">{t('encounters.searching')}</p>
          </div>
        )}

        {!loading && results && results.type === 'pokemon' && (
          <div>
            <div className="d-flex align-items-center gap-3 mb-4">
              <img
                src={getSpriteUrl(results.pokemon)}
                alt={results.pokemon}
                style={{ width: '64px', height: '64px', imageRendering: 'pixelated' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h4 className="fw-bold m-0" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                  {results.pokemon}
                </h4>
                <p className="text-muted mb-0" style={{ color: isDark ? '#9ca3af' : '#6c757d', fontSize: '0.85rem' }}>
                  {t('encounters.foundInRoutes')}
                </p>
              </div>
            </div>

            {results.routes.length === 0 ? (
              <Card className="border-0 shadow-sm" style={{ backgroundColor: isDark ? '#23252f' : '#fff' }}>
                <Card.Body className="text-center py-5">
                  {getPokemonId(results.pokemon) ? (
                    <>
                      <img
                        src={getSpriteUrl(results.pokemon)}
                        alt={results.pokemon}
                        style={{ width: '64px', height: '64px', imageRendering: 'pixelated', opacity: 0.5 }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <p className="text-muted mt-3 mb-3">{t('encounters.noWildEncounters')}</p>
                      {/* Información de obtención alternativa */}
                      {(() => {
                        const obtencion = getPokemonObtencion(results.pokemon);
                        if (obtencion) {
                          const methodInfo = OBTENCION_METHODS[obtencion.method];
                          const methodLabel = methodInfo ? (language === 'es' ? methodInfo.label_es : methodInfo.label_en) : obtencion.method;
                          const methodColor = methodInfo?.color || '#888';
                          return (
                            <div
                              className="mt-3 p-3 rounded-3 mx-auto"
                              style={{
                                maxWidth: '400px',
                                backgroundColor: isDark ? '#2e3040' : '#f8f9fa',
                                border: `2px solid ${methodColor}`,
                              }}
                            >
                              <div className="d-flex align-items-center gap-2 mb-2 justify-content-center">
                                <span style={{ fontSize: '1.2rem' }}>{methodInfo?.icon || '•'}</span>
                                <Badge
                                  className="rounded-pill"
                                  style={{
                                    backgroundColor: methodColor,
                                    color: '#fff',
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  {methodLabel}
                                </Badge>
                                {obtencion.gen && (
                                  <Badge
                                    className="rounded-pill"
                                    style={{
                                      backgroundColor: GEN_LABELS[obtencion.gen]?.color || '#888',
                                      color: '#fff',
                                      fontSize: '0.7rem',
                                    }}
                                  >
                                    {language === 'es' ? GEN_LABELS[obtencion.gen]?.es : GEN_LABELS[obtencion.gen]?.en}
                                  </Badge>
                                )}
                              </div>
                              <p className="m-0 fw-semibold" style={{ color: isDark ? '#e8eaed' : '#333', fontSize: '0.9rem' }}>
                                {language === 'es' ? obtencion.location_es : obtencion.location_en}
                              </p>
                              {obtencion.note_es && (
                                <small className="d-block mt-1" style={{ color: isDark ? '#9ca3af' : '#6c757d', fontSize: '0.75rem' }}>
                                  {language === 'es' ? obtencion.note_es : obtencion.note_en}
                                </small>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </>
                  ) : (
                    <p className="text-muted">{t('encounters.noResults')}</p>
                  )}
                </Card.Body>
              </Card>
            ) : (
              <Row className="g-3">
                {results.routes.map(({ routeKey, routeName, encounters }) => (
                  <Col md={6} lg={4} key={routeKey}>
                    <Card
                      className="h-100 border-0 shadow-sm"
                      style={{ backgroundColor: isDark ? '#23252f' : '#fff' }}
                    >
                      <Card.Header
                        className="fw-bold d-flex justify-content-between align-items-center"
                        style={{
                          backgroundColor: isDark ? '#2e3040' : '#e8f5e9',
                          color: isDark ? '#e8eaed' : '#2e7d32',
                          borderBottom: isDark ? '1px solid #3d3f50' : '1px solid #c8e6c9',
                        }}
                      >
                        <span>{getRouteName(routeName)}</span>
                        <Badge
                          className="rounded-pill"
                          style={{
                            fontSize: '0.65rem',
                            backgroundColor: getGenColor(routeName.gen),
                            color: '#fff',
                          }}
                        >
                          {getGenLabel(routeName.gen)}
                        </Badge>
                      </Card.Header>
                      <Card.Body className="p-0">
                        {genFilter === 'all'
                          ? groupEncountersByPokemon(encounters).map((group, idx, arr) => (
                              <div
                                key={idx}
                                className="d-flex align-items-center p-2"
                                style={{
                                  borderBottom: idx < arr.length - 1 ? (isDark ? '1px solid #2e303a' : '1px solid #f0f0f0') : 'none',
                                }}
                              >
                                <img
                                  src={getSpriteUrl(group.pokemon)}
                                  alt={group.pokemon}
                                  style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <div className="flex-grow-1 ms-2">
                                  <div className="fw-semibold" style={{ fontSize: '0.85rem', color: isDark ? '#e8eaed' : '#333' }}>
                                    {group.pokemon}
                                  </div>
                                  <small style={{ fontSize: '0.7rem', color: isDark ? '#9ca3af' : '#6c757d' }}>
                                    {getMethodLabel(group.method)} · Lv.{group.min_level}{group.max_level !== group.min_level ? `-${group.max_level}` : ''}
                                  </small>
                                </div>
                                <div className="d-flex flex-column gap-1 align-items-end">
                                  {group.gens.map((g, gi) => (
                                    <Badge
                                      key={gi}
                                      className="rounded-pill"
                                      style={{
                                        fontSize: '0.65rem',
                                        backgroundColor: getGenColor(g.gen),
                                        color: '#fff',
                                      }}
                                    >
                                      {getGenLabel(g.gen)} {g.chance}%
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))
                          : encounters.map((enc, idx) => (
                              <div
                                key={idx}
                                className="d-flex align-items-center p-2"
                                style={{
                                  borderBottom: idx < encounters.length - 1 ? (isDark ? '1px solid #2e303a' : '1px solid #f0f0f0') : 'none',
                                }}
                              >
                                <img
                                  src={getSpriteUrl(enc.pokemon)}
                                  alt={enc.pokemon}
                                  style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <div className="flex-grow-1 ms-2">
                                  <div className="fw-semibold" style={{ fontSize: '0.85rem', color: isDark ? '#e8eaed' : '#333' }}>
                                    {enc.pokemon}
                                  </div>
                                  <small style={{ fontSize: '0.7rem', color: isDark ? '#9ca3af' : '#6c757d' }}>
                                    {getMethodLabel(enc.method)} · Lv.{enc.min_level}{enc.max_level !== enc.min_level ? `-${enc.max_level}` : ''}
                                  </small>
                                </div>
                                <Badge
                                  className="rounded-pill"
                                  style={{
                                    fontSize: '0.7rem',
                                    backgroundColor: getGenColor(enc.gen),
                                    color: '#fff',
                                  }}
                                >
                                  {enc.chance}%
                                </Badge>
                              </div>
                            ))}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        )}

        {!loading && results && results.type === 'route' && (
          <div>
            {results.route ? (
              <>
                <h4 className="fw-bold mb-3" style={{ color: isDark ? '#e8eaed' : '#333' }}>
                  {t('encounters.pokemonInRoute')} <span className="text-success">{getRouteName(results.route)}</span>
                  <Badge
                    className="rounded-pill ms-2"
                    style={{
                      fontSize: '0.75rem',
                      backgroundColor: getGenColor(results.route.gen),
                      color: '#fff',
                    }}
                  >
                    {getGenLabel(results.route.gen)}
                  </Badge>
                </h4>
                <Card className="border-0 shadow-sm" style={{ backgroundColor: isDark ? '#23252f' : '#fff' }}>
                  <Card.Body className="p-0">
                    {genFilter === 'all'
                      ? groupEncountersByPokemon(results.route.encounters).map((group, idx, arr) => (
                          <div
                            key={idx}
                            className="d-flex align-items-center p-3"
                            style={{
                              borderBottom: idx < arr.length - 1 ? (isDark ? '1px solid #2e303a' : '1px solid #f0f0f0') : 'none',
                            }}
                          >
                            <img
                              src={getSpriteUrl(group.pokemon)}
                              alt={group.pokemon}
                              style={{ width: '48px', height: '48px', imageRendering: 'pixelated' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div className="flex-grow-1 ms-3">
                              <div className="fw-bold" style={{ fontSize: '0.95rem', color: isDark ? '#e8eaed' : '#333' }}>
                                {group.pokemon}
                              </div>
                              <small style={{ fontSize: '0.75rem', color: isDark ? '#9ca3af' : '#6c757d' }}>
                                {getMethodLabel(group.method)} · {t('encounters.level')}: {group.min_level}{group.max_level !== group.min_level ? `-${group.max_level}` : ''}
                              </small>
                            </div>
                            <div className="d-flex flex-column gap-1 align-items-end">
                              {group.gens.map((g, gi) => (
                                <Badge
                                  key={gi}
                                  className="rounded-pill px-2 py-1"
                                  style={{
                                    fontSize: '0.75rem',
                                    backgroundColor: getGenColor(g.gen),
                                    color: '#fff',
                                  }}
                                >
                                  {getGenLabel(g.gen)} {g.chance}%
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))
                      : results.route.encounters.map((enc, idx) => (
                          <div
                            key={idx}
                            className="d-flex align-items-center p-3"
                            style={{
                              borderBottom: idx < results.route.encounters.length - 1 ? (isDark ? '1px solid #2e303a' : '1px solid #f0f0f0') : 'none',
                            }}
                          >
                            <img
                              src={getSpriteUrl(enc.pokemon)}
                              alt={enc.pokemon}
                              style={{ width: '48px', height: '48px', imageRendering: 'pixelated' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div className="flex-grow-1 ms-3">
                              <div className="fw-bold" style={{ fontSize: '0.95rem', color: isDark ? '#e8eaed' : '#333' }}>
                                {enc.pokemon}
                              </div>
                              <small style={{ fontSize: '0.75rem', color: isDark ? '#9ca3af' : '#6c757d' }}>
                                {getMethodLabel(enc.method)} · {t('encounters.level')}: {enc.min_level}{enc.max_level !== enc.min_level ? `-${enc.max_level}` : ''}
                              </small>
                            </div>
                            <Badge
                              className="rounded-pill px-3 py-2"
                              style={{
                                fontSize: '0.8rem',
                                backgroundColor: getGenColor(enc.gen),
                                color: '#fff',
                              }}
                            >
                              {enc.chance}%
                            </Badge>
                          </div>
                        ))}
                  </Card.Body>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-sm" style={{ backgroundColor: isDark ? '#23252f' : '#fff' }}>
                <Card.Body className="text-center py-5">
                  <p className="text-muted">{t('encounters.noResults')}</p>
                </Card.Body>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default EncountersPage;
