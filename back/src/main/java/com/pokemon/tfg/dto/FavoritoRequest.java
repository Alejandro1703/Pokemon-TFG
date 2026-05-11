package com.pokemon.tfg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoritoRequest {

    @NotNull(message = "El ID del Pokémon es obligatorio")
    private Integer pokemonId;

    @NotBlank(message = "El nombre del Pokémon es obligatorio")
    private String pokemonNombre;
}
