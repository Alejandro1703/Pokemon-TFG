package com.pokemon.tfg.dto;

import com.pokemon.tfg.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String message;
    private Usuario user;
}
