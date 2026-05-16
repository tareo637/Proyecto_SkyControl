package com.example.demo.service;

import com.example.demo.model.Vuelo;
import com.example.demo.repository.VueloRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VueloService {

    private final VueloRepository vueloRepository;

    // Inyectamos el repositorio real que ya tienes creado
    public VueloService(VueloRepository vueloRepository) {
        this.vueloRepository = vueloRepository;
    }

    // Método para obtener todos los vuelos de la base de datos
    public List<Vuelo> obtenerTodos() {
        return vueloRepository.findAll();
    }

    // Método para guardar o actualizar un vuelo
    public Vuelo guardar(Vuelo vuelo) {
        return vueloRepository.save(vuelo);
    }
}