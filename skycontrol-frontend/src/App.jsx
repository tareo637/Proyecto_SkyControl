import { useState, useEffect, useRef } from 'react'

function App() {
  const [vuelos, setVuelos] = useState([])
  const [form, setForm] = useState({ numeroVuelo: '', aerolinea: 'Avianca', destino: '', estado: 'En hora' })
  
  // Referencia para el canvas del radar animado
  const canvasRef = useRef(null)
  // Estado interno para rastrear las posiciones de los aviones en el radar
  const avionesRef = useRef({})

  const API_URL = "http://localhost:8080/api/vuelos"

const logosAerolineas = {
  Avianca: "/Imagenes/avianca.png",
  LATAM: "/Imagenes/latam.png",
  Wingo: "/Imagenes/wingo.png.png",
  VivaAir: "/Imagenes/vivaair.png"
};

const imagenesDestinos = {
  Bogota: "/Imagenes/bogota.jpg",
  Cartagena: "/Imagenes/cartagena.jpg",
  Medellin: "/Imagenes/medellin.jpg"
};

  const handleImageError = (e) => {
    e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='20' viewBox='0 0 50 20'><rect width='100%' height='100%' fill='%231a234a'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%2300d2ff' font-size='8' font-family='sans-serif'>✈️</text></svg>";
  }

  const cargarVuelos = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setVuelos(data)
    } catch (error) {
      console.error("Error conectando al backend:", error)
    }
  }

  useEffect(() => {
    cargarVuelos()
  }, [])

  // --- LOOP DE ANIMACIÓN DEL RADAR INTERACTIVO ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let anguloBarrido = 0

    const animarRadar = () => {
      // 1. Limpiar con una capa semitransparente para dejar el efecto de estela (Ghost effect)
      ctx.fillStyle = 'rgba(7, 11, 25, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centroX = canvas.width / 2
      const centroY = canvas.height / 2
      const radioMax = Math.min(centroX, centroY) - 10

      // 2. Dibujar círculos concéntricos del radar
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.15)'
      ctx.lineWidth = 1
      for (let r = radioMax / 4; r <= radioMax; r += radioMax / 4) {
        ctx.beginPath()
        ctx.arc(centroX, centroY, r, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Líneas de cuadrante (Cruz del radar)
      ctx.beginPath()
      ctx.moveTo(centroX - radioMax, centroY); ctx.lineTo(centroX + radioMax, centroY)
      ctx.moveTo(centroX, centroY - radioMax); ctx.lineTo(centroX, centroY + radioMax)
      ctx.stroke()

      // 3. Dibujar la línea de barrido del radar
      anguloBarrido += 0.02
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centroX, centroY)
      ctx.lineTo(
        centroX + Math.cos(anguloBarrido) * radioMax,
        centroY + Math.sin(anguloBarrido) * radioMax
      )
      ctx.stroke()

      // 4. Sincronizar y actualizar aviones basados en los vuelos de la base de datos
      vuelos.forEach((vuelo) => {
        // Si el avión no existe en memoria de animación, inicializarlo en una coordenada aleatoria
        if (!avionesRef.current[vuelo.id]) {
          const anguloInicial = Math.random() * Math.PI * 2
          const distanciaInicial = (Math.random() * 0.5 + 0.3) * radioMax // Distancia del centro
          
          avionesRef.current[vuelo.id] = {
            x: centroX + Math.cos(anguloInicial) * distanciaInicial,
            y: centroY + Math.sin(anguloInicial) * distanciaInicial,
            angulo: anguloInicial,
            distancia: distanciaInicial,
            faseParpadeo: Math.random() * 10
          }
        }

        const avion = avionesRef.current[vuelo.id]
        avion.faseParpadeo += 0.05

        // Comportamiento según el estado real de la base de datos
        if (vuelo.estado === 'En hora') {
          // El avión avanza progresivamente hacia la pista (el centro)
          if (avion.distancia > 15) {
            avion.distancia -= 0.15
            // Añadir un leve balanceo orbital para simular vuelo dinámico
            avion.angulo += 0.002
          } else {
            // Llegó a pista: se queda en el centro simulando aterrizaje seguro
            avion.distancia = 12
          }
          avion.x = centroX + Math.cos(avion.angulo) * avion.distancia
          avion.y = centroY + Math.sin(avion.angulo) * avion.distancia
          ctx.fillStyle = '#10b981' // Verde para operaciones normales
        } else if (vuelo.estado === 'Retrasado') {
          // Órbita de espera en círculos lejos del aeropuerto (fuera de la pista)
          avion.angulo += 0.008 
          avion.x = centroX + Math.cos(avion.angulo) * avion.distancia
          avion.y = centroY + Math.sin(avion.angulo) * avion.distancia
          ctx.fillStyle = '#f59e0b' // Amarillo de advertencia/espera
        } else {
          // Cancelado: Se queda varado o congelado en su última posición
          ctx.fillStyle = '#ef4848' // Rojo
        }

        // Efecto visual de parpadeo de baliza de navegación aeronáutica
        if (Math.sin(avion.faseParpadeo) > 0) {
          // Dibujar punto del avión
          ctx.beginPath()
          ctx.arc(avion.x, avion.y, 5, 0, Math.PI * 2)
          ctx.fill()

          // Dibujar anillo de eco de radar a su alrededor
          ctx.strokeStyle = ctx.fillStyle
          ctx.beginPath()
          ctx.arc(avion.x, avion.y, 9, 0, Math.PI * 2)
          ctx.stroke()

          // Mostrar etiqueta de texto con el código del vuelo y destino al lado del punto
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
          ctx.font = 'bold 10px monospace'
          ctx.fillText(`${vuelo.numeroVuelo} ➔ ${vuelo.destino}`, avion.x + 10, avion.y + 3)
          
          // Mostrar pequeño subtexto con su altitud/estado simulado
          ctx.fillStyle = 'rgba(0, 210, 255, 0.6)'
          ctx.font = '8px monospace'
          const infoEstado = vuelo.estado === 'En hora' && avion.distancia <= 15 ? 'PISTA / APCH' : vuelo.estado.toUpperCase()
          ctx.fillText(`ALT: 120 FL / ${infoEstado}`, avion.x + 10, avion.y + 13)
        }
      })

      // Limpiar registros de aviones borrados de la base de datos
      const idsActuales = vuelos.map(v => v.id)
      Object.keys(avionesRef.current).forEach(id => {
        if (!idsActuales.includes(Number(id))) {
          delete avionesRef.current[id]
        }
      })

      animationFrameId = requestAnimationFrame(animarRadar)
    }

    animarRadar()
    return () => cancelAnimationFrame(animationFrameId)
  }, [vuelos])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const seleccionarAerolineaRapida = (nombre) => {
    setForm({ ...form, aerolinea: nombre })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        cargarVuelos()
        setForm({ numeroVuelo: '', aerolinea: 'Avianca', destino: '', estado: 'En hora' })
      }
    } catch (error) {
      console.error("Error al guardar vuelo:", error)
    }
  }

  const handleEliminar = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este vuelo de la torre de control?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        if (res.ok) cargarVuelos()
      } catch (error) {
        console.error("Error al eliminar:", error)
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070b19',
      backgroundImage: 'radial-gradient(circle at 50% 10%, #1a234a 0%, #070b19 80%)',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '25px',
      boxSizing: 'border-box'
    }}>
      
      {/* HEADER ESTILO HUD RADAR DE TORRE */}
      <header style={{
        textAlign: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(0, 210, 255, 0.2)',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, letterSpacing: '1px', textShadow: '0 0 15px rgba(0, 210, 255, 0.5)' }}>
          ✈️ SKYCONTROL ADVANCED COMMAND CENTER
        </h1>
        <div style={{
          display: 'inline-block',
          marginTop: '5px',
          padding: '4px 12px',
          background: 'rgba(0, 210, 255, 0.1)',
          border: '1px solid #00d2ff',
          borderRadius: '4px',
          color: '#00d2ff',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          letterSpacing: '2px'
        }}>
          LIVE TOWER OPERATIONS CONTROL
        </div>
      </header>

      {/* CONTENEDOR EN DOS COLUMNAS REFORZADO */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '30px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        
        {/* PANEL IZQUIERDO: FORMULARIO */}
        <aside style={{
          background: 'rgba(13, 20, 43, 0.85)',
          border: '1px solid rgba(0, 210, 255, 0.15)',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          height: 'fit-content'
        }}>
          <h2 style={{ fontSize: '1.3rem', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', color: '#00d2ff' }}>
            Registrar Vuelo
          </h2>
          
          {/* BOTONES CON LOGOS LOCALES */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '8px', fontWeight: 'bold' }}>
              Selección rápida de Aerolínea:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {Object.keys(logosAerolineas).map((key) => (
                <button 
                  key={key}
                  type="button"
                  onClick={() => seleccionarAerolineaRapida(key)}
                  style={{
                    background: form.aerolinea === key ? 'rgba(0, 210, 255, 0.25)' : 'rgba(255,255,255,0.03)',
                    border: form.aerolinea === key ? '2px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                    padding: '6px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '42px',
                    transition: 'all 0.2s',
                    boxShadow: form.aerolinea === key ? '0 0 10px rgba(0,210,255,0.3)' : 'none'
                  }}
                >
                  <img 
                    src={logosAerolineas[key]} 
                    alt={key} 
                    onError={handleImageError}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                  />
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '5px' }}>Número de Vuelo</label>
              <input 
                type="text" 
                name="numeroVuelo" 
                placeholder="ej: AV244" 
                value={form.numeroVuelo} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', fontSize: '0.95rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '5px' }}>Aerolínea Seleccionada</label>
              <input 
                type="text" 
                name="aerolinea" 
                value={form.aerolinea} 
                readOnly
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', background: 'rgba(0, 210, 255, 0.05)', border: '1px solid rgba(0, 210, 255, 0.3)', borderRadius: '6px', color: '#00d2ff', fontSize: '0.95rem', fontWeight: 'bold' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '5px' }}>Destino</label>
              <input 
                type="text" 
                name="destino" 
                placeholder="ej: Bogotá, Cartagena, Medellin" 
                value={form.destino} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', fontSize: '0.95rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '5px' }}>Estado Operacional</label>
              <select 
                name="estado" 
                value={form.estado} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '10px', background: '#0d142b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', fontSize: '0.95rem' }}
              >
                <option value="En hora">🟢 En hora</option>
                <option value="Retrasado">🟡 Retrasado</option>
                <option value="Cancelado">🔴 Cancelado</option>
              </select>
            </div>

            <button type="submit" style={{ marginTop: '10px', padding: '12px', background: '#00d2ff', color: '#070b19', border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 0 15px rgba(0, 210, 255, 0.4)' }}>
              ⚡ ENVIAR A TORRE DE CONTROL
            </button>
          </form>
        </aside>

        {/* PANEL DERECHO: MONITOR GRÁFICO CON RADAR ANIMADO */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* RADAR DE CONTROL TOTALMENTE ANIMADO POR JAVASCRIPT */}
          <div style={{
            background: '#070b19',
            borderRadius: '12px',
            padding: '15px',
            border: '1px solid rgba(0, 210, 255, 0.25)',
            boxShadow: 'inset 0 0 20px rgba(0, 210, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ alignSelf: 'flex-start', color: '#00d2ff', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' }}>
              📡 LIVE ATC RADAR SCANNER (REALTIME DATA)
            </div>
            
            {/* Lienzo del Radar */}
            <canvas 
              ref={canvasRef} 
              width={750} 
              height={260} 
              style={{ 
                background: '#040814', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.05)' 
              }}
            />
          </div>

         {/* GRID DE DESTINOS LOCALES */}
<div>
  <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#9ca3af', letterSpacing: '0.5px' }}>Destinos en Operación</h3>
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
    gap: '15px',
    width: '100%'
  }}>
    {Object.keys(imagenesDestinos).map((nombre) => (
      <div key={nombre} style={{
        background: 'rgba(13, 20, 43, 0.6)',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ width: '100%', height: '140px', overflow: 'hidden', background: '#101730' }}>
          <img 
            src={imagenesDestinos[nombre]} 
            alt={nombre} 
            onError={handleImageError}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              display: 'block'
            }} 
          />
        </div>
        <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(13, 20, 43, 0.9)' }}>
          <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{nombre}</span>
          <span style={{ color: '#10b981', fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '10px' }}>Ruta Activa</span>
        </div>
      </div>
    ))}
  </div>
</div>

          {/* MONITOR TABLA PREMIUM */}
          <div style={{
            background: 'rgba(13, 20, 43, 0.5)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(0, 210, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#ffffff' }}>📊 Monitor de Vuelos en Tiempo Real</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0, 210, 255, 0.2)', color: '#9ca3af', fontSize: '0.85rem' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>CÓDIGO VUELO</th>
                    <th style={{ padding: '12px' }}>AEROLÍNEA</th>
                    <th style={{ padding: '12px' }}>DESTINO</th>
                    <th style={{ padding: '12px' }}>ESTADO TRÁFICO</th>
                    <th style={{ padding: '12px' }}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {vuelos.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#4b5563', fontSize: '0.9rem' }}>
                        No hay tráficos de vuelo reportados en el radar.
                      </td>
                    </tr>
                  ) : (
                    vuelos.map((vuelo) => (
                      <tr key={vuelo.id} style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.03)'
                      }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#00d2ff' }}>#{vuelo.id}</td>
                        <td style={{ padding: '12px', letterSpacing: '1px', fontWeight: 'bold' }}>{vuelo.numeroVuelo}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {logosAerolineas[vuelo.aerolinea] ? (
                              <div style={{ 
                                background: 'white', 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                height: '18px' 
                              }}>
                                <img 
                                  src={logosAerolineas[vuelo.aerolinea]} 
                                  alt="" 
                                  onError={handleImageError}
                                  style={{ height: '12px', maxWidth: '50px', objectFit: 'contain' }} 
                                />
                              </div>
                            ) : null}
                            <span style={{ fontSize: '0.9rem' }}>{vuelo.aerolinea}</span>
                          </div>
                        </td>
                       <td style={{ padding: '12px', fontSize: '0.9rem' }}>{vuelo.destino}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: '4px', 
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            background: vuelo.estado.includes('En hora') ? '#10b981' : vuelo.estado.includes('Retrasado') ? '#f59e0b' : '#ef4848' 
                          }}>
                            {vuelo.estado}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button 
                            onClick={() => handleEliminar(vuelo.id)} 
                            style={{ 
                              background: 'rgba(239,68,68,0.1)', 
                              color: '#ef4848', 
                              border: '1px solid rgba(239,68,68,0.3)', 
                              padding: '4px 10px', 
                              cursor: 'pointer', 
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}
                          >
                            🗑️ REMOVER
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </main>

      </div>
    </div>
  )
}

export default App