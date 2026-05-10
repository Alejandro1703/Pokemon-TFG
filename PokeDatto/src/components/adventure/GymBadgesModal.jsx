import { Modal, Button, Row, Col } from 'react-bootstrap';
import { getBadgesForGame, getRegionForGame } from './gameData';
import { useTranslation } from '../../contexts/SettingsContext';

const TYPE_COLORS = {
  normal:   { bg: '#C6C6A7', border: '#A8A878', circle: '#D5D5B8', text: '#6D6D4E' },
  fuego:    { bg: '#F5AC78', border: '#F08030', circle: '#F8C8A0', text: '#9C531F' },
  agua:     { bg: '#9DB7F5', border: '#6890F0', circle: '#B4C8F8', text: '#445E9C' },
  planta:   { bg: '#A7DB8D', border: '#78C850', circle: '#B8E4A0', text: '#4E8234' },
  electrico:{ bg: '#FAE078', border: '#F8D030', circle: '#FCE899', text: '#A1871F' },
  hielo:    { bg: '#BCE6E6', border: '#98D8D8', circle: '#D0F0F0', text: '#638D8D' },
  lucha:    { bg: '#D67873', border: '#C03028', circle: '#E09890', text: '#7D1F1A' },
  veneno:   { bg: '#C183C1', border: '#A040A0', circle: '#D0A0D0', text: '#682A68' },
  tierra:   { bg: '#EBD69D', border: '#E0C068', circle: '#F0E0B0', text: '#927D44' },
  volador:  { bg: '#C6B7F5', border: '#A890F0', circle: '#D4C8F8', text: '#6D5E9C' },
  psiquico: { bg: '#FA92B2', border: '#F85888', circle: '#FCB0C8', text: '#A13959' },
  bicho:    { bg: '#C6D16E', border: '#A8B820', circle: '#D4DC8C', text: '#6D7815' },
  roca:     { bg: '#D1C17D', border: '#B8A038', circle: '#DDD09A', text: '#786824' },
  fantasma: { bg: '#A292BC', border: '#705898', circle: '#B8A8CC', text: '#493963' },
  dragon:   { bg: '#A27DFA', border: '#7038F8', circle: '#B898FC', text: '#4924A1' },
  siniestro:{ bg: '#A29288', border: '#705848', circle: '#B8A89E', text: '#49392F' },
  acero:    { bg: '#D1D1E0', border: '#B8B8D0', circle: '#DDDDE8', text: '#787887' },
};

function GymBadgesModal({ show, onHide, gameName, earnedBadges = [], onToggleBadge }) {
  const { t } = useTranslation();
  const badges = getBadgesForGame(gameName);
  const region = getRegionForGame(gameName);

  const earnedCount = earnedBadges.length;

  const renderBadge = (badge, idx) => {
    const earned = earnedBadges.includes(idx);
    const tc = TYPE_COLORS[badge.type] || TYPE_COLORS.normal;
    return (
      <Col xs={6} sm={3} key={idx} className="text-center">
        <div
          className="p-3 rounded-3 mx-auto"
          style={{
            backgroundColor: tc.bg,
            border: `2px solid ${tc.border}`,
            maxWidth: '140px',
            transition: 'all 0.2s ease',
            opacity: earned ? 1 : 0.55,
          }}
        >
          <div
            className="mx-auto mb-2 d-flex align-items-center justify-content-center"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: earned ? tc.circle : '#e0e0e0',
              borderRadius: '50%',
              border: earned ? `3px solid ${tc.border}` : '3px solid #bdbdbd',
              overflow: 'hidden',
              filter: earned ? 'none' : 'grayscale(80%)',
              transition: 'all 0.2s ease',
            }}
          >
            <img
              src={badge.image}
              alt={badge.name}
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span style="font-size:2rem">🏅</span>`;
              }}
            />
          </div>
          <div className="fw-bold" style={{ fontSize: '0.78rem', color: tc.text }}>
            {badge.name}
          </div>
          <small style={{ fontSize: '0.68rem', color: tc.text, opacity: 0.75 }}>
            {badge.leader}
          </small>
          <div className="mt-2">
            <button
              onClick={() => onToggleBadge && onToggleBadge(idx)}
              style={{
                padding: '3px 12px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '0.68rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: earned ? '#4caf50' : 'rgba(255,255,255,0.6)',
                color: earned ? '#fff' : tc.text,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = earned ? '#f44336' : '#66bb6a';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.textContent = earned ? `✕ ${t('badges.remove')}` : `✓ ${t('badges.mark')}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = earned ? '#4caf50' : 'rgba(255,255,255,0.6)';
                e.currentTarget.style.color = earned ? '#fff' : tc.text;
                e.currentTarget.textContent = earned ? `✓ ${t('badges.obtained')}` : `— ${t('badges.notObtained')}`;
              }}
            >
              {earned ? `✓ ${t('badges.obtained')}` : `— ${t('badges.notObtained')}`}
            </button>
          </div>
        </div>
      </Col>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header
        closeButton
        style={{
          background: 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)',
          border: 'none',
        }}
      >
        <Modal.Title className="fw-bold text-white">
          {t('badges.title')} - {region.name}
          <span
            style={{
              fontSize: '0.75rem',
              marginLeft: '12px',
              backgroundColor: 'rgba(255,255,255,0.25)',
              padding: '2px 10px',
              borderRadius: '12px',
            }}
          >
            {earnedCount}/{badges.length}
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <p className="text-center text-muted mb-4">
          {t('badges.description').replace('{region}', region.name).replace('{game}', gameName)}
        </p>

        {/* First row: Badges 1-4 */}
        <Row className="g-3 mb-3 justify-content-center">
          {badges.slice(0, 4).map((badge, idx) => renderBadge(badge, idx))}
        </Row>

        {/* Second row: Badges 5-8 */}
        <Row className="g-3 justify-content-center">
          {badges.slice(4, 8).map((badge, idx) => renderBadge(badge, idx + 4))}
        </Row>
      </Modal.Body>

      <Modal.Footer className="border-top-0">
        <Button variant="secondary" onClick={onHide} className="rounded-pill px-4">
          {t('common.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GymBadgesModal;
