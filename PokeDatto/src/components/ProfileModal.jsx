import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useSettings, useTranslation } from '../contexts/SettingsContext';

function ProfileModal({ show, onHide, user, onLogout, onUserUpdate, standalone = false }) {
  const { isDark, toggleTheme, language, setLanguage } = useSettings();
  const { t } = useTranslation();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || '');
      setEmail(user.email || '');
    }
    setMessage({ text: '', type: '' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowDeleteConfirm(false);
  }, [show, user]);

  const handleUpdateProfile = async () => {
    if (!nombre.trim()) {
      setMessage({ text: 'El nombre no puede estar vacio', type: 'danger' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://pokemon-tfg-backend.onrender.com/api/user/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim() })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ text: 'Perfil actualizado correctamente', type: 'success' });
        if (data.user) {
          onUserUpdate(data.user);
        }
      } else {
        setMessage({ text: data.message || 'Error al actualizar', type: 'danger' });
      }
    } catch {
      setMessage({ text: 'Error de conexion con el servidor', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      setMessage({ text: 'Introduce tu contraseña actual', type: 'danger' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ text: 'La nueva contraseña debe tener al menos 6 caracteres', type: 'danger' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Las contraseñas no coinciden', type: 'danger' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://pokemon-tfg-backend.onrender.com/api/user/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ text: 'Contraseña actualizada correctamente', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ text: data.message || 'Error al cambiar contraseña', type: 'danger' });
      }
    } catch {
      setMessage({ text: 'Error de conexion con el servidor', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://pokemon-tfg-backend.onrender.com/api/user/${user.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onLogout();
      } else {
        const data = await response.json();
        setMessage({ text: data.message || 'Error al eliminar cuenta', type: 'danger' });
      }
    } catch {
      setMessage({ text: 'Error de conexion con el servidor', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const content = (
    <div className={standalone ? '' : 'p-4'}>
      {standalone && (
        <div className="d-flex justify-content-between align-items-center py-3 px-4 mb-4 rounded-3"
          style={{
            background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
            border: 'none'
          }}
        >
          <h4 className="fw-bold text-dark m-0">{t('profile.title')}</h4>
        </div>
      )}
      
      {!standalone && (
        <Modal.Header
          className="d-flex justify-content-between align-items-center py-3 px-4"
          style={{
            background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
            border: 'none'
          }}
        >
          <Modal.Title className="fw-bold text-dark m-0">
            {t('profile.title')}
          </Modal.Title>
          <Button
            variant="dark"
            size="sm"
            onClick={onHide}
            className="rounded-circle d-flex align-items-center justify-content-center p-0"
            style={{ width: '36px', height: '36px', fontWeight: 'bold', fontSize: '1.2rem' }}
          >
            ✕
          </Button>
        </Modal.Header>
      )}
      
      <div className={standalone ? 'p-4' : ''}>
        {message.text && (
          <Alert variant={message.type} className="mb-3">
            {message.text}
          </Alert>
        )}

        {/* Preferencias */}
        <div className="p-3 mb-4 rounded-3" style={{ backgroundColor: isDark ? '#2a2c38' : '#e8f5e9', borderLeft: '4px solid #66bb6a' }}>
          <h5 className="fw-bold mb-3">{t('profile.preferences')}</h5>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.3rem' }}>{isDark ? '🌙' : '☀️'}</span>
              <span className="fw-bold">{t('profile.darkMode')}</span>
            </div>
            <Form.Check
              type="switch"
              id="dark-mode-switch"
              checked={isDark}
              onChange={toggleTheme}
              style={{ transform: 'scale(1.3)' }}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.3rem' }}>🌐</span>
              <span className="fw-bold">{t('profile.language')}</span>
            </div>
            <div className="d-flex gap-1">
              <Button
                size="sm"
                onClick={() => setLanguage('es')}
                style={{
                  backgroundColor: language === 'es' ? '#ffc107' : 'transparent',
                  color: language === 'es' ? '#333' : (isDark ? '#c8ccd4' : '#666'),
                  border: language === 'es' ? '2px solid #ff9800' : (isDark ? '1px solid #4b5563' : '1px solid #ddd'),
                  borderRadius: '8px',
                  fontWeight: language === 'es' ? 'bold' : 'normal',
                  padding: '4px 12px',
                }}
              >
                ES
              </Button>
              <Button
                size="sm"
                onClick={() => setLanguage('en')}
                style={{
                  backgroundColor: language === 'en' ? '#ffc107' : 'transparent',
                  color: language === 'en' ? '#333' : (isDark ? '#c8ccd4' : '#666'),
                  border: language === 'en' ? '2px solid #ff9800' : (isDark ? '1px solid #4b5563' : '1px solid #ddd'),
                  borderRadius: '8px',
                  fontWeight: language === 'en' ? 'bold' : 'normal',
                  padding: '4px 12px',
                }}
              >
                EN
              </Button>
            </div>
          </div>
        </div>

        {/* Datos del perfil */}
        <div className="p-3 mb-4 rounded-3" style={{ backgroundColor: isDark ? '#2a2c38' : '#f8f9fa', borderLeft: '4px solid #ffc107' }}>
          <h5 className="fw-bold mb-3">{t('profile.personalData')}</h5>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">{t('profile.name')}</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={t('profile.namePlaceholder')}
              style={{ borderRadius: '10px' }}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">{t('profile.email')}</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('profile.emailPlaceholder')}
              style={{ borderRadius: '10px' }}
              disabled={loading}
            />
          </Form.Group>
          <Button
            variant="warning"
            className="fw-bold text-dark"
            style={{ borderRadius: '10px' }}
            onClick={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="me-2" /> : null}
            {t('profile.saveChanges')}
          </Button>
        </div>

        {/* Cambiar contraseña */}
        <div className="p-3 mb-4 rounded-3" style={{ backgroundColor: isDark ? '#2a2520' : '#fff8e1', borderLeft: '4px solid #ff9800' }}>
          <h5 className="fw-bold mb-3">{t('profile.changePassword')}</h5>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">{t('profile.currentPassword')}</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('profile.currentPasswordPlaceholder')}
              style={{ borderRadius: '10px' }}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">{t('profile.newPassword')}</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('profile.newPasswordPlaceholder')}
              style={{ borderRadius: '10px' }}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">{t('profile.confirmPassword')}</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('profile.confirmPasswordPlaceholder')}
              style={{ borderRadius: '10px' }}
              disabled={loading}
            />
          </Form.Group>
          <Button
            variant="warning"
            className="fw-bold text-dark"
            style={{ borderRadius: '10px' }}
            onClick={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="me-2" /> : null}
            {t('profile.changePasswordBtn')}
          </Button>
        </div>

        {/* Acciones de cuenta */}
        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
          <Button
            variant="outline-dark"
            className="fw-bold"
            style={{ borderRadius: '10px' }}
            onClick={onLogout}
          >
            {t('profile.logout')}
          </Button>
          
          {!showDeleteConfirm ? (
            <Button
              variant="outline-danger"
              className="fw-bold"
              style={{ borderRadius: '10px' }}
              onClick={() => setShowDeleteConfirm(true)}
            >
              {t('profile.deleteAccount')}
            </Button>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="text-danger fw-bold small">{t('profile.deleteConfirm')}</span>
              <Button
                variant="danger"
                size="sm"
                className="fw-bold"
                style={{ borderRadius: '10px' }}
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : t('profile.deleteYes')}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                style={{ borderRadius: '10px' }}
                onClick={() => setShowDeleteConfirm(false)}
              >
                {t('profile.deleteCancel')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (standalone) {
    return content;
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      {content}
    </Modal>
  );
}

export default ProfileModal;
