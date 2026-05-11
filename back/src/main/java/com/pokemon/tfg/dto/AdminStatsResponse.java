package com.pokemon.tfg.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsuarios;
    private long totalJuegos;
    private long totalShinyHunts;
    private long totalIntentosShiny;
    private List<Map<String, Object>> topJuegos;
    private List<Map<String, Object>> usuariosRecientes;
}
