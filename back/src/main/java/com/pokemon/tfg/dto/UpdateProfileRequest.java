package com.pokemon.tfg.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String nombre;
    private String email;
}
