import { useState, useEffect } from "react";

import './App.css';

function App(){
  //Estados para formulario

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState(0);

  //Estado para la lista de empleados

  const [registros, setRegistros] = useState([]);

  //Estado para saber si se está editando

  const [editIndex, setEditIndex] = useState(null);

  useEffect( () => {
    cargarEmpleados();
  }, []);

  //Función para cargar empleados

  const cargarEmpleados = async () => {
    try {
      const response = await fetch('http://localhost:3001/empleados');
      const data = await response.json();
      setRegistros(data)
    } catch(error) {
      alert('Error al cargar los empleados');
    }
  }

  //Función para registrar datos

  const registrarDatos = async(e) => {
    e.preventDefault();

    if (editIndex !== null) {

      //Actualizar empleado existente

      try {
        const empleado = registros[editIndex];
        const response = await fetch(`http://localhost:3001/empleados/${empleado.id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({nombre, edad, pais, cargo, anios})
        });

        if (response.ok) {
          const nuevosRegistros = [...registros]
          nuevosRegistros[editIndex] = {...empleado, nombre, edad, pais, cargo, anios};
          setRegistros(nuevosRegistros);
          setEditIndex(null);
          alert('Empleado actualizado correctamente');
        } else {
          alert('Error al actualizar el empleado');
        }

      } catch (error) {
        alert('Error de conexión al actualizar');
      }
    } else {
      //Crear un nuevo empleado
      try {
        const response = await fetch('http://localhost:3001/empleados/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({nombre, edad, pais, cargo, anios})
        });

        const data = await response.json();

        if (response.ok) {
          setRegistros([...registros, data]);
          alert('Empleado guardado correctamente');
        } else {
          alert('Error al guardar el empleado');
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }

    //Limpiar el formulario
    setNombre("");
    setEdad(0);
    setPais("");
    setCargo("");
    setAnios(0);
  };

  //Eliminar Registros
  const eliminarRegistro = async(idx) => {
    
    //Se obtiene el empleado por el índice
    const empleado = registros[idx];
    try {
        const response = await fetch(`http://localhost:3001/empleados/${empleado.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setRegistros(registros.filter((_, i) => i !== idx));
          if(editIndex === idx) {
            setEditIndex(null);
            setNombre("");
            setEdad(0);
            setPais("");
            setCargo("");
            setAnios(0);
          }
          alert('Empleado eliminado correctamente');
        } else {
          alert('Error al eliminar el empleado');
        }

      } catch (error) {
        alert('Error de conexión al eliminar');
      }
  };

  //Función a ejecutar cuando se quiera editar
  const editarRegistro = (idx) => {
    const reg = registros[idx];
    setNombre(reg.nombre);
    setEdad(reg.edad);
    setPais(reg.pais);
    setCargo(reg.cargo);
    setAnios(reg.anios);
    setEditIndex(idx);
  };

  return (
    <div className="app-wrapper">

      {/* ── Encabezado de página ── */}
      <header className="page-header">
        <h1>Gestión de <span>Empleados</span></h1>
        <div className="header-divider"></div>
      </header>

      {/* ── Tarjeta del formulario ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">✦</div>
          <h2>{editIndex !== null ? "Editar Empleado" : "Registro de Empleado"}</h2>
          {editIndex !== null && (
            <span className="edit-badge">Modo edición</span>
          )}
        </div>

        <div className="card-body">
          <form onSubmit={registrarDatos}>
            <div className="form-grid">

              {/* Nombre */}
              <div className="field-group full-width">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              {/* Edad */}
              <div className="field-group">
                <label htmlFor="edad">Edad</label>
                <input
                  id="edad"
                  type="number"
                  placeholder="Ej: 30"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  required
                />
              </div>

              {/* País */}
              <div className="field-group">
                <label htmlFor="pais">País</label>
                <input
                  id="pais"
                  type="text"
                  placeholder="Ej: Colombia"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  required
                />
              </div>

              {/* Cargo */}
              <div className="field-group">
                <label htmlFor="cargo">Cargo</label>
                <input
                  id="cargo"
                  type="text"
                  placeholder="Ej: Desarrollador"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  required
                />
              </div>

              {/* Años de experiencia */}
              <div className="field-group">
                <label htmlFor="anios">Años de experiencia</label>
                <input
                  id="anios"
                  type="number"
                  placeholder="Ej: 5"
                  value={anios}
                  onChange={(e) => setAnios(e.target.value)}
                  required
                />
              </div>

            </div>

            {/* Acciones del formulario */}
            <div className="form-actions">
              {editIndex !== null && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditIndex(null);
                    setNombre("");
                    setEdad(0);
                    setPais("");
                    setCargo("");
                    setAnios(0);
                  }}
                >
                  Cancelar
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                {editIndex !== null ? "✦ Actualizar" : "✦ Registrar"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Tarjeta de tabla de empleados ── */}
      <div className="card table-card">
        <div className="card-header">
          <div className="card-header-icon">◈</div>
          <h2>Empleados Registrados</h2>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {registros.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <p>No hay empleados registrados aún.</p>
            </div>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>País</th>
                    <th>Cargo</th>
                    <th>Años Exp.</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((reg, idx) => (
                    <tr key={reg.id ?? idx}>
                      <td>{reg.nombre}</td>
                      <td>{reg.edad}</td>
                      <td>{reg.pais}</td>
                      <td>{reg.cargo}</td>
                      <td>{reg.anios}</td>
                      <td>
                        <div className="action-cell">
                          <button
                            className="btn-icon btn-edit"
                            title="Editar"
                            onClick={() => editarRegistro(idx)}
                          >
                            ✎
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            title="Eliminar"
                            onClick={() => eliminarRegistro(idx)}
                          >
                            ✕
                          </button>
                        </div>
                      </td> 
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;