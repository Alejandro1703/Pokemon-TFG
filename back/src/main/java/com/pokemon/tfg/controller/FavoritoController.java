package com.pokemon.tfg.controller;

import com.pokemon.tfg.dto.FavoritoRequest;
import com.pokemon.tfg.entity.Favorito;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.service.FavoritoService;
import com.pokemon.tfg.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<Favorito>> obtenerFavoritos(Authentication authentication) {
        Usuario usuario = obtenerUsuarioActual(authentication);
        return ResponseEntity.ok(favoritoService.obtenerFavoritosPorUsuario(usuario.getId()));
    }

    @GetMapping("/check/{pokemonId}")
    public ResponseEntity<Map<String, Boolean>> esFavorito(@PathVariable Integer pokemonId,
                                                            Authentication authentication) {
        Usuario usuario = obtenerUsuarioActual(authentication);
        boolean isFav = favoritoService.esFavorito(usuario.getId(), pokemonId);
        return ResponseEntity.ok(Map.of("favorito", isFav));
    }

    @PostMapping
    public ResponseEntity<?> agregarFavorito(@Valid @RequestBody FavoritoRequest request,
                                              Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            Favorito favorito = favoritoService.agregarFavorito(
                    usuario.getId(),
                    request.getPokemonId(),
                    request.getPokemonNombre()
            );
            return ResponseEntity.ok(favorito);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al agregar favorito: " + e.getMessage());
        }
    }

    @DeleteMapping("/{pokemonId}")
    public ResponseEntity<?> eliminarFavorito(@PathVariable Integer pokemonId,
                                               Authentication authentication) {
        try {
            Usuario usuario = obtenerUsuarioActual(authentication);
            favoritoService.eliminarFavorito(usuario.getId(), pokemonId);
            return ResponseEntity.ok("Favorito eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar favorito: " + e.getMessage());
        }
    }

    private Usuario obtenerUsuarioActual(Authentication authentication) {
        String username = authentication.getName();
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
