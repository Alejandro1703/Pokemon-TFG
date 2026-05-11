package com.pokemon.tfg.repository;

import com.pokemon.tfg.entity.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuarioId(Long usuarioId);

    Optional<Favorito> findByUsuarioIdAndPokemonId(Long usuarioId, Integer pokemonId);

    boolean existsByUsuarioIdAndPokemonId(Long usuarioId, Integer pokemonId);

    void deleteByUsuarioIdAndPokemonId(Long usuarioId, Integer pokemonId);
}
