package com.pokemon.tfg.controller;

import com.pokemon.tfg.dto.UpdatePasswordRequest;
import com.pokemon.tfg.dto.UpdateProfileRequest;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody UpdateProfileRequest request) {
        Optional<Usuario> optUser = usuarioRepository.findById(id);
        if (optUser.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Usuario no encontrado"));
        }

        Usuario usuario = optUser.get();

        if (request.getNombre() != null && !request.getNombre().isBlank()) {
            if (!request.getNombre().equals(usuario.getNombre()) && usuarioRepository.existsByUsername(request.getNombre())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ese nombre ya esta en uso"));
            }
            usuario.setNombre(request.getNombre());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!request.getEmail().equals(usuario.getEmail()) && usuarioRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ese email ya esta registrado"));
            }
            usuario.setEmail(request.getEmail());
        }

        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Map.of("message", "Perfil actualizado", "user", usuario));
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody UpdatePasswordRequest request) {
        Optional<Usuario> optUser = usuarioRepository.findById(id);
        if (optUser.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Usuario no encontrado"));
        }

        Usuario usuario = optUser.get();

        if (!passwordEncoder.matches(request.getCurrentPassword(), usuario.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "La contrasena actual es incorrecta"));
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "La nueva contrasena debe tener al menos 6 caracteres"));
        }

        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Map.of("message", "Contrasena actualizada"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        Optional<Usuario> optUser = usuarioRepository.findById(id);
        if (optUser.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Usuario no encontrado"));
        }

        usuarioRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Cuenta eliminada"));
    }
}
