import { useState } from "react";

const AgregarEstudianteSolicitud = () => {
  const [formData, setFormData] = useState({
    solicitud_id: "",
    numero_identificacion: "",
    nombre_estudiante: "",
    correo: "",
    telefono: "",
    semestre: "",
  });

  const [errorInput, setErrorInput] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (["solicitud_id", "numero_identificacion", "telefono", "semestre"].includes(name)) {
      filteredValue = value.replace(/[^0-9]/g, "");
    } else if (name === "nombre_estudiante") {
      filteredValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: filteredValue,
    }));
  };

  const validar = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.solicitud_id.trim()) {
      setErrorInput("solicitud_id");
      return "El ID de la solicitud es obligatorio y debe ser un número.";
    }
    if (!formData.numero_identificacion.trim() || !/^\d{7,10}$/.test(formData.numero_identificacion)) {
      setErrorInput("numero_identificacion");
      return "Número de identificación solo debe contener números y tener entre 7 y 10 dígitos.";
    }
    if (!formData.nombre_estudiante.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.nombre_estudiante)) {
      setErrorInput("nombre_estudiante");
      return "Nombre del estudiante solo debe contener letras y espacios.";
    }
    if (!formData.correo.trim() || !emailRegex.test(formData.correo)) {
      setErrorInput("correo");
      return "Correo electrónico inválido.";
    }
    if (!formData.telefono.trim() || !/^3\d{9}$/.test(formData.telefono)) {
      setErrorInput("telefono");
      return "Teléfono inválido. Debe comenzar con 3 y tener 10 dígitos.";
    }
    const semestre = parseInt(formData.semestre);
    if (!semestre || semestre < 1) {
      setErrorInput("semestre");
      return "El semestre debe ser un número entero mayor o igual a 1.";
    }

    setErrorInput("");
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validar();
    if (error) {
      setMensaje(`❌ ${error}`);
      return;
    }

    try {
      const res = await fetch("https://permanencia.infinityfreeapp.com/ingenieria_software_add_estudiante_solicitud.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (res.ok) {
        setMensaje("✅ Datos del estudiante enviados correctamente.");
        setFormData({
          solicitud_id: "",
          numero_identificacion: "",
          nombre_estudiante: "",
          correo: "",
          telefono: "",
          semestre: "",
        });
      } else {
        setMensaje("❌ Error al enviar los datos. Inténtalo de nuevo.");
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error de conexión con el servidor.");
    }
  };

  const getInputClass = (name) =>
    `px-4 py-2 border rounded-md text-base ${
      name === errorInput ? "border-red-500 bg-red-50" : "border-green-200"
    }`;

  return (
    <div className="flex items-center w-full min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="mx-auto p-8 bg-green-50 border-2 border-green-500 rounded-2xl shadow-md font-sans max-md:w-full max-md:m-8 max-xl:w-2/3 w-1/2"
        noValidate
      >
        <img
        className="w-28 mx-auto mb-4"
        src="/logo-upc.png"
        alt="Logo UPC"
      />
      
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
          Agregar Estudiante a Solicitud
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {[
            { name: "solicitud_id", label: "ID de la Solicitud" },
            { name: "numero_identificacion", label: "Número de Identificación" },
            { name: "nombre_estudiante", label: "Nombre del Estudiante" },
            { name: "correo", label: "Correo Electrónico" },
            { name: "telefono", label: "Teléfono" },
            { name: "semestre", label: "Semestre" },
          ].map(({ name, label }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="font-semibold text-green-700 mb-1">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type="text"
                value={formData[name]}
                onChange={handleChange}
                className={getInputClass(name)}
                autoComplete="off"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-md transition duration-300"
        >
          Enviar Datos del Estudiante
        </button>

        {mensaje && (
          <p className="mt-4 text-center font-semibold text-green-900">{mensaje}</p>
        )}
      </form>
    </div>
  );
};

export default AgregarEstudianteSolicitud;
