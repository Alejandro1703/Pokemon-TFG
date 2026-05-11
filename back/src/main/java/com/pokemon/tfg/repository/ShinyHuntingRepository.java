package com.pokemon.tfg.repository;

import com.pokemon.tfg.entity.ShinyHunting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShinyHuntingRepository extends JpaRepository<ShinyHunting, Long> {

    List<ShinyHunting> findByUsuarioId(Long usuarioId);

    Optional<ShinyHunting> findByIdAndUsuarioId(Long id, Long usuarioId);

    void deleteByIdAndUsuarioId(Long id, Long usuarioId);

    long count();

    @Query("SELECT COALESCE(SUM(s.intentos), 0) FROM ShinyHunting s")
    long sumTotalIntentos();
}
