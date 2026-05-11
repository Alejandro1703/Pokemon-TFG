package com.pokemon.tfg.controller;

import com.pokemon.tfg.dto.ShinyHuntingRequest;
import com.pokemon.tfg.entity.ShinyHunting;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.service.ShinyHuntingService;
import com.pokemon.tfg.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shiny-hunting")
@CrossOrigin(origins = "http://localhost:5173")
public class ShinyHuntingController {

    @Autowired
    private ShinyHuntingService shinyHuntingService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<ShinyHunting>> obtenerRegistros(Authentication authentication) {
        Usuario usuario = obtenerUsuarioActual(authentication);
        List<ShinyHunting> registros = shinyHuntingService.obtenerRegistrosPorUsuario(usuario.getId());
        return ResponseEntity.ok(registros);
    }

    @PostMapping
    public ResponseEntity<?> agregarRegistro(@Valid @RequestBody ShinyHuntingRequest request,
                                              Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            ShinyHunting registro = shinyHuntingService.agregarRegistro(
                    usuario.getId(),
                    request.getPokemonNombre(),
                    request.getFechaEncuentro(),
                    request.getIntentos(),
                    request.getMetodo(),
                    request.getTiempoPorIntento(),
                    request.getJuegoNombre()
            );
            return ResponseEntity.ok(registro);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al agregar registro: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarRegistro(@PathVariable Long id,
                                             @Valid @RequestBody ShinyHuntingRequest request,
                                             Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            ShinyHunting registro = shinyHuntingService.editarRegistro(
                    id,
                    usuario.getId(),
                    request.getPokemonNombre(),
                    request.getFechaEncuentro(),
                    request.getIntentos(),
                    request.getMetodo(),
                    request.getTiempoPorIntento(),
                    request.getJuegoNombre()
            );
            return ResponseEntity.ok(registro);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al editar registro: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarRegistro(@PathVariable Long id, Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            shinyHuntingService.eliminarRegistro(id, usuario.getId());
            return ResponseEntity.ok("Registro eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar registro: " + e.getMessage());
        }
    }

    private Usuario obtenerUsuarioActual(Authentication authentication) {
        String username = authentication.getName();
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
