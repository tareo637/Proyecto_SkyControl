package com.example.demo.controller;

import com.example.demo.model.Vuelo;
import com.example.demo.service.VueloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vuelos")
@CrossOrigin(origins = "*") // Clave para que React se conecte sin bloqueos de red
public class VueloController {

    @Autowired
    private VueloService vueloService;

    // 1. OBTENER TODOS LOS VUELOS (GET al entrar a /api/vuelos)
    @GetMapping
    public List<Vuelo> obtenerTodosLosVuelos() {
        return vueloService.obtenerTodos();
    }

    // 2. BUSCAR UN VUELO POR ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Vuelo> obtenerVueloPorId(@PathVariable Long id) {
        Optional<Vuelo> vuelo = vueloService.obtenerPorId(id);
        return vuelo.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3. GUARDAR UN VUELO NUEVO (POST)
    @PostMapping
    public Vuelo guardarVuelo(@RequestBody Vuelo vuelo) {
        return vueloService.guardar(vuelo);
    }

    // 4. ACTUALIZAR UN VUELO EXISTENTE (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Vuelo> actualizarVuelo(@PathVariable Long id, @RequestBody Vuelo detallesVuelo) {
        Optional<Vuelo> vueloExistente = vueloService.obtenerPorId(id);

        if (vueloExistente.isPresent()) {
            Vuelo vuelo = vueloExistente.get();
            vuelo.setNumeroVuelo(detallesVuelo.getNumeroVuelo());
            vuelo.setAerolinea(detallesVuelo.getAerolinea());
            vuelo.setDestino(detallesVuelo.getDestino());
            vuelo.setEstado(detallesVuelo.getEstado());

            Vuelo vueloActualizado = vueloService.guardar(vuelo);
            return ResponseEntity.ok(vueloActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. ELIMINAR UN VUELO (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVuelo(@PathVariable Long id) {
        Optional<Vuelo> vuelo = vueloService.obtenerPorId(id);
        if (vuelo.isPresent()) {
            vueloService.eliminar(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}