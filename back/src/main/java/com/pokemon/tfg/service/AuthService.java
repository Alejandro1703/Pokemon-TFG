package com.pokemon.tfg.service;

import com.pokemon.tfg.dto.AuthResponse;
import com.pokemon.tfg.dto.LoginRequest;
import com.pokemon.tfg.dto.RegisterRequest;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.repository.UsuarioRepository;
import com.pokemon.tfg.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse register(RegisterRequest request) {
        // Verificar si el usuario ya existe
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(null, "El nombre de usuario ya está en uso", null);
        }

        // Verificar si el teléfono ya está registrado
        if (usuarioRepository.existsByTelefono(request.getTelefono())) {
            return new AuthResponse(null, "El teléfono ya está registrado", null);
        }

        // Crear nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellidos(request.getApellidos());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setPokemonFavorito(request.getPokemonFavorito());

        usuarioRepository.save(usuario);

        String token = jwtUtils.generateToken(usuario.getUsername());
        return new AuthResponse(token, "Registro exitoso", usuario);
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (usuario == null) {
            return new AuthResponse(null, "Usuario o contraseña incorrectos", null);
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return new AuthResponse(null, "Usuario o contraseña incorrectos", null);
        }

        String token = jwtUtils.generateToken(usuario.getUsername());
        return new AuthResponse(token, "Inicio de sesión exitoso", usuario);
    }
}
