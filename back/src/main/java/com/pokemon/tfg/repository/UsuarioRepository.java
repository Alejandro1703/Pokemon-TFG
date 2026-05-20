package com.pokemon.tfg.repository;

import com.pokemon.tfg.entity.Role;
import com.pokemon.tfg.entity.Usuario;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    boolean existsByTelefono(String telefono);
    
    boolean existsByEmail(String email);

    long count();

    long countByRole(Role role);

    List<Usuario> findAllByOrderByIdAsc();
}
