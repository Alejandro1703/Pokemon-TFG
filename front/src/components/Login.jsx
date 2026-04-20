import { useState } from 'react';
import { Form, Button, Card, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './layout/AuthLayout';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:9876/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setError('');
        setSuccess('Inicio de sesion exitoso. Redirigiendo...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        const data = await response.json();
        setError(data.message || 'Usuario o contrasena incorrectos');
      }
    } catch {
      setError('Error de conexion con el servidor');
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
            Bienvenido
          </h2>
          <p className="text-white text-opacity-90 mb-0">
            Inicia sesion para acceder a tu coleccion
          </p>
        </div>
        
        <Card.Body className="p-5 bg-white">
          {error && (
            <Alert 
              variant="danger" 
              className="rounded-3 border-0"
              style={{ backgroundColor: '#ffebee', color: '#c62828' }}
            >
              <span className="small fw-semibold">{error}</span>
            </Alert>
          )}
          {success && (
            <Alert 
              variant="success" 
              className="rounded-3 border-0"
              style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
            >
              <span className="small fw-semibold">{success}</span>
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-dark mb-2">
                Nombre de Usuario
              </Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Introduce tu usuario"
                className="border-2 py-3 px-4"
                style={{ 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  borderColor: '#e0e0e0'
                }}
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-dark mb-2">
                Contrasena
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Introduce tu contrasena"
                className="border-2 py-3 px-4"
                style={{ 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  borderColor: '#e0e0e0'
                }}
                disabled={loading}
              />
            </Form.Group>

            <div className="d-grid mb-4">
              <Button
                type="submit"
                className="fw-bold py-3 border-0"
                style={{ 
                  borderRadius: '12px',
                  fontSize: '1.1rem',
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
                    Entrando...
                  </>
                ) : (
                  'Iniciar Sesion'
                )}
              </Button>
            </div>
          </Form>
          
          <div 
            className="text-center p-3 rounded-3"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <p className="text-secondary mb-3">
              ¿Aun no tienes una cuenta?
            </p>
            <Button 
              variant="outline-dark"
              as={Link}
              to="/register" 
              className="fw-semibold px-4"
              style={{ borderRadius: '10px' }}
            >
              Crear cuenta nueva
            </Button>
          </div>
        </Card.Body>
      </Card>
    </AuthLayout>
  );
}

export default Login;
