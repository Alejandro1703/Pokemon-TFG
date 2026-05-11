package com.pokemon.tfg.repository;

import com.pokemon.tfg.entity.JuegoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface JuegoUsuarioRepository extends JpaRepository<JuegoUsuario, Long> {

    List<JuegoUsuario> findByUsuarioId(Long usuarioId);

    Optional<JuegoUsuario> findByIdAndUsuarioId(Long id, Long usuarioId);

    void deleteByIdAndUsuarioId(Long id, Long usuarioId);

    long count();

    @Query("SELECT j.juegoNombre as nombre, COUNT(j) as total FROM JuegoUsuario j GROUP BY j.juegoNombre ORDER BY total DESC")
    List<Map<String, Object>> findTopJuegos();
}
