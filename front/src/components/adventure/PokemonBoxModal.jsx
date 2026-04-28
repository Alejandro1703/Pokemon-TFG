import { useState } from 'react';
import { Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { useTranslation } from '../../contexts/SettingsContext';

const POKEMON_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const SLOTS_PER_BOX = 30;
const COLS = 6;

function PokemonBoxModal({ show, onHide, gameName, boxes, onUpdateBoxes }) {
  const { t } = useTranslation();
  const [activeBox, setActiveBox] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pokemonIdInput, setPokemonIdInput] = useState('');
  const [pokemonNameInput, setPokemonNameInput] = useState('');
  const [pokemonPreview, setPokemonPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [dragFrom, setDragFrom] = useState(null);

  const currentBox = boxes[activeBox] || { name: `${t('pokemonBox.box')} ${activeBox + 1}`, slots: Array(SLOTS_PER_BOX).fill(null) };

  // Buscar Pokémon por nombre o ID en la PokeAPI
  const searchPokemon = async () => {
    const query = pokemonIdInput.trim().toLowerCase();
    if (!query) return;

    setLoadingPreview(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      if (res.ok) {
        const data = await res.json();
        setPokemonPreview({
          pokemonId: data.id,
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          sprite: `${POKEMON_SPRITE_BASE}/${data.id}.png`,
        });
        setPokemonNameInput(data.name.charAt(0).toUpperCase() + data.name.slice(1));
      } else {
        setPokemonPreview(null);
        setPokemonNameInput(t('common.notFound'));
      }
    } catch {
      setPokemonPreview(null);
      setPokemonNameInput(t('common.connectionError'));
    } finally {
      setLoadingPreview(false);
    }
  };

  // Añadir Pokémon a la primera posición vacía
  const addPokemon = () => {
    if (!pokemonPreview) return;

    const newBoxes = [...boxes];
    const box = { ...currentBox, slots: [...currentBox.slots] };

    const emptyIdx = box.slots.findIndex(s => s === null);
    if (emptyIdx === -1) return; // Box full

    box.slots[emptyIdx] = {
      pokemonId: pokemonPreview.pokemonId,
      name: pokemonPreview.name,
      sprite: pokemonPreview.sprite,
    };

    newBoxes[activeBox] = box;
    onUpdateBoxes(newBoxes);

    // Reset form
    setPokemonIdInput('');
    setPokemonNameInput('');
    setPokemonPreview(null);
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

    // Intercambiar posiciones
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

      <Modal.Body className="p-3">
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
            <h6 className="mb-0 fw-bold">{t('pokemonBox.box')} {activeBox + 1}</h6>
            <Button
              size="sm"
              variant="outline-secondary"
              className="rounded-circle"
              style={{ width: '30px', height: '30px', padding: 0 }}
              onClick={() => {
                if (activeBox >= boxes.length - 1) {
                  // Crear nueva caja
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
            style={{ backgroundColor: '#f3e5f5', border: '1px solid #ce93d8' }}
          >
            <Row className="g-2 align-items-end">
              <Col md={4}>
                <Form.Label className="fw-bold small">{t('pokemonBox.searchLabel')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('pokemonBox.searchPlaceholder')}
                  value={pokemonIdInput}
                  onChange={(e) => setPokemonIdInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') searchPokemon(); }}
                  size="sm"
                  style={{ borderRadius: '10px' }}
                />
              </Col>
              <Col md={2}>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-100 rounded-pill"
                  onClick={searchPokemon}
                  disabled={loadingPreview}
                >
                  {loadingPreview ? '...' : t('pokemonBox.search')}
                </Button>
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
                      <div className="fw-bold" style={{ fontSize: '0.85rem' }}>{pokemonPreview.name}</div>
                      <small className="text-muted">#{pokemonPreview.pokemonId}</small>
                    </div>
                  </div>
                ) : (
                  <small className="text-muted">{pokemonNameInput || t('pokemonBox.searchPrompt')}</small>
                )}
              </Col>
              <Col md={3}>
                <div className="d-flex gap-1">
                  <Button
                    size="sm"
                    variant="success"
                    className="flex-grow-1 rounded-pill fw-bold"
                    onClick={addPokemon}
                    disabled={!pokemonPreview}
                  >
                    {t('pokemonBox.add')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="rounded-pill"
                    onClick={() => { setShowAddForm(false); setPokemonPreview(null); setPokemonIdInput(''); setPokemonNameInput(''); }}
                  >
                    ✕
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* Grid de la caja (6 columnas x 5 filas = 30 slots) */}
        <div
          className="rounded-3 p-2"
          style={{
            backgroundColor: '#fce4ec',
            border: '2px solid #f48fb1',
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: '4px',
          }}
        >
          {currentBox.slots.map((slot, idx) => (
            <div
              key={idx}
              draggable={!!slot}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className="d-flex flex-column align-items-center justify-content-center position-relative"
              style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: dragFrom === idx ? '#e1bee7' : slot ? '#fff' : 'rgba(255,255,255,0.5)',
                borderRadius: '10px',
                border: dragFrom === idx ? '2px dashed #ab47bc' : slot ? '2px solid #f48fb1' : '1px dashed #f8bbd0',
                cursor: slot ? 'grab' : 'default',
                transition: 'all 0.15s ease',
                overflow: 'hidden',
                minHeight: '70px',
              }}
              title={slot ? `${slot.name} (#${slot.pokemonId}) - ${t('pokemonBox.dragToMove')}` : t('pokemonBox.emptySlot').replace('{slot}', idx + 1)}
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
                    style={{ fontSize: '0.6rem', color: '#ad1457' }}
                  >
                    {slot.name}
                  </small>
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
                <small className="text-muted" style={{ fontSize: '0.6rem', opacity: 0.5 }}>
                  {idx + 1}
                </small>
              )}
            </div>
          ))}
        </div>

        <small className="text-muted d-block mt-2 text-center">
          {t('pokemonBox.dragToSwap')}
        </small>
      </Modal.Body>

      <Modal.Footer className="border-top-0">
        <Button variant="secondary" onClick={onHide} className="rounded-pill px-4">
          {t('common.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PokemonBoxModal;
