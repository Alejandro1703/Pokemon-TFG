package com.pokemon.tfg.controller;

import com.pokemon.tfg.dto.AventuraRequest;
import com.pokemon.tfg.entity.Aventura;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.service.AventuraService;
import com.pokemon.tfg.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aventuras")
@CrossOrigin(origins = "http://localhost:5173")
public class AventuraController {

    @Autowired
    private AventuraService aventuraService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<Aventura>> obtenerAventuras(Authentication authentication) {
        Usuario usuario = obtenerUsuarioActual(authentication);
        return ResponseEntity.ok(aventuraService.obtenerAventurasPorUsuario(usuario.getId()));
    }

    @GetMapping("/{juegoNombre}")
    public ResponseEntity<?> obtenerAventuraPorJuego(@PathVariable String juegoNombre,
                                                      Authentication authentication) {
        Usuario usuario = obtenerUsuarioActual(authentication);
        return aventuraService.obtenerAventuraPorJuego(usuario.getId(), juegoNombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> guardarAventura(@Valid @RequestBody AventuraRequest request,
                                              Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            Aventura aventura = aventuraService.guardarAventura(
                    usuario.getId(),
                    request.getJuegoNombre(),
                    request.getDatos()
            );
            return ResponseEntity.ok(aventura);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar aventura: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAventura(@PathVariable Long id, Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            aventuraService.eliminarAventura(id, usuario.getId());
            return ResponseEntity.ok("Aventura eliminada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar aventura: " + e.getMessage());
        }
    }

    private Usuario obtenerUsuarioActual(Authentication authentication) {
        String username = authentication.getName();
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
