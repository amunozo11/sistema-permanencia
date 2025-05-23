import React, { useState } from "react";

const RemisionPsicologica = () => {
  const [formData, setFormData] = useState({
    nombre_estudiante: "",
    numero_documento: "",
    programa_academico: "",
    semestre: "",
    motivo_remision: "",
    docente_remite: "",
    correo_docente: "",
    telefono_docente: "",
    fecha: "",
    hora: "",
    tipo_remision: "",
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
        "https://permanencia.infinityfreeapp.com/PostRemisionPsicologica.php",
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
      <h2 className="text-xl font-bold mb-4">Formulario de Remisión Psicológica</h2>
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
            value={formData.semestre}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Motivo de la Remisión</label>
          <textarea
            name="motivo_remision"
            value={formData.motivo_remision}
            onChange={handleChange}
            minLength={10}
            maxLength={300}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Docente que Remite</label>
          <input
            name="docente_remite"
            value={formData.docente_remite}
            onChange={handleChange}
            pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ ]+"
            maxLength={100}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Correo del Docente</label>
          <input
            type="email"
            name="correo_docente"
            value={formData.correo_docente}
            onChange={handleChange}
            maxLength={100}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Teléfono del Docente</label>
          <input
            name="telefono_docente"
            pattern="\d{10}"
            maxLength={10}
            value={formData.telefono_docente}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Hora</label>
          <input
            type="time"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block font-semibold">Tipo de Remisión</label>
          <select
            name="tipo_remision"
            value={formData.tipo_remision}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          >
            <option value="">Seleccione tipo de remisión</option>
            <option value="individual">Individual</option>
            <option value="grupal">Grupal</option>
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

export default RemisionPsicologica;
