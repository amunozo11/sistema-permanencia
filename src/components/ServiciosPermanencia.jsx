import { useState, useRef } from "react"

const programas = [
  "ADMINISTRACIÓN DE EMPRESAS", "ADMINISTRACIÓN DE EMPRESAS TURÍSTICAS Y HOTELERAS", "COMERCIO INTERNACIONAL", 
  "CONTADURÍA PÚBLICA", "DERECHO", "ECONOMÍA", "ENFERMERÍA", "INGENIERÍA AGROINDUSTRIAL",
  "INGENIERIA AMBIENTAL Y SANITARIA", "INGENIERÍA ELECTRÓNICA", "INGENIERÍA DE SISTEMAS", "DERECHO",
  "INSTRUMENTACIÓN QUIRÚRGICA", "LICENCIATURA EN ARTE Y FOLCLOR", "LICENCIATURA EN CIENCIAS NATURALES Y EDUCACIÓN AMBIENTAL",
  "LICENCIATURA EN EDUCACIÓN FISICA, RECREACIÓN Y DEPORTES", "LICENCIATURA EN LENGUA CASTELLANA E INGLÉS", "LICENCIATURA EN MATEMÁTICAS",
  "MICROBIOLOGÍA", "SOCIOLOGÍA"  
]

const tipoDocumentoOpciones = ["CC", "TI", "CE", "Pasaporte"]
const riesgoOpciones = ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"]
const estratoOpciones = [1, 2, 3, 4, 5, 6]
const estadoParticipacionOpciones = ["Activo", "Inactivo", "Finalizado"]
const tipoComidaOpciones = ["Almuerzo"]
const tipoParticipanteOpciones = ["Admitido", "Nuevo", "Media académica"]
const nivelRiesgoSpadiesOpciones = ["Bajo", "Medio", "Alto"]
const motivoIntervencionOpciones = [
  "Problemas familiares", "Dificultades emocionales", "Estrés académico", "Ansiedad / depresión", "Problemas de adaptación", "Otros"
]
const tipoIntervencionOpciones = ["Asesoría", "Taller", "Otro"]

export default function ServiciosPermanencia() {
  const servicios = [
    {
      nombre: "Programa de Orientación Académica (POA)",
      descripcion: "Registro de tutorías y acompañamiento académico.",
      icono: "📚",
      key: "tutoria"
    },
    {
      nombre: "Programa de Orientación Psicosocial (POPS)",
      descripcion: "Registro de atención y seguimiento psicosocial.",
      icono: "🧠",
      key: "psicologia"
    },
    {
      nombre: "Programa de Orientación Vocacional y Adaptación Universitaria (POVAU)",
      descripcion: "Registro de orientación vocacional y seguimiento.",
      icono: "🧑‍🎓",
      key: "vocacional"
    },
    {
      nombre: "Comedor Universitario",
      descripcion: "Registro y seguimiento de beneficiarios del comedor.",
      icono: "🍽️",
      key: "comedor"
    },
  ]

  const [servicioActivo, setServicioActivo] = useState(null)
  const [form, setForm] = useState({})
  const [errores, setErrores] = useState({})

  // Referencias para cada título de formulario
  const tituloRefs = {
    tutoria: useRef(null),
    psicologia: useRef(null),
    vocacional: useRef(null),
    comedor: useRef(null),
  }

  // Función para activar y navegar al título del formulario
  const handleServicioClick = (key) => {
    setServicioActivo(key)
    setTimeout(() => {
      const ref = tituloRefs[key]?.current
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "start" })
        // Opcional: enfocar el título para accesibilidad
        ref.focus && ref.focus()
      }
    }, 100)
  }

  // Validaciones según reglas de la tabla Estudiante y Servicios
  const validar = (key, campos) => {
    const err = {}

    // Validaciones comunes de estudiante
    if (!campos.tipo_documento || !tipoDocumentoOpciones.includes(campos.tipo_documento))
      err.tipo_documento = "Tipo de documento requerido o inválido"
    if (!campos.numero_documento || !/^\d{7,10}$/.test(campos.numero_documento))
      err.numero_documento = "Número de documento requerido (7-10 dígitos numéricos)"
    if (!campos.nombres || !/^[A-ZÁÉÍÓÚÑ ]{2,50}$/.test(campos.nombres))
      err.nombres = "Nombres requeridos (solo mayúsculas y letras)"
    if (!campos.apellidos || !/^[A-ZÁÉÍÓÚÑ ]{2,50}$/.test(campos.apellidos))
      err.apellidos = "Apellidos requeridos (solo mayúsculas y letras)"
    if (!campos.correo || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(campos.correo))
      err.correo = "Correo requerido y válido"
    if (campos.telefono && !/^3\d{9}$/.test(campos.telefono))
      err.telefono = "Teléfono debe ser celular colombiano (3** *** ****)"
    if (campos.direccion && campos.direccion.length > 100)
      err.direccion = "Dirección máxima 100 caracteres"
    if (!campos.programa_academico || !programas.includes(campos.programa_academico))
      err.programa_academico = "Programa requerido y válido"
    if (!campos.semestre || isNaN(campos.semestre) || campos.semestre < 1)
      err.semestre = "Semestre requerido y debe ser mayor o igual a 1"
    if (!campos.riesgo_desercion || !riesgoOpciones.includes(campos.riesgo_desercion))
      err.riesgo_desercion = "Riesgo requerido y válido"
    if (!campos.estrato || !estratoOpciones.includes(Number(campos.estrato)))
      err.estrato = "Estrato requerido (1-6)"

    // Validaciones específicas por servicio
    if (key === "tutoria") {
      if (!campos.fecha_asignacion) err.fecha_asignacion = "Fecha de asignación requerida"
      if (!campos.nivel_riesgo || !riesgoOpciones.includes(campos.nivel_riesgo))
        err.nivel_riesgo = "Nivel de riesgo requerido y válido"
      if (typeof campos.requiere_tutoria === "undefined")
        err.requiere_tutoria = "Indique si requiere tutoría"
    }
    if (key === "psicologia") {
      if (!campos.motivo_intervencion || campos.motivo_intervencion.length < 3)
        err.motivo_intervencion = "Motivo de intervención requerido"
      if (!campos.tipo_intervencion || !tipoIntervencionOpciones.includes(campos.tipo_intervencion))
        err.tipo_intervencion = "Tipo de intervención requerido y válido"
      if (!campos.fecha_atencion)
        err.fecha_atencion = "Fecha de atención requerida"
    }
    if (key === "vocacional") {
      if (!campos.tipo_participante || !tipoParticipanteOpciones.includes(campos.tipo_participante))
        err.tipo_participante = "Tipo de participante requerido y válido"
      if (!campos.riesgo_spadies || !nivelRiesgoSpadiesOpciones.includes(campos.riesgo_spadies))
        err.riesgo_spadies = "Nivel de riesgo SPADIES requerido y válido"
      if (!campos.fecha_ingreso_programa)
        err.fecha_ingreso_programa = "Fecha de ingreso requerida"
    }
    if (key === "comedor") {
      if (!campos.condicion_socioeconomica)
        err.condicion_socioeconomica = "Condición socioeconómica requerida"
      if (!campos.fecha_solicitud)
        err.fecha_solicitud = "Fecha de solicitud requerida"
      if (typeof campos.aprobado === "undefined")
        err.aprobado = "Indique si fue aprobado"
      if (!campos.tipo_comida || !tipoComidaOpciones.includes(campos.tipo_comida))
        err.tipo_comida = "Tipo de comida requerido y válido"
      if (!campos.raciones_asignadas || isNaN(campos.raciones_asignadas) || campos.raciones_asignadas < 1)
        err.raciones_asignadas = "Raciones asignadas debe ser mayor a 0"
    }
    // Puedes agregar validaciones específicas para los otros servicios aquí

    return err
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = (e, key) => {
    e.preventDefault()
    const err = validar(key, form)
    setErrores(err)
    if (Object.keys(err).length === 0) {
      alert("Registro enviado correctamente")
      setForm({})
      setServicioActivo(null)
    }
  }

  // Campos comunes de estudiante
  const renderCamposEstudiante = () => (
    <>
      <label className="block text-xs font-semibold">Tipo de Documento *</label>
      <select className="border p-2 rounded w-full mb-2" name="tipo_documento" value={form.tipo_documento || ""} onChange={handleChange}>
        <option value="">Seleccione...</option>
        {tipoDocumentoOpciones.map(op => <option key={op} value={op}>{op}</option>)}
      </select>
      {errores.tipo_documento && <span className="text-red-500 text-xs">{errores.tipo_documento}</span>}

      <input className="border p-2 rounded w-full mb-2" name="numero_documento" value={form.numero_documento || ""} onChange={handleChange} placeholder="Número de Documento *" maxLength={10} />
      {errores.numero_documento && <span className="text-red-500 text-xs">{errores.numero_documento}</span>}

      <input className="border p-2 rounded w-full mb-2 uppercase" name="nombres" value={form.nombres || ""} onChange={handleChange} placeholder="Nombres *" maxLength={50} />
      {errores.nombres && <span className="text-red-500 text-xs">{errores.nombres}</span>}

      <input className="border p-2 rounded w-full mb-2 uppercase" name="apellidos" value={form.apellidos || ""} onChange={handleChange} placeholder="Apellidos *" maxLength={50} />
      {errores.apellidos && <span className="text-red-500 text-xs">{errores.apellidos}</span>}

      <input className="border p-2 rounded w-full mb-2" name="correo" value={form.correo || ""} onChange={handleChange} placeholder="Correo Electrónico *" maxLength={100} />
      {errores.correo && <span className="text-red-500 text-xs">{errores.correo}</span>}

      <input className="border p-2 rounded w-full mb-2" name="telefono" value={form.telefono || ""} onChange={handleChange} placeholder="Teléfono (opcional)" maxLength={10} />
      {errores.telefono && <span className="text-red-500 text-xs">{errores.telefono}</span>}

      <input className="border p-2 rounded w-full mb-2" name="direccion" value={form.direccion || ""} onChange={handleChange} placeholder="Dirección (opcional)" maxLength={100} />
      {errores.direccion && <span className="text-red-500 text-xs">{errores.direccion}</span>}

      <label className="block text-xs font-semibold">Programa Académico *</label>
      <select className="border p-2 rounded w-full mb-2" name="programa_academico" value={form.programa_academico || ""} onChange={handleChange}>
        <option value="">Seleccione...</option>
        {programas.map(op => <option key={op} value={op}>{op}</option>)}
      </select>
      {errores.programa_academico && <span className="text-red-500 text-xs">{errores.programa_academico}</span>}

      <input className="border p-2 rounded w-full mb-2" name="semestre" value={form.semestre || ""} onChange={handleChange} placeholder="Semestre Actual *" type="number" min={1} max={20} />
      {errores.semestre && <span className="text-red-500 text-xs">{errores.semestre}</span>}

      <label className="block text-xs font-semibold">Riesgo de Deserción *</label>
      <select className="border p-2 rounded w-full mb-2" name="riesgo_desercion" value={form.riesgo_desercion || ""} onChange={handleChange}>
        <option value="">Seleccione...</option>
        {riesgoOpciones.map(op => <option key={op} value={op}>{op}</option>)}
      </select>
      {errores.riesgo_desercion && <span className="text-red-500 text-xs">{errores.riesgo_desercion}</span>}

      <label className="block text-xs font-semibold">Estrato *</label>
      <select className="border p-2 rounded w-full mb-2" name="estrato" value={form.estrato || ""} onChange={handleChange}>
        <option value="">Seleccione...</option>
        {estratoOpciones.map(op => <option key={op} value={op}>{op}</option>)}
      </select>
      {errores.estrato && <span className="text-red-500 text-xs">{errores.estrato}</span>}
    </>
  )

  const renderFormulario = (key) => {
    switch (key) {
      case "tutoria":
        return (
          <form
            className="bg-gray-50 p-4 rounded-xl shadow mt-4"
            onSubmit={e => handleSubmit(e, key)}
          >
            <h4
              className="font-semibold mb-2"
              id="titulo-tutoria"
              tabIndex={-1}
              ref={tituloRefs.tutoria}
            >
              Registro de Tutoría Académica (POA)
            </h4>
            {renderCamposEstudiante()}
            <label className="block text-xs font-semibold">Nivel de Riesgo *</label>
            <select className="border p-2 rounded w-full mb-2" name="nivel_riesgo" value={form.nivel_riesgo || ""} onChange={handleChange}>
              <option value="">Seleccione...</option>
              {riesgoOpciones.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
            {errores.nivel_riesgo && <span className="text-red-500 text-xs">{errores.nivel_riesgo}</span>}

            <label className="block text-xs font-semibold">¿Requiere Tutoría? *</label>
            <input type="checkbox" name="requiere_tutoria" checked={form.requiere_tutoria || false} onChange={handleChange} className="mr-2" /> Sí
            {errores.requiere_tutoria && <span className="text-red-500 text-xs block">{errores.requiere_tutoria}</span>}

            <label className="block text-xs font-semibold mt-2">Fecha de Asignación *</label>
            <input className="border p-2 rounded w-full mb-2" name="fecha_asignacion" value={form.fecha_asignacion || ""} onChange={handleChange} type="date" />
            {errores.fecha_asignacion && <span className="text-red-500 text-xs">{errores.fecha_asignacion}</span>}

            <textarea className="border p-2 rounded w-full mb-2" name="acciones_apoyo" value={form.acciones_apoyo || ""} onChange={handleChange} placeholder="Acciones de Apoyo (opcional)" maxLength={255} />
            <button className="bg-institucional-verde2 text-white px-4 py-2 rounded">Registrar</button>
          </form>
        )
      case "psicologia":
        return (
          <form
            className="bg-gray-50 p-4 rounded-xl shadow mt-4"
            onSubmit={e => handleSubmit(e, key)}
          >
            <h4
              className="font-semibold mb-2"
              id="titulo-psicologia"
              tabIndex={-1}
              ref={tituloRefs.psicologia}
            >
              Registro de Asesoría Psicológica (POPS)
            </h4>
            {renderCamposEstudiante()}
            <label className="block text-xs font-semibold">Motivo de Intervención *</label>
            <select className="border p-2 rounded w-full mb-2" name="motivo_intervencion" value={form.motivo_intervencion || ""} onChange={handleChange}>
              <option value="">Seleccione...</option>
              {motivoIntervencionOpciones.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
            {errores.motivo_intervencion && <span className="text-red-500 text-xs">{errores.motivo_intervencion}</span>}

            <label className="block text-xs font-semibold">Tipo de Intervención *</label>
            <select className="border p-2 rounded w-full mb-2" name="tipo_intervencion" value={form.tipo_intervencion || ""} onChange={handleChange}>
              <option value="">Seleccione...</option>
              {tipoIntervencionOpciones.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
            {errores.tipo_intervencion && <span className="text-red-500 text-xs">{errores.tipo_intervencion}</span>}

            <label className="block text-xs font-semibold">Fecha de Atención *</label>
            <input className="border p-2 rounded w-full mb-2" name="fecha_atencion" value={form.fecha_atencion || ""} onChange={handleChange} type="date" />
            {errores.fecha_atencion && <span className="text-red-500 text-xs">{errores.fecha_atencion}</span>}

            <textarea className="border p-2 rounded w-full mb-2" name="seguimiento" value={form.seguimiento || ""} onChange={handleChange} placeholder="Seguimiento (opcional)" maxLength={255} />
            <button className="bg-institucional-verde2 text-white px-4 py-2 rounded">Registrar</button>
          </form>
        )
      case "vocacional":
        return (
          <form
            className="bg-gray-50 p-4 rounded-xl shadow mt-4"
            onSubmit={e => handleSubmit(e, key)}
          >
            <h4
              className="font-semibold mb-2"
              id="titulo-vocacional"
              tabIndex={-1}
              ref={tituloRefs.vocacional}
            >
              Registro de Orientación Vocacional (POVAU)
            </h4>
            {renderCamposEstudiante()}
            <label className="block text-xs font-semibold">Tipo de Participante *</label>
            <select className="border p-2 rounded w-full mb-2" name="tipo_participante" value={form.tipo_participante || ""} onChange={handleChange}>
              <option value="">Seleccione...</option>
              {tipoParticipanteOpciones.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
            {errores.tipo_participante && <span className="text-red-500 text-xs">{errores.tipo_participante}</span>}

            <label className="block text-xs font-semibold">Nivel de Riesgo SPADIES *</label>
            <select className="border p-2 rounded w-full mb-2" name="riesgo_spadies" value={form.riesgo_spadies || ""} onChange={handleChange}>
              <option value="">Seleccione...</option>
              {nivelRiesgoSpadiesOpciones.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
            {errores.riesgo_spadies && <span className="text-red-500 text-xs">{errores.riesgo_spadies}</span>}

            <label className="block text-xs font-semibold">Fecha de Ingreso *</label>
            <input className="border p-2 rounded w-full mb-2" name="fecha_ingreso_programa" value={form.fecha_ingreso_programa || ""} onChange={handleChange} type="date" />
            {errores.fecha_ingreso_programa && <span className="text-red-500 text-xs">{errores.fecha_ingreso_programa}</span>}

            <textarea className="border p-2 rounded w-full mb-2" name="observaciones" value={form.observaciones || ""} onChange={handleChange} placeholder="Observaciones (opcional)" maxLength={255} />
            <button className="bg-institucional-verde2 text-white px-4 py-2 rounded">Registrar</button>
          </form>
        )
      case "comedor":
        return (
          <form
            className="bg-gray-50 p-4 rounded-xl shadow mt-4"
            onSubmit={e => handleSubmit(e, key)}
          >
            <h4
              className="font-semibold mb-2"
              id="titulo-comedor"
              tabIndex={-1}
              ref={tituloRefs.comedor}
            >
              Registro de Comedor Universitario
            </h4>
            {renderCamposEstudiante()}
            <input className="border p-2 rounded w-full mb-2" name="condicion_socioeconomica" value={form.condicion_socioeconomica || ""} onChange={handleChange} placeholder="Condición Socioeconómica *" maxLength={100} />
            {errores.condicion_socioeconomica && <span className="text-red-500 text-xs">{errores.condicion_socioeconomica}</span>}

            <label className="block text-xs font-semibold">Fecha de Solicitud *</label>
            <input className="border p-2 rounded w-full mb-2" name="fecha_solicitud" value={form.fecha_solicitud || ""} onChange={handleChange} type="date" />
            {errores.fecha_solicitud && <span className="text-red-500 text-xs">{errores.fecha_solicitud}</span>}

            <label className="block text-xs font-semibold">¿Aprobado? *</label>
            <input type="checkbox" name="aprobado" checked={form.aprobado || false} onChange={handleChange} className="mr-2" /> Sí
            {errores.aprobado && <span className="text-red-500 text-xs block">{errores.aprobado}</span>}

            <label className="block text-xs font-semibold">Tipo de Comida *</label>
            <select className="border p-2 rounded w-full mb-2" name="tipo_comida" value={form.tipo_comida || ""} onChange={handleChange}>
              <option value="">Seleccione...</option>
              {tipoComidaOpciones.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
            {errores.tipo_comida && <span className="text-red-500 text-xs">{errores.tipo_comida}</span>}

            <input className="border p-2 rounded w-full mb-2" name="raciones_asignadas" value={form.raciones_asignadas || ""} onChange={handleChange} type="number" min={1} placeholder="Raciones Asignadas *" />
            {errores.raciones_asignadas && <span className="text-red-500 text-xs">{errores.raciones_asignadas}</span>}

            <textarea className="border p-2 rounded w-full mb-2" name="observaciones" value={form.observaciones || ""} onChange={handleChange} placeholder="Observaciones (opcional)" maxLength={255} />
            <button className="bg-institucional-verde2 text-white px-4 py-2 rounded">Registrar</button>
          </form>
        )
      default:
        return (
          <div className="bg-gray-50 p-4 rounded-xl shadow mt-4 text-gray-500">
            Formulario en construcción para este servicio.
          </div>
        )
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mt-8">
      <h3 className="text-2xl font-semibold mb-6 text-institucional-verde1">Servicios de Permanencia Estudiantil</h3>
      <div className="flex flex-col gap-2">
        {servicios.map((servicio) => (
          <div key={servicio.key} className="border border-gray-200 rounded-lg">
            <button
              className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-colors rounded-lg focus:outline-none ${
                servicioActivo === servicio.key
                  ? "bg-institucional-verde2 text-white"
                  : "bg-white hover:bg-institucional-verde1/10 text-institucional-verde2"
              }`}
              onClick={() => handleServicioClick(servicio.key)}
            >
              <span className="text-2xl">{servicio.icono}</span>
              <span className="font-medium">{servicio.nombre}</span>
              <span className="ml-2 text-sm text-gray-500">{servicio.descripcion}</span>
            </button>
            {servicioActivo === servicio.key && (
              <div className="px-6 pb-6">{renderFormulario(servicio.key)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
