package com.pokemon.tfg.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AventuraRequest {

    @NotBlank(message = "El nombre del juego es obligatorio")
    private String juegoNombre;

    private String datos;
}
