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
          setError('Acceso denegado: no eres administrador');
        } else {
          setError('Error al cargar estadísticas');
        }
      } catch {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, navigate]);

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
              <StatCard
                title={t('admin.totalUsers')}
                value={stats.totalUsuarios}
                color="#42a5f5"
              />
              <StatCard
                title={t('admin.totalGames')}
                value={stats.totalJuegos}
                color="#66bb6a"
              />
              <StatCard
                title={t('admin.totalShinyHunts')}
                value={stats.totalShinyHunts}
                color="#ffa726"
              />
              <StatCard
                title={t('admin.totalAttempts')}
                value={stats.totalIntentosShiny}
                color="#ef5350"
              />
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
                        <th>Juego</th>
                        <th>Veces añadido</th>
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
                  <Table responsive variant={isDark ? 'dark' : ''}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Fecha de registro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.usuariosRecientes.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.nombre}</td>
                          <td>{u.username}</td>
                          <td>{u.fechaCreacion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
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
