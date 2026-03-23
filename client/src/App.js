
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

  const[cargarEmpleados = async () => {
    try {
      const response = await fetch('http://localhost:3001/empleados');
      const data = await response.json();
      setRegistros(data)
    } catch(error) {
      alert('Error al cargar los empleados');
    }
  }]

  //Función para registrar datos

  const registrarDatos = async(e) => {
    e.preventDefault();

    if (editIndex !== null) {

      //Acctualizar empleado existente

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
          alert('Error al guardad el empleado');
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
    const reg = registros[idx];
    try {
        const empleado = registros[idx];
        const response = await fetch(`http://localhost:3001/empleados/${empleado.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setRegistros(registros.filter((_, i) => i !== idx));
          if(editIndex == idx) {
            setEditIndex(null);
            setNombre("");
            setEdad(0);
            setPais("");
            setCargo("");
            setAnios(0);
          }
          alert('Empleado actualizado correctamente');
        } else {
          alert('Error al actualizar el empleado');
        }

      } catch (error) {
        alert('Error de conexión al actualizar');
      }
  }


  return ();
}

export default App;
