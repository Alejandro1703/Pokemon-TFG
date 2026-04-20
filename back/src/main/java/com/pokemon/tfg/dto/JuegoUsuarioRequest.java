package com.pokemon.tfg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JuegoUsuarioRequest {

    @NotBlank(message = "El nombre del juego es obligatorio")
    private String juegoNombre;

    @NotBlank(message = "El estado es obligatorio")
    private String estado;

    @NotNull(message = "El precio de compra es obligatorio")
    @Positive(message = "El precio de compra debe ser positivo")
    private Double precioCompra;

    @NotNull(message = "El precio de mercado es obligatorio")
    @Positive(message = "El precio de mercado debe ser positivo")
    private Double precioMercado;

    private LocalDate fechaCompra;
}
