import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

function ProfileModal({ show, onHide, user, onLogout, onUserUpdate }) {
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
      const response = await fetch(`http://localhost:9876/api/user/${user.id}/profile`, {
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
      setMessage({ text: 'Introduce tu contrasena actual', type: 'danger' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ text: 'La nueva contrasena debe tener al menos 6 caracteres', type: 'danger' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Las contrasenas no coinciden', type: 'danger' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:9876/api/user/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ text: 'Contrasena actualizada correctamente', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ text: data.message || 'Error al cambiar contrasena', type: 'danger' });
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
      const response = await fetch(`http://localhost:9876/api/user/${user.id}`, {
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

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      style={{ zIndex: 9999 }}
    >
      <Modal.Header 
        className="d-flex justify-content-between align-items-center py-3 px-4"
        style={{ 
          background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
          border: 'none'
        }}
      >
        <Modal.Title className="fw-bold text-dark m-0">
          Mi Perfil
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

      <Modal.Body className="p-4">
        {message.text && (
          <Alert variant={message.type} className="mb-3">
            {message.text}
          </Alert>
        )}

        {/* Datos del perfil */}
        <div className="p-3 mb-4 rounded-3" style={{ backgroundColor: '#f8f9fa', borderLeft: '4px solid #ffc107' }}>
          <h5 className="fw-bold mb-3">Datos personales</h5>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              style={{ borderRadius: '10px' }}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Correo electronico</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
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
            Guardar cambios
          </Button>
        </div>

        {/* Cambiar contrasena */}
        <div className="p-3 mb-4 rounded-3" style={{ backgroundColor: '#fff8e1', borderLeft: '4px solid #ff9800' }}>
          <h5 className="fw-bold mb-3">Cambiar contrasena</h5>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Contrasena actual</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Tu contrasena actual"
              style={{ borderRadius: '10px' }}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Nueva contrasena</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimo 6 caracteres"
              style={{ borderRadius: '10px' }}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Confirmar nueva contrasena</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contrasena"
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
            Cambiar contrasena
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
            Cerrar sesion
          </Button>
          
          {!showDeleteConfirm ? (
            <Button
              variant="outline-danger"
              className="fw-bold"
              style={{ borderRadius: '10px' }}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Eliminar mi cuenta
            </Button>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="text-danger fw-bold small">¿Seguro?</span>
              <Button
                variant="danger"
                size="sm"
                className="fw-bold"
                style={{ borderRadius: '10px' }}
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : 'Si, eliminar'}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                style={{ borderRadius: '10px' }}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ProfileModal;
