import React, { useState } from "react";

const IngenieriaSoftwareForm = () => {
  const [solicitud, setSolicitud] = useState({
    docente_tutor: "",
    facultad: "",
    programa: "",
    nombre_asignatura: "",
  });

  const [estudiante, setEstudiante] = useState({
    solicitud_id: 1,
    numero_identificacion: "",
    nombre_estudiante: "",
    correo: "",
    telefono: "",
    semestre: "",
  });

  const handleSolicitudChange = (e) => {
    const { name, value } = e.target;
    setSolicitud((prev) => ({ ...prev, [name]: value }));
  };

  const handleEstudianteChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number" && name === "solicitud_id") {
      const numericValue = parseInt(value, 10);
      if (numericValue >= 1) {
        setEstudiante((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setEstudiante((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSolicitudSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://permanencia.infinityfreeapp.com/ingenieria_software_solicitud.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(solicitud).toString(),
      });
      alert(res.ok ? "Solicitud creada correctamente." : "Error al crear solicitud.");
    } catch (err) {
      console.error(err);
      alert("Error de conexión.");
    }
  };

  const handleEstudianteSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://permanencia.infinityfreeapp.com/ingenieria_software_add_estudiante_solicitud.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(estudiante).toString(),
      });
      alert(res.ok ? "Estudiante asignado correctamente." : "Error al asignar estudiante.");
    } catch (err) {
      console.error(err);
      alert("Error de conexión.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-10">
      <h2 className="text-xl font-bold mb-2">Crear Solicitud de Ingeniería de Software</h2>
      <form onSubmit={handleSolicitudSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Docente Tutor</label>
          <input
            name="docente_tutor"
            value={solicitud.docente_tutor}
            onChange={handleSolicitudChange}
            pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ ]+"
            maxLength={100}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Facultad</label>
          <input
            name="facultad"
            value={solicitud.facultad}
            onChange={handleSolicitudChange}
            pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ ]+"
            maxLength={100}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Programa</label>
          <input
            name="programa"
            value={solicitud.programa}
            onChange={handleSolicitudChange}
            pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ ]+"
            maxLength={100}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Nombre de la Asignatura</label>
          <input
            name="nombre_asignatura"
            value={solicitud.nombre_asignatura}
            onChange={handleSolicitudChange}
            pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ ]+"
            maxLength={100}
            required
            className="w-full p-2 border"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Crear Solicitud
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Asignar Estudiante a Solicitud</h2>
      <form onSubmit={handleEstudianteSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">ID de la Solicitud</label>
          <input
            type="number"
            name="solicitud_id"
            min="1"
            value={estudiante.solicitud_id}
            onChange={handleEstudianteChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Número de Identificación</label>
          <input
            name="numero_identificacion"
            value={estudiante.numero_identificacion}
            onChange={handleEstudianteChange}
            pattern="\d{7,10}"
            maxLength={10}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Nombre del Estudiante</label>
          <input
            name="nombre_estudiante"
            value={estudiante.nombre_estudiante}
            onChange={handleEstudianteChange}
            pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ ]+"
            maxLength={100}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Correo Electrónico</label>
          <input
            type="email"
            name="correo"
            value={estudiante.correo}
            onChange={handleEstudianteChange}
            maxLength={100}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Teléfono</label>
          <input
            name="telefono"
            value={estudiante.telefono}
            onChange={handleEstudianteChange}
            pattern="\d{10}"
            maxLength={10}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Semestre</label>
          <input
            type="number"
            name="semestre"
            min="1"
            max="10"
            value={estudiante.semestre}
            onChange={handleEstudianteChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Asignar Estudiante
        </button>
      </form>
    </div>
  );
};

export default IngenieriaSoftwareForm;
