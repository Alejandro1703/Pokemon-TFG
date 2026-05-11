import { useState } from 'react';
import { Card, Row, Col, Badge, Accordion } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSettings, useTranslation } from '../contexts/SettingsContext';
import {
  ALL_LEAGUES,
  getLeaguePokemonSprite,
  TYPE_COLORS,
  TYPE_NAMES_ES,
  TYPE_NAMES_EN,
} from '../data/pokemonLeagueData';
import {
  getMoveTranslation,
  getMoveType,
  getPokemonTypes,
  getItemSpriteUrl,
} from '../data/gymExtraData';

function PokemonLeaguePage() {
  const { isDark } = useSettings();
  const { language } = useTranslation();
  const [activeRegion, setActiveRegion] = useState(null);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextElementSibling;
    if (fallback) fallback.style.display = 'flex';
  };

  const toggleRegion = (regionKey) => {
    setActiveRegion(activeRegion === regionKey ? null : regionKey);
  };

  const renderMemberCard = (member, isChampion = false) => {
    return (
      <Col md={isChampion ? 12 : 6} lg={isChampion ? 12 : 3} key={member.id} className={isChampion ? 'mb-3' : ''}>
        <Card
          className="border-0 shadow-sm h-100"
          style={{
            backgroundColor: isDark ? '#23252f' : '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            border: isChampion ? `3px solid ${TYPE_COLORS[member.type]}` : 'none',
          }}
        >
          <div
            className="px-3 py-3 d-flex align-items-center gap-3"
            style={{
              background: isChampion ? 'transparent' : `linear-gradient(135deg, ${TYPE_COLORS[member.type]}18 0%, ${TYPE_COLORS[member.type]}08 100%)`,
              borderBottom: isChampion ? 'none' : `2px solid ${TYPE_COLORS[member.type]}`,
            }}
          >
            <div
              className="position-relative"
              style={{
                width: isChampion ? '110px' : '72px',
                height: isChampion ? '110px' : '72px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid ${TYPE_COLORS[member.type]}`,
                backgroundColor: isDark ? '#1a1c23' : '#f0f0f0',
                flexShrink: 0,
              }}
            >
              <img
                src={member.image}
                alt={language === 'es' ? member.name_es : member.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: isChampion ? 'contain' : 'cover',
                  padding: isChampion ? '6px' : '0',
                }}
                onError={handleImageError}
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 align-items-center justify-content-center fw-bold"
                style={{
                  display: 'none',
                  backgroundColor: isDark ? '#2a2d3a' : '#f0f0f0',
                  color: TYPE_COLORS[member.type],
                  fontSize: isChampion ? '2.2rem' : '1.5rem',
                }}
              >
                {(language === 'es' ? member.name_es : member.name).charAt(0)}
              </div>
            </div>
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h5 className="m-0 fw-bold" style={{ color: isDark ? '#e8eaed' : '#1f2937', fontSize: isChampion ? '1.35rem' : '1.25rem' }}>
                  {language === 'es' ? member.name_es : member.name}
                </h5>
              </div>
              <small className="d-block" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>
                {language === 'es' ? member.role.es : member.role.en}
              </small>
              <div className="d-flex gap-1 mt-1 flex-wrap">
                <span
                  className="d-inline-flex align-items-center gap-1 rounded-pill"
                  style={{
                    color: TYPE_COLORS[member.type],
                    border: `1.5px solid ${TYPE_COLORS[member.type]}`,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '3px 10px',
                    textTransform: 'capitalize',
                    backgroundColor: 'transparent',
                  }}
                >
                  <span style={{ fontSize: '0.65rem' }}>●</span>
                  {language === 'es' ? TYPE_NAMES_ES[member.type] : TYPE_NAMES_EN[member.type]}
                </span>
                {member.note && (
                  <span
                    className="rounded-pill"
                    style={{
                      backgroundColor: 'transparent',
                      color: isDark ? '#9ca3af' : '#6c757d',
                      border: `1px solid ${isDark ? '#3a3d4a' : '#e5e7eb'}`,
                      fontSize: '0.6rem',
                      padding: '2px 8px',
                    }}
                  >
                    {language === 'es' ? member.note.es : member.note.en}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Card.Body className="p-3">
            <Accordion
              defaultActiveKey={null}
              style={{
                '--bs-accordion-bg': 'transparent',
                '--bs-accordion-border-color': isDark ? '#3a3d4a' : '#e5e7eb',
                '--bs-accordion-btn-color': isDark ? '#e8eaed' : '#333',
                '--bs-accordion-btn-bg': 'transparent',
                '--bs-accordion-active-bg': isDark ? '#2e3040' : '#f8f9fa',
                '--bs-accordion-active-color': isDark ? '#e8eaed' : '#333',
              }}
            >
              <Accordion.Item eventKey="team">
                <Accordion.Header className="py-1">
                  <small className="fw-semibold">
                    {language === 'es' ? 'Equipo (' : 'Team ('}{member.team.length}{language === 'es' ? ' Pokémon)' : ' Pokémon)'}
                  </small>
                </Accordion.Header>
                <Accordion.Body className="px-0 pt-2 pb-1">
                  {member.team.map((poke, idx) => {
                    const pokeTypes = getPokemonTypes(poke.name);
                    const itemSprite = poke.item ? getItemSpriteUrl(poke.item) : null;
                    return (
                      <div
                        key={idx}
                        className="mb-2 p-2 rounded-2"
                        style={{ backgroundColor: isDark ? '#2a2d3a' : '#f8f9fa' }}
                      >
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <img
                            src={getLeaguePokemonSprite(poke.name)}
                            alt={poke.name}
                            style={{
                              width: '48px',
                              height: '48px',
                              imageRendering: 'pixelated',
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png`;
                            }}
                          />
                          <div className="flex-grow-1" style={{ minWidth: 0 }}>
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                              <span className="fw-semibold" style={{ color: isDark ? '#e8eaed' : '#333', fontSize: '0.85rem' }}>
                                {poke.name}
                              </span>
                              {pokeTypes.map((pt) => (
                                <span
                                  key={pt}
                                  className="rounded-pill"
                                  style={{
                                    backgroundColor: 'transparent',
                                    color: TYPE_COLORS[pt],
                                    border: `1.5px solid ${TYPE_COLORS[pt]}`,
                                    fontSize: '0.55rem',
                                    fontWeight: 600,
                                    padding: '1px 6px',
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {language === 'es' ? TYPE_NAMES_ES[pt] : TYPE_NAMES_EN[pt]}
                                </span>
                              ))}
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                              <span style={{ color: isDark ? '#9ca3af' : '#6c757d', fontSize: '0.7rem' }}>
                                Lv.{poke.level}
                              </span>
                              {poke.item && (
                                <div className="d-flex align-items-center gap-1">
                                  {itemSprite && (
                                    <img
                                      src={itemSprite}
                                      alt={poke.item}
                                      style={{ width: '16px', height: '16px', imageRendering: 'pixelated' }}
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  )}
                                  <span style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 500 }}>
                                    {poke.item}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row g-1">
                          {poke.moves.map((move, mIdx) => {
                            const moveType = getMoveType(move);
                            return (
                              <div key={mIdx} className="col-6">
                                <div
                                  className="d-flex align-items-center gap-1 px-2 py-1 rounded-1"
                                  style={{
                                    backgroundColor: TYPE_COLORS[moveType] + '10',
                                    border: `1px solid ${TYPE_COLORS[moveType]}25`,
                                  }}
                                >
                                  <span
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      backgroundColor: TYPE_COLORS[moveType],
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: isDark ? '#e8eaed' : '#333',
                                      fontSize: '0.7rem',
                                      fontWeight: 500,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {getMoveTranslation(move, language)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </Accordion.Body>
              </Accordion.Item>
              {(() => {
                const resolvedTips = member.tips ? member.tips(language === 'es' ? member.name_es : member.name, language === 'es' ? member.name_es : member.name) : null;
                const tipsList = resolvedTips ? resolvedTips[language] : [];
                if (!tipsList || tipsList.length === 0) return null;
                return (
                  <Accordion.Item eventKey="tips">
                    <Accordion.Header className="py-1">
                      <small className="fw-semibold" style={{ color: '#f59e0b' }}>
                        {language === 'es' ? 'Consejos' : 'Tips'}
                      </small>
                    </Accordion.Header>
                    <Accordion.Body className="px-0 pt-2 pb-1">
                      {tipsList.map((tip, tIdx) => (
                        <div
                          key={tIdx}
                          className="d-flex align-items-start gap-2 mb-2 p-2 rounded-2"
                          style={{ backgroundColor: isDark ? '#2a2d3a' : '#f8f9fa' }}
                        >
                          <span
                            style={{
                              color: '#f59e0b',
                              fontSize: '0.9rem',
                              lineHeight: 1.4,
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            💡
                          </span>
                          <span
                            style={{
                              color: isDark ? '#e8eaed' : '#333',
                              fontSize: '0.75rem',
                              lineHeight: 1.5,
                            }}
                          >
                            {tip}
                          </span>
                        </div>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })()}
            </Accordion>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <DashboardLayout>
      <div className="container-fluid py-4">
        <h2 className="m-0 fw-bold mb-4" style={{ color: isDark ? '#e8eaed' : '#1f2937' }}>
          {language === 'es' ? 'Liga Pokémon' : 'Pokemon League'}
        </h2>

        <div className="d-flex flex-column">
          {ALL_LEAGUES.map((region) => {
            const isOpen = activeRegion === region.region;
            return (
              <div key={region.region}>
                <div
                  className="d-flex align-items-center gap-2 mb-3 px-3 py-2 rounded-3 cursor-pointer"
                  style={{
                    backgroundColor: region.color + '20',
                    borderLeft: `4px solid ${region.color}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: isOpen ? 1 : 0.85,
                  }}
                  onClick={() => toggleRegion(region.region)}
                >
                  <h4 className="m-0 fw-bold" style={{ color: region.color }}>
                    {language === 'es' ? region.label_es : region.label_en}
                  </h4>
                  <span
                    className="rounded-pill"
                    style={{
                      color: region.color,
                      border: `1.5px solid ${region.color}`,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 10px',
                      backgroundColor: 'transparent',
                    }}
                  >
                    Gen {region.gen}
                  </span>
                  <small className="ms-auto" style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>
                    {region.members.length} {language === 'es' ? 'Altos Mandos + Campeón' : 'Elite Four + Champion'}
                  </small>
                  <span style={{ color: region.color, fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </div>

                {isOpen && (
                  <>
                    <Row className="g-3 mx-0 mb-3">
                      {region.members.map((member) => renderMemberCard(member))}
                    </Row>
                    <div className="mx-0 mb-4">
                      <h6
                        className="fw-bold mb-2 px-2"
                        style={{ color: isDark ? '#e8eaed' : '#1f2937', fontSize: '0.9rem' }}
                      >
                        {language === 'es' ? 'Campeón de la Liga' : 'League Champion'}
                      </h6>
                      <Row className="g-3 mx-0">
                        {renderMemberCard(region.champion, true)}
                      </Row>
                    </div>
                    {region.recommendedTeam && region.recommendedTeam[language] && (
                      <div
                        className="mx-0 mb-4 p-3 rounded-3"
                        style={{
                          backgroundColor: isDark ? '#2a2d3a' : '#f8f9fa',
                          border: `2px solid ${region.color}40`,
                        }}
                      >
                        <h6
                          className="fw-bold mb-3"
                          style={{ color: region.color, fontSize: '0.9rem' }}
                        >
                          {language === 'es' ? 'Equipo Recomendado' : 'Recommended Team'}
                        </h6>
                        {region.recommendedTeam[language].map((rec, rIdx) => (
                          <div
                            key={rIdx}
                            className="d-flex align-items-start gap-2 mb-2"
                          >
                            <span style={{ color: region.color, fontSize: '0.85rem', flexShrink: 0 }}>▸</span>
                            <span style={{ color: isDark ? '#e8eaed' : '#333', fontSize: '0.8rem', lineHeight: 1.5 }}>
                              {rec}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PokemonLeaguePage;
