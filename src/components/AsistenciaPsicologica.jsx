import React, { useState } from "react";

const AsistenciaPsicologica = () => {
  const [formData, setFormData] = useState({
    nombre_estudiante: "",
    numero_documento: "",
    programa_academico: "",
    semestre: "",
    nombre_actividad: "",
    modalidad: "",
    tipo_actividad: "",
    fecha_actividad: "",
    hora_inicio: "",
    hora_fin: "",
    modalidad_registro: "",
    observaciones: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "/api/PostRemisionPsicologica.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formData).toString(),
        }
      );

      if (res.ok) {
        alert("Formulario enviado exitosamente.");
        setFormData({});
      } else {
        alert("Error al enviar el formulario.");
      }
    } catch (error) {
      alert("Error de conexión.");
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Formulario de Asistencia a Actividad Psicológica</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nombre del Estudiante</label>
          <input
            name="nombre_estudiante"
            value={formData.nombre_estudiante}
            onChange={handleChange}
            pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ ]+"
            maxLength={100}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Número de Documento</label>
          <input
            name="numero_documento"
            value={formData.numero_documento}
            onChange={handleChange}
            pattern="\d{7,10}"
            maxLength={10}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Programa Académico</label>
          <input
            name="programa_academico"
            value={formData.programa_academico}
            onChange={handleChange}
            pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ ]+"
            maxLength={100}
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
            value={formData.semestre}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Nombre de la Actividad</label>
          <input
            name="nombre_actividad"
            value={formData.nombre_actividad}
            onChange={handleChange}
            maxLength={150}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Modalidad</label>
          <select
            name="modalidad"
            value={formData.modalidad}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          >
            <option value="">Seleccione modalidad</option>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
            <option value="híbrida">Híbrida</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Tipo de Actividad</label>
          <input
            name="tipo_actividad"
            value={formData.tipo_actividad}
            onChange={handleChange}
            maxLength={100}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Fecha de la Actividad</label>
          <input
            type="date"
            name="fecha_actividad"
            value={formData.fecha_actividad}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Hora de Inicio</label>
          <input
            type="time"
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Hora de Finalización</label>
          <input
            type="time"
            name="hora_fin"
            value={formData.hora_fin}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Modalidad de Registro</label>
          <select
            name="modalidad_registro"
            value={formData.modalidad_registro}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          >
            <option value="">Seleccione modalidad de registro</option>
            <option value="manual">Manual</option>
            <option value="digital">Digital</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Observaciones (opcional)</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            maxLength={300}
            className="w-full p-2 border"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default AsistenciaPsicologica;
