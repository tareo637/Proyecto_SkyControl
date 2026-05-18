import { useState, useEffect } from 'react'

function App() {
  const [vuelos, setVuelos] = useState([])
  const [form, setForm] = useState({ numeroVuelo: '', aerolinea: 'Avianca', destino: '', estado: 'En hora' })

  const API_URL = "http://localhost:8080/api/vuelos"

  // LOGOS DE AEROLÍNEAS OPTIMIZADOS (CDNs ESTABLES DE LOGOS)
  const logosAerolineas = {
    Avianca: "https://logos-download.com/wp-content/uploads/2016/07/Avianca_logo_red.png",
    LATAM: "https://logos-download.com/wp-content/uploads/2016/07/LATAM_Airlines_logo_portada.png",
    Wingo: "https://vuelosbaratos.com.co/wp-content/uploads/2016/10/wingo-logo.png",
    VivaAir: "https://upload.wikimedia.org/wikipedia/commons/2/23/Viva_Air_Colombia_logo.png"
  }

  // IMÁGENES DE DESTINOS CORREGIDAS CON FORMATOS ESTABLES Y COMPRIMIDOS
  const imagenesDestinos = {
    Cartagena: "https://images.unsplash.com/photo-1548805721-39e55b6c3f5d?auto=format&fit=crop&w=400&q=80",
    Medellin: "https://images.unsplash.com/photo-1595062584113-f66170d37af9?auto=format&fit=crop&w=400&q=80",
    Bogota: "https://images.unsplash.com/photo-1568241723642-e5108cb9e1e4?auto=format&fit=crop&w=400&q=80"
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
        marginBottom: '30px',
        position: 'relative'
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
          
          {/* BOTONES CON LOGOS CORREGIDOS */}
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
                  <img src={logosAerolineas[key]} alt={key} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
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

            <button type="submit" style={{ marginTop: '10px', padding: '12px', background: '#00d2ff', color: '#070b19', border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 0 15px rgba(0, 210, 255, 0.4)', transition: 'transform 0.1s' }}>
              ⚡ ENVIAR A TORRE DE CONTROL
            </button>
          </form>
        </aside>

        {/* PANEL DERECHO: MONITOR GRÁFICO */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* CONTROL RADAR BANNER */}
          <div style={{
            height: '140px',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid rgba(0, 210, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(7, 11, 25, 0.7)' }} />
            <div style={{ position: 'relative', textAlign: 'center', zIndex: 2 }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#00d2ff', letterSpacing: '2px' }}>📡 NETWORK DATALINK LINKED</h2>
              <p style={{ margin: '5px 0 0 0', color: '#a5f3fc', fontSize: '0.85rem' }}>Conexión cifrada activa con MySQL Server a través de Spring Boot</p>
            </div>
          </div>

          {/* GRID DE DESTINOS CORREGIDO */}
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#9ca3af', letterSpacing: '0.5px' }}>Destinos en Operación</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              {Object.keys(imagenesDestinos).map((nombre) => (
                <div key={nombre} style={{
                  background: 'rgba(13, 20, 43, 0.6)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div style={{ width: '100%', height: '110px', overflow: 'hidden' }}>
                    <img src={imagenesDestinos[nombre]} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        transition: 'background 0.2s'
                      }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#00d2ff' }}>#{vuelo.id}</td>
                        <td style={{ padding: '12px', letterSpacing: '1px', fontWeight: 'bold' }}>{vuelo.numeroVuelo}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {logosAerolineas[vuelo.aerolinea] ? (
                              <div style={{ background: 'white', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContents: 'center', height: '18px' }}>
                                <img src={logosAerolineas[vuelo.aerolinea]} alt="" style={{ height: '12px', maxWidth: '50px', objectFit: 'contain' }} />
                              </div>
                            ) : null}
                            <span style={{ fontSize: '0.9rem' }}>{vuelo.aerolinea}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.9rem' }}>🇨🇴 {vuelo.destino}</td>
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