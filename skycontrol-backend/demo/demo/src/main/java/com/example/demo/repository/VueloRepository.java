package com.example.demo.repository;

import com.example.demo.model.Vuelo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VueloRepository extends JpaRepository<Vuelo, Long> {
    // Aquí ya tenemos gratis los métodos: save(), findAll(), findById(), deleteById()
}