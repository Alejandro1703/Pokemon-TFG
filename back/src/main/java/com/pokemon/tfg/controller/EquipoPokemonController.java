package com.pokemon.tfg.controller;

import com.pokemon.tfg.dto.EquipoPokemonRequest;
import com.pokemon.tfg.entity.EquipoPokemon;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.service.EquipoPokemonService;
import com.pokemon.tfg.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
@CrossOrigin(origins = "http://localhost:5173")
public class EquipoPokemonController {

    @Autowired
    private EquipoPokemonService equipoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<EquipoPokemon>> obtenerEquipos(Authentication authentication) {
        Usuario usuario = obtenerUsuarioActual(authentication);
        return ResponseEntity.ok(equipoService.obtenerEquiposPorUsuario(usuario.getId()));
    }

    @PostMapping
    public ResponseEntity<?> crearEquipo(@Valid @RequestBody EquipoPokemonRequest request,
                                          Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            EquipoPokemon equipo = equipoService.crearEquipo(
                    usuario.getId(),
                    request.getNombre(),
                    request.getJuegoNombre(),
                    request.getMiembros()
            );
            return ResponseEntity.ok(equipo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear equipo: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarEquipo(@PathVariable Long id,
                                           @Valid @RequestBody EquipoPokemonRequest request,
                                           Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            EquipoPokemon equipo = equipoService.editarEquipo(
                    id,
                    usuario.getId(),
                    request.getNombre(),
                    request.getJuegoNombre(),
                    request.getMiembros()
            );
            return ResponseEntity.ok(equipo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al editar equipo: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEquipo(@PathVariable Long id, Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            equipoService.eliminarEquipo(id, usuario.getId());
            return ResponseEntity.ok("Equipo eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar equipo: " + e.getMessage());
        }
    }

    private Usuario obtenerUsuarioActual(Authentication authentication) {
        String username = authentication.getName();
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
