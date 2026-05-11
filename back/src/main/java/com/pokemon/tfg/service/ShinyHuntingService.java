package com.pokemon.tfg.service;

import com.pokemon.tfg.entity.ShinyHunting;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.repository.ShinyHuntingRepository;
import com.pokemon.tfg.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ShinyHuntingService {

    @Autowired
    private ShinyHuntingRepository shinyHuntingRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<ShinyHunting> obtenerRegistrosPorUsuario(Long usuarioId) {
        return shinyHuntingRepository.findByUsuarioId(usuarioId);
    }

    public ShinyHunting agregarRegistro(Long usuarioId, String pokemonNombre, LocalDate fechaEncuentro,
                                         Integer intentos, String metodo, Integer tiempoPorIntento, String juegoNombre) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        ShinyHunting registro = new ShinyHunting();
        registro.setUsuario(usuario);
        registro.setPokemonNombre(pokemonNombre);
        registro.setFechaEncuentro(fechaEncuentro);
        registro.setIntentos(intentos);
        registro.setMetodo(metodo);
        registro.setTiempoPorIntento(tiempoPorIntento);
        registro.setJuegoNombre(juegoNombre);

        return shinyHuntingRepository.save(registro);
    }

    public ShinyHunting editarRegistro(Long id, Long usuarioId, String pokemonNombre, LocalDate fechaEncuentro,
                                        Integer intentos, String metodo, Integer tiempoPorIntento, String juegoNombre) {
        ShinyHunting registro = shinyHuntingRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Registro no encontrado o no pertenece al usuario"));

        registro.setPokemonNombre(pokemonNombre);
        registro.setFechaEncuentro(fechaEncuentro);
        registro.setIntentos(intentos);
        registro.setMetodo(metodo);
        registro.setTiempoPorIntento(tiempoPorIntento);
        registro.setJuegoNombre(juegoNombre);

        return shinyHuntingRepository.save(registro);
    }

    @Transactional
    public void eliminarRegistro(Long id, Long usuarioId) {
        shinyHuntingRepository.deleteByIdAndUsuarioId(id, usuarioId);
    }
}
