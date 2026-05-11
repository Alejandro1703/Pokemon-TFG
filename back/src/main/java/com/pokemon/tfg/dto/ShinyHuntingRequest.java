package com.pokemon.tfg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShinyHuntingRequest {

    @NotBlank(message = "El nombre del Pokémon es obligatorio")
    private String pokemonNombre;

    private LocalDate fechaEncuentro;

    @NotNull(message = "El número de intentos es obligatorio")
    @PositiveOrZero(message = "Los intentos deben ser cero o positivos")
    private Integer intentos;

    @NotBlank(message = "El método de caza es obligatorio")
    private String metodo;

    @PositiveOrZero(message = "El tiempo por intento debe ser cero o positivo")
    private Integer tiempoPorIntento;

    private String juegoNombre;
}
