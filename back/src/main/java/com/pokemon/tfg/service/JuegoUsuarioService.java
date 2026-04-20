package com.pokemon.tfg.service;

import com.pokemon.tfg.entity.JuegoUsuario;
import com.pokemon.tfg.entity.Usuario;
import com.pokemon.tfg.repository.JuegoUsuarioRepository;
import com.pokemon.tfg.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class JuegoUsuarioService {

    @Autowired
    private JuegoUsuarioRepository juegoUsuarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<JuegoUsuario> obtenerJuegosPorUsuario(Long usuarioId) {
        return juegoUsuarioRepository.findByUsuarioId(usuarioId);
    }

    public JuegoUsuario agregarJuego(Long usuarioId, String juegoNombre, String estado,
                                      Double precioCompra, Double precioMercado, LocalDate fechaCompra) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        JuegoUsuario juegoUsuario = new JuegoUsuario();
        juegoUsuario.setUsuario(usuario);
        juegoUsuario.setJuegoNombre(juegoNombre);
        juegoUsuario.setEstado(estado);
        juegoUsuario.setPrecioCompra(precioCompra);
        juegoUsuario.setPrecioMercado(precioMercado);
        juegoUsuario.setFechaCompra(fechaCompra);
        // El beneficio se calcula automáticamente en @PrePersist

        return juegoUsuarioRepository.save(juegoUsuario);
    }

    public JuegoUsuario editarJuego(Long id, Long usuarioId, String juegoNombre, String estado,
                                     Double precioCompra, Double precioMercado, LocalDate fechaCompra) {
        JuegoUsuario juego = juegoUsuarioRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado o no pertenece al usuario"));

        juego.setJuegoNombre(juegoNombre);
        juego.setEstado(estado);
        juego.setPrecioCompra(precioCompra);
        juego.setPrecioMercado(precioMercado);
        juego.setFechaCompra(fechaCompra);
        // El beneficio se recalcula automáticamente en @PreUpdate

        return juegoUsuarioRepository.save(juego);
    }

    @Transactional
    public void eliminarJuego(Long id, Long usuarioId) {
        juegoUsuarioRepository.deleteByIdAndUsuarioId(id, usuarioId);
    }

    public Optional<JuegoUsuario> obtenerJuegoPorIdYUsuario(Long id, Long usuarioId) {
        return juegoUsuarioRepository.findByIdAndUsuarioId(id, usuarioId);
    }
}
