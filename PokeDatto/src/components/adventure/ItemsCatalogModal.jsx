import { useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { ITEMS_CATALOG, getItemSpriteUrl } from './gameData';
import { useTranslation } from '../../contexts/SettingsContext';

const GEN_LABELS = ['1ª', '2ª', '3ª', '4ª', '5ª'];
const GEN_COLORS = {
  active: ['#ef5350', '#42a5f5', '#66bb6a', '#ab47bc', '#78909c'],
  inactive: '#e0e0e0',
};

const getCategories = (t) => [
  { key: 'all', label: t('items.categoryAll'), icon: '📋' },
  { key: 'medicina', label: t('items.categoryMedicine'), icon: '💊' },
  { key: 'pokeballs', label: t('items.categoryBalls'), icon: '⚪' },
  { key: 'objetos', label: t('items.categoryItems'), icon: '🎒' },
  { key: 'objetos_combate', label: t('items.categoryCombat'), icon: '⚔️' },
  { key: 'bayas', label: t('items.categoryBerries'), icon: '🍇' },
  { key: 'objetos_clave', label: t('items.categoryKey'), icon: '🔑' },
];

function ItemsCatalogModal({ show, onHide }) {
  const { t, tItem } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGen, setFilterGen] = useState(null);

  const getFilteredItems = () => {
    let items = ITEMS_CATALOG;

    if (activeCategory !== 'all') {
      items = items.filter(i => i.pocket === activeCategory);
    }

    if (filterGen !== null) {
      items = items.filter(i => i.gens.includes(filterGen));
    }

    if (searchTerm) {
      items = items.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.effect.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items;
  };

  const filteredItems = getFilteredItems();

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header
        closeButton
        style={{
          background: 'linear-gradient(135deg, #7c4dff 0%, #536dfe 100%)',
          border: 'none',
        }}
      >
        <Modal.Title className="fw-bold text-white">
          {t('items.available')} (Gen 1 - Gen 5)
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        {/* Barra de filtros */}
        <div className="p-3" style={{ borderBottom: '2px solid #e0e0e0', backgroundColor: '#fafafa' }}>
          <Row className="g-2 align-items-center">
            <Col md={5}>
              <Form.Control
                type="text"
                placeholder={t('items.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '20px' }}
              />
            </Col>
            <Col md={7}>
              <div className="d-flex flex-wrap gap-1">
                {getCategories(t).map((cat) => (
                  <Button
                    key={cat.key}
                    size="sm"
                    onClick={() => setActiveCategory(cat.key)}
                    style={{
                      backgroundColor: activeCategory === cat.key ? '#536dfe' : 'white',
                      color: activeCategory === cat.key ? 'white' : '#555',
                      border: activeCategory === cat.key ? 'none' : '1px solid #ddd',
                      borderRadius: '16px',
                      fontSize: '0.75rem',
                      fontWeight: activeCategory === cat.key ? 'bold' : 'normal',
                      padding: '3px 10px',
                    }}
                  >
                    {cat.icon} {cat.label}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>

          {/* Filtro por generación */}
          <div className="d-flex align-items-center gap-2 mt-2">
            <small className="text-muted fw-bold">{t('items.filterByGen')}</small>
            {[1, 2, 3, 4, 5].map((gen) => (
              <Button
                key={gen}
                size="sm"
                onClick={() => setFilterGen(filterGen === gen ? null : gen)}
                style={{
                  backgroundColor: filterGen === gen ? GEN_COLORS.active[gen - 1] : 'white',
                  color: filterGen === gen ? 'white' : '#555',
                  border: filterGen === gen ? 'none' : '1px solid #ddd',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  padding: '2px 10px',
                  minWidth: '36px',
                }}
              >
                {GEN_LABELS[gen - 1]}
              </Button>
            ))}
            {filterGen && (
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => setFilterGen(null)}
                style={{ borderRadius: '12px', fontSize: '0.7rem', padding: '2px 8px' }}
              >
                {t('items.clear')}
              </Button>
            )}
          </div>
        </div>

        {/* Grid de items */}
        <div className="p-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <small className="text-muted mb-2 d-block">
            {filteredItems.length} {filteredItems.length !== 1 ? t('items.foundPlural') : t('items.foundSingular')}
          </small>
          <Row className="g-2">
            {filteredItems.map((item) => (
              <Col xs={12} sm={6} md={4} lg={3} key={item.id}>
                <div
                  className="d-flex align-items-start p-2 rounded-3 h-100"
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Icono del item */}
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#e3f2fd',
                      borderRadius: '8px',
                    }}
                  >
                    <img
                      src={getItemSpriteUrl(item.sprite)}
                      alt={item.name}
                      style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span style="font-size:1.2rem">❓</span>';
                      }}
                    />
                  </div>

                  <div className="ms-2 flex-grow-1 overflow-hidden">
                    {/* Nombre */}
                    <div className="fw-bold text-truncate" style={{ fontSize: '0.82rem' }}>
                      {tItem(item.id)}
                    </div>

                    {/* Efecto */}
                    <small className="text-muted d-block" style={{ fontSize: '0.68rem', lineHeight: 1.2 }}>
                      {t(item.effect)}
                    </small>

                    {/* Indicadores de generación */}
                    <div className="d-flex gap-1 mt-1">
                      {GEN_LABELS.map((label, idx) => {
                        const genNum = idx + 1;
                        const isAvailable = item.gens.includes(genNum);
                        return (
                          <span
                            key={genNum}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '22px',
                              height: '16px',
                              borderRadius: '4px',
                              fontSize: '0.55rem',
                              fontWeight: 'bold',
                              color: isAvailable ? 'white' : '#bbb',
                              backgroundColor: isAvailable ? GEN_COLORS.active[idx] : GEN_COLORS.inactive,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {filteredItems.length === 0 && (
            <div className="text-center py-5">
              <div style={{ fontSize: '3rem', opacity: 0.3 }}>🔍</div>
              <p className="text-muted mt-2">{t('items.notFound')}</p>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="border-top">
        <Button variant="secondary" onClick={onHide} className="rounded-pill px-4">
          {t('common.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ItemsCatalogModal;
