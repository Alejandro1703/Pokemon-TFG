package com.pokemon.tfg.service;

import com.pokemon.tfg.entity.Favorito;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.repository.FavoritoRepository;
import com.pokemon.tfg.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Favorito> obtenerFavoritosPorUsuario(Long usuarioId) {
        return favoritoRepository.findByUsuarioId(usuarioId);
    }

    public boolean esFavorito(Long usuarioId, Integer pokemonId) {
        return favoritoRepository.existsByUsuarioIdAndPokemonId(usuarioId, pokemonId);
    }

    public Favorito agregarFavorito(Long usuarioId, Integer pokemonId, String pokemonNombre) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (favoritoRepository.existsByUsuarioIdAndPokemonId(usuarioId, pokemonId)) {
            throw new RuntimeException("Este Pokémon ya está en favoritos");
        }

        Favorito favorito = new Favorito();
        favorito.setUsuario(usuario);
        favorito.setPokemonId(pokemonId);
        favorito.setPokemonNombre(pokemonNombre);
        return favoritoRepository.save(favorito);
    }

    @Transactional
    public void eliminarFavorito(Long usuarioId, Integer pokemonId) {
        favoritoRepository.deleteByUsuarioIdAndPokemonId(usuarioId, pokemonId);
    }
}
