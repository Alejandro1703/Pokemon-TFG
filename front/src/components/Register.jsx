import { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, ListGroup } from 'react-bootstrap';

function Register() {
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

  // Cargar lista de Pokémon desde PokeAPI
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
    } catch (err) {
      console.error('Error fetching Pokemon:', err);
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
      setError('Todos los campos son obligatorios');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(formData.telefono)) {
      setError('El teléfono debe tener 9 dígitos');
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
        setSuccess('¡Registro exitoso! Ya puedes iniciar sesión.');
        setFormData({
          nombre: '',
          apellidos: '',
          fechaNacimiento: '',
          username: '',
          password: '',
          confirmPassword: '',
          telefono: '',
          pokemonFavorito: ''
        });
      } else {
        const data = await response.json();
        setError(data.message || 'Error en el registro');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sugerencias al hacer click fuera
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
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--warm-light)' }}>
            <Card.Body className="p-4">
              <h2 className="text-center mb-4" style={{ color: 'var(--text-h)' }}>
                🎮 Registro de Entrenador
              </h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'var(--text-h)', fontWeight: 500 }}>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        style={{ borderColor: 'var(--border)' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'var(--text-h)', fontWeight: 500 }}>Apellidos</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        placeholder="Tus apellidos"
                        style={{ borderColor: 'var(--border)' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--text-h)', fontWeight: 500 }}>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    style={{ borderColor: 'var(--border)' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--text-h)', fontWeight: 500 }}>Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Elige un nombre de usuario"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'var(--text-h)', fontWeight: 500 }}>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        style={{ borderColor: 'var(--border)' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'var(--text-h)', fontWeight: 500 }}>Repetir Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirma tu contraseña"
                        style={{ borderColor: 'var(--border)' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--text-h)', fontWeight: 500 }}>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="9 dígitos"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4" ref={pokemonInputRef}>
                  <Form.Label style={{ color: 'var(--text-h)', fontWeight: 500 }}>
                    Pokémon Favorito ✨
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="pokemonFavorito"
                    value={formData.pokemonFavorito}
                    onChange={handleChange}
                    placeholder="Escribe el nombre de tu Pokémon favorito"
                    style={{ borderColor: 'var(--border)' }}
                    autoComplete="off"
                  />
                  {showSuggestions && (
                    <ListGroup className="position-absolute w-100" style={{ zIndex: 1000, boxShadow: 'var(--shadow)' }}>
                      {pokemonSuggestions.map((pokemon) => (
                        <ListGroup.Item
                          key={pokemon.name}
                          action
                          onClick={() => selectPokemon(pokemon.name)}
                          style={{ cursor: 'pointer', textTransform: 'capitalize' }}
                        >
                          {pokemon.name}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
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
                  {loading ? 'Registrando...' : '🎯 Crear Cuenta'}
                </Button>
              </Form>
              
              <div className="text-center mt-3">
                <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  ¿Ya tienes cuenta? Inicia sesión
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
