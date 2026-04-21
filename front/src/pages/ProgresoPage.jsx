import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProgresoModal from '../components/ProgresoModal';

const JUEGOS_DISPONIBLES = [
  { id: 1, nombre: 'Rojo Fuego', imagen: '/images/juegos/Rojo Fuego.jpeg', generacion: 'Gen 1' },
  { id: 2, nombre: 'Verde Hoja', imagen: '/images/juegos/Verde Hoja.jpeg', generacion: 'Gen 1' },
  { id: 3, nombre: 'Rubi', imagen: '/images/juegos/Rubi.jpeg', generacion: 'Gen 3' },
  { id: 4, nombre: 'Zafiro', imagen: '/images/juegos/Zafiro.jpeg', generacion: 'Gen 3' },
  { id: 5, nombre: 'Esmeralda', imagen: '/images/juegos/Esmeralda.jpeg', generacion: 'Gen 3' },
  { id: 6, nombre: 'Diamante', imagen: '/images/juegos/Diamante.jpeg', generacion: 'Gen 4' },
  { id: 7, nombre: 'Perla', imagen: '/images/juegos/Perla.jpeg', generacion: 'Gen 4' },
  { id: 8, nombre: 'Platino', imagen: '/images/juegos/Platino.jpeg', generacion: 'Gen 4' },
  { id: 9, nombre: 'Oro HeartGold', imagen: '/images/juegos/Oro HeartGold.jpeg', generacion: 'Gen 2' },
  { id: 10, nombre: 'Plata SoulSilver', imagen: '/images/juegos/Plata SoulSilver.jpeg', generacion: 'Gen 2' },
  { id: 11, nombre: 'Negro', imagen: '/images/juegos/Negro.jpeg', generacion: 'Gen 5' },
  { id: 12, nombre: 'Blanco', imagen: '/images/juegos/Blanco.jpeg', generacion: 'Gen 5' },
  { id: 13, nombre: 'Negro 2', imagen: '/images/juegos/Negro 2.jpeg', generacion: 'Gen 5' },
  { id: 14, nombre: 'Blanco 2', imagen: '/images/juegos/Blanco 2.jpeg', generacion: 'Gen 5' }
];

function ProgresoPage() {
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
            <h2 className="fw-bold m-0">Progreso</h2>
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
