package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vuelos")
public class Vuelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_vuelo") // Asegura que mapee bien con numero_vuelo en XAMPP
    private String numeroVuelo;

    @Column(name = "aerolinea")
    private String aerolinea;

    @Column(name = "destino")
    private String destino;

    @Column(name = "estado")
    private String estado;

    // Constructor vacío obligatorio
    public Vuelo() {}

    // Constructor con parámetros
    public Vuelo(Long id, String numeroVuelo, String aerolinea, String destino, String estado) {
        this.id = id;
        this.numeroVuelo = numeroVuelo;
        this.aerolinea = aerolinea;
        this.destino = destino;
        this.estado = estado;
    }

    // --- GETTERS Y SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroVuelo() { return numeroVuelo; }
    public void setNumeroVuelo(String numeroVuelo) { this.numeroVuelo = numeroVuelo; }

    public String getAerolinea() { return aerolinea; }
    public void setAerolinea(String aerolinea) { this.aerolinea = aerolinea; }

    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}