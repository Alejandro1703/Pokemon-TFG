import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="p-4 text-center">
        <h2 className="fw-bold mb-4">Bienvenido al Inicio</h2>
        <p className="text-secondary">
          Selecciona una opción del menú lateral para comenzar.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
