package com.pokemon.tfg.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pokemon.tfg.dto.AdminStatsResponse;
import com.pokemon.tfg.entity.EquipoPokemon;
import com.pokemon.tfg.entity.Role;
import com.pokemon.tfg.repository.EquipoPokemonRepository;
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

import java.util.*;
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

    @Autowired
    private EquipoPokemonRepository equipoPokemonRepository;

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

        List<Map<String, Object>> usuariosRecientes = usuarioRepository.findAllByOrderByIdAsc()
                .stream()
                .map(u -> Map.<String, Object>of(
                        "nombre", u.getNombre(),
                        "username", u.getUsername(),
                        "fechaCreacion", u.getFechaCreacion() != null ? u.getFechaCreacion().toString() : ""
                ))
                .collect(Collectors.toList());

        // Stat 1: Total equipos creados
        long totalEquipos = equipoPokemonRepository.count();

        // Stat 2: Pokémon más usados en equipos (parsear JSON miembros)
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Long> pokemonCount = new HashMap<>();
        List<EquipoPokemon> allTeams = equipoPokemonRepository.findAll();
        for (EquipoPokemon equipo : allTeams) {
            String miembrosJson = equipo.getMiembros();
            if (miembrosJson != null && !miembrosJson.isEmpty()) {
                try {
                    List<Map<String, Object>> members = mapper.readValue(
                            miembrosJson, new TypeReference<List<Map<String, Object>>>() {});
                    for (Map<String, Object> member : members) {
                        String name = (String) member.get("name");
                        Object idObj = member.get("id");
                        if (name != null) {
                            pokemonCount.merge(name + "|" + (idObj != null ? idObj.toString() : ""), 1L, Long::sum);
                        }
                    }
                } catch (Exception ignored) {}
            }
        }
        List<Map<String, Object>> topPokemonEquipos = pokemonCount.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    String[] parts = e.getKey().split("\\|", -1);
                    String name = parts[0];
                    String id = parts.length > 1 ? parts[1] : "";
                    return Map.<String, Object>of("nombre", name, "id", id, "total", e.getValue());
                })
                .collect(Collectors.toList());

        // Stat 4: Media de intentos por shiny
        long mediaIntentosShiny = totalShinyHunts > 0 ? totalIntentosShiny / totalShinyHunts : 0;

        // Stat 5: Juegos por estado de conservación
        List<Map<String, Object>> juegosByEstado = juegoUsuarioRepository.findJuegosByEstado();

        // Stat 7: Admins vs Usuarios registrados
        long totalAdmins = usuarioRepository.countByRole(Role.ADMIN);

        AdminStatsResponse stats = new AdminStatsResponse(
                totalUsuarios,
                totalJuegos,
                totalShinyHunts,
                totalIntentosShiny,
                topJuegos,
                usuariosRecientes,
                totalEquipos,
                topPokemonEquipos,
                mediaIntentosShiny,
                juegosByEstado,
                totalAdmins
        );

        return ResponseEntity.ok(stats);
    }
}
