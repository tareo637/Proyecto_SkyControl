package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vuelos") // Se conecta a tu tabla de MySQL
@Data // Esto genera los Getters y Setters automáticamente gracias a Lombok
public class Vuelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroVuelo;
    private String aerolinea;
    private String destino;
    private String estado; // Ejemplo: "En hora", "Retrasado"
}