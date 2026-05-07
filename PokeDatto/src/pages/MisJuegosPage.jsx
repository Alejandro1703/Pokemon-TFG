import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import MisJuegosModal from '../components/MisJuegosModal';
import { useTranslation } from '../contexts/SettingsContext';

const JUEGOS_DISPONIBLES = [
  { id: 1, nombreKey: 'games.fireRed', imagen: '/images/juegos/Rojo Fuego.jpeg', generacionKey: 'games.gen1', precios: { completo: 240, semi: 210, sinManual: 165, soloCartucho: 75, caratulaCartucho: 145 }},
  { id: 2, nombreKey: 'games.leafGreen', imagen: '/images/juegos/Verde Hoja.jpeg', generacionKey: 'games.gen1', precios: { completo: 230, semi: 200, sinManual: 155, soloCartucho: 70, caratulaCartucho: 135 }},
  { id: 3, nombreKey: 'games.ruby', imagen: '/images/juegos/Rubi.jpeg', generacionKey: 'games.gen3', precios: { completo: 210, semi: 185, sinManual: 140, soloCartucho: 65, caratulaCartucho: 125 }},
  { id: 4, nombreKey: 'games.sapphire', imagen: '/images/juegos/Zafiro.jpeg', generacionKey: 'games.gen3', precios: { completo: 210, semi: 185, sinManual: 140, soloCartucho: 65, caratulaCartucho: 125 }},
  { id: 5, nombreKey: 'games.emerald', imagen: '/images/juegos/Esmeralda.jpeg', generacionKey: 'games.gen3', precios: { completo: 520, semi: 460, sinManual: 350, soloCartucho: 140, caratulaCartucho: 310 }},
  { id: 6, nombreKey: 'games.diamond', imagen: '/images/juegos/Diamante.jpeg', generacionKey: 'games.gen4', precios: { completo: 90, semi: 75, sinManual: 60, soloCartucho: 35, caratulaCartucho: 70 }},
  { id: 7, nombreKey: 'games.pearl', imagen: '/images/juegos/Perla.jpeg', generacionKey: 'games.gen4', precios: { completo: 85, semi: 70, sinManual: 55, soloCartucho: 35, caratulaCartucho: 65 }},
  { id: 8, nombreKey: 'games.platinum', imagen: '/images/juegos/Platino.jpeg', generacionKey: 'games.gen4', precios: { completo: 160, semi: 140, sinManual: 115, soloCartucho: 75, caratulaCartucho: 130 }},
  { id: 9, nombreKey: 'games.heartGold', imagen: '/images/juegos/Oro HeartGold.jpeg', generacionKey: 'games.gen2', precios: { completo: 175, semi: 155, sinManual: 130, soloCartucho: 95, caratulaCartucho: 145, conPokewalker: 450 }},
  { id: 10, nombreKey: 'games.soulSilver', imagen: '/images/juegos/Plata SoulSilver.jpeg', generacionKey: 'games.gen2', precios: { completo: 175, semi: 155, sinManual: 130, soloCartucho: 95, caratulaCartucho: 145, conPokewalker: 450 }},
  { id: 11, nombreKey: 'games.black', imagen: '/images/juegos/Negro.jpeg', generacionKey: 'games.gen5', precios: { completo: 110, semi: 95, sinManual: 80, soloCartucho: 60, caratulaCartucho: 90 }},
  { id: 12, nombreKey: 'games.white', imagen: '/images/juegos/Blanco.jpeg', generacionKey: 'games.gen5', precios: { completo: 110, semi: 95, sinManual: 80, soloCartucho: 60, caratulaCartucho: 90 }},
  { id: 13, nombreKey: 'games.black2', imagen: '/images/juegos/Negro 2.jpeg', generacionKey: 'games.gen5', precios: { completo: 200, semi: 180, sinManual: 150, soloCartucho: 100, caratulaCartucho: 165 }},
  { id: 14, nombreKey: 'games.white2', imagen: '/images/juegos/Blanco 2.jpeg', generacionKey: 'games.gen5', precios: { completo: 200, semi: 180, sinManual: 150, soloCartucho: 100, caratulaCartucho: 165 }}
];

function MisJuegosPage() {
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
            <h2 className="fw-bold m-0">{t('sidebar.myGames')}</h2>
          </Card.Body>
        </Card>
        <MisJuegosModal standalone={true} juegosDisponibles={JUEGOS_DISPONIBLES.map(juego => ({
          ...juego,
          nombre: t(juego.nombreKey),
          nombreKey: juego.nombreKey,
          generacion: t(juego.generacionKey)
        }))} />
      </div>
    </DashboardLayout>
  );
}

export default MisJuegosPage;
