package com.pokemon.tfg.repository;

import com.pokemon.tfg.entity.JuegoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JuegoUsuarioRepository extends JpaRepository<JuegoUsuario, Long> {

    List<JuegoUsuario> findByUsuarioId(Long usuarioId);

    Optional<JuegoUsuario> findByIdAndUsuarioId(Long id, Long usuarioId);

    void deleteByIdAndUsuarioId(Long id, Long usuarioId);
}
