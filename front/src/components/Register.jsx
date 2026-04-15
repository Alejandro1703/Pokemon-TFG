import { useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Alert, ListGroup, Spinner, InputGroup, Row, Col } from 'react-bootstrap';
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
    telefono: '',
    pokemonFavorito: ''
  });

  const [pokemonSuggestions, setPokemonSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const pokemonInputRef = useRef(null);

  useEffect(() => {
    if (formData.pokemonFavorito.length >= 2) {
      fetchPokemonSuggestions(formData.pokemonFavorito);
    } else {
      setPokemonSuggestions([]);
      setShowSuggestions(false);
    }
  }, [formData.pokemonFavorito]);

  const fetchPokemonSuggestions = async (query) => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const data = await response.json();
      const filtered = data.results
        .filter(pokemon => pokemon.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setPokemonSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } catch {
      console.error('Error fetching Pokemon');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const selectPokemon = (pokemonName) => {
    setFormData(prev => ({ ...prev, pokemonFavorito: pokemonName }));
    setShowSuggestions(false);
  };

  const validateForm = () => {
    if (!formData.nombre || !formData.apellidos || !formData.fechaNacimiento || 
        !formData.username || !formData.password || !formData.telefono) {
      setError('Todos los campos son obligatorios para completar tu registro');
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
          telefono: formData.telefono,
          pokemonFavorito: formData.pokemonFavorito
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pokemonInputRef.current && !pokemonInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <AuthLayout>
      <Card 
        className="border-0 shadow-lg overflow-hidden"
        style={{ borderRadius: '20px' }}
      >
        <div 
          className="p-4 text-center"
          style={{
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            borderBottom: '4px solid #1b5e20'
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
        
        <Card.Body className="p-5 bg-white">
          {error && (
            <Alert 
              variant="danger" 
              className="rounded-3 border-0 mb-4"
              style={{ backgroundColor: '#ffebee', color: '#c62828' }}
            >
              <span className="small fw-semibold">{error}</span>
            </Alert>
          )}
          {success && (
            <Alert 
              variant="success" 
              className="rounded-3 border-0 mb-4"
              style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
            >
              <span className="small fw-semibold">{success}</span>
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <div 
              className="p-4 mb-4 rounded-3"
              style={{ backgroundColor: '#f8f9fa', borderLeft: '4px solid #4caf50' }}
            >
              <h5 className="text-dark mb-4 fw-bold">Informacion Personal</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-2">Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="border-2 py-3 px-4"
                    style={{ borderRadius: '12px', borderColor: '#e0e0e0' }}
                    disabled={loading}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-2">Apellidos</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    placeholder="Tus apellidos"
                    className="border-2 py-3 px-4"
                    style={{ borderRadius: '12px', borderColor: '#e0e0e0' }}
                    disabled={loading}
                  />
                </Col>
              </Row>
              
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-2">Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="border-2 py-3 px-4"
                    style={{ borderRadius: '12px', borderColor: '#e0e0e0' }}
                    disabled={loading}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-2">Telefono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="9 digitos"
                    className="border-2 py-3 px-4"
                    style={{ borderRadius: '12px', borderColor: '#e0e0e0' }}
                    disabled={loading}
                  />
                </Col>
              </Row>
            </div>

            <div 
              className="p-4 mb-4 rounded-3"
              style={{ backgroundColor: '#fff8e1', borderLeft: '4px solid #ffc107' }}
            >
              <h5 className="text-dark mb-4 fw-bold">Credenciales de Acceso</h5>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-2">Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Elige un nombre unico"
                    className="border-2 py-3 px-4"
                    style={{ borderRadius: '12px', borderColor: '#e0e0e0' }}
                    disabled={loading}
                  />
                  <Form.Text className="text-muted small ms-1">
                    Este sera tu identificador para iniciar sesion
                  </Form.Text>
                </Col>
              </Row>
              
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-2">Contrasena</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimo 6 caracteres"
                    className="border-2 py-3 px-4"
                    style={{ borderRadius: '12px', borderColor: '#e0e0e0' }}
                    disabled={loading}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold text-dark mb-2">Confirmar Contrasena</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contrasena"
                    className="border-2 py-3 px-4"
                    style={{ borderRadius: '12px', borderColor: '#e0e0e0' }}
                    disabled={loading}
                  />
                </Col>
              </Row>
            </div>

            <div 
              className="p-4 mb-4 rounded-3"
              style={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3' }}
              ref={pokemonInputRef}
            >
              <h5 className="text-dark mb-3 fw-bold">Pokemon Favorito</h5>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold text-dark mb-2">Selecciona tu companero</Form.Label>
                <Form.Control
                  type="text"
                  name="pokemonFavorito"
                  value={formData.pokemonFavorito}
                  onChange={handleChange}
                  placeholder="Escribe el nombre de tu Pokemon favorito"
                  className="border-2 py-3 px-4"
                  style={{ borderRadius: '12px', borderColor: '#e0e0e0' }}
                  autoComplete="off"
                  disabled={loading}
                />
                <Form.Text className="text-muted small ms-1">
                  Escribe al menos 2 letras para ver sugerencias
                </Form.Text>
              </Form.Group>
              
              {showSuggestions && (
                <ListGroup 
                  className="mt-3 shadow rounded-3 overflow-hidden" 
                  style={{ zIndex: 1000 }}
                >
                  {pokemonSuggestions.map((pokemon) => (
                    <ListGroup.Item
                      key={pokemon.name}
                      action
                      onClick={() => selectPokemon(pokemon.name)}
                      className="py-3 text-capitalize border-0 border-bottom"
                      style={{ cursor: 'pointer' }}
                    >
                      {pokemon.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>

            <div className="d-grid mb-4">
              <Button
                type="submit"
                className="fw-bold py-3 border-0"
                style={{ 
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  background: loading 
                    ? '#ccc' 
                    : 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
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
            className="text-center p-3 rounded-3"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <p className="text-secondary mb-3">
              ¿Ya tienes una cuenta?
            </p>
            <Button 
              variant="outline-dark"
              as={Link}
              to="/login" 
              className="fw-semibold px-4"
              style={{ borderRadius: '10px' }}
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
