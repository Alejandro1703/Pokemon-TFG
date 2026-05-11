package com.pokemon.tfg.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipoPokemonRequest {

    @NotBlank(message = "El nombre del equipo es obligatorio")
    private String nombre;

    private String juegoNombre;

    private String miembros;
}
