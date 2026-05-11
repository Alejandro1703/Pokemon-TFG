package com.pokemon.tfg.service;

import com.pokemon.tfg.entity.Aventura;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.repository.AventuraRepository;
import com.pokemon.tfg.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AventuraService {

    @Autowired
    private AventuraRepository aventuraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Aventura> obtenerAventurasPorUsuario(Long usuarioId) {
        return aventuraRepository.findByUsuarioId(usuarioId);
    }

    public Optional<Aventura> obtenerAventuraPorJuego(Long usuarioId, String juegoNombre) {
        return aventuraRepository.findByUsuarioIdAndJuegoNombre(usuarioId, juegoNombre);
    }

    public Aventura guardarAventura(Long usuarioId, String juegoNombre, String datos) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Optional<Aventura> existente = aventuraRepository.findByUsuarioIdAndJuegoNombre(usuarioId, juegoNombre);

        if (existente.isPresent()) {
            Aventura aventura = existente.get();
            aventura.setDatos(datos);
            return aventuraRepository.save(aventura);
        } else {
            Aventura aventura = new Aventura();
            aventura.setUsuario(usuario);
            aventura.setJuegoNombre(juegoNombre);
            aventura.setDatos(datos);
            return aventuraRepository.save(aventura);
        }
    }

    @Transactional
    public void eliminarAventura(Long id, Long usuarioId) {
        aventuraRepository.deleteByIdAndUsuarioId(id, usuarioId);
    }
}
