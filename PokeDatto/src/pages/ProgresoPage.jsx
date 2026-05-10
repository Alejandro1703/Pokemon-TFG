import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProgresoModal from '../components/ProgresoModal';
import { useTranslation } from '../contexts/SettingsContext';

const JUEGOS_DISPONIBLES = [
  { id: 1, nombreKey: 'games.fireRed', imagen: '/images/juegos/Rojo Fuego.jpeg', generacionKey: 'games.gen1' },
  { id: 2, nombreKey: 'games.leafGreen', imagen: '/images/juegos/Verde Hoja.jpeg', generacionKey: 'games.gen1' },
  { id: 3, nombreKey: 'games.ruby', imagen: '/images/juegos/Rubi.jpeg', generacionKey: 'games.gen3' },
  { id: 4, nombreKey: 'games.sapphire', imagen: '/images/juegos/Zafiro.jpeg', generacionKey: 'games.gen3' },
  { id: 5, nombreKey: 'games.emerald', imagen: '/images/juegos/Esmeralda.jpeg', generacionKey: 'games.gen3' },
  { id: 6, nombreKey: 'games.diamond', imagen: '/images/juegos/Diamante.jpeg', generacionKey: 'games.gen4' },
  { id: 7, nombreKey: 'games.pearl', imagen: '/images/juegos/Perla.jpeg', generacionKey: 'games.gen4' },
  { id: 8, nombreKey: 'games.platinum', imagen: '/images/juegos/Platino.jpeg', generacionKey: 'games.gen4' },
  { id: 9, nombreKey: 'games.heartGold', imagen: '/images/juegos/Oro HeartGold.jpeg', generacionKey: 'games.gen2' },
  { id: 10, nombreKey: 'games.soulSilver', imagen: '/images/juegos/Plata SoulSilver.jpeg', generacionKey: 'games.gen2' },
  { id: 11, nombreKey: 'games.black', imagen: '/images/juegos/Negro.jpeg', generacionKey: 'games.gen5' },
  { id: 12, nombreKey: 'games.white', imagen: '/images/juegos/Blanco.jpeg', generacionKey: 'games.gen5' },
  { id: 13, nombreKey: 'games.black2', imagen: '/images/juegos/Negro 2.jpeg', generacionKey: 'games.gen5' },
  { id: 14, nombreKey: 'games.white2', imagen: '/images/juegos/Blanco 2.jpeg', generacionKey: 'games.gen5' }
];

function ProgresoPage() {
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
            <h2 className="fw-bold m-0">{t('progress.title')}</h2>
          </Card.Body>
        </Card>
        <ProgresoModal
          standalone={true}
          juegosDisponibles={JUEGOS_DISPONIBLES}
        />
      </div>
    </DashboardLayout>
  );
}

export default ProgresoPage;
