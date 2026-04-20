import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import MisJuegosModal from '../components/MisJuegosModal';

const JUEGOS_DISPONIBLES = [
  { id: 1, nombre: 'Rojo Fuego', imagen: '/images/juegos/Rojo Fuego.jpeg', generacion: 'Gen 1', precios: { completo: 240, semi: 210, sinManual: 165, soloCartucho: 75, caratulaCartucho: 145 }},
  { id: 2, nombre: 'Verde Hoja', imagen: '/images/juegos/Verde Hoja.jpeg', generacion: 'Gen 1', precios: { completo: 230, semi: 200, sinManual: 155, soloCartucho: 70, caratulaCartucho: 135 }},
  { id: 3, nombre: 'Rubi', imagen: '/images/juegos/Rubi.jpeg', generacion: 'Gen 3', precios: { completo: 210, semi: 185, sinManual: 140, soloCartucho: 65, caratulaCartucho: 125 }},
  { id: 4, nombre: 'Zafiro', imagen: '/images/juegos/Zafiro.jpeg', generacion: 'Gen 3', precios: { completo: 210, semi: 185, sinManual: 140, soloCartucho: 65, caratulaCartucho: 125 }},
  { id: 5, nombre: 'Esmeralda', imagen: '/images/juegos/Esmeralda.jpeg', generacion: 'Gen 3', precios: { completo: 520, semi: 460, sinManual: 350, soloCartucho: 140, caratulaCartucho: 310 }},
  { id: 6, nombre: 'Diamante', imagen: '/images/juegos/Diamante.jpeg', generacion: 'Gen 4', precios: { completo: 90, semi: 75, sinManual: 60, soloCartucho: 35, caratulaCartucho: 70 }},
  { id: 7, nombre: 'Perla', imagen: '/images/juegos/Perla.jpeg', generacion: 'Gen 4', precios: { completo: 85, semi: 70, sinManual: 55, soloCartucho: 35, caratulaCartucho: 65 }},
  { id: 8, nombre: 'Platino', imagen: '/images/juegos/Platino.jpeg', generacion: 'Gen 4', precios: { completo: 160, semi: 140, sinManual: 115, soloCartucho: 75, caratulaCartucho: 130 }},
  { id: 9, nombre: 'Oro HeartGold', imagen: '/images/juegos/Oro HeartGold.jpeg', generacion: 'Gen 2', precios: { completo: 175, semi: 155, sinManual: 130, soloCartucho: 95, caratulaCartucho: 145, conPokewalker: 450 }},
  { id: 10, nombre: 'Plata SoulSilver', imagen: '/images/juegos/Plata SoulSilver.jpeg', generacion: 'Gen 2', precios: { completo: 175, semi: 155, sinManual: 130, soloCartucho: 95, caratulaCartucho: 145, conPokewalker: 450 }},
  { id: 11, nombre: 'Negro', imagen: '/images/juegos/Negro.jpeg', generacion: 'Gen 5', precios: { completo: 110, semi: 95, sinManual: 80, soloCartucho: 60, caratulaCartucho: 90 }},
  { id: 12, nombre: 'Blanco', imagen: '/images/juegos/Blanco.jpeg', generacion: 'Gen 5', precios: { completo: 110, semi: 95, sinManual: 80, soloCartucho: 60, caratulaCartucho: 90 }},
  { id: 13, nombre: 'Negro 2', imagen: '/images/juegos/Negro 2.jpeg', generacion: 'Gen 5', precios: { completo: 200, semi: 180, sinManual: 150, soloCartucho: 100, caratulaCartucho: 165 }},
  { id: 14, nombre: 'Blanco 2', imagen: '/images/juegos/Blanco 2.jpeg', generacion: 'Gen 5', precios: { completo: 200, semi: 180, sinManual: 150, soloCartucho: 100, caratulaCartucho: 165 }}
];

function MisJuegosPage() {
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
              ← Volver al inicio
            </Button>
            <h2 className="fw-bold m-0">Mis Juegos</h2>
          </Card.Body>
        </Card>
        <MisJuegosModal standalone={true} juegosDisponibles={JUEGOS_DISPONIBLES} />
      </div>
    </DashboardLayout>
  );
}

export default MisJuegosPage;
