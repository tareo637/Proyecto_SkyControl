package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vuelos")
public class Vuelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroVuelo;
    private String aerolinea;
    private String destino;
    private String estado;

    // Constructor vacío obligatorio para JPA
    public Vuelo() {}

    // Constructor con parámetros
    public Vuelo(Long id, String numeroVuelo, String aerolinea, String destino, String estado) {
        this.id = id;
        this.numeroVuelo = numeroVuelo;
        this.aerolinea = aerolinea;
        this.destino = destino;
        this.estado = estado;
    }

    // --- GETTERS Y SETTERS MANUALES (Para eliminar los errores del controlador) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroVuelo() {
        return numeroVuelo;
    }

    public void setNumeroVuelo(String numeroVuelo) {
        this.numeroVuelo = numeroVuelo;
    }

    public String getAerolinea() {
        return aerolinea;
    }

    public void setAerolinea(String aerolinea) {
        this.aerolinea = aerolinea;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}