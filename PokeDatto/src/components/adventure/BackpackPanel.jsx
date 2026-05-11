import { useState, useEffect, useRef } from 'react';
import { Card, Badge, Button, Row, Col, Form } from 'react-bootstrap';
import { getPocketsForGame, getItemSpriteUrl, ITEMS_CATALOG } from './gameData';
import { useSettings, useTranslation } from '../../contexts/SettingsContext';

function BackpackPanel({ gameName, backpack, onUpdateBackpack }) {
  const { isDark } = useSettings();
  const { t, tItem, tPocket } = useTranslation();
  const pockets = getPocketsForGame(gameName);
  const [activePocket, setActivePocket] = useState(pockets[0]?.key || '');
  const [showAddItem, setShowAddItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef(null);
  const searchSuggRef = useRef(null);

  const currentPocketData = backpack[activePocket] || [];

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchSuggRef.current && !searchSuggRef.current.contains(e.target) &&
          searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocompletado de items
  const handleSearchInput = (value) => {
    setSearchTerm(value);
    if (value.length >= 2) {
      const available = getAvailableItems();
      const filtered = available
        .filter(i => tItem(i.id).toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
      setSearchSuggestions(filtered);
      setShowSearchSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSearchSuggestions(false);
    }
  };

  const selectSuggestion = (item) => {
    addItemToBackpack(item);
    setSearchTerm('');
    setShowSearchSuggestions(false);
  };

  const addItemToBackpack = (item) => {
    const newBackpack = { ...backpack };
    const pocketItems = [...(newBackpack[activePocket] || [])];
    const existingIdx = pocketItems.findIndex(i => i.itemId === item.id);

    if (existingIdx >= 0) {
      pocketItems[existingIdx] = { ...pocketItems[existingIdx], quantity: pocketItems[existingIdx].quantity + 1 };
    } else {
      pocketItems.push({
        itemId: item.id,
        name: item.name,
        sprite: item.sprite,
        effect: item.effect,
        quantity: 1,
      });
    }

    newBackpack[activePocket] = pocketItems;
    onUpdateBackpack(newBackpack);
  };

  const removeItemFromBackpack = (itemId) => {
    const newBackpack = { ...backpack };
    const pocketItems = [...(newBackpack[activePocket] || [])];
    const idx = pocketItems.findIndex(i => i.itemId === itemId);

    if (idx >= 0) {
      if (pocketItems[idx].quantity > 1) {
        pocketItems[idx] = { ...pocketItems[idx], quantity: pocketItems[idx].quantity - 1 };
      } else {
        pocketItems.splice(idx, 1);
      }
    }

    newBackpack[activePocket] = pocketItems;
    onUpdateBackpack(newBackpack);
  };

  const incrementItem = (itemId) => {
    const newBackpack = { ...backpack };
    const pocketItems = [...(newBackpack[activePocket] || [])];
    const idx = pocketItems.findIndex(i => i.itemId === itemId);

    if (idx >= 0) {
      pocketItems[idx] = { ...pocketItems[idx], quantity: pocketItems[idx].quantity + 1 };
    }

    newBackpack[activePocket] = pocketItems;
    onUpdateBackpack(newBackpack);
  };

  // Filtrar items del catálogo disponibles para este bolsillo
  const getAvailableItems = () => {
    let items = ITEMS_CATALOG.filter(i => i.pocket === activePocket);
    // Para gen1_remake y gen3, medicina va dentro de "objetos"
    if (activePocket === 'objetos') {
      const pocketKeys = pockets.map(p => p.key);
      if (!pocketKeys.includes('medicina')) {
        const medItems = ITEMS_CATALOG.filter(i => i.pocket === 'medicina');
        items = [...items, ...medItems];
      }
      if (!pocketKeys.includes('objetos_combate')) {
        const combatItems = ITEMS_CATALOG.filter(i => i.pocket === 'objetos_combate');
        items = [...items, ...combatItems];
      }
    }
    if (searchTerm) {
      items = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return items;
  };

  const totalItems = Object.values(backpack).reduce(
    (sum, pocket) => sum + (pocket || []).reduce((s, i) => s + i.quantity, 0), 0
  );

  return (
    <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
      <Card.Header
        className="d-flex align-items-center justify-content-between"
        style={{
          background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
          borderRadius: '16px 16px 0 0',
          border: 'none',
          padding: '16px 20px',
        }}
      >
        <div>
          <h5 className="fw-bold text-white mb-0">{t('backpack.title')}</h5>
          <small className="text-white" style={{ opacity: 0.8 }}>
            {totalItems} {t('backpack.itemsInTotal')}
          </small>
        </div>
        <Badge bg="light" text="dark" pill style={{ fontSize: '0.85rem' }}>
          {gameName}
        </Badge>
      </Card.Header>

      {/* Pestañas de bolsillos */}
      <div
        className="d-flex flex-wrap gap-1 p-2"
        style={{ borderBottom: isDark ? '2px solid #2e303a' : '2px solid #e0e0e0', backgroundColor: isDark ? '#1a1b23' : '#f5f5f5' }}
      >
        {pockets.map((pocket) => {
          const pocketCount = (backpack[pocket.key] || []).reduce((s, i) => s + i.quantity, 0);
          return (
            <Button
              key={pocket.key}
              size="sm"
              onClick={() => { setActivePocket(pocket.key); setShowAddItem(false); }}
              style={{
                backgroundColor: activePocket === pocket.key ? pocket.color : (isDark ? '#23252f' : 'transparent'),
                color: activePocket === pocket.key ? 'white' : (isDark ? '#c8ccd4' : '#555'),
                border: activePocket === pocket.key ? 'none' : (isDark ? '1px solid #3d3f4e' : '1px solid #ddd'),
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: activePocket === pocket.key ? 'bold' : 'normal',
                transition: 'all 0.2s ease',
                padding: '4px 12px',
              }}
            >
              {pocket.icon} {tPocket(pocket.key)}
              {pocketCount > 0 && (
                <Badge
                  bg="dark"
                  pill
                  className="ms-1"
                  style={{ fontSize: '0.65rem' }}
                >
                  {pocketCount}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      <Card.Body style={{ maxHeight: '500px', overflowY: 'auto', padding: '12px' }}>
        {/* Items actuales en el bolsillo */}
        {currentPocketData.length === 0 && !showAddItem ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem', opacity: 0.3 }}>
              {pockets.find(p => p.key === activePocket)?.icon || '🎒'}
            </div>
            <p className="text-muted mt-2" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>{t('backpack.empty')}</p>
            <Button
              variant="outline-primary"
              size="sm"
              className="rounded-pill"
              onClick={() => setShowAddItem(true)}
            >
              + {t('backpack.addItem')}
            </Button>
          </div>
        ) : (
          <>
            {currentPocketData.map((item) => (
              <div
                key={item.itemId}
                className="d-flex align-items-center p-2 mb-1 rounded-3"
                style={{
                  backgroundColor: isDark ? '#23252f' : '#f8f9fa',
                  border: isDark ? '1px solid #2e303a' : '1px solid #e9ecef',
                  transition: 'all 0.2s ease',
                }}
              >
                <img
                  src={getItemSpriteUrl(item.sprite)}
                  alt={item.name}
                  style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="flex-grow-1 ms-2">
                  <div className="fw-semibold" style={{ fontSize: '0.85rem', color: isDark ? '#e8eaed' : '#333' }}>{tItem(item.itemId)}</div>
                  <small className="text-muted" style={{ fontSize: '0.7rem', color: isDark ? '#9ca3af' : '#6c757d' }}>{t(item.effect)}</small>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline-danger"
                    style={{ width: '26px', height: '26px', padding: 0, fontSize: '0.75rem', borderRadius: '50%' }}
                    onClick={() => removeItemFromBackpack(item.itemId)}
                  >
                    -
                  </Button>
                  <Badge
                    bg="primary"
                    style={{ fontSize: '0.8rem', minWidth: '30px', textAlign: 'center' }}
                  >
                    x{item.quantity}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline-success"
                    style={{ width: '26px', height: '26px', padding: 0, fontSize: '0.75rem', borderRadius: '50%' }}
                    onClick={() => incrementItem(item.itemId)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}

            {!showAddItem && (
              <Button
                variant="outline-primary"
                size="sm"
                className="w-100 mt-2 rounded-pill"
                onClick={() => setShowAddItem(true)}
              >
                + {t('backpack.addItem')}
              </Button>
            )}
          </>
        )}

        {/* Panel para añadir items */}
        {showAddItem && (
          <div className="mt-3">
            <div className="d-flex align-items-center gap-2 mb-2 position-relative">
              <div className="flex-grow-1 position-relative">
                <Form.Control
                  ref={searchRef}
                  type="text"
                  placeholder={t('items.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => { if (searchTerm.length >= 2) setShowSearchSuggestions(true); }}
                  size="sm"
                  style={{ borderRadius: '20px', backgroundColor: isDark ? '#1a1b23' : '#fff', color: isDark ? '#e8eaed' : '#333' }}
                />
                {showSearchSuggestions && searchSuggestions.length > 0 && (
                  <div
                    ref={searchSuggRef}
                    className="position-absolute w-100 mt-1 rounded-3 shadow"
                    style={{
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      backgroundColor: isDark ? '#1a1b23' : '#fff',
                      border: isDark ? '1px solid #2e303a' : '1px solid #dee2e6',
                    }}
                  >
                    {searchSuggestions.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center gap-2 px-3 py-2"
                        style={{
                          cursor: 'pointer',
                          borderBottom: isDark ? '1px solid #2e303a' : '1px solid #f0f0f0',
                          color: isDark ? '#e8eaed' : '#333',
                          fontSize: '0.85rem',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? '#2e3040' : '#f8f9fa'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        onClick={() => selectSuggestion(item)}
                      >
                        <img
                          src={getItemSpriteUrl(item.sprite)}
                          alt={item.name}
                          style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }}
                        />
                        <span>{tItem(item.id)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                className="rounded-pill"
                onClick={() => { setShowAddItem(false); setSearchTerm(''); setShowSearchSuggestions(false); }}
              >
                {t('common.close')}
              </Button>
            </div>
            {searchTerm.length >= 2 && !showSearchSuggestions && (
              <div className="text-center py-3" style={{ color: isDark ? '#9ca3af' : '#6c757d', fontSize: '0.8rem' }}>
                {getAvailableItems().length === 0 ? t('items.notFound') : t('backpack.typeToSearch')}
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default BackpackPanel;
