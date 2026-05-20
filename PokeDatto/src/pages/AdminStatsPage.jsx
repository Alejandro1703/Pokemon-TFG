import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Spinner, Table, Card, Row, Col } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSettings, useTranslation } from '../contexts/SettingsContext';
import { useAuth } from '../hooks/useAuth';

function AdminStatsPage() {
  const { isDark } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentUsersPage, setRecentUsersPage] = useState(1);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:9876/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else if (response.status === 403) {
          setError(t('admin.accessDenied'));
        } else {
          setError(t('admin.errorLoadingStats'));
        }
      } catch {
        setError(t('common.connectionError'));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, navigate, t]);

  const textPrimary = isDark ? '#e8eaed' : '#1f2937';
  const textSecondary = isDark ? '#9ca3af' : '#6c757d';
  const cardBg = isDark ? '#23252f' : '#ffffff';
  const cardBorder = isDark ? '#2e303a' : '#e5e7eb';

  const StatCard = ({ title, value, color }) => (
    <Col xs={12} sm={6} lg={3} className="mb-4">
      <div
        className="rounded-4 p-4 text-center h-100"
        style={{
          backgroundColor: cardBg,
          border: `2px solid ${color}40`,
        }}
      >
        <h3 className="fw-bold mb-1" style={{ color, fontSize: '2rem' }}>
          {value}
        </h3>
        <p className="mb-0" style={{ color: textSecondary, fontSize: '0.9rem' }}>
          {title}
        </p>
      </div>
    </Col>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center" style={{ color: textPrimary }}>
          <p className="fs-5">{error}</p>
          <Button as={Link} to="/dashboard" variant="primary">
            {t('admin.back')}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fw-bold" style={{ color: textPrimary }}>
             {t('admin.title')}
          </h2>
          <Button as={Link} to="/dashboard" variant="outline-primary">
            {t('admin.back')}
          </Button>
        </div>

        {stats && (
          <>
            {/* Tarjetas de resumen */}
            <Row>
              <StatCard title={t('admin.totalUsers')} value={stats.totalUsuarios} color="#42a5f5" />
              <StatCard title={t('admin.totalGames')} value={stats.totalJuegos} color="#66bb6a" />
              <StatCard title={t('admin.totalShinyHunts')} value={stats.totalShinyHunts} color="#ffa726" />
              <StatCard title={t('admin.totalAttempts')} value={stats.totalIntentosShiny} color="#ef5350" />
              <StatCard title={t('admin.totalTeams')} value={stats.totalEquipos} color="#ab47bc" />
              <StatCard title={t('admin.avgShinyAttempts')} value={stats.mediaIntentosShiny} color="#26c6da" />
            </Row>

            {/* Top juegos */}
            <Card
              className="mb-4 border-0"
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <Card.Body>
                <h5 className="fw-bold mb-3" style={{ color: textPrimary }}>
                  🎮 {t('admin.topGames')}
                </h5>
                {stats.topJuegos && stats.topJuegos.length > 0 ? (
                  <Table responsive variant={isDark ? 'dark' : ''}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t('admin.game')}</th>
                        <th>{t('admin.timesAdded')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topJuegos.map((juego, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{juego.nombre || juego.juegoNombre || '—'}</td>
                          <td>{juego.total || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p style={{ color: textSecondary }}>{t('admin.noData')}</p>
                )}
              </Card.Body>
            </Card>

            {/* Pokémon más usados + Juegos por estado */}
            <Row className="g-3 mb-4">
              <Col lg={6}>
                <Card className="border-0 h-100" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
                  <Card.Body>
                    <h5 className="fw-bold mb-3" style={{ color: textPrimary }}>{t('admin.topPokemon')}</h5>
                    {stats.topPokemonEquipos && stats.topPokemonEquipos.length > 0 ? (
                      <div className="d-flex flex-column gap-2">
                        {stats.topPokemonEquipos.map((p, idx) => {
                          const maxVal = stats.topPokemonEquipos[0]?.total || 1;
                          const pct = Math.round((p.total / maxVal) * 100);
                          return (
                            <div key={idx} className="d-flex align-items-center gap-2">
                              {p.id && (
                                <img
                                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                                  alt={p.nombre}
                                  style={{ width: '28px', height: '28px', imageRendering: 'pixelated', flexShrink: 0 }}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              )}
                              <small className="text-capitalize fw-bold flex-shrink-0" style={{ width: '90px', color: textPrimary, fontSize: '0.8rem' }}>{p.nombre}</small>
                              <div className="flex-grow-1 rounded-pill" style={{ height: '14px', backgroundColor: isDark ? '#2e303a' : '#e5e7eb', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#ab47bc', borderRadius: '9999px', minWidth: '20px', transition: 'width 0.5s ease' }} />
                              </div>
                              <small style={{ color: textSecondary, fontSize: '0.75rem', flexShrink: 0 }}>{p.total} {t('admin.times')}</small>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ color: textSecondary }}>{t('admin.noData')}</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="border-0 h-100" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
                  <Card.Body>
                    <h5 className="fw-bold mb-3" style={{ color: textPrimary }}>{t('admin.gamesByCondition')}</h5>
                    {stats.juegosByEstado && stats.juegosByEstado.length > 0 ? (
                      <div className="d-flex flex-column gap-2">
                        {stats.juegosByEstado.map((e, idx) => {
                          const maxVal = stats.juegosByEstado[0]?.total || 1;
                          const pct = Math.round((e.total / maxVal) * 100);
                          return (
                            <div key={idx} className="d-flex align-items-center gap-2">
                              <small className="fw-bold flex-shrink-0" style={{ width: '90px', color: textPrimary, fontSize: '0.8rem' }}>{e.estado}</small>
                              <div className="flex-grow-1 rounded-pill" style={{ height: '14px', backgroundColor: isDark ? '#2e303a' : '#e5e7eb', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#66bb6a', borderRadius: '9999px', minWidth: '20px', transition: 'width 0.5s ease' }} />
                              </div>
                              <small style={{ color: textSecondary, fontSize: '0.75rem', flexShrink: 0 }}>{e.total}</small>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ color: textSecondary }}>{t('admin.noData')}</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Distribución de roles */}
            <Card className="border-0 mb-4" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3" style={{ color: textPrimary }}>{t('admin.userRoles')}</h5>
                <div className="d-flex gap-4 flex-wrap">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: isDark ? '#2e3040' : '#f5f5f5', flex: 1, minWidth: '140px' }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', backgroundColor: 'rgba(66,165,245,0.15)' }}>
                      <span style={{ fontSize: '1.4rem', color: '#42a5f5', fontWeight: 700 }}>{stats.totalUsuarios - stats.totalAdmins}</span>
                    </div>
                    <div>
                      <div className="fw-bold" style={{ color: textPrimary }}>{t('admin.regularUsers')}</div>
                      <small style={{ color: textSecondary }}>{Math.round(((stats.totalUsuarios - stats.totalAdmins) / (stats.totalUsuarios || 1)) * 100)}% {t('admin.percentOfTotal')}</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: isDark ? '#2e3040' : '#f5f5f5', flex: 1, minWidth: '140px' }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', backgroundColor: 'rgba(239,83,80,0.15)' }}>
                      <span style={{ fontSize: '1.4rem', color: '#ef5350', fontWeight: 700 }}>{stats.totalAdmins}</span>
                    </div>
                    <div>
                      <div className="fw-bold" style={{ color: textPrimary }}>{t('admin.admins')}</div>
                      <small style={{ color: textSecondary }}>{Math.round((stats.totalAdmins / (stats.totalUsuarios || 1)) * 100)}% {t('admin.percentOfTotal')}</small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Usuarios recientes */}
            <Card
              className="border-0"
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <Card.Body>
                <h5 className="fw-bold mb-3" style={{ color: textPrimary }}>
                  👥 {t('admin.recentUsers')}
                </h5>
                {stats.usuariosRecientes && stats.usuariosRecientes.length > 0 ? (
                  <>
                    <Table responsive variant={isDark ? 'dark' : ''}>
                      <thead>
                        <tr>
                          <th>{t('admin.name')}</th>
                          <th>{t('admin.username')}</th>
                          <th>{t('admin.registrationDate')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.usuariosRecientes
                          .slice((recentUsersPage - 1) * 5, recentUsersPage * 5)
                          .map((u, idx) => (
                            <tr key={idx}>
                              <td>{u.nombre}</td>
                              <td>{u.username}</td>
                              <td>{u.fechaCreacion}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                    <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        disabled={recentUsersPage === 1}
                        onClick={() => setRecentUsersPage(p => Math.max(1, p - 1))}
                      >
                        {t('common.previous')}
                      </Button>
                      <small style={{ color: textSecondary }}>
                        {recentUsersPage} / {Math.ceil(stats.usuariosRecientes.length / 5)}
                      </small>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        disabled={recentUsersPage >= Math.ceil(stats.usuariosRecientes.length / 5)}
                        onClick={() => setRecentUsersPage(p => p + 1)}
                      >
                        {t('common.next')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <p style={{ color: textSecondary }}>{t('admin.noData')}</p>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminStatsPage;
