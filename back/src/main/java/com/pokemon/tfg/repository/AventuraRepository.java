package com.pokemon.tfg.repository;

import com.pokemon.tfg.entity.Aventura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AventuraRepository extends JpaRepository<Aventura, Long> {

    List<Aventura> findByUsuarioId(Long usuarioId);

    Optional<Aventura> findByUsuarioIdAndJuegoNombre(Long usuarioId, String juegoNombre);

    Optional<Aventura> findByIdAndUsuarioId(Long id, Long usuarioId);

    void deleteByIdAndUsuarioId(Long id, Long usuarioId);
}
