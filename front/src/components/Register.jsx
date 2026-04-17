import { useState } from 'react';
import { Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './layout/AuthLayout';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    username: '',
    password: '',
    confirmPassword: '',
    telefono: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.nombre || !formData.apellidos || !formData.fechaNacimiento || 
        !formData.username || !formData.password || !formData.telefono) {
      setError('Por favor, completa todos los campos');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contrasenas no coinciden');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return false;
    }
    
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(formData.telefono)) {
      setError('El telefono debe tener exactamente 9 digitos numericos');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:9876/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          fechaNacimiento: formData.fechaNacimiento,
          username: formData.username,
          password: formData.password,
          telefono: formData.telefono
        })
      });
      
      if (response.ok) {
        setSuccess('Registro completado exitosamente. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Hubo un problema con el registro');
      }
    } catch {
      setError('No se puede conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card 
        className="border-0 shadow-lg overflow-hidden"
        style={{ borderRadius: '20px' }}
      >
        <div 
          className="p-5 text-center"
          style={{
            background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
            borderBottom: '4px solid #e65100'
          }}
        >
          <h2 
            className="fw-bold text-white mb-2"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
          >
            Crear Cuenta
          </h2>
          <p className="text-white text-opacity-90 mb-0">
            Unete a la comunidad de entrenadores Pokemon
          </p>
        </div>
        
        <Card.Body className="p-4 bg-white">
          {error && (
            <Alert 
              variant="danger" 
              className="rounded-3 border-0 py-2 mb-3"
              style={{ backgroundColor: '#ffebee', color: '#c62828' }}
            >
              <span className="small fw-semibold">{error}</span>
            </Alert>
          )}
          {success && (
            <Alert 
              variant="success" 
              className="rounded-3 border-0 py-2 mb-3"
              style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
            >
              <span className="small fw-semibold">{success}</span>
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-1 small">
                    Nombre
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="border-2 py-2 px-3"
                    style={{ 
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      borderColor: '#e0e0e0'
                    }}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-1 small">
                    Apellidos
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    placeholder="Tus apellidos"
                    className="border-2 py-2 px-3"
                    style={{ 
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      borderColor: '#e0e0e0'
                    }}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-1 small">
                    Fecha de Nacimiento
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="border-2 py-2 px-3"
                    style={{ 
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      borderColor: '#e0e0e0'
                    }}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-1 small">
                    Telefono
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="9 digitos"
                    className="border-2 py-2 px-3"
                    style={{ 
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      borderColor: '#e0e0e0'
                    }}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-dark mb-1 small">
                Nombre de Usuario
              </Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Elige un nombre unico"
                className="border-2 py-2 px-3"
                style={{ 
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  borderColor: '#e0e0e0'
                }}
                disabled={loading}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-1 small">
                    Contrasena
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimo 6 caracteres"
                    className="border-2 py-2 px-3"
                    style={{ 
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      borderColor: '#e0e0e0'
                    }}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-1 small">
                    Confirmar Contrasena
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contrasena"
                    className="border-2 py-2 px-3"
                    style={{ 
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      borderColor: '#e0e0e0'
                    }}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid mb-3">
              <Button
                type="submit"
                className="fw-bold py-2 border-0"
                style={{ 
                  borderRadius: '10px',
                  fontSize: '1rem',
                  background: loading 
                    ? '#ccc' 
                    : 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                  boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            </div>
          </Form>
          
          <div 
            className="text-center p-2 rounded-3"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <p className="text-secondary mb-2 small">
              ¿Ya tienes una cuenta?
            </p>
            <Button 
              variant="outline-dark"
              as={Link}
              to="/login" 
              className="fw-semibold px-3 py-1"
              size="sm"
              style={{ borderRadius: '8px' }}
            >
              Iniciar sesion
            </Button>
          </div>
        </Card.Body>
      </Card>
    </AuthLayout>
  );
}

export default Register;
