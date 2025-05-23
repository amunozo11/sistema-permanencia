import React, { useState } from "react";

const IntervencionGrupalForm = () => {
  const [formData, setFormData] = useState({
    fecha_solicitud: "",
    nombre_docente_permanencia: "",
    celular_permanencia: "",
    correo_permanencia: "",
    programa_permanencia: "",
    tipo_poblacion: "",
    nombre_docente_asignatura: "",
    celular_docente_asignatura: "",
    correo_docente_asignatura: "",
    programa_docente_asignatura: "",
    asignatura_intervenir: "",
    grupo: "",
    semestre: "",
    numero_estudiantes: "",
    fecha_programada: "",
    hora: "",
    aula: "",
    bloque: "",
    sede: "",
    estado: "",
    tematica_sugerida: "",
    motivo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.estado !== "se hizo" && !formData.motivo.trim()) {
      alert("El campo 'Motivo' es obligatorio si el estado no es 'se hizo'.");
      return;
    }

    try {
      const res = await fetch("https://permanencia.infinityfreeapp.com/solicitud_intervencion_grupal.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });
      alert(res.ok ? "Formulario enviado correctamente." : "Error al enviar formulario.");
    } catch (err) {
      console.error(err);
      alert("Error de conexión.");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Solicitud de Intervención Grupal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "fecha_solicitud", label: "Fecha de Solicitud", type: "date" },
          { name: "nombre_docente_permanencia", label: "Docente de Permanencia", pattern: "[A-Za-zÁÉÍÓÚáéíóúñÑ ]+" },
          { name: "celular_permanencia", label: "Celular Permanencia", pattern: "\\d{10}", maxLength: 10 },
          { name: "correo_permanencia", label: "Correo Permanencia", type: "email" },
          { name: "programa_permanencia", label: "Programa Permanencia", pattern: "[A-Za-zÁÉÍÓÚáéíóúñÑ ]+" },
          { name: "tipo_poblacion", label: "Tipo de Población", pattern: "[A-Za-zÁÉÍÓÚáéíóúñÑ ]+" },
          { name: "nombre_docente_asignatura", label: "Docente de la Asignatura", pattern: "[A-Za-zÁÉÍÓÚáéíóúñÑ ]+" },
          { name: "celular_docente_asignatura", label: "Celular Docente Asignatura", pattern: "\\d{10}", maxLength: 10 },
          { name: "correo_docente_asignatura", label: "Correo Docente Asignatura", type: "email" },
          { name: "programa_docente_asignatura", label: "Programa Docente Asignatura", pattern: "[A-Za-zÁÉÍÓÚáéíóúñÑ ]+" },
          { name: "asignatura_intervenir", label: "Asignatura a Intervenir", pattern: "[A-Za-zÁÉÍÓÚáéíóúñÑ ]+" },
          { name: "grupo", label: "Grupo", type: "number", min: 1 },
          { name: "semestre", label: "Semestre", type: "number", min: 1 },
          { name: "numero_estudiantes", label: "Número de Estudiantes", type: "number", min: 1 },
          { name: "fecha_programada", label: "Fecha Programada", type: "date" },
          { name: "hora", label: "Hora", type: "time" },
          { name: "aula", label: "Aula", pattern: "\\d+" },
          { name: "bloque", label: "Bloque", pattern: "[A-Za-z]", maxLength: 1 },
          { name: "sede", label: "Sede" },
        ].map(({ name, label, type = "text", pattern, maxLength, min }) => (
          <div key={name}>
            <label className="block font-semibold">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              pattern={pattern}
              maxLength={maxLength}
              min={min}
              required
              className="w-full p-2 border"
            />
          </div>
        ))}

        <div>
          <label className="block font-semibold">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          >
            <option value="">Seleccione estado</option>
            <option value="se hizo">Se hizo</option>
            <option value="no se hizo">No se hizo</option>
            <option value="espera">Espera</option>
            <option value="sin disponibilidad de tallerista">Sin disponibilidad de tallerista</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Temática Sugerida (opcional)</label>
          <textarea
            name="tematica_sugerida"
            value={formData.tematica_sugerida}
            onChange={handleChange}
            className="w-full p-2 border"
            maxLength={300}
          />
        </div>

        <div>
          <label className="block font-semibold">Motivo (obligatorio si no se hizo)</label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            className="w-full p-2 border"
            maxLength={300}
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
};

export default IntervencionGrupalForm;
