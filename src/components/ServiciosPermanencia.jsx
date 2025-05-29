"use client"

import { useState } from "react"
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  GraduationCap,
  Brain,
  DollarSign,
  Compass,
  Clock,
  BarChart3,
  Utensils,
} from "lucide-react"

const programas = [
  "ADMINISTRACIÓN DE EMPRESAS",
  "ADMINISTRACIÓN DE EMPRESAS TURÍSTICAS Y HOTELERAS",
  "COMERCIO INTERNACIONAL",
  "CONTADURÍA PÚBLICA",
  "DERECHO",
  "ECONOMÍA",
  "ENFERMERÍA",
  "INGENIERÍA AGROINDUSTRIAL",
  "INGENIERIA AMBIENTAL Y SANITARIA",
  "INGENIERÍA ELECTRÓNICA",
  "INGENIERÍA DE SISTEMAS",
  "INSTRUMENTACIÓN QUIRÚRGICA",
  "LICENCIATURA EN ARTE Y FOLCLOR",
  "LICENCIATURA EN CIENCIAS NATURALES Y EDUCACIÓN AMBIENTAL",
  "LICENCIATURA EN EDUCACIÓN FISICA, RECREACIÓN Y DEPORTES",
  "LICENCIATURA EN LENGUA CASTELLANA E INGLÉS",
  "LICENCIATURA EN MATEMÁTICAS",
  "MICROBIOLOGÍA",
  "SOCIOLOGÍA",
]

const tipoDocumentoOpciones = ["CC", "TI", "CE", "Pasaporte"]
const riesgoOpciones = ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"]
const estratoOpciones = [1, 2, 3, 4, 5, 6]
const estadoParticipacionOpciones = ["Activo", "Inactivo", "Finalizado"]
const tipoComidaOpciones = ["Almuerzo"]
const tipoParticipanteOpciones = ["Admitido", "Nuevo", "Media académica"]
const nivelRiesgoSpadiesOpciones = ["Bajo", "Medio", "Alto"]
const motivoIntervencionOpciones = [
  "Problemas familiares",
  "Dificultades emocionales",
  "Estrés académico",
  "Ansiedad / depresión",
  "Problemas de adaptación",
  "Otros",
]
const tipoIntervencionOpciones = ["Asesoría", "Taller", "Otro"]

export default function ServiciosPermanencia() {
  const servicios = [
    {
      nombre: "Programa de Orientación Académica (POA)",
      descripcion: "Registro de tutorías y acompañamiento académico.",
      icono: <GraduationCap className="w-8 h-8" />,
      key: "tutoria",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      nombre: "Programa de Orientación Psicosocial (POPS)",
      descripcion: "Registro de atención y seguimiento psicosocial.",
      icono: <Brain className="w-8 h-8" />,
      key: "psicologia",
      color: "from-blue-500 to-blue-600",
    },
    {
      nombre: "Apoyo Socioeconómico",
      descripcion: "Registro de apoyos económicos y becas.",
      icono: <DollarSign className="w-8 h-8" />,
      key: "apoyo",
      color: "from-purple-500 to-purple-600",
    },
    {
      nombre: "Programa de Orientación Vocacional (POVAU)",
      descripcion: "Registro de orientación vocacional y seguimiento.",
      icono: <Compass className="w-8 h-8" />,
      key: "vocacional",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      nombre: "Talleres de Habilidades",
      descripcion: "Registro de talleres y actividades de desarrollo.",
      icono: <Clock className="w-8 h-8" />,
      key: "talleres",
      color: "from-orange-500 to-orange-600",
    },
    {
      nombre: "Seguimiento Académico",
      descripcion: "Registro de seguimiento y evaluación académica.",
      icono: <BarChart3 className="w-8 h-8" />,
      key: "seguimiento",
      color: "from-teal-500 to-teal-600",
    },
    {
      nombre: "Comedor Universitario",
      descripcion: "Registro y seguimiento de beneficiarios del comedor.",
      icono: <Utensils className="w-8 h-8" />,
      key: "comedor",
      color: "from-amber-500 to-amber-600",
    },
  ]

  const [servicioActivo, setServicioActivo] = useState(null)
  const [form, setForm] = useState({})
  const [errores, setErrores] = useState({})
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })

  // Configuración de la API con opciones de fallback
  const BASE_API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001"

  // Función para intentar diferentes combinaciones de URL y prefijos
  const tryApiUrls = async (key, formData) => {
    const urlConfigs = [
      { url: BASE_API_URL, prefix: "" },
      { url: BASE_API_URL, prefix: "/api" },
      { url: "http://localhost:8001", prefix: "" },
      { url: "http://localhost:8001", prefix: "/api" },
      { url: "http://127.0.0.1:8000", prefix: "" },
      { url: "http://127.0.0.1:8000", prefix: "/api" },
    ]

    const serviceEndpoints = {
      tutoria: "/tutoria",
      psicologia: "/psicologia",
      apoyo: "/socioeconomico",
      vocacional: "/vocacional",
      talleres: "/talleres",
      seguimiento: "/seguimiento",
      comedor: "/comedor",
    }

    const endpoint = serviceEndpoints[key]
    if (!endpoint) {
      throw new Error("Servicio no configurado para API")
    }

    for (const config of urlConfigs) {
      const fullUrl = `${config.url}${config.prefix}${endpoint}`
      console.log(`Intentando conectar a: ${fullUrl}`)

      try {
        const response = await fetch(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        console.log(`Estado de la respuesta (${fullUrl}):`, response.status, response.statusText)

        if (response.status !== 404) {
          console.log(`Configuración exitosa encontrada: ${fullUrl}`)
          localStorage.setItem("api_url_config", JSON.stringify(config))

          let data
          const contentType = response.headers.get("content-type")

          if (contentType && contentType.includes("application/json")) {
            data = await response.json()
            console.log("Respuesta del servidor (JSON):", data)
          } else {
            const text = await response.text()
            console.log("Respuesta del servidor (texto):", text)
            try {
              data = JSON.parse(text)
            } catch (e) {
              data = { message: text || "Respuesta no disponible" }
            }
          }

          return { success: response.ok, data, config }
        }
      } catch (error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          console.log(`No se pudo conectar a ${fullUrl}:`, error.message)
        } else if (error.message.includes("Error HTTP")) {
          throw error
        }
      }
    }

    throw new Error("No se pudo conectar al servidor. Por favor, verifica que el backend esté en ejecución.")
  }

  // Validaciones según reglas de la tabla Estudiante y Servicios
  const validar = (key, campos) => {
    const err = {}

    // Validaciones comunes de estudiante
    if (!campos.tipo_documento || !tipoDocumentoOpciones.includes(campos.tipo_documento))
      err.tipo_documento = "Tipo de documento requerido o inválido"
    if (!campos.numero_documento1 || !/^\d{7,10}$/.test(campos.numero_documento1))
      err.numero_documento1 = "Número de documento requerido (7-10 dígitos numéricos)"
    if (!campos.nombres || !/^[A-ZÁÉÍÓÚÑ ]{2,50}$/.test(campos.nombres))
      err.nombres = "Nombres requeridos (solo mayúsculas y letras)"
    if (!campos.apellidos || !/^[A-ZÁÉÍÓÚÑ ]{2,50}$/.test(campos.apellidos))
      err.apellidos = "Apellidos requeridos (solo mayúsculas y letras)"
    if (!campos.correo1 || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(campos.correo1))
      err.correo1 = "Correo requerido y válido"
    if (campos.telefono && !/^3\d{9}$/.test(campos.telefono))
      err.telefono = "Teléfono debe ser celular colombiano (3** *** ****)"
    if (campos.direccion && campos.direccion.length > 100) err.direccion = "Dirección máxima 100 caracteres"
    if (!campos.programa_academico || !programas.includes(campos.programa_academico))
      err.programa_academico = "Programa requerido y válido"
    if (!campos.semestre || isNaN(campos.semestre) || campos.semestre < 1)
      err.semestre = "Semestre requerido y debe ser mayor o igual a 1"
    if (!campos.riesgo_desercion || !riesgoOpciones.includes(campos.riesgo_desercion))
      err.riesgo_desercion = "Riesgo requerido y válido"
    if (!campos.estrato || !estratoOpciones.includes(Number(campos.estrato))) err.estrato = "Estrato requerido (1-6)"

    // Validaciones específicas por servicio
    if (key === "tutoria") {
      if (!campos.fecha_asignacion) err.fecha_asignacion = "Fecha de asignación requerida"
      if (!campos.nivel_riesgo || !riesgoOpciones.includes(campos.nivel_riesgo))
        err.nivel_riesgo = "Nivel de riesgo requerido y válido"
    }
    if (key === "psicologia") {
      if (!campos.motivo_intervencion || !motivoIntervencionOpciones.includes(campos.motivo_intervencion))
        err.motivo_intervencion = "Motivo de intervención requerido"
      if (!campos.tipo_intervencion || !tipoIntervencionOpciones.includes(campos.tipo_intervencion))
        err.tipo_intervencion = "Tipo de intervención requerido y válido"
      if (!campos.fecha_atencion) err.fecha_atencion = "Fecha de atención requerida"
    }
    if (key === "vocacional") {
      if (!campos.tipo_participante || !tipoParticipanteOpciones.includes(campos.tipo_participante))
        err.tipo_participante = "Tipo de participante requerido y válido"
      if (!campos.riesgo_spadies || !nivelRiesgoSpadiesOpciones.includes(campos.riesgo_spadies))
        err.riesgo_spadies = "Nivel de riesgo SPADIES requerido y válido"
      if (!campos.fecha_ingreso_programa) err.fecha_ingreso_programa = "Fecha de ingreso requerida"
    }
    if (key === "comedor") {
      if (!campos.condicion_socioeconomica) err.condicion_socioeconomica = "Condición socioeconómica requerida"
      if (!campos.fecha_solicitud) err.fecha_solicitud = "Fecha de solicitud requerida"
      if (!campos.tipo_comida || !tipoComidaOpciones.includes(campos.tipo_comida))
        err.tipo_comida = "Tipo de comida requerido y válido"
      if (!campos.raciones_asignadas || isNaN(campos.raciones_asignadas) || campos.raciones_asignadas < 1)
        err.raciones_asignadas = "Raciones asignadas debe ser mayor a 0"
    }

    return err
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = async (e, key) => {
    e.preventDefault()
    const err = validar(key, form)
    setErrores(err)

    if (Object.keys(err).length === 0) {
      setLoading(true)
      setMensaje({ tipo: "", texto: "" })

      try {
        const formData = { ...form }

        // Asegurar que semestre sea un número
        if (formData.semestre) {
          formData.semestre = Number.parseInt(formData.semestre, 10)
        } else {
          formData.semestre = 1
        }

        // Asegurar que estrato sea un número
        if (formData.estrato) {
          formData.estrato = Number.parseInt(formData.estrato, 10)
        } else {
          formData.estrato = 1
        }

        // Procesamiento específico por tipo de servicio
        if (key === "comedor") {
          if (formData.raciones_asignadas) {
            formData.raciones_asignadas = Number.parseInt(formData.raciones_asignadas, 10)
          } else {
            formData.raciones_asignadas = 1
          }

          formData.aprobado = Boolean(formData.aprobado)

          if (!formData.fecha_solicitud) {
            formData.fecha_solicitud = new Date().toISOString().split("T")[0]
          }

          if (!formData.condicion_socioeconomica) {
            formData.condicion_socioeconomica = "Estudiante regular"
          }

          if (!formData.tipo_comida) {
            formData.tipo_comida = "Almuerzo"
          }

          if (!formData.riesgo_desercion) {
            formData.riesgo_desercion = "Bajo"
          }
        } else if (key === "tutoria") {
          if (!formData.nivel_riesgo) formData.nivel_riesgo = "Bajo"
          if (formData.requiere_tutoria === undefined) formData.requiere_tutoria = true
          if (!formData.fecha_asignacion) formData.fecha_asignacion = new Date().toISOString().split("T")[0]
        } else if (key === "psicologia") {
          if (!formData.motivo_intervencion) formData.motivo_intervencion = "Otros"
          if (!formData.tipo_intervencion) formData.tipo_intervencion = "Asesoría"
          if (!formData.fecha_atencion) formData.fecha_atencion = new Date().toISOString().split("T")[0]
        } else if (key === "vocacional") {
          if (!formData.tipo_participante) formData.tipo_participante = "Nuevo"
          if (!formData.riesgo_spadies) formData.riesgo_spadies = "Bajo"
          if (!formData.fecha_ingreso_programa) formData.fecha_ingreso_programa = new Date().toISOString().split("T")[0]
        }

        if (!formData.tipo_documento) formData.tipo_documento = "CC"
        if (!formData.programa_academico) formData.programa_academico = programas[0]

        console.log(`Enviando datos para el servicio '${key}':`, formData)

        const result = await tryApiUrls(key, formData)
        const data = result.data

        if (result.success && data.success) {
          setMensaje({
            tipo: "success",
            texto: data.message || "Registro enviado correctamente",
          })
          setTimeout(() => {
            setForm({})
            setServicioActivo(null)
            setMensaje({ tipo: "", texto: "" })
          }, 2000)
        } else {
          if (data.error === "Datos inválidos" && data.message) {
            const erroresBackend = {}

            if (typeof data.message === "object") {
              Object.keys(data.message).forEach((campo) => {
                erroresBackend[campo] = data.message[campo]
              })
              setErrores((prevErrores) => ({ ...prevErrores, ...erroresBackend }))

              const primerCampo = Object.keys(data.message)[0]
              const primerError = data.message[primerCampo]
              setMensaje({
                tipo: "error",
                texto: `Error en ${primerCampo}: ${primerError}`,
              })
            } else {
              setMensaje({
                tipo: "error",
                texto: data.message || "Error al enviar el registro",
              })
            }
          } else {
            setMensaje({
              tipo: "error",
              texto: data.message || data.detail || "Error al enviar el registro",
            })
          }
        }
      } catch (error) {
        console.error("Error al enviar datos:", error)
        setMensaje({
          tipo: "error",
          texto: error.message || "Error al conectar con el servidor",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  // Campos comunes de estudiante
  const renderCamposEstudiante = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Documento <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.tipo_documento ? "border-red-500" : "border-gray-300"}`}
            name="tipo_documento"
            value={form.tipo_documento || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione...</option>
            {tipoDocumentoOpciones.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
          {errores.tipo_documento && <span className="text-red-500 text-xs mt-1">{errores.tipo_documento}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Documento <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.numero_documento1 ? "border-red-500" : "border-gray-300"}`}
            name="numero_documento1"
            value={form.numero_documento1 || ""}
            onChange={handleChange}
            placeholder="Número de Documento"
            maxLength={10}
          />
          {errores.numero_documento1 && <span className="text-red-500 text-xs mt-1">{errores.numero_documento1}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombres <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase ${errores.nombres ? "border-red-500" : "border-gray-300"}`}
            name="nombres"
            value={form.nombres || ""}
            onChange={handleChange}
            placeholder="Nombres"
            maxLength={50}
          />
          {errores.nombres && <span className="text-red-500 text-xs mt-1">{errores.nombres}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellidos <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase ${errores.apellidos ? "border-red-500" : "border-gray-300"}`}
            name="apellidos"
            value={form.apellidos || ""}
            onChange={handleChange}
            placeholder="Apellidos"
            maxLength={50}
          />
          {errores.apellidos && <span className="text-red-500 text-xs mt-1">{errores.apellidos}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.correo1 ? "border-red-500" : "border-gray-300"}`}
            name="correo1"
            value={form.correo1 || ""}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            maxLength={100}
          />
          {errores.correo1 && <span className="text-red-500 text-xs mt-1">{errores.correo1}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.telefono ? "border-red-500" : "border-gray-300"}`}
            name="telefono"
            value={form.telefono || ""}
            onChange={handleChange}
            placeholder="3XX XXX XXXX"
            maxLength={10}
          />
          {errores.telefono && <span className="text-red-500 text-xs mt-1">{errores.telefono}</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
        <input
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.direccion ? "border-red-500" : "border-gray-300"}`}
          name="direccion"
          value={form.direccion || ""}
          onChange={handleChange}
          placeholder="Dirección de residencia"
          maxLength={100}
        />
        {errores.direccion && <span className="text-red-500 text-xs mt-1">{errores.direccion}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Programa Académico <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.programa_academico ? "border-red-500" : "border-gray-300"}`}
            name="programa_academico"
            value={form.programa_academico || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione...</option>
            {programas.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
          {errores.programa_academico && (
            <span className="text-red-500 text-xs mt-1">{errores.programa_academico}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semestre <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.semestre ? "border-red-500" : "border-gray-300"}`}
            name="semestre"
            value={form.semestre || ""}
            onChange={handleChange}
            placeholder="Semestre Actual"
            type="number"
            min={1}
            max={20}
          />
          {errores.semestre && <span className="text-red-500 text-xs mt-1">{errores.semestre}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Riesgo de Deserción <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.riesgo_desercion ? "border-red-500" : "border-gray-300"}`}
            name="riesgo_desercion"
            value={form.riesgo_desercion || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione...</option>
            {riesgoOpciones.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
          {errores.riesgo_desercion && <span className="text-red-500 text-xs mt-1">{errores.riesgo_desercion}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estrato <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.estrato ? "border-red-500" : "border-gray-300"}`}
            name="estrato"
            value={form.estrato || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione...</option>
            {estratoOpciones.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
          {errores.estrato && <span className="text-red-500 text-xs mt-1">{errores.estrato}</span>}
        </div>
      </div>
    </div>
  )

  const renderFormulario = (key) => {
    const servicio = servicios.find((s) => s.key === key)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className={`bg-gradient-to-r ${servicio.color} p-6 text-white rounded-t-xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {servicio.icono}
                <h3 className="text-xl font-bold">{servicio.nombre}</h3>
              </div>
              <button onClick={() => setServicioActivo(null)} className="text-white hover:text-gray-200 text-2xl">
                ×
              </button>
            </div>
            <p className="mt-2 opacity-90">{servicio.descripcion}</p>
          </div>

          <form onSubmit={(e) => handleSubmit(e, key)} className="p-6">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Información del Estudiante</h4>
              {renderCamposEstudiante()}
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Información del Servicio</h4>
              {renderCamposServicio(key)}
            </div>

            {mensaje.tipo && (
              <div
                className={`p-4 rounded-lg mb-4 flex items-center space-x-2 ${
                  mensaje.tipo === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {mensaje.tipo === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span>{mensaje.texto}</span>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setServicioActivo(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-gradient-to-r ${servicio.color} text-white rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 disabled:opacity-50`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? "Enviando..." : "Registrar"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const renderCamposServicio = (key) => {
    switch (key) {
      case "tutoria":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Riesgo <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.nivel_riesgo ? "border-red-500" : "border-gray-300"}`}
                  name="nivel_riesgo"
                  value={form.nivel_riesgo || ""}
                  onChange={handleChange}
                >
                  <option value="">Seleccione...</option>
                  {riesgoOpciones.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                {errores.nivel_riesgo && <span className="text-red-500 text-xs mt-1">{errores.nivel_riesgo}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Asignación <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.fecha_asignacion ? "border-red-500" : "border-gray-300"}`}
                  name="fecha_asignacion"
                  value={form.fecha_asignacion || ""}
                  onChange={handleChange}
                  type="date"
                />
                {errores.fecha_asignacion && (
                  <span className="text-red-500 text-xs mt-1">{errores.fecha_asignacion}</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requiere_tutoria"
                name="requiere_tutoria"
                checked={form.requiere_tutoria || false}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="requiere_tutoria" className="text-sm font-medium text-gray-700">
                Requiere Tutoría
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acciones de Apoyo</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                name="acciones_apoyo"
                value={form.acciones_apoyo || ""}
                onChange={handleChange}
                placeholder="Describa las acciones de apoyo recomendadas"
                maxLength={255}
                rows={3}
              />
            </div>
          </div>
        )

      case "psicologia":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de Intervención <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.motivo_intervencion ? "border-red-500" : "border-gray-300"}`}
                  name="motivo_intervencion"
                  value={form.motivo_intervencion || ""}
                  onChange={handleChange}
                >
                  <option value="">Seleccione...</option>
                  {motivoIntervencionOpciones.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                {errores.motivo_intervencion && (
                  <span className="text-red-500 text-xs mt-1">{errores.motivo_intervencion}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Intervención <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.tipo_intervencion ? "border-red-500" : "border-gray-300"}`}
                  name="tipo_intervencion"
                  value={form.tipo_intervencion || ""}
                  onChange={handleChange}
                >
                  <option value="">Seleccione...</option>
                  {tipoIntervencionOpciones.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                {errores.tipo_intervencion && (
                  <span className="text-red-500 text-xs mt-1">{errores.tipo_intervencion}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Atención <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.fecha_atencion ? "border-red-500" : "border-gray-300"}`}
                name="fecha_atencion"
                value={form.fecha_atencion || ""}
                onChange={handleChange}
                type="date"
              />
              {errores.fecha_atencion && <span className="text-red-500 text-xs mt-1">{errores.fecha_atencion}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seguimiento</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="seguimiento"
                value={form.seguimiento || ""}
                onChange={handleChange}
                placeholder="Notas de seguimiento"
                maxLength={255}
                rows={3}
              />
            </div>
          </div>
        )

      case "vocacional":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Participante <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errores.tipo_participante ? "border-red-500" : "border-gray-300"}`}
                  name="tipo_participante"
                  value={form.tipo_participante || ""}
                  onChange={handleChange}
                >
                  <option value="">Seleccione...</option>
                  {tipoParticipanteOpciones.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                {errores.tipo_participante && (
                  <span className="text-red-500 text-xs mt-1">{errores.tipo_participante}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Riesgo SPADIES <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errores.riesgo_spadies ? "border-red-500" : "border-gray-300"}`}
                  name="riesgo_spadies"
                  value={form.riesgo_spadies || ""}
                  onChange={handleChange}
                >
                  <option value="">Seleccione...</option>
                  {nivelRiesgoSpadiesOpciones.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                {errores.riesgo_spadies && <span className="text-red-500 text-xs mt-1">{errores.riesgo_spadies}</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Ingreso al Programa <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errores.fecha_ingreso_programa ? "border-red-500" : "border-gray-300"}`}
                name="fecha_ingreso_programa"
                value={form.fecha_ingreso_programa || ""}
                onChange={handleChange}
                type="date"
              />
              {errores.fecha_ingreso_programa && (
                <span className="text-red-500 text-xs mt-1">{errores.fecha_ingreso_programa}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                name="observaciones"
                value={form.observaciones || ""}
                onChange={handleChange}
                placeholder="Observaciones adicionales"
                maxLength={255}
                rows={3}
              />
            </div>
          </div>
        )

      case "comedor":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condición Socioeconómica <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errores.condicion_socioeconomica ? "border-red-500" : "border-gray-300"}`}
                name="condicion_socioeconomica"
                value={form.condicion_socioeconomica || ""}
                onChange={handleChange}
                placeholder="Describa la condición socioeconómica"
                maxLength={100}
              />
              {errores.condicion_socioeconomica && (
                <span className="text-red-500 text-xs mt-1">{errores.condicion_socioeconomica}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Solicitud <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errores.fecha_solicitud ? "border-red-500" : "border-gray-300"}`}
                  name="fecha_solicitud"
                  value={form.fecha_solicitud || ""}
                  onChange={handleChange}
                  type="date"
                />
                {errores.fecha_solicitud && (
                  <span className="text-red-500 text-xs mt-1">{errores.fecha_solicitud}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Comida <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errores.tipo_comida ? "border-red-500" : "border-gray-300"}`}
                  name="tipo_comida"
                  value={form.tipo_comida || ""}
                  onChange={handleChange}
                >
                  <option value="">Seleccione...</option>
                  {tipoComidaOpciones.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                {errores.tipo_comida && <span className="text-red-500 text-xs mt-1">{errores.tipo_comida}</span>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="aprobado"
                name="aprobado"
                checked={form.aprobado || false}
                onChange={handleChange}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="aprobado" className="text-sm font-medium text-gray-700">
                Solicitud Aprobada
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raciones Asignadas <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errores.raciones_asignadas ? "border-red-500" : "border-gray-300"}`}
                name="raciones_asignadas"
                value={form.raciones_asignadas || ""}
                onChange={handleChange}
                type="number"
                min={1}
                placeholder="Número de raciones"
              />
              {errores.raciones_asignadas && (
                <span className="text-red-500 text-xs mt-1">{errores.raciones_asignadas}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                name="observaciones"
                value={form.observaciones || ""}
                onChange={handleChange}
                placeholder="Observaciones adicionales"
                maxLength={255}
                rows={3}
              />
            </div>
          </div>
        )

      case "apoyo":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vulnerabilidad</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                name="tipo_vulnerabilidad"
                value={form.tipo_vulnerabilidad || ""}
                onChange={handleChange}
                placeholder="Tipo de vulnerabilidad"
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                name="observaciones"
                value={form.observaciones || ""}
                onChange={handleChange}
                placeholder="Observaciones adicionales"
                maxLength={255}
                rows={3}
              />
            </div>
          </div>
        )

      case "talleres":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Taller <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                name="nombre_taller"
                value={form.nombre_taller || ""}
                onChange={handleChange}
                placeholder="Nombre del taller"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha del Taller <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                name="fecha_taller"
                value={form.fecha_taller || ""}
                onChange={handleChange}
                type="date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                name="observaciones"
                value={form.observaciones || ""}
                onChange={handleChange}
                placeholder="Observaciones adicionales"
                maxLength={255}
                rows={3}
              />
            </div>
          </div>
        )

      case "seguimiento":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado de Participación <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                name="estado_participacion"
                value={form.estado_participacion || ""}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                {estadoParticipacionOpciones.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
              {errores.estado_participacion && (
                <span className="text-red-500 text-xs mt-1">{errores.estado_participacion}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones de Permanencia <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                name="observaciones_permanencia"
                value={form.observaciones_permanencia || ""}
                onChange={handleChange}
                placeholder="Observaciones de permanencia"
                maxLength={200}
                rows={3}
              />
            </div>
          </div>
        )

      default:
        return <div className="text-center py-8 text-gray-500">Formulario en construcción para este servicio.</div>
    }
  }

  return (
    <div className="min-h-screen p-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Servicios de Permanencia Estudiantil</h1>
          <p className="text-gray-600 text-lg">Sistema integral de registro y seguimiento para estudiantes UNIPAZ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-28">
          {servicios.map((servicio) => (
            <div
              key={servicio.key}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => setServicioActivo(servicio.key)}
            >
              <div className={`bg-gradient-to-r ${servicio.color} p-6 rounded-t-xl text-white h-[140px]`}>
                <div className="flex flex-col h-full gap-4 items-center">
                  {servicio.icono}
                  <h3 className="text-lg font-bold text-center">{servicio.nombre}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-center mb-4">{servicio.descripcion}</p>
                <button
                  className={`w-full py-2 px-4 bg-gradient-to-r ${servicio.color} text-white rounded-lg hover:opacity-90 transition-opacity font-medium`}
                >
                  Registrar
                </button>
              </div>
            </div>
          ))}
        </div>

        {servicioActivo && renderFormulario(servicioActivo)}
      </div>
    </div>
  )
}
