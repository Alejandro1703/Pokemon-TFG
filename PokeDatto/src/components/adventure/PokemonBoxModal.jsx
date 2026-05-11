import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { useTranslation, useSettings } from '../../contexts/SettingsContext';
// Items sprites se construyen directamente con ITEM_SPRITE_BASE

const ITEM_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

const itemNameToSpriteId = (name) => {
  if (!name || name === 'Ninguno') return null;
  return name.toLowerCase().replace(/'/g, '').replace(/ /g, '-');
};

const POKEMON_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const SHINY_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny';
const SLOTS_PER_BOX = 30;
const COLS = 6;

// Lista de objetos comunes para equipar Pokémon
const EQUIPABLE_ITEMS = [
  'Ninguno', 'Oran Berry', 'Sitrus Berry', 'Lum Berry', 'Focus Sash',
  'Leftovers', 'Choice Band', 'Choice Specs', 'Choice Scarf', 'Life Orb',
  'Expert Belt', 'Muscle Band', 'Wise Glasses', 'Zoom Lens', 'Wide Lens',
  'Scope Lens', 'Razor Claw', 'Razor Fang', 'King\'s Rock', 'Quick Claw',
  'Bright Powder', 'Lax Incense', 'Shell Bell', 'Big Root', 'Metronome',
  'Light Ball', 'Thick Club', 'Stick', 'Lucky Punch', 'Metal Powder',
  'Eviolite', 'Assault Vest', 'Rocky Helmet', 'Air Balloon', 'Red Card',
  'Eject Button', 'Absorb Bulb', 'Cell Battery', 'Luminous Moss', 'Snowball',
  'Weakness Policy', 'Blunder Policy', 'Room Service', 'Utility Umbrella',
  'Mental Herb', 'White Herb', 'Power Herb', 'Mirror Herb', 'Clear Amulet',
  'Terrain Extender', 'Grassy Seed', 'Misty Seed', 'Electric Seed', 'Psychic Seed',
];

function PokemonBoxModal({ show, onHide, gameName, boxes, onUpdateBoxes }) {
  const { t } = useTranslation();
  const { isDark } = useSettings();
  const [activeBox, setActiveBox] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pokemonIdInput, setPokemonIdInput] = useState('');
  const [pokemonNameInput, setPokemonNameInput] = useState('');
  const [pokemonPreview, setPokemonPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [dragFrom, setDragFrom] = useState(null);

  // Nuevos campos
  const [movesList, setMovesList] = useState([]);
  const [moveInputs, setMoveInputs] = useState(['', '', '', '']);
  const [moveSuggestions, setMoveSuggestions] = useState([[], [], [], []]);
  const [showMoveSuggestions, setShowMoveSuggestions] = useState([false, false, false, false]);
  const [itemInput, setItemInput] = useState('');
  const [itemSuggestions, setItemSuggestions] = useState([]);
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);
  const itemInputRef = useRef(null);
  const itemSuggRef = useRef(null);
  const [isShiny, setIsShiny] = useState(false);

  // Modal de detalle/edición
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailSlotIdx, setDetailSlotIdx] = useState(null);
  const [editNickname, setEditNickname] = useState('');
  const [editMoves, setEditMoves] = useState(['', '', '', '']);
  const [editItem, setEditItem] = useState('');
  const [editItemSuggestions, setEditItemSuggestions] = useState([]);
  const [showEditItemSuggestions, setShowEditItemSuggestions] = useState(false);
  const editItemInputRef = useRef(null);
  const editItemSuggRef = useRef(null);
  const [editShiny, setEditShiny] = useState(false);
  const [editMoveSuggestions, setEditMoveSuggestions] = useState([[], [], [], []]);
  const [showEditMoveSuggestions, setShowEditMoveSuggestions] = useState([false, false, false, false]);

  // Autocompletado de Pokémon
  const [pokemonList, setPokemonList] = useState([]);
  const [pokeSuggestions, setPokeSuggestions] = useState([]);
  const [showPokeSuggestions, setShowPokeSuggestions] = useState(false);
  const pokeInputRef = useRef(null);
  const pokeSuggRef = useRef(null);

  const currentBox = boxes[activeBox] || { name: `${t('pokemonBox.box')} ${activeBox + 1}`, slots: Array(SLOTS_PER_BOX).fill(null) };

  // Cargar listas de PokeAPI
  useEffect(() => {
    const loadData = async () => {
      try {
        const [movesRes, pokeRes] = await Promise.all([
          fetch('https://pokeapi.co/api/v2/move?limit=900'),
          fetch('https://pokeapi.co/api/v2/pokemon?limit=649'),
        ]);
        const movesData = await movesRes.json();
        const pokeData = await pokeRes.json();
        setMovesList(movesData.results.map(m => ({ name: m.name, display: m.name.replace(/-/g, ' ') })));
        setPokemonList(pokeData.results.map((p, idx) => ({ name: p.name, id: idx + 1 })));
      } catch {
        // Si falla, dejar vacío
      }
    };
    loadData();
  }, []);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pokeSuggRef.current && !pokeSuggRef.current.contains(e.target) &&
          pokeInputRef.current && !pokeInputRef.current.contains(e.target)) {
        setShowPokeSuggestions(false);
      }
      if (itemSuggRef.current && !itemSuggRef.current.contains(e.target) &&
          itemInputRef.current && !itemInputRef.current.contains(e.target)) {
        setShowItemSuggestions(false);
      }
      if (editItemSuggRef.current && !editItemSuggRef.current.contains(e.target) &&
          editItemInputRef.current && !editItemInputRef.current.contains(e.target)) {
        setShowEditItemSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocompletado Pokémon
  const handlePokemonInput = (value) => {
    setPokemonIdInput(value);
    setPokemonPreview(null);
    setPokemonNameInput('');
    if (value.length >= 2 && pokemonList.length > 0) {
      const filtered = pokemonList
        .filter(p => p.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
      setPokeSuggestions(filtered);
      setShowPokeSuggestions(true);
    } else {
      setPokeSuggestions([]);
      setShowPokeSuggestions(false);
    }
  };

  const selectPokemonSuggestion = async (pokemon) => {
    setPokemonIdInput(pokemon.name);
    setShowPokeSuggestions(false);
    setLoadingPreview(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      if (res.ok) {
        const data = await res.json();
        const sprite = isShiny
          ? `${SHINY_SPRITE_BASE}/${data.id}.png`
          : `${POKEMON_SPRITE_BASE}/${data.id}.png`;
        setPokemonPreview({
          pokemonId: data.id,
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          sprite,
          shiny: isShiny,
        });
        setPokemonNameInput(data.name.charAt(0).toUpperCase() + data.name.slice(1));
      }
    } catch {
      // ignore
    } finally {
      setLoadingPreview(false);
    }
  };

  // Manejar input de movimiento
  const handleMoveInput = (idx, value) => {
    const newInputs = [...moveInputs];
    newInputs[idx] = value;
    setMoveInputs(newInputs);

    if (value.length >= 2 && movesList.length > 0) {
      const usedMoves = moveInputs.filter((_, i) => i !== idx).map(m => m.toLowerCase());
      const filtered = movesList
        .filter(m => m.display.toLowerCase().includes(value.toLowerCase()) && !usedMoves.includes(m.display.toLowerCase()))
        .slice(0, 6);
      const newSugg = [...moveSuggestions];
      newSugg[idx] = filtered;
      setMoveSuggestions(newSugg);
      const newShow = [...showMoveSuggestions];
      newShow[idx] = true;
      setShowMoveSuggestions(newShow);
    } else {
      const newSugg = [...moveSuggestions];
      newSugg[idx] = [];
      setMoveSuggestions(newSugg);
      const newShow = [...showMoveSuggestions];
      newShow[idx] = false;
      setShowMoveSuggestions(newShow);
    }
  };

  const selectMove = (idx, moveDisplay) => {
    const newInputs = [...moveInputs];
    newInputs[idx] = moveDisplay;
    setMoveInputs(newInputs);
    const newShow = [...showMoveSuggestions];
    newShow[idx] = false;
    setShowMoveSuggestions(newShow);
  };

  const clearMove = (idx) => {
    const newInputs = [...moveInputs];
    newInputs[idx] = '';
    setMoveInputs(newInputs);
  };

  const atLeastOneMove = () => moveInputs.some(m => m.trim() !== '');

  // Abrir modal de detalle/edición
  const openDetailModal = (idx) => {
    const slot = currentBox.slots[idx];
    if (!slot) return;
    setDetailSlotIdx(idx);
    setEditNickname(slot.name || '');
    setEditShiny(slot.shiny || false);
    setEditItem(slot.item || '');
    const moves = slot.moves || [];
    setEditMoves([moves[0] || '', moves[1] || '', moves[2] || '', moves[3] || '']);
    setEditMoveSuggestions([[], [], [], []]);
    setShowEditMoveSuggestions([false, false, false, false]);
    setShowDetailModal(true);
  };

  const handleEditMoveInput = (idx, value) => {
    const newInputs = [...editMoves];
    newInputs[idx] = value;
    setEditMoves(newInputs);

    if (value.length >= 2 && movesList.length > 0) {
      const usedMoves = editMoves.filter((_, i) => i !== idx).map(m => m.toLowerCase());
      const filtered = movesList
        .filter(m => m.display.toLowerCase().includes(value.toLowerCase()) && !usedMoves.includes(m.display.toLowerCase()))
        .slice(0, 6);
      const newSugg = [...editMoveSuggestions];
      newSugg[idx] = filtered;
      setEditMoveSuggestions(newSugg);
      const newShow = [...showEditMoveSuggestions];
      newShow[idx] = true;
      setShowEditMoveSuggestions(newShow);
    } else {
      const newSugg = [...editMoveSuggestions];
      newSugg[idx] = [];
      setEditMoveSuggestions(newSugg);
      const newShow = [...showEditMoveSuggestions];
      newShow[idx] = false;
      setShowEditMoveSuggestions(newShow);
    }
  };

  const selectEditMove = (idx, moveDisplay) => {
    const newInputs = [...editMoves];
    newInputs[idx] = moveDisplay;
    setEditMoves(newInputs);
    const newShow = [...showEditMoveSuggestions];
    newShow[idx] = false;
    setShowEditMoveSuggestions(newShow);
  };

  const clearEditMove = (idx) => {
    const newInputs = [...editMoves];
    newInputs[idx] = '';
    setEditMoves(newInputs);
  };

  // Autocompletado de items (add)
  const handleItemInput = (value) => {
    setItemInput(value);
    if (value.length >= 1) {
      const filtered = EQUIPABLE_ITEMS
        .filter(i => i.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
      setItemSuggestions(filtered);
      setShowItemSuggestions(true);
    } else {
      setItemSuggestions([]);
      setShowItemSuggestions(false);
    }
  };

  const selectItem = (item) => {
    setItemInput(item === 'Ninguno' ? '' : item);
    setShowItemSuggestions(false);
  };

  const clearItem = () => {
    setItemInput('');
    setShowItemSuggestions(false);
  };

  // Autocompletado de items (edit)
  const handleEditItemInput = (value) => {
    setEditItem(value);
    if (value.length >= 1) {
      const filtered = EQUIPABLE_ITEMS
        .filter(i => i.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
      setEditItemSuggestions(filtered);
      setShowEditItemSuggestions(true);
    } else {
      setEditItemSuggestions([]);
      setShowEditItemSuggestions(false);
    }
  };

  const selectEditItem = (item) => {
    setEditItem(item === 'Ninguno' ? '' : item);
    setShowEditItemSuggestions(false);
  };

  const clearEditItem = () => {
    setEditItem('');
    setShowEditItemSuggestions(false);
  };

  const toggleEditShiny = () => {
    setEditShiny(prev => !prev);
  };

  const saveSlotChanges = () => {
    if (detailSlotIdx === null) return;
    const newBoxes = [...boxes];
    const box = { ...currentBox, slots: [...currentBox.slots] };
    const slot = box.slots[detailSlotIdx];
    if (!slot) return;

    const validMoves = editMoves.filter(m => m.trim() !== '');
    const sprite = editShiny
      ? `${SHINY_SPRITE_BASE}/${slot.pokemonId}.png`
      : `${POKEMON_SPRITE_BASE}/${slot.pokemonId}.png`;

    box.slots[detailSlotIdx] = {
      ...slot,
      name: editNickname || slot.name,
      sprite,
      shiny: editShiny,
      moves: validMoves,
      item: editItem || null,
    };

    newBoxes[activeBox] = box;
    onUpdateBoxes(newBoxes);
    setShowDetailModal(false);
    setDetailSlotIdx(null);
  };

  // Buscar Pokémon por nombre o ID (también al pulsar Enter)
  const searchPokemon = async () => {
    const query = pokemonIdInput.trim().toLowerCase();
    if (!query) return;
    await selectPokemonSuggestion({ name: query });
  };

  // Añadir Pokémon a la primera posición vacía
  const addPokemon = () => {
    if (!pokemonPreview || !atLeastOneMove()) return;

    const newBoxes = [...boxes];
    const box = { ...currentBox, slots: [...currentBox.slots] };

    const emptyIdx = box.slots.findIndex(s => s === null);
    if (emptyIdx === -1) return;

    const validMoves = moveInputs.filter(m => m.trim() !== '');

    box.slots[emptyIdx] = {
      pokemonId: pokemonPreview.pokemonId,
      name: pokemonPreview.name,
      sprite: pokemonPreview.sprite,
      shiny: isShiny,
      moves: validMoves,
      item: itemInput || null,
    };

    newBoxes[activeBox] = box;
    onUpdateBoxes(newBoxes);

    // Reset form
    setPokemonIdInput('');
    setPokemonNameInput('');
    setPokemonPreview(null);
    setMoveInputs(['', '', '', '']);
    setMoveSuggestions([[], [], [], []]);
    setShowMoveSuggestions([false, false, false, false]);
    setItemInput('');
    setIsShiny(false);
    setShowAddForm(false);
  };

  // Eliminar Pokémon de un slot
  const removePokemon = (slotIdx) => {
    const newBoxes = [...boxes];
    const box = { ...currentBox, slots: [...currentBox.slots] };
    box.slots[slotIdx] = null;
    newBoxes[activeBox] = box;
    onUpdateBoxes(newBoxes);
  };

  // Drag and drop handlers
  const handleDragStart = (e, idx) => {
    if (!currentBox.slots[idx]) return;
    setDragFrom(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, toIdx) => {
    e.preventDefault();
    if (dragFrom === null || dragFrom === toIdx) {
      setDragFrom(null);
      return;
    }

    const newBoxes = [...boxes];
    const box = { ...currentBox, slots: [...currentBox.slots] };

    const temp = box.slots[toIdx];
    box.slots[toIdx] = box.slots[dragFrom];
    box.slots[dragFrom] = temp;

    newBoxes[activeBox] = box;
    onUpdateBoxes(newBoxes);
    setDragFrom(null);
  };

  const handleDragEnd = () => {
    setDragFrom(null);
  };

  const occupiedSlots = currentBox.slots.filter(s => s !== null).length;

  const formBg = isDark ? '#2a2535' : '#f3e5f5';
  const formBorder = isDark ? '#4a4060' : '#ce93d8';
  const boxBg = isDark ? '#2a2535' : '#fce4ec';
  const boxBorder = isDark ? '#4a4060' : '#f48fb1';
  const slotBgEmpty = isDark ? 'rgba(60,55,80,0.4)' : 'rgba(255,255,255,0.5)';
  const slotBgFilled = isDark ? '#3a3550' : '#fff';
  const slotDrag = isDark ? '#4a4560' : '#e1bee7';

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header
        closeButton
        style={{
          background: 'linear-gradient(135deg, #ec407a 0%, #ab47bc 100%)',
          border: 'none',
        }}
      >
        <Modal.Title className="fw-bold text-white">
          {t('pokemonBox.title')} - {gameName}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-3" style={{ maxHeight: '72vh', overflowY: 'auto', backgroundColor: isDark ? '#1e1b2e' : '#fff' }}>
        {/* Selector de caja */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <Button
              size="sm"
              variant="outline-secondary"
              className="rounded-circle"
              style={{ width: '30px', height: '30px', padding: 0 }}
              onClick={() => setActiveBox(Math.max(0, activeBox - 1))}
              disabled={activeBox === 0}
            >
              ◀
            </Button>
            <h6 className="mb-0 fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>{t('pokemonBox.box')} {activeBox + 1}</h6>
            <Button
              size="sm"
              variant="outline-secondary"
              className="rounded-circle"
              style={{ width: '30px', height: '30px', padding: 0 }}
              onClick={() => {
                if (activeBox >= boxes.length - 1) {
                  const newBoxes = [...boxes, { name: `${t('pokemonBox.box')} ${boxes.length + 1}`, slots: Array(SLOTS_PER_BOX).fill(null) }];
                  onUpdateBoxes(newBoxes);
                }
                setActiveBox(activeBox + 1);
              }}
            >
              ▶
            </Button>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Badge bg="secondary" pill>{occupiedSlots}/{SLOTS_PER_BOX}</Badge>
            <Button
              size="sm"
              variant="primary"
              className="rounded-pill fw-bold"
              onClick={() => setShowAddForm(!showAddForm)}
              disabled={occupiedSlots >= SLOTS_PER_BOX}
            >
              + {t('pokemonBox.addPokemon')}
            </Button>
          </div>
        </div>

        {/* Formulario para añadir Pokémon */}
        {showAddForm && (
          <div
            className="p-3 mb-3 rounded-3"
            style={{ backgroundColor: formBg, border: `1px solid ${formBorder}` }}
          >
            <Row className="g-2 align-items-end">
              <Col md={6} className="position-relative">
                <Form.Label className="fw-bold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>{t('pokemonBox.searchLabel')}</Form.Label>
                <Form.Control
                  ref={pokeInputRef}
                  type="text"
                  placeholder={t('pokemonBox.searchPlaceholder')}
                  value={pokemonIdInput}
                  onChange={(e) => handlePokemonInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') searchPokemon(); }}
                  disabled={loadingPreview}
                  size="sm"
                  autoComplete="off"
                  style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333' }}
                />
                {showPokeSuggestions && pokeSuggestions.length > 0 && (
                  <div
                    ref={pokeSuggRef}
                    className="position-absolute w-100 mt-1 rounded-3 shadow"
                    style={{
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      backgroundColor: isDark ? '#1a1b23' : '#fff',
                      border: isDark ? '1px solid #2e303a' : '1px solid #dee2e6',
                    }}
                  >
                    {pokeSuggestions.map((p) => (
                      <div
                        key={p.id}
                        className="d-flex align-items-center gap-2 px-3 py-2"
                        style={{
                          cursor: 'pointer',
                          borderBottom: isDark ? '1px solid #2e303a' : '1px solid #f0f0f0',
                          color: isDark ? '#e8eaed' : '#333',
                          fontSize: '0.85rem',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? '#2e3040' : '#f8f9fa'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        onClick={() => selectPokemonSuggestion(p)}
                      >
                        <img
                          src={`${POKEMON_SPRITE_BASE}/${p.id}.png`}
                          alt={p.name}
                          style={{ width: '28px', height: '28px', imageRendering: 'pixelated' }}
                        />
                        <span className="text-capitalize">{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Col>
              <Col md={3} className="text-center">
                {pokemonPreview ? (
                  <div className="d-flex align-items-center gap-2 justify-content-center">
                    <img
                      src={pokemonPreview.sprite}
                      alt={pokemonPreview.name}
                      style={{ width: '48px', height: '48px', imageRendering: 'pixelated' }}
                    />
                    <div>
                      <div className="fw-bold" style={{ fontSize: '0.85rem', color: isDark ? '#e8eaed' : '#333' }}>{pokemonPreview.name}</div>
                      <small style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>#{pokemonPreview.pokemonId}</small>
                    </div>
                  </div>
                ) : (
                  <small style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>{pokemonNameInput || t('pokemonBox.searchPrompt')}</small>
                )}
              </Col>
              <Col md={3} className="d-flex align-items-end justify-content-center pb-1">
                <Button
                  size="sm"
                  className="rounded-pill fw-bold border-0"
                  onClick={() => {
                    setIsShiny(!isShiny);
                    if (pokemonPreview) {
                      const sprite = !isShiny
                        ? `${SHINY_SPRITE_BASE}/${pokemonPreview.pokemonId}.png`
                        : `${POKEMON_SPRITE_BASE}/${pokemonPreview.pokemonId}.png`;
                      setPokemonPreview({ ...pokemonPreview, sprite, shiny: !isShiny });
                    }
                  }}
                  style={{
                    background: isShiny
                      ? 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)'
                      : isDark ? '#4a4560' : '#e0e0e0',
                    color: isShiny ? '#333' : isDark ? '#c8ccd4' : '#666',
                    fontSize: '0.8rem',
                    padding: '6px 16px',
                  }}
                >
                  {isShiny ? '⭐ Shiny' : '☆ Shiny'}
                </Button>
              </Col>
            </Row>

            {/* 4 campos de ataques */}
            <Row className="g-2 mt-2">
              {[0, 1, 2, 3].map(idx => (
                <Col md={6} key={idx} className="position-relative">
                  <Form.Label className="fw-bold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                    {t('pokemonBox.moves')} {idx + 1}
                  </Form.Label>
                  <div className="d-flex gap-1">
                    <Form.Control
                      type="text"
                      placeholder={t('pokemonBox.movesPlaceholder')}
                      value={moveInputs[idx]}
                      onChange={(e) => handleMoveInput(idx, e.target.value)}
                      onFocus={() => {
                        if (moveInputs[idx].length >= 2) {
                          const newShow = [...showMoveSuggestions];
                          newShow[idx] = true;
                          setShowMoveSuggestions(newShow);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          const newShow = [...showMoveSuggestions];
                          newShow[idx] = false;
                          setShowMoveSuggestions(newShow);
                        }, 150);
                      }}
                      size="sm"
                      autoComplete="off"
                      style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333' }}
                    />
                    {moveInputs[idx] && (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className="px-2 py-0"
                        style={{ fontSize: '0.7rem' }}
                        onClick={() => clearMove(idx)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                  {showMoveSuggestions[idx] && moveSuggestions[idx].length > 0 && (
                    <div
                      className="position-absolute w-100 mt-1 rounded-3 shadow"
                      style={{
                        zIndex: 1000,
                        maxHeight: '150px',
                        overflowY: 'auto',
                        backgroundColor: isDark ? '#1a1b23' : '#fff',
                        border: isDark ? '1px solid #2e303a' : '1px solid #dee2e6',
                      }}
                    >
                      {moveSuggestions[idx].map((m, i) => (
                        <div
                          key={i}
                          className="px-3 py-1"
                          style={{
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            borderBottom: isDark ? '1px solid #2e303a' : '1px solid #f0f0f0',
                            color: isDark ? '#e8eaed' : '#333',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? '#2e3040' : '#f8f9fa'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          onMouseDown={() => selectMove(idx, m.display)}
                        >
                          {m.display}
                        </div>
                      ))}
                    </div>
                  )}
                </Col>
              ))}
            </Row>
            {!atLeastOneMove() && pokemonPreview && (
              <div className="mt-1" style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                {t('pokemonBox.atLeastOneMove')}
              </div>
            )}

            {/* Objeto y botones */}
            <Row className="g-2 mt-2 align-items-end">
              <Col md={6} className="position-relative">
                <Form.Label className="fw-bold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>{t('pokemonBox.item')}</Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    ref={itemInputRef}
                    type="text"
                    placeholder={t('pokemonBox.item')}
                    value={itemInput}
                    onChange={(e) => handleItemInput(e.target.value)}
                    onFocus={() => { if (itemInput.length >= 1) setShowItemSuggestions(true); }}
                    size="sm"
                    autoComplete="off"
                    style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333' }}
                  />
                  {itemInput && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="px-2 py-0"
                      style={{ fontSize: '0.7rem' }}
                      onClick={clearItem}
                    >
                      ✕
                    </Button>
                  )}
                </div>
                {showItemSuggestions && itemSuggestions.length > 0 && (
                  <div
                    ref={itemSuggRef}
                    className="position-absolute w-100 mt-1 rounded-3 shadow"
                    style={{
                      zIndex: 1000,
                      maxHeight: '150px',
                      overflowY: 'auto',
                      backgroundColor: isDark ? '#1a1b23' : '#fff',
                      border: isDark ? '1px solid #2e303a' : '1px solid #dee2e6',
                    }}
                  >
                    {itemSuggestions.map((item, i) => {
                      const spriteId = itemNameToSpriteId(item);
                      return (
                        <div
                          key={i}
                          className="px-3 py-1 d-flex align-items-center gap-2"
                          style={{
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            borderBottom: isDark ? '1px solid #2e303a' : '1px solid #f0f0f0',
                            color: isDark ? '#e8eaed' : '#333',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? '#2e3040' : '#f8f9fa'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          onMouseDown={() => selectItem(item)}
                        >
                          {spriteId && (
                            <img
                              src={`${ITEM_SPRITE_BASE}/${spriteId}.png`}
                              alt={item}
                              style={{ width: '20px', height: '20px', imageRendering: 'pixelated' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Col>
              <Col md={6}>
                <div className="d-flex gap-1">
                  <Button
                    size="sm"
                    variant="success"
                    className="flex-grow-1 rounded-pill fw-bold"
                    onClick={addPokemon}
                    disabled={!pokemonPreview || !atLeastOneMove()}
                  >
                    {t('pokemonBox.add')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="rounded-pill"
                    onClick={() => {
                      setShowAddForm(false);
                      setPokemonPreview(null);
                      setPokemonIdInput('');
                      setPokemonNameInput('');
                      setMoveInputs(['', '', '', '']);
                      setMoveSuggestions([[], [], [], []]);
                      setShowMoveSuggestions([false, false, false, false]);
                      setItemInput('');
                      setIsShiny(false);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* Grid de la caja */}
        <div
          className="rounded-3 p-2"
          style={{
            backgroundColor: boxBg,
            border: `2px solid ${boxBorder}`,
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: '4px',
          }}
        >
          {currentBox.slots.map((slot, idx) => (
            <div
              key={idx}
              draggable={!!slot}
              onClick={() => openDetailModal(idx)}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className="d-flex flex-column align-items-center justify-content-center position-relative"
              style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: dragFrom === idx ? slotDrag : slot ? slotBgFilled : slotBgEmpty,
                borderRadius: '10px',
                border: dragFrom === idx ? '2px dashed #ab47bc' : slot ? `2px solid ${boxBorder}` : `1px dashed ${isDark ? '#4a4060' : '#f8bbd0'}`,
                cursor: slot ? 'grab' : 'default',
                transition: 'all 0.15s ease',
                overflow: 'hidden',
                minHeight: '35px',
              }}
              title={slot ? `${slot.name} (#${slot.pokemonId})${slot.shiny ? ' ⭐' : ''}${slot.item ? ` - ${slot.item}` : ''} - ${t('pokemonBox.dragToMove')}` : t('pokemonBox.emptySlot').replace('{slot}', idx + 1)}
            >
              {slot ? (
                <>
                  <img
                    src={slot.sprite}
                    alt={slot.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      imageRendering: 'pixelated',
                      pointerEvents: 'none',
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${POKEMON_SPRITE_BASE}/${slot.pokemonId}.png`;
                    }}
                  />
                  <small
                    className="fw-bold text-truncate w-100 text-center px-1"
                    style={{ fontSize: '0.6rem', color: isDark ? '#ffb74d' : '#ad1457' }}
                  >
                    {slot.name}
                  </small>
                  {slot.shiny && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        fontSize: '0.7rem',
                      }}
                    >
                      ⭐
                    </span>
                  )}
                  {slot.item && (
                    <span
                      className="badge rounded-pill px-1"
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '2px',
                        fontSize: '0.45rem',
                        backgroundColor: isDark ? '#4a4560' : '#f8bbd0',
                        color: isDark ? '#e8eaed' : '#880e4f',
                      }}
                    >
                      {slot.item}
                    </span>
                  )}
                  {/* Botón eliminar */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removePokemon(idx); }}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'rgba(244,67,54,0.8)',
                      color: 'white',
                      fontSize: '0.55rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </>
              ) : (
                <small style={{ fontSize: '0.6rem', opacity: 0.5, color: isDark ? '#9ca3af' : '#6c757d' }}>
                  {idx + 1}
                </small>
              )}
            </div>
          ))}
        </div>

        <small className="d-block mt-2 text-center" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>
          {t('pokemonBox.dragToSwap')}
        </small>
      </Modal.Body>

      <Modal.Footer className="border-top-0" style={{ backgroundColor: isDark ? '#1e1b2e' : '#fff' }}>
        <Button variant="secondary" onClick={onHide} className="rounded-pill px-4">
          {t('common.close')}
        </Button>
      </Modal.Footer>

      {/* Modal de detalle/edición de Pokémon */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="md" centered>
        <Modal.Header
          closeButton
          style={{
            background: 'linear-gradient(135deg, #ec407a 0%, #ab47bc 100%)',
            border: 'none',
          }}
        >
          <Modal.Title className="fw-bold text-white">
            {t('pokemonBox.editTitle')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: isDark ? '#1e1b2e' : '#fff' }}>
          <div className="text-center mb-3">
            <img
              src={detailSlotIdx !== null && currentBox.slots[detailSlotIdx]
                ? (editShiny
                  ? `${SHINY_SPRITE_BASE}/${currentBox.slots[detailSlotIdx].pokemonId}.png`
                  : `${POKEMON_SPRITE_BASE}/${currentBox.slots[detailSlotIdx].pokemonId}.png`)
                : ''}
              alt={editNickname}
              style={{ width: '80px', height: '80px', imageRendering: 'pixelated' }}
            />
            <div className="fw-bold" style={{ color: isDark ? '#e8eaed' : '#333' }}>
              {editNickname}
              {editShiny && ' ⭐'}
            </div>
          </div>

          {/* Apodo */}
          <Row className="g-2 mb-2">
            <Col md={12}>
              <Form.Label className="fw-bold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>{t('pokemonBox.nickname')}</Form.Label>
              <Form.Control
                type="text"
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
                size="sm"
                style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333' }}
              />
            </Col>
          </Row>

          {/* Shiny toggle */}
          <div className="d-flex justify-content-center mb-2">
            <Button
              size="sm"
              className="rounded-pill fw-bold border-0"
              onClick={toggleEditShiny}
              style={{
                background: editShiny
                  ? 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)'
                  : isDark ? '#4a4560' : '#e0e0e0',
                color: editShiny ? '#333' : isDark ? '#c8ccd4' : '#666',
                fontSize: '0.8rem',
                padding: '6px 16px',
              }}
            >
              {editShiny ? '⭐ Shiny' : '☆ Shiny'}
            </Button>
          </div>

          {/* 4 ataques */}
          <Row className="g-2">
            {[0, 1, 2, 3].map(idx => (
              <Col md={6} key={idx} className="position-relative">
                <Form.Label className="fw-bold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>
                  {t('pokemonBox.moves')} {idx + 1}
                </Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    type="text"
                    placeholder={t('pokemonBox.movesPlaceholder')}
                    value={editMoves[idx]}
                    onChange={(e) => handleEditMoveInput(idx, e.target.value)}
                    onFocus={() => {
                      if (editMoves[idx].length >= 2) {
                        const newShow = [...showEditMoveSuggestions];
                        newShow[idx] = true;
                        setShowEditMoveSuggestions(newShow);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        const newShow = [...showEditMoveSuggestions];
                        newShow[idx] = false;
                        setShowEditMoveSuggestions(newShow);
                      }, 150);
                    }}
                    size="sm"
                    autoComplete="off"
                    style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333' }}
                  />
                  {editMoves[idx] && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="px-2 py-0"
                      style={{ fontSize: '0.7rem' }}
                      onClick={() => clearEditMove(idx)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
                {showEditMoveSuggestions[idx] && editMoveSuggestions[idx].length > 0 && (
                  <div
                    className="position-absolute w-100 mt-1 rounded-3 shadow"
                    style={{
                      zIndex: 1000,
                      maxHeight: '150px',
                      overflowY: 'auto',
                      backgroundColor: isDark ? '#1a1b23' : '#fff',
                      border: isDark ? '1px solid #2e303a' : '1px solid #dee2e6',
                    }}
                  >
                    {editMoveSuggestions[idx].map((m, i) => (
                      <div
                        key={i}
                        className="px-3 py-1"
                        style={{
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          borderBottom: isDark ? '1px solid #2e303a' : '1px solid #f0f0f0',
                          color: isDark ? '#e8eaed' : '#333',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? '#2e3040' : '#f8f9fa'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        onMouseDown={() => selectEditMove(idx, m.display)}
                      >
                        {m.display}
                      </div>
                    ))}
                  </div>
                )}
              </Col>
            ))}
          </Row>

          {/* Objeto */}
          <Row className="g-2 mt-2">
            <Col md={12} className="position-relative">
              <Form.Label className="fw-bold small" style={{ color: isDark ? '#c8ccd4' : '#333' }}>{t('pokemonBox.item')}</Form.Label>
              <div className="d-flex gap-1">
                <Form.Control
                  ref={editItemInputRef}
                  type="text"
                  placeholder={t('pokemonBox.item')}
                  value={editItem}
                  onChange={(e) => handleEditItemInput(e.target.value)}
                  onFocus={() => { if (editItem.length >= 1) setShowEditItemSuggestions(true); }}
                  size="sm"
                  autoComplete="off"
                  style={{ borderRadius: '10px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333' }}
                />
                {editItem && (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="px-2 py-0"
                    style={{ fontSize: '0.7rem' }}
                    onClick={clearEditItem}
                  >
                    ✕
                  </Button>
                )}
              </div>
              {showEditItemSuggestions && editItemSuggestions.length > 0 && (
                <div
                  ref={editItemSuggRef}
                  className="position-absolute w-100 mt-1 rounded-3 shadow"
                  style={{
                    zIndex: 1000,
                    maxHeight: '150px',
                    overflowY: 'auto',
                    backgroundColor: isDark ? '#1a1b23' : '#fff',
                    border: isDark ? '1px solid #2e303a' : '1px solid #dee2e6',
                  }}
                >
                  {editItemSuggestions.map((item, i) => {
                    const spriteId = itemNameToSpriteId(item);
                    return (
                      <div
                        key={i}
                        className="px-3 py-1 d-flex align-items-center gap-2"
                        style={{
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          borderBottom: isDark ? '1px solid #2e303a' : '1px solid #f0f0f0',
                          color: isDark ? '#e8eaed' : '#333',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? '#2e3040' : '#f8f9fa'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        onMouseDown={() => selectEditItem(item)}
                      >
                        {spriteId && (
                          <img
                            src={`${ITEM_SPRITE_BASE}/${spriteId}.png`}
                            alt={item}
                            style={{ width: '20px', height: '20px', imageRendering: 'pixelated' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <span>{item}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-top-0" style={{ backgroundColor: isDark ? '#1e1b2e' : '#fff' }}>
          <Button variant="secondary" className="rounded-pill" onClick={() => setShowDetailModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="success" className="rounded-pill fw-bold" onClick={saveSlotChanges}>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
}

export default PokemonBoxModal;
