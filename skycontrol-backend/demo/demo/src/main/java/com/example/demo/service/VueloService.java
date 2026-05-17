package com.example.demo.service;

import com.example.demo.model.Vuelo;
import com.example.demo.repository.VueloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VueloService {

    @Autowired
    private VueloRepository vueloRepository;

    // 1. Obtener todos los vuelos
    public List<Vuelo> obtenerTodos() {
        return vueloRepository.findAll();
    }

    // 2. Buscar un vuelo por ID (¡Este le faltaba a tu controlador!)
    public Optional<Vuelo> obtenerPorId(Long id) {
        return vueloRepository.findById(id);
    }

    // 3. Guardar o actualizar un vuelo
    public Vuelo guardar(Vuelo vuelo) {
        return vueloRepository.save(vuelo);
    }

    // 4. Eliminar un vuelo por ID (¡Este también le faltaba!)
    public void eliminar(Long id) {
        vueloRepository.deleteById(id);
    }
}