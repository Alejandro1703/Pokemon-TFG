import { useState, useEffect, useMemo } from 'react';
import { Button, Card, Row, Col, Form, Badge, Spinner, ListGroup, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSettings, useTranslation } from '../contexts/SettingsContext';
import ALL_POKEMON_DATA from '../data/pokemonData.json';
import { COMMON_MOVES, COMMON_ITEMS, ITEM_SPRITE_URL } from '../data/teamBuilderData';

const API_URL = import.meta.env.VITE_API_URL || 'https://pokemon-tfg-backend.onrender.com';

const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

function TeamBuilderPage() {
  const { isDark } = useSettings();
  const { t } = useTranslation();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [teamGame, setTeamGame] = useState('');
  const [members, setMembers] = useState([null, null, null, null, null, null]);
  const [searchSlot, setSearchSlot] = useState(null);
  const [slotSearch, setSlotSearch] = useState('');
  const [memberDetailIdx, setMemberDetailIdx] = useState(null);
  const [tempMoves, setTempMoves] = useState(['', '', '', '']);
  const [tempItem, setTempItem] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [moveSearches, setMoveSearches] = useState(['', '', '', '']);
  const [focusedMoveIdx, setFocusedMoveIdx] = useState(null);

  const itemSuggestions = useMemo(() => {
    if (itemSearch.length < 2) return [];
    const q = itemSearch.toLowerCase();
    return COMMON_ITEMS.filter(it => it.name.toLowerCase().includes(q) || it.slug.includes(q)).slice(0, 6);
  }, [itemSearch]);

  const getMoveSuggestions = (idx) => {
    const q = moveSearches[idx].toLowerCase();
    if (q.length < 2) return [];
    return COMMON_MOVES.filter(m => m.toLowerCase().includes(q)).slice(0, 6);
  };

  const token = localStorage.getItem('token');

  const suggestions = useMemo(() => {
    if (slotSearch.length >= 2) {
      return ALL_POKEMON_DATA.filter(p => p.name.startsWith(slotSearch.toLowerCase())).slice(0, 6);
    }
    return [];
  }, [slotSearch]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/equipos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTeams(data.map(t => ({ ...t, miembros: t.miembros ? JSON.parse(t.miembros) : [] })));
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchTeams(); }, []);

  const openNewTeam = () => {
    setEditingTeam(null);
    setTeamName('');
    setTeamGame('');
    setMembers([null, null, null, null, null, null]);
    setShowModal(true);
  };

  const openEditTeam = (team) => {
    setEditingTeam(team);
    setTeamName(team.nombre);
    setTeamGame(team.juegoNombre || '');
    const m = team.miembros || [];
    setMembers([...m, ...Array(6 - m.length).fill(null)]);
    setShowModal(true);
  };

  const addPokemonToSlot = (p) => {
    if (searchSlot === null) return;
    const newMembers = [...members];
    newMembers[searchSlot] = { id: p.id, name: p.name, types: p.types, stats: p.stats, moves: ['', '', '', ''], item: '' };
    setMembers(newMembers);
    setSearchSlot(null);
    setSlotSearch('');
  };

  const openMemberDetail = (idx, e) => {
    if (e) e.stopPropagation();
    const member = members[idx];
    if (!member) return;
    setMemberDetailIdx(idx);
    setTempMoves(member.moves ? [...member.moves] : ['', '', '', '']);
    setTempItem(member.item || '');
  };

  const saveMemberDetail = () => {
    if (memberDetailIdx === null) return;
    const newMembers = [...members];
    newMembers[memberDetailIdx] = {
      ...newMembers[memberDetailIdx],
      moves: tempMoves.map(m => m.trim()).slice(0, 4),
      item: tempItem.trim()
    };
    setMembers(newMembers);
    setMemberDetailIdx(null);
    setTempMoves(['', '', '', '']);
    setTempItem('');
    setItemSearch('');
    setMoveSearches(['', '', '', '']);
    setFocusedMoveIdx(null);
  };

  const selectItem = (itemName) => {
    setTempItem(itemName);
    setItemSearch('');
  };

  const selectMove = (idx, moveName) => {
    const newMoves = [...tempMoves];
    newMoves[idx] = moveName;
    setTempMoves(newMoves);
    const newSearches = [...moveSearches];
    newSearches[idx] = '';
    setMoveSearches(newSearches);
    setFocusedMoveIdx(null);
  };

  const removeSlot = (idx) => {
    const newMembers = [...members];
    newMembers[idx] = null;
    setMembers(newMembers);
  };

  const saveTeam = async () => {
    const validMembers = members.filter(Boolean);
    if (!teamName.trim() || validMembers.length === 0) return;

    const body = {
      nombre: teamName.trim(),
      juegoNombre: teamGame.trim() || null,
      miembros: JSON.stringify(validMembers)
    };

    try {
      const url = editingTeam ? `${API_URL}/api/equipos/${editingTeam.id}` : `${API_URL}/api/equipos`;
      const method = editingTeam ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setShowModal(false);
        fetchTeams();
      }
    } catch (err) {
      console.error('Error saving team:', err);
    }
  };

  const deleteTeam = async (id) => {
    try {
      await fetch(`${API_URL}/api/equipos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTeams();
    } catch (err) {
      console.error('Error deleting team:', err);
    }
  };

  const textPrimary = isDark ? '#e8eaed' : '#1f2937';
  const textSecondary = isDark ? '#9ca3af' : '#6c757d';
  const cardBg = isDark ? '#23252f' : '#ffffff';
  const cardBorder = isDark ? '#2e303a' : '#e5e7eb';

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
          <Button as={Link} to="/dashboard" variant="outline-secondary" className="rounded-pill">{t('page.backToDashboard')}</Button>
          <h2 className="fw-bold m-0" style={{ color: textPrimary }}>{t('teamBuilder.title')}</h2>
          <Button variant="primary" className="ms-auto rounded-pill" onClick={openNewTeam}>{t('teamBuilder.newTeam')}</Button>
        </div>

        <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: isDark ? '#2a2d3d' : '#e8f4fd', borderLeft: '4px solid #1976d2' }}>
          <small style={{ color: isDark ? '#b0b3c7' : '#555' }}>
            {t('teamBuilder.description')}
          </small>
        </div>

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
        ) : teams.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem' }}>🏟️</div>
            <h5 style={{ color: textSecondary }}>{t('teamBuilder.noTeams')}</h5>
            <Button variant="primary" className="rounded-pill mt-2" onClick={openNewTeam}>{t('teamBuilder.createFirst')}</Button>
          </div>
        ) : (
          <Row className="g-3">
            {teams.map(team => (
              <Col md={12} lg={6} key={team.id}>
                <Card className="border-0 h-100 shadow-sm" style={{ backgroundColor: cardBg, borderRadius: '16px' }}>
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-1" style={{ color: textPrimary }}>{team.nombre}</h6>
                        {team.juegoNombre && <small style={{ color: textSecondary }}>{team.juegoNombre}</small>}
                      </div>
                      <div className="d-flex gap-2">
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => openEditTeam(team)}
                          onKeyDown={(e) => e.key === 'Enter' && openEditTeam(team)}
                          className="d-inline-flex align-items-center px-3 py-1 rounded-pill fw-bold"
                          style={{
                            fontSize: '0.78rem',
                            color: isDark ? '#90caf9' : '#1976d2',
                            backgroundColor: isDark ? 'rgba(25,118,210,0.15)' : 'rgba(25,118,210,0.08)',
                            border: `1px solid ${isDark ? 'rgba(25,118,210,0.35)' : 'rgba(25,118,210,0.25)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            userSelect: 'none'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(25,118,210,0.25)' : 'rgba(25,118,210,0.15)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(25,118,210,0.15)' : 'rgba(25,118,210,0.08)';
                          }}
                        >
                          {t('common.edit')}
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => deleteTeam(team.id)}
                          onKeyDown={(e) => e.key === 'Enter' && deleteTeam(team.id)}
                          className="d-inline-flex align-items-center px-3 py-1 rounded-pill fw-bold"
                          style={{
                            fontSize: '0.78rem',
                            color: isDark ? '#ef9a9a' : '#d32f2f',
                            backgroundColor: isDark ? 'rgba(211,47,47,0.15)' : 'rgba(211,47,47,0.08)',
                            border: `1px solid ${isDark ? 'rgba(211,47,47,0.35)' : 'rgba(211,47,47,0.25)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            userSelect: 'none'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(211,47,47,0.25)' : 'rgba(211,47,47,0.15)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(211,47,47,0.15)' : 'rgba(211,47,47,0.08)';
                          }}
                        >
                          {t('common.delete')}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex gap-3 flex-wrap">
                      {(team.miembros || []).map((m, idx) => (
                        <div key={idx} className="text-center" style={{ width: '96px' }}>
                          <div className="d-flex gap-1 justify-content-center flex-nowrap mb-1">
                            {m.types.map(tpe => (
                              <span
                                key={tpe}
                                style={{
                                  backgroundColor: TYPE_COLORS[tpe],
                                  color: '#fff',
                                  fontWeight: 700,
                                  fontSize: '0.55rem',
                                  textTransform: 'uppercase',
                                  padding: '2px 5px',
                                  borderRadius: '20px',
                                  letterSpacing: '0.3px',
                                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                                  display: 'inline-block',
                                  whiteSpace: 'nowrap'
                                }}
                              >{tpe}</span>
                            ))}
                          </div>
                          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.id}.png`}
                            alt={m.name} style={{ width: '72px', height: '72px', imageRendering: 'pixelated' }} />
                          <div style={{ fontSize: '0.75rem', color: textSecondary, textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                          {m.item && <div style={{ fontSize: '0.6rem', color: '#ffa726' }}>📦{m.item.substring(0,10)}</div>}
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Modal crear/editar equipo */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton style={{ backgroundColor: isDark ? '#1a1b23' : '#f8f9fa' }}>
            <Modal.Title style={{ color: textPrimary }}>
              {editingTeam ? t('teamBuilder.editTeam') : t('teamBuilder.newTeam')}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: isDark ? '#23252f' : '#fff' }}>
            <Row className="g-3 mb-3">
              <Col sm={6}>
                <Form.Label style={{ color: textSecondary }}>{t('teamBuilder.teamName')}</Form.Label>
                <Form.Control value={teamName} onChange={e => setTeamName(e.target.value)} placeholder={t('teamBuilder.teamNamePlaceholder')} />
              </Col>
              <Col sm={6}>
                <Form.Label style={{ color: textSecondary }}>{t('teamBuilder.game')}</Form.Label>
                <Form.Control value={teamGame} onChange={e => setTeamGame(e.target.value)} placeholder={t('teamBuilder.gamePlaceholder')} />
              </Col>
            </Row>

            <h6 className="fw-bold mb-3" style={{ color: textPrimary }}>{t('teamBuilder.members')}</h6>
            <Row className="g-2 mb-3">
              {members.map((member, idx) => (
                <Col xs={4} sm={2} key={idx}>
                  <div
                    className="text-center rounded-3 p-2 position-relative"
                    style={{
                      backgroundColor: isDark ? '#2e3040' : '#f0f0f0',
                      border: searchSlot === idx ? '2px solid #1976d2' : `1px solid ${cardBorder}`,
                      cursor: 'pointer', minHeight: '100px'
                    }}
                    onClick={() => { setSearchSlot(idx); setSlotSearch(''); }}
                  >
                    {member ? (
                      <>
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.id}.png`}
                          alt={member.name} style={{ width: '56px', height: '56px', imageRendering: 'pixelated' }} />
                        <div style={{ fontSize: '0.65rem', color: textPrimary, textTransform: 'capitalize' }}>{member.name}</div>
                        <div className="d-flex gap-1 justify-content-center flex-wrap mt-1">
                          {member.types.map(tpe => (
                            <span
                              key={tpe}
                              style={{
                                backgroundColor: TYPE_COLORS[tpe],
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.5rem',
                                textTransform: 'uppercase',
                                padding: '2px 6px',
                                borderRadius: '20px',
                                letterSpacing: '0.4px',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                                display: 'inline-block'
                              }}
                            >{tpe}</span>
                          ))}
                        </div>
                        {member.item && <div style={{ fontSize: '0.5rem', color: '#ffa726' }}>📦 {member.item}</div>}
                        <Button variant="link" size="sm" className="p-0 position-absolute" style={{ top: '2px', right: '4px', fontSize: '0.7rem' }} onClick={(e) => { e.stopPropagation(); removeSlot(idx); }}>✕</Button>
                        <Button variant="link" size="sm" className="p-0 position-absolute" style={{ top: '2px', left: '4px', fontSize: '0.7rem' }} onClick={(e) => openMemberDetail(idx, e)} title={t('teamBuilder.editMovesItem')}>⚙️</Button>
                      </>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center" style={{ height: '80px' }}>
                        <span style={{ fontSize: '1.5rem', color: textSecondary }}>+</span>
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {searchSlot !== null && (
              <div className="position-relative mb-3">
                <Form.Control value={slotSearch} onChange={e => setSlotSearch(e.target.value)} placeholder={t('teamBuilder.searchPokemon')} autoFocus />
                {suggestions.length > 0 && (
                  <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 1000 }}>
                    {suggestions.map(p => (
                      <ListGroup.Item key={p.id} action onClick={() => addPokemonToSlot(p)}>
                        <div className="d-flex align-items-center gap-2">
                          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                            alt={p.name} style={{ width: '32px', height: '32px' }} />
                          <span className="text-capitalize">{p.name}</span>
                          <div className="ms-auto d-flex gap-1">
                            {p.types.map(tpe => (
                              <span
                                key={tpe}
                                style={{
                                  backgroundColor: TYPE_COLORS[tpe],
                                  color: '#fff',
                                  fontWeight: 700,
                                  fontSize: '0.55rem',
                                  textTransform: 'uppercase',
                                  padding: '2px 8px',
                                  borderRadius: '20px',
                                  letterSpacing: '0.5px',
                                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                                  display: 'inline-block'
                                }}
                              >{tpe}</span>
                            ))}
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: isDark ? '#1a1b23' : '#f8f9fa' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>{t('teamBuilder.cancel')}</Button>
            <Button variant="primary" onClick={saveTeam} disabled={!teamName.trim() || members.every(m => !m)}>{t('teamBuilder.save')}</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal edición movimientos + objeto de un miembro */}
        <Modal show={memberDetailIdx !== null} onHide={() => setMemberDetailIdx(null)} centered size="md">
          <Modal.Header closeButton style={{ backgroundColor: isDark ? '#1a1b23' : '#f8f9fa' }}>
            <Modal.Title style={{ color: textPrimary }}>
              {memberDetailIdx !== null && members[memberDetailIdx] ? (
                <span className="text-capitalize d-flex align-items-center gap-2">
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${members[memberDetailIdx].id}.png`}
                    alt={members[memberDetailIdx].name} style={{ width: '36px', height: '36px' }} />
                  {members[memberDetailIdx].name}
                </span>
              ) : t('teamBuilder.editMovesItem')}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: isDark ? '#23252f' : '#fff' }}>
            {/* Objeto con autocompletar */}
            <Form.Group className="mb-3 position-relative">
              <Form.Label style={{ color: textSecondary }}>{t('teamBuilder.item')}</Form.Label>
              <div className="d-flex align-items-center gap-2">
                {tempItem && (
                  <img
                    src={(() => {
                      const found = COMMON_ITEMS.find(it => it.name.toLowerCase() === tempItem.toLowerCase());
                      return found ? ITEM_SPRITE_URL(found.slug) : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                    })()}
                    alt={tempItem}
                    style={{ width: '28px', height: '28px', imageRendering: 'pixelated' }}
                    onError={(e) => { e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; }}
                  />
                )}
                <Form.Control
                  value={itemSearch || tempItem}
                  onChange={e => { setItemSearch(e.target.value); setTempItem(e.target.value); }}
                  onFocus={() => setItemSearch(tempItem)}
                  placeholder={t('teamBuilder.itemPlaceholder')}
                  autoComplete="off"
                />
              </div>
              {itemSuggestions.length > 0 && (
                <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 1050 }}>
                  {itemSuggestions.map(it => (
                    <ListGroup.Item key={it.slug} action onClick={() => selectItem(it.name)} className="d-flex align-items-center gap-2">
                      <img src={ITEM_SPRITE_URL(it.slug)} alt={it.name} style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} onError={(e) => { e.target.style.display = 'none'; }} />
                      <span>{it.name}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form.Group>

            {/* Movimientos con autocompletar */}
            <h6 className="fw-bold mb-2" style={{ color: textPrimary }}>{t('teamBuilder.moves')}</h6>
            {tempMoves.map((move, idx) => {
              const suggestions = focusedMoveIdx === idx ? getMoveSuggestions(idx) : [];
              return (
                <Form.Group key={idx} className="mb-2 position-relative">
                  <Form.Control
                    value={moveSearches[idx] || move}
                    onChange={e => {
                      const newSearches = [...moveSearches];
                      newSearches[idx] = e.target.value;
                      setMoveSearches(newSearches);
                      const newMoves = [...tempMoves];
                      newMoves[idx] = e.target.value;
                      setTempMoves(newMoves);
                    }}
                    onFocus={() => { setFocusedMoveIdx(idx); setMoveSearches(prev => { const n = [...prev]; n[idx] = move; return n; }); }}
                    onBlur={() => setTimeout(() => setFocusedMoveIdx(null), 150)}
                    placeholder={`${t('teamBuilder.move')} ${idx + 1}`}
                    autoComplete="off"
                  />
                  {suggestions.length > 0 && (
                    <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 1050 }}>
                      {suggestions.map(m => (
                        <ListGroup.Item key={m} action onMouseDown={() => selectMove(idx, m)}>{m}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Form.Group>
              );
            })}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: isDark ? '#1a1b23' : '#f8f9fa' }}>
            <Button variant="secondary" onClick={() => setMemberDetailIdx(null)}>{t('teamBuilder.cancel')}</Button>
            <Button variant="primary" onClick={saveMemberDetail}>{t('teamBuilder.saveDetails')}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default TeamBuilderPage;
