package com.pokemon.tfg.controller;

import com.pokemon.tfg.dto.JuegoUsuarioRequest;
import com.pokemon.tfg.entity.JuegoUsuario;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.service.JuegoUsuarioService;
import com.pokemon.tfg.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/juegos-usuario")
@CrossOrigin(origins = "http://localhost:5173")
public class JuegoUsuarioController {

    @Autowired
    private JuegoUsuarioService juegoUsuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<JuegoUsuario>> obtenerMisJuegos(Authentication authentication) {
        Usuario usuario = obtenerUsuarioActual(authentication);
        List<JuegoUsuario> juegos = juegoUsuarioService.obtenerJuegosPorUsuario(usuario.getId());
        return ResponseEntity.ok(juegos);
    }

    @PostMapping
    public ResponseEntity<?> agregarJuego(@Valid @RequestBody JuegoUsuarioRequest request, 
                                          Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            JuegoUsuario juego = juegoUsuarioService.agregarJuego(
                    usuario.getId(),
                    request.getJuegoNombre(),
                    request.getEstado(),
                    request.getPrecioCompra(),
                    request.getPrecioMercado(),
                    request.getFechaCompra()
            );
            return ResponseEntity.ok(juego);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al agregar juego: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarJuego(@PathVariable Long id,
                                         @Valid @RequestBody JuegoUsuarioRequest request,
                                         Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            JuegoUsuario juego = juegoUsuarioService.editarJuego(
                    id,
                    usuario.getId(),
                    request.getJuegoNombre(),
                    request.getEstado(),
                    request.getPrecioCompra(),
                    request.getPrecioMercado(),
                    request.getFechaCompra()
            );
            return ResponseEntity.ok(juego);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al editar juego: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarJuego(@PathVariable Long id, Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            juegoUsuarioService.eliminarJuego(id, usuario.getId());
            return ResponseEntity.ok("Juego eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar juego: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/comentario")
    public ResponseEntity<?> actualizarComentario(@PathVariable Long id,
                                                   @RequestBody String comentario,
                                                   Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            // Eliminar comillas si vienen en el JSON (JSON.stringify envía "texto")
            String comentarioLimpio = comentario;
            if (comentarioLimpio != null && comentarioLimpio.startsWith("\"") && comentarioLimpio.endsWith("\"")) {
                comentarioLimpio = comentarioLimpio.substring(1, comentarioLimpio.length() - 1);
            }
            JuegoUsuario juego = juegoUsuarioService.actualizarComentario(id, usuario.getId(), comentarioLimpio);
            return ResponseEntity.ok(juego);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar comentario: " + e.getMessage());
        }
    }

    private Usuario obtenerUsuarioActual(Authentication authentication) {
        String username = authentication.getName();
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
