import { useState, useEffect } from 'react'

function App() {
  const [vuelos, setVuelos] = useState([])
  const [form, setForm] = useState({ numeroVuelo: '', aerolinea: '', destino: '', estado: 'En hora' })

  const API_URL = "http://localhost:8080/api/vuelos"

  // 1. Cargar vuelos desde el Backend
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

  // 2. Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 3. Registrar un nuevo vuelo (POST)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        cargarVuelos() // Recargar la tabla automáticamente
        setForm({ numeroVuelo: '', aerolinea: '', destino: '', estado: 'En hora' }) // Limpiar formulario
      }
    } catch (error) {
      console.error("Error al guardar vuelo:", error)
    }
  }

  // 4. Eliminar un vuelo (DELETE)
  const handleEliminar = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este vuelo?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        if (res.ok) cargarVuelos()
      } catch (error) {
        console.error("Error al eliminar:", error)
      }
    }
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h2>✈️ Panel de Control - SkyControl</h2>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'grid', gap: '10px', background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
        <h3>Registrar Vuelo</h3>
        <input type="text" name="numeroVuelo" placeholder="Número de Vuelo (ej: AV244)" value={form.numeroVuelo} onChange={handleChange} required style={{ padding: '8px' }} />
        <input type="text" name="aerolinea" placeholder="Aerolínea" value={form.aerolinea} onChange={handleChange} required style={{ padding: '8px' }} />
        <input type="text" name="destino" placeholder="Destino" value={form.destino} onChange={handleChange} required style={{ padding: '8px' }} />
        <select name="estado" value={form.estado} onChange={handleChange} style={{ padding: '8px' }}>
          <option value="En hora">En hora</option>
          <option value="Retrasado">Retrasado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Guardar Vuelo</button>
      </form>

      {/* Tabla de Resultados */}
      <h3>Listado de Vuelos</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>ID</th>
            <th>Número</th>
            <th>Aerolínea</th>
            <th>Destino</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vuelos.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hay vuelos registrados en este momento.</td></tr>
          ) : (
            vuelos.map((vuelo) => (
              <tr key={vuelo.id}>
                <td>{vuelo.id}</td>
                <td>{vuelo.numeroVuelo}</td>
                <td>{vuelo.aerolinea}</td>
                <td>{vuelo.destino}</td>
                <td>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', color: 'white', background: vuelo.estado === 'En hora' ? 'green' : vuelo.estado === 'Retrasado' ? 'orange' : 'red' }}>
                    {vuelo.estado}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEliminar(vuelo.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App