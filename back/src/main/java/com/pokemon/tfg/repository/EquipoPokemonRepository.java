package com.pokemon.tfg.repository;

import com.pokemon.tfg.entity.EquipoPokemon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipoPokemonRepository extends JpaRepository<EquipoPokemon, Long> {

    List<EquipoPokemon> findByUsuarioId(Long usuarioId);

    Optional<EquipoPokemon> findByIdAndUsuarioId(Long id, Long usuarioId);

    void deleteByIdAndUsuarioId(Long id, Long usuarioId);
}
