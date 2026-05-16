package com.example.demo.controller; // Esto se arreglará solo al renombrar la carpeta

import com.example.demo.model.Vuelo;
import com.example.demo.repository.VueloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vuelos")
@CrossOrigin(origins = "*")
public class VueloController {

    @Autowired
    private VueloRepository vueloRepository;

    // 1. OBTENER TODOS LOS VUELOS (GET)
    @GetMapping
    public List<Vuelo> obtenerTodosLosVuelos() {
        return vueloRepository.findAll();
    }

    // 2. GUARDAR UN VUELO NUEVO (POST)
    @PostMapping
    public Vuelo guardarVuelo(@RequestBody Vuelo vuelo) {
        return vueloRepository.save(vuelo);
    }
}