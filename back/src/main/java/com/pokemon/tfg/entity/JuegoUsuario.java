package com.pokemon.tfg.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "juegos_usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JuegoUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "juego_nombre", nullable = false)
    private String juegoNombre;

    @Column(nullable = false)
    private String estado;

    @Column(name = "precio_compra")
    private Double precioCompra;

    @Column(name = "precio_mercado", nullable = false)
    private Double precioMercado;

    @Column(nullable = true)
    private Double beneficio;

    @Column(name = "fecha_compra")
    private LocalDate fechaCompra;

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
        calcularBeneficio();
    }

    @PreUpdate
    protected void onUpdate() {
        calcularBeneficio();
    }

    private void calcularBeneficio() {
        if (precioMercado != null && precioCompra != null) {
            this.beneficio = precioMercado - precioCompra;
        } else {
            this.beneficio = null;
        }
    }
}
