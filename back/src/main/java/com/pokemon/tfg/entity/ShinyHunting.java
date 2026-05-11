package com.pokemon.tfg.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "shiny_hunting")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShinyHunting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "pokemon_nombre", nullable = false)
    private String pokemonNombre;

    @Column(name = "fecha_encuentro")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaEncuentro;

    @Column(nullable = false)
    private Integer intentos;

    @Column(nullable = false)
    private String metodo;

    @Column(name = "tiempo_por_intento")
    private Integer tiempoPorIntento;

    @Column(name = "juego_nombre")
    private String juegoNombre;

    @Column(name = "fecha_registro")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaRegistro;

    @Column(name = "hora_registro")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horaRegistro;

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDate.now();
        horaRegistro = LocalTime.now();
    }
}
