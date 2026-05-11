package com.pokemon.tfg.controller;

import com.pokemon.tfg.dto.AdminStatsResponse;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.repository.JuegoUsuarioRepository;
import com.pokemon.tfg.repository.ShinyHuntingRepository;
import com.pokemon.tfg.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JuegoUsuarioRepository juegoUsuarioRepository;

    @Autowired
    private ShinyHuntingRepository shinyHuntingRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminStatsResponse> getStats() {
        long totalUsuarios = usuarioRepository.count();
        long totalJuegos = juegoUsuarioRepository.count();
        long totalShinyHunts = shinyHuntingRepository.count();
        long totalIntentosShiny = shinyHuntingRepository.sumTotalIntentos();

        List<Map<String, Object>> topJuegos = juegoUsuarioRepository.findTopJuegos()
                .stream()
                .limit(5)
                .collect(Collectors.toList());

        List<Map<String, Object>> usuariosRecientes = usuarioRepository.findTop10ByOrderByFechaCreacionDesc()
                .stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "nombre", u.getNombre(),
                        "username", u.getUsername(),
                        "fechaCreacion", u.getFechaCreacion() != null ? u.getFechaCreacion().toString() : ""
                ))
                .collect(Collectors.toList());

        AdminStatsResponse stats = new AdminStatsResponse(
                totalUsuarios,
                totalJuegos,
                totalShinyHunts,
                totalIntentosShiny,
                topJuegos,
                usuariosRecientes
        );

        return ResponseEntity.ok(stats);
    }
}
