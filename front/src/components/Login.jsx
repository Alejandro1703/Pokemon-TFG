import { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

function Login() {
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
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('¡Inicio de sesión exitoso!');
        // Redirigir al dashboard (después lo implementaremos)
        // navigate('/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Usuario o contraseña incorrectos');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--warm-light)' }}>
            <Card.Body className="p-4">
              <h2 className="text-center mb-4" style={{ color: 'var(--text-h)' }}>
                🔥 Bienvenido Entrenador
              </h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--text-h)', fontWeight: 500 }}>
                    Nombre de Usuario
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Tu nombre de usuario"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ color: 'var(--text-h)', fontWeight: 500 }}>
                    Contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                  style={{
                    backgroundColor: 'var(--accent)',
                    borderColor: 'var(--accent)',
                    fontWeight: 600,
                    padding: '12px'
                  }}
                >
                  {loading ? 'Iniciando sesión...' : '⚡ Iniciar Sesión'}
                </Button>
              </Form>
              
              <div className="text-center mt-3">
                <a href="/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  ¿No tienes cuenta? Regístrate
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
