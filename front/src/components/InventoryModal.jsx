import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Badge, Spinner, Card, ListGroup, Tab, Tabs } from 'react-bootstrap';

// Categorías de objetos comunes en juegos Pokémon
const ITEM_CATEGORIES = {
  medicine: { name: 'Medicinas', color: '#ff6b6b' },
  pokeballs: { name: 'Poké Balls', color: '#4ecdc4' },
  battle: { name: 'Objetos de Batalla', color: '#ffe66d' },
  berries: { name: 'Bayas', color: '#95e1d3' },
  key: { name: 'Objetos Clave', color: '#f38181' },
  evolution: { name: 'Evolución', color: '#aa96da' },
  held: { name: 'Objetos Equipables', color: '#fcbad3' }
};

// Objetos comunes predefinidos (para no depender 100% de la API)
const COMMON_ITEMS = {
  medicine: [
    { id: 'potion', name: 'Poción', effect: 'Restaura 20 PS', sprite: 'potion' },
    { id: 'super-potion', name: 'Superpoción', effect: 'Restaura 50 PS', sprite: 'super-potion' },
    { id: 'hyper-potion', name: 'Hiperpoción', effect: 'Restaura 200 PS', sprite: 'hyper-potion' },
    { id: 'max-potion', name: 'Poción Máxima', effect: 'Restaura todos los PS', sprite: 'max-potion' },
    { id: 'revive', name: 'Revivir', effect: 'Revive a un Pokémon debilitado', sprite: 'revive' },
    { id: 'full-restore', name: 'Restaurar Todo', effect: 'Restaura PS y estado', sprite: 'full-restore' },
    { id: 'antidote', name: 'Antídoto', effect: 'Cura envenenamiento', sprite: 'antidote' },
    { id: 'paralyze-heal', name: 'Antiparalizador', effect: 'Cura parálisis', sprite: 'paralyze-heal' },
    { id: 'burn-heal', name: 'Antiquemar', effect: 'Cura quemaduras', sprite: 'burn-heal' },
    { id: 'ice-heal', name: 'Antihielo', effect: 'Cura congelación', sprite: 'ice-heal' },
    { id: 'awakening', name: 'Despertar', effect: 'Despierta al Pokémon', sprite: 'awakening' },
    { id: 'full-heal', name: 'Cura Total', effect: 'Cura cualquier estado', sprite: 'full-heal' }
  ],
  pokeballs: [
    { id: 'poke-ball', name: 'Poké Ball', effect: 'Básica para capturar', sprite: 'poke-ball' },
    { id: 'great-ball', name: 'Superball', effect: 'Mejor tasa de captura', sprite: 'great-ball' },
    { id: 'ultra-ball', name: 'Ultraball', effect: 'Alta tasa de captura', sprite: 'ultra-ball' },
    { id: 'master-ball', name: 'Master Ball', effect: 'Captura 100% segura', sprite: 'master-ball' },
    { id: 'premier-ball', name: 'Honor Ball', effect: 'Edición especial', sprite: 'premier-ball' },
    { id: 'timer-ball', name: 'Turno Ball', effect: 'Mejor tras varios turnos', sprite: 'timer-ball' },
    { id: 'nest-ball', name: 'Nido Ball', effect: 'Mejor con Pokémon débiles', sprite: 'nest-ball' },
    { id: 'dusk-ball', name: 'Ocaso Ball', effect: 'Mejor de noche/cuevas', sprite: 'dusk-ball' }
  ],
  battle: [
    { id: 'x-attack', name: 'Ataque X', effect: '+1 nivel de Ataque', sprite: 'x-attack' },
    { id: 'x-defense', name: 'Defensa X', effect: '+1 nivel de Defensa', sprite: 'x-defense' },
    { id: 'x-speed', name: 'Velocidad X', effect: '+1 nivel de Velocidad', sprite: 'x-speed' },
    { id: 'x-accuracy', name: 'Precisión X', effect: '+1 nivel de Precisión', sprite: 'x-accuracy' },
    { id: 'x-sp-atk', name: 'Ataque Especial X', effect: '+1 nivel At. Especial', sprite: 'x-sp-atk' },
    { id: 'x-sp-def', name: 'Defensa Especial X', effect: '+1 nivel Def. Especial', sprite: 'x-sp-def' },
    { id: 'guard-spec', name: 'Guardia Especial', effect: 'Protege de cambios de stats', sprite: 'guard-spec' },
    { id: 'dire-hit', name: 'Direct Hit', effect: 'Aumenta probabilidad de crítico', sprite: 'dire-hit' }
  ],
  evolution: [
    { id: 'fire-stone', name: 'Piedra Fuego', effect: 'Evoluciona ciertos Pokémon', sprite: 'fire-stone' },
    { id: 'water-stone', name: 'Piedra Agua', effect: 'Evoluciona ciertos Pokémon', sprite: 'water-stone' },
    { id: 'thunder-stone', name: 'Piedra Trueno', effect: 'Evoluciona ciertos Pokémon', sprite: 'thunder-stone' },
    { id: 'leaf-stone', name: 'Piedra Hoja', effect: 'Evoluciona ciertos Pokémon', sprite: 'leaf-stone' },
    { id: 'moon-stone', name: 'Piedra Lunar', effect: 'Evoluciona ciertos Pokémon', sprite: 'moon-stone' },
    { id: 'sun-stone', name: 'Piedra Solar', effect: 'Evoluciona ciertos Pokémon', sprite: 'sun-stone' },
    { id: 'shiny-stone', name: 'Piedra Día', effect: 'Evoluciona ciertos Pokémon', sprite: 'shiny-stone' },
    { id: 'dusk-stone', name: 'Piedra Noche', effect: 'Evoluciona ciertos Pokémon', sprite: 'dusk-stone' },
    { id: 'dawn-stone', name: 'Piedra Alba', effect: 'Evoluciona ciertos Pokémon', sprite: 'dawn-stone' }
  ],
  held: [
    { id: 'muscle-band', name: 'Cinta Fuerte', effect: '+10% daño físico', sprite: 'muscle-band' },
    { id: 'wise-glasses', name: 'Gafas Especiales', effect: '+10% daño especial', sprite: 'wise-glasses' },
    { id: 'expert-belt', name: 'Cinta Experto', effect: '+20% daño superefectivo', sprite: 'expert-belt' },
    { id: 'life-orb', name: 'Vida Esfera', effect: '+30% daño, consume PS', sprite: 'life-orb' },
    { id: 'choice-band', name: 'Cinta Elegida', effect: '+50% Ataque, bloquea movs', sprite: 'choice-band' },
    { id: 'choice-specs', name: 'Gafas Elegidas', effect: '+50% At. Esp., bloquea movs', sprite: 'choice-specs' },
    { id: 'choice-scarf', name: 'Pañuelo Elegido', effect: '+50% Vel., bloquea movs', sprite: 'choice-scarf' },
    { id: 'focus-sash', name: 'Banda Focus', effect: 'Resiste golpe mortal 1 vez', sprite: 'focus-sash' },
    { id: 'leftovers', name: 'Restos', effect: 'Recupera 1/16 PS por turno', sprite: 'leftovers' },
    { id: 'lucky-egg', name: 'Huevo Suerte', effect: '+50% experiencia ganada', sprite: 'lucky-egg' },
    { id: 'amulet-coin', name: 'Moneda Amuleto', effect: 'Dobla el dinero ganado', sprite: 'amulet-coin' },
    { id: 'exp-share', name: 'Repartir Exp', effect: 'Comparte experiencia', sprite: 'exp-share' }
  ],
  berries: [
    { id: 'oran-berry', name: 'Baya Oran', effect: 'Restaura 10 PS', sprite: 'oran-berry' },
    { id: 'sitrus-berry', name: 'Baya Zidra', effect: 'Restaura 25% PS', sprite: 'sitrus-berry' },
    { id: 'lum-berry', name: 'Baya Ziuela', effect: 'Cura cualquier estado', sprite: 'lum-berry' },
    { id: 'leppa-berry', name: 'Baya Zanama', effect: 'Restaura 10 PP de un movimiento', sprite: 'leppa-berry' },
    { id: 'cheri-berry', name: 'Baya Zreza', effect: 'Cura parálisis', sprite: 'cheri-berry' },
    { id: 'chesto-berry', name: 'Baya Atania', effect: 'Despierta al Pokémon', sprite: 'chesto-berry' },
    { id: 'pecha-berry', name: 'Baya Meloc', effect: 'Cura envenenamiento', sprite: 'pecha-berry' },
    { id: 'rawst-berry', name: 'Baya Safre', effect: 'Cura quemaduras', sprite: 'rawst-berry' },
    { id: 'aspear-berry', name: 'Baya Perasi', effect: 'Cura congelación', sprite: 'aspear-berry' },
    { id: 'persim-berry', name: 'Baya Caquic', effect: 'Cura confusión', sprite: 'persim-berry' }
  ],
  key: [
    { id: 'bicycle', name: 'Bicicleta', effect: 'Viaja más rápido', sprite: 'bicycle' },
    { id: 'town-map', name: 'Mapa', effect: 'Muestra la región', sprite: 'town-map' },
    { id: 'super-rod', name: 'Supercaña', effect: 'Pesca Pokémon raros', sprite: 'super-rod' },
    { id: 'good-rod', name: 'Caña Buena', effect: 'Pesca Pokémon', sprite: 'good-rod' },
    { id: 'old-rod', name: 'Caña Vieja', effect: 'Pesca Pokémon comunes', sprite: 'old-rod' },
    { id: 'hm-surf', name: 'MO03 Surf', effect: 'Viaja por el agua', sprite: 'hm-normal' },
    { id: 'hm-fly', name: 'MO02 Vuelo', effect: 'Viaja entre ciudades', sprite: 'hm-flying' },
    { id: 'hm-strength', name: 'MO04 Fuerza', effect: 'Empuja rocas', sprite: 'hm-fighting' },
    { id: 'hm-cut', name: 'MO01 Corte', effect: 'Corta arbustos', sprite: 'hm-normal' },
    { id: 'hm-flash', name: 'MO05 Destello', effect: 'Ilumina cuevas', sprite: 'hm-normal' }
  ]
};

function InventoryModal({ show, onHide, gameName, username }) {
  const [inventory, setInventory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('medicine');
  const [searchTerm, setSearchTerm] = useState('');
  const [customItem, setCustomItem] = useState({ name: '', quantity: 1, note: '' });
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Cargar inventario del juego
  useEffect(() => {
    const loadInventory = () => {
      if (show && gameName && username) {
        const savedInventory = localStorage.getItem(`inventory_${username}_${gameName}`);
        if (savedInventory) {
          setInventory(JSON.parse(savedInventory));
        } else {
          setInventory({});
        }
      }
    };
    loadInventory();
  }, [show, gameName, username]);

  // Guardar inventario
  const saveInventory = (newInventory) => {
    setInventory(newInventory);
    localStorage.setItem(`inventory_${username}_${gameName}`, JSON.stringify(newInventory));
  };

  // Añadir objeto
  const addItem = (itemId, itemData, quantity = 1) => {
    const newInventory = { ...inventory };
    if (newInventory[itemId]) {
      newInventory[itemId].quantity += quantity;
    } else {
      newInventory[itemId] = { ...itemData, quantity };
    }
    saveInventory(newInventory);
  };

  // Eliminar objeto
  const removeItem = (itemId, quantity = 1) => {
    const newInventory = { ...inventory };
    if (newInventory[itemId]) {
      newInventory[itemId].quantity -= quantity;
      if (newInventory[itemId].quantity <= 0) {
        delete newInventory[itemId];
      }
      saveInventory(newInventory);
    }
  };

  // Añadir objeto personalizado
  const addCustomItem = () => {
    if (customItem.name.trim()) {
      const id = `custom_${Date.now()}`;
      addItem(id, {
        name: customItem.name,
        effect: customItem.note || 'Objeto personalizado',
        sprite: 'unknown-item',
        isCustom: true
      }, customItem.quantity);
      setCustomItem({ name: '', quantity: 1, note: '' });
      setShowCustomForm(false);
    }
  };

  // Filtrar objetos por búsqueda
  const getFilteredItems = () => {
    const items = COMMON_ITEMS[selectedCategory] || [];
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.effect.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Calcular estadísticas
  const totalItems = Object.values(inventory).reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItems = Object.keys(inventory).length;

  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down">
      <Modal.Header 
        style={{ 
          background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
          border: 'none'
        }}
      >
        <Modal.Title className="text-white fw-bold">
          Inventario - {gameName}
        </Modal.Title>
        <Button variant="light" size="sm" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Header>

      <Modal.Body className="p-0">
        <Tabs
          activeKey={selectedCategory}
          onSelect={(k) => setSelectedCategory(k)}
          className="border-bottom"
          fill
        >
          {Object.entries(ITEM_CATEGORIES).map(([key, category]) => (
            <Tab 
              key={key} 
              eventKey={key} 
              title={
                <span style={{ color: category.color, fontWeight: 'bold' }}>
                  {category.name}
                </span>
              }
            />
          ))}
        </Tabs>

        <Row className="g-0" style={{ minHeight: '500px' }}>
          {/* Panel izquierdo: Lista de objetos disponibles */}
          <Col md={8} className="border-end">
            <div className="p-3 border-bottom bg-light">
              <Form.Control
                type="text"
                placeholder="Buscar objetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="p-3" style={{ maxHeight: '450px', overflowY: 'auto' }}>
              <Row className="g-2">
                {getFilteredItems().map((item) => (
                  <Col xs={6} md={4} lg={3} key={item.id}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body className="p-3 text-center">
                        <div 
                          className="mb-2 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '50px', 
                            height: '50px',
                            backgroundColor: ITEM_CATEGORIES[selectedCategory]?.color || '#ddd'
                          }}
                        >
                          <span className="fw-bold text-white" style={{ fontSize: '0.7rem' }}>
                            {item.id.substring(0, 3).toUpperCase()}
                          </span>
                        </div>
                        <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>
                          {item.name}
                        </h6>
                        <small className="text-muted d-block mb-2" style={{ fontSize: '0.7rem' }}>
                          {item.effect}
                        </small>
                        <Button 
                          size="sm" 
                          variant="primary"
                          className="w-100"
                          onClick={() => addItem(item.id, item)}
                        >
                          Añadir
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          {/* Panel derecho: Inventario actual */}
          <Col md={4} className="bg-light">
            <div className="p-3 border-bottom">
              <h5 className="fw-bold mb-1">Tu Inventario</h5>
              <small className="text-muted">
                {totalItems} objetos ({uniqueItems} únicos)
              </small>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {Object.entries(inventory).length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <p>Tu inventario está vacío</p>
                  <small>Haz clic en "Añadir" para guardar objetos</small>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {Object.entries(inventory).map(([itemId, item]) => (
                    <ListGroup.Item key={itemId} className="d-flex justify-content-between align-items-center p-3">
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>
                          {item.name}
                          {item.isCustom && (
                            <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.6rem' }}>
                              PERSONALIZADO
                            </Badge>
                          )}
                        </h6>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {item.effect}
                        </small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg="primary" style={{ fontSize: '0.9rem' }}>
                          x{item.quantity}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => removeItem(itemId)}
                        >
                          -
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline-success"
                          onClick={() => addItem(itemId, item)}
                        >
                          +
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>

            {/* Botón objeto personalizado */}
            <div className="p-3 border-top">
              {!showCustomForm ? (
                <Button 
                  variant="outline-primary" 
                  className="w-100"
                  onClick={() => setShowCustomForm(true)}
                >
                  + Añadir objeto personalizado
                </Button>
              ) : (
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-3">
                    <h6 className="fw-bold mb-3">Objeto Personalizado</h6>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Nombre del objeto"
                        value={customItem.name}
                        onChange={(e) => setCustomItem({...customItem, name: e.target.value})}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Descripción/efecto (opcional)"
                        value={customItem.note}
                        onChange={(e) => setCustomItem({...customItem, note: e.target.value})}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="number"
                        min="1"
                        placeholder="Cantidad"
                        value={customItem.quantity}
                        onChange={(e) => setCustomItem({...customItem, quantity: parseInt(e.target.value) || 1})}
                      />
                    </Form.Group>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="flex-grow-1"
                        onClick={() => setShowCustomForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        className="flex-grow-1"
                        onClick={addCustomItem}
                      >
                        Añadir
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default InventoryModal;
