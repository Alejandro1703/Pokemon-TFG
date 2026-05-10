import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import PokemonComparator from '../components/PokemonComparator';
import { useTranslation } from '../contexts/SettingsContext';

function ComparatorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="p-4">
        <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#f8f9fa' }}>
          <Card.Body className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/dashboard')}
              className="rounded-pill me-3"
            >
              {t('page.backToDashboard')}
            </Button>
            <h2 className="fw-bold m-0">{t('comparator.title')}</h2>
          </Card.Body>
        </Card>
        <PokemonComparator standalone={true} />
      </div>
    </DashboardLayout>
  );
}

export default ComparatorPage;
