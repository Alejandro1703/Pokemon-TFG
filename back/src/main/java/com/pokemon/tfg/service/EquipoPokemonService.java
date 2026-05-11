package com.pokemon.tfg.service;

import com.pokemon.tfg.entity.EquipoPokemon;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.repository.EquipoPokemonRepository;
import com.pokemon.tfg.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EquipoPokemonService {

    @Autowired
    private EquipoPokemonRepository equipoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<EquipoPokemon> obtenerEquiposPorUsuario(Long usuarioId) {
        return equipoRepository.findByUsuarioId(usuarioId);
    }

    public EquipoPokemon crearEquipo(Long usuarioId, String nombre, String juegoNombre, String miembros) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        EquipoPokemon equipo = new EquipoPokemon();
        equipo.setUsuario(usuario);
        equipo.setNombre(nombre);
        equipo.setJuegoNombre(juegoNombre);
        equipo.setMiembros(miembros);
        return equipoRepository.save(equipo);
    }

    public EquipoPokemon editarEquipo(Long id, Long usuarioId, String nombre, String juegoNombre, String miembros) {
        EquipoPokemon equipo = equipoRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado o no pertenece al usuario"));

        equipo.setNombre(nombre);
        equipo.setJuegoNombre(juegoNombre);
        equipo.setMiembros(miembros);
        return equipoRepository.save(equipo);
    }

    @Transactional
    public void eliminarEquipo(Long id, Long usuarioId) {
        equipoRepository.deleteByIdAndUsuarioId(id, usuarioId);
    }
}
