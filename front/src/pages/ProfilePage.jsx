import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileModal from '../components/ProfileModal';
import { useTranslation } from '../contexts/SettingsContext';

function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

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
            <h2 className="fw-bold m-0">{t('page.profile')}</h2>
          </Card.Body>
        </Card>
        {user && (
          <ProfileModal
            standalone={true}
            user={user}
            onLogout={handleLogout}
            onUserUpdate={(updatedUser) => {
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
