import { useState, useMemo } from 'react';
import { Button, Card, Row, Col, Form, Badge, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSettings, useTranslation } from '../contexts/SettingsContext';
import ALL_POKEMON_DATA from '../data/pokemonData.json';

const TYPE_CHART = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

function getTypeEffectiveness(atkType, defTypes) {
  let mult = 1;
  defTypes.forEach(dt => {
    mult *= (TYPE_CHART[atkType]?.[dt] ?? 1);
  });
  return mult;
}

function calcDamage(level, power, atk, def, stab, effectiveness, critical) {
  const base = ((((2 * level / 5 + 2) * power * atk / def) / 50) + 2);
  const stabMult = stab ? 1.5 : 1;
  const critMult = critical ? 1.5 : 1;
  const minRoll = Math.floor(base * 0.85 * stabMult * effectiveness * critMult);
  const maxRoll = Math.floor(base * 1.0 * stabMult * effectiveness * critMult);
  return { min: Math.max(minRoll, 0), max: Math.max(maxRoll, 0) };
}

function DamageCalcPage() {
  const { isDark } = useSettings();
  const { t } = useTranslation();

  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [level, setLevel] = useState(50);
  const [movePower, setMovePower] = useState(80);
  const [moveType, setMoveType] = useState('normal');
  const [isSpecial, setIsSpecial] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  const sugg1 = useMemo(() => {
    if (search1.length >= 2) {
      return ALL_POKEMON_DATA.filter(p => p.name.startsWith(search1.toLowerCase())).slice(0, 5);
    }
    return [];
  }, [search1]);

  const sugg2 = useMemo(() => {
    if (search2.length >= 2) {
      return ALL_POKEMON_DATA.filter(p => p.name.startsWith(search2.toLowerCase())).slice(0, 5);
    }
    return [];
  }, [search2]);

  const selectP1 = (p) => { setPokemon1(p); setSearch1(''); setMoveType(p.types[0]); };
  const selectP2 = (p) => { setPokemon2(p); setSearch2(''); };

  const result = (() => {
    if (!pokemon1 || !pokemon2) return null;
    const atk = isSpecial ? pokemon1.stats.specialAttack : pokemon1.stats.attack;
    const def = isSpecial ? pokemon2.stats.specialDefense : pokemon2.stats.defense;
    const stab = pokemon1.types.includes(moveType);
    const eff = getTypeEffectiveness(moveType, pokemon2.types);
    const dmg = calcDamage(level, movePower, atk, def, stab, eff, isCritical);
    const hp = pokemon2.stats.hp;
    const realHp = Math.floor(((2 * hp * level) / 100) + level + 10);
    return { ...dmg, effectiveness: eff, stab, realHp, pctMin: Math.round((dmg.min / realHp) * 100), pctMax: Math.round((dmg.max / realHp) * 100) };
  })();

  const textPrimary = isDark ? '#e8eaed' : '#1f2937';
  const textSecondary = isDark ? '#9ca3af' : '#6c757d';
  const cardBg = isDark ? '#23252f' : '#ffffff';
  const cardBorder = isDark ? '#2e303a' : '#e5e7eb';

  const renderPokemonSelector = (label, search, setSearchFn, suggestions, pokemon, onSelect, color) => (
    <Card className="border-0 h-100" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px' }}>
      <Card.Header className="fw-bold text-white" style={{ backgroundColor: color }}>{label}</Card.Header>
      <Card.Body className="p-3">
        <Form.Group className="position-relative mb-3">
          <Form.Control type="text" placeholder={t('damageCalc.searchPokemon')} value={search} onChange={e => setSearchFn(e.target.value)} autoComplete="off" />
          {suggestions.length > 0 && (
            <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 1000 }}>
              {suggestions.map(p => (
                <ListGroup.Item key={p.id} action onClick={() => onSelect(p)} className="text-capitalize">{p.name}</ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>
        {pokemon && (
          <div className="text-center">
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={pokemon.name}
              style={{ width: '96px', height: '96px', imageRendering: 'pixelated' }} />
            <h6 className="text-capitalize fw-bold mt-2" style={{ color: textPrimary }}>{pokemon.name}</h6>
            <div className="d-flex gap-1 justify-content-center mb-2">
              {pokemon.types.map(type => (
                <span
                  key={type}
                  style={{
                    backgroundColor: TYPE_COLORS[type],
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    letterSpacing: '0.6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    display: 'inline-block'
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
            <div className="row g-1">
              {Object.entries(pokemon.stats).map(([stat, val]) => (
                <div key={stat} className="col-6">
                  <small style={{ color: textSecondary, fontSize: '0.7rem' }}>
                    {stat === 'specialAttack' ? 'SpA' : stat === 'specialDefense' ? 'SpD' : stat.substring(0, 3).toUpperCase()}
                  </small>
                  <span className="fw-bold ms-1" style={{ color: textPrimary, fontSize: '0.8rem' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <Button as={Link} to="/dashboard" variant="outline-secondary" className="rounded-pill">{t('page.backToDashboard')}</Button>
          <h2 className="fw-bold m-0" style={{ color: textPrimary }}>{t('damageCalc.title')}</h2>
        </div>

        <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: isDark ? '#2a2d3d' : '#fce8e8', borderLeft: '4px solid #d32f2f' }}>
          <small style={{ color: isDark ? '#b0b3c7' : '#555' }}>
            {t('damageCalc.description')}
          </small>
        </div>

        <Row className="g-3 mb-4">
          <Col md={5}>
            {renderPokemonSelector(t('damageCalc.attacker'), search1, setSearch1, sugg1, pokemon1, selectP1, '#1976d2')}
          </Col>
          <Col md={2} className="d-flex align-items-center justify-content-center">
            <div className="text-center" style={{ fontSize: '2.5rem' }}>⚔️</div>
          </Col>
          <Col md={5}>
            {renderPokemonSelector(t('damageCalc.defender'), search2, setSearch2, sugg2, pokemon2, selectP2, '#d32f2f')}
          </Col>
        </Row>

        {/* Move Config */}
        <Card className="border-0 mb-4" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px' }}>
          <Card.Body className="p-4">
            <h6 className="fw-bold mb-3" style={{ color: textPrimary }}>{t('damageCalc.moveConfig')}</h6>
            <Row className="g-3">
              <Col sm={3}>
                <Form.Label style={{ color: textSecondary, fontSize: '0.85rem' }}>{t('damageCalc.level')}</Form.Label>
                <Form.Control type="number" value={level} min={1} max={100} onChange={e => setLevel(Number(e.target.value))} />
              </Col>
              <Col sm={3}>
                <Form.Label style={{ color: textSecondary, fontSize: '0.85rem' }}>{t('damageCalc.power')}</Form.Label>
                <Form.Control type="number" value={movePower} min={0} max={300} onChange={e => setMovePower(Number(e.target.value))} />
              </Col>
              <Col sm={3}>
                <Form.Label style={{ color: textSecondary, fontSize: '0.85rem' }}>{t('damageCalc.moveType')}</Form.Label>
                <Form.Select value={moveType} onChange={e => setMoveType(e.target.value)}>
                  {Object.keys(TYPE_COLORS).map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col sm={3} className="d-flex flex-column justify-content-end gap-2">
                <Form.Check type="switch" label={t('damageCalc.special')} checked={isSpecial} onChange={e => setIsSpecial(e.target.checked)} />
                <Form.Check type="switch" label={t('damageCalc.critical')} checked={isCritical} onChange={e => setIsCritical(e.target.checked)} />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Result */}
        {result && (
          <Card className="border-0" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px' }}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: textPrimary }}>📊 {t('damageCalc.result')}</h6>
              <Row className="g-3 mb-3">
                <Col xs={6} sm={3}>
                  <div className="text-center rounded-3 p-3" style={{ backgroundColor: isDark ? '#2e3040' : '#f5f5f5' }}>
                    <small style={{ color: textSecondary }}>{t('damageCalc.damage')}</small>
                    <h4 className="fw-bold mb-0" style={{ color: '#ef5350' }}>{result.min} - {result.max}</h4>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="text-center rounded-3 p-3" style={{ backgroundColor: isDark ? '#2e3040' : '#f5f5f5' }}>
                    <small style={{ color: textSecondary }}>% HP</small>
                    <h4 className="fw-bold mb-0" style={{ color: '#ffa726' }}>{result.pctMin}% - {result.pctMax}%</h4>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="text-center rounded-3 p-3" style={{ backgroundColor: isDark ? '#2e3040' : '#f5f5f5' }}>
                    <small style={{ color: textSecondary }}>{t('damageCalc.effectiveness')}</small>
                    <h4 className="fw-bold mb-0" style={{ color: result.effectiveness >= 2 ? '#4caf50' : result.effectiveness < 1 ? '#ef5350' : '#ffa726' }}>
                      x{result.effectiveness}
                    </h4>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="text-center rounded-3 p-3" style={{ backgroundColor: isDark ? '#2e3040' : '#f5f5f5' }}>
                    <small style={{ color: textSecondary }}>STAB</small>
                    <h4 className="fw-bold mb-0" style={{ color: result.stab ? '#4caf50' : textSecondary }}>{result.stab ? '✓ x1.5' : '✗'}</h4>
                  </div>
                </Col>
              </Row>
              <div className="rounded-3 p-3" style={{ backgroundColor: isDark ? '#2e3040' : '#f5f5f5' }}>
                <small style={{ color: textSecondary }}>{t('damageCalc.hpNote')}: </small>
                <small className="fw-bold" style={{ color: textPrimary }}>
                  {pokemon2.name} HP = {result.realHp} (Lv.{level}) →{' '}
                  {result.pctMax >= 100
                    ? <span style={{ color: '#4caf50' }}>{t('damageCalc.ohko')}</span>
                    : result.pctMin >= 50
                    ? <span style={{ color: '#ffa726' }}>{t('damageCalc.twoHko')}</span>
                    : <span style={{ color: '#ef5350' }}>{t('damageCalc.threeHko')}</span>
                  }
                </small>
              </div>
            </Card.Body>
          </Card>
        )}

        {!pokemon1 && !pokemon2 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem' }}>🧮</div>
            <h5 style={{ color: textSecondary }}>{t('damageCalc.selectTwo')}</h5>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DamageCalcPage;
