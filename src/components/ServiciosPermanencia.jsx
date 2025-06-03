"use client"

import React, { useState, useEffect } from "react"
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
  Users,
  TrendingUp,
  Download,
  Eye,
  Plus,
  Search,
  RefreshCw,
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

const ServiciosPermanencia = () => {
  const servicios = [
    {
      nombre: "Programa de Orientación Académica (POA)",
      descripcion: "Registro de tutorías y acompañamiento académico.",
      icono: React.createElement(GraduationCap, { className: "w-8 h-8" }),
      key: "tutoria",
      color: "from-emerald-500 to-emerald-600",
      endpoint: "/tutoria",
    },
    {
      nombre: "Programa de Orientación Psicosocial (POPS)",
      descripcion: "Registro de atención y seguimiento psicosocial.",
      icono: React.createElement(Brain, { className: "w-8 h-8" }),
      key: "psicologia",
      color: "from-blue-500 to-blue-600",
      endpoint: "/psicologia",
    },
    {
      nombre: "Apoyo Socioeconómico",
      descripcion: "Registro de apoyos económicos y becas.",
      icono: React.createElement(DollarSign, { className: "w-8 h-8" }),
      key: "socioeconomico",
      color: "from-purple-500 to-purple-600",
      endpoint: "/socioeconomico",
    },
    {
      nombre: "Programa de Orientación Vocacional (POVAU)",
      descripcion: "Registro de orientación vocacional y seguimiento.",
      icono: React.createElement(Compass, { className: "w-8 h-8" }),
      key: "vocacional",
      color: "from-indigo-500 to-indigo-600",
      endpoint: "/vocacional",
    },
    {
      nombre: "Talleres de Habilidades",
      descripcion: "Registro de talleres y actividades de desarrollo.",
      icono: React.createElement(Clock, { className: "w-8 h-8" }),
      key: "talleres",
      color: "from-orange-500 to-orange-600",
      endpoint: "/talleres",
    },
    {
      nombre: "Seguimiento Académico",
      descripcion: "Registro de seguimiento y evaluación académica.",
      icono: React.createElement(BarChart3, { className: "w-8 h-8" }),
      key: "seguimiento",
      color: "from-teal-500 to-teal-600",
      endpoint: "/seguimiento",
    },
    {
      nombre: "Comedor Universitario",
      descripcion: "Registro y seguimiento de beneficiarios del comedor.",
      icono: React.createElement(Utensils, { className: "w-8 h-8" }),
      key: "comedor",
      color: "from-amber-500 to-amber-600",
      endpoint: "/comedor",
    },
  ]

  const [vistaActual, setVistaActual] = useState("dashboard")
  const [servicioActivo, setServicioActivo] = useState(null)
  const [form, setForm] = useState({})
  const [errores, setErrores] = useState({})
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })
  const [datos, setDatos] = useState({})
  const [filtros, setFiltros] = useState({
    servicio: "",
    programa: "",
    riesgo: "",
    fechaInicio: "",
    fechaFin: "",
  })
  const [estadisticas, setEstadisticas] = useState({
    totalEstudiantes: 0,
    serviciosActivos: 0,
    riesgoAlto: 0,
    tendenciaMensual: [],
  })

  const BASE_API_URL = "https://backend-permanencia.onrender.com/api/servicios"

  // Cargar datos al inicializar
  useEffect(() => {
    cargarDatos()
    cargarEstadisticas()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const promesas = servicios.map(async (servicio) => {
        try {
          const response = await fetch(`${BASE_API_URL}${servicio.endpoint}`)
          if (response.ok) {
            const data = await response.json()
            return { [servicio.key]: data.data || [] }
          }
          return { [servicio.key]: [] }
        } catch (error) {
          console.error(`Error cargando ${servicio.key}:`, error)
          return { [servicio.key]: [] }
        }
      })

      const resultados = await Promise.all(promesas)
      const datosCompletos = resultados.reduce((acc, curr) => ({ ...acc, ...curr }), {})
      setDatos(datosCompletos)
    } catch (error) {
      console.error("Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const cargarEstadisticas = async () => {
    try {
      // Simular carga de estadísticas
      setEstadisticas({
        totalEstudiantes: 1250,
        serviciosActivos: 7,
        riesgoAlto: 180,
        tendenciaMensual: [
          { mes: "Ene", registros: 45 },
          { mes: "Feb", registros: 52 },
          { mes: "Mar", registros: 48 },
          { mes: "Abr", registros: 61 },
          { mes: "May", registros: 55 },
          { mes: "Jun", registros: 67 },
        ],
      })
    } catch (error) {
      console.error("Error cargando estadísticas:", error)
    }
  }

  const tryApiUrls = async (key, formData) => {
    const servicio = servicios.find((s) => s.key === key)
    if (!servicio) {
      throw new Error("Servicio no encontrado")
    }

    const fullUrl = `${BASE_API_URL}${servicio.endpoint}`

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      let data
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        try {
          data = JSON.parse(text)
        } catch (e) {
          data = { message: text || "Respuesta no disponible" }
        }
      }

      return { success: response.ok, data }
    } catch (error) {
      throw new Error("No se pudo conectar al servidor. Por favor, verifica que el backend esté en ejecución.")
    }
  }

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

  const handleFiltroChange = (e) => {
    const { name, value } = e.target
    setFiltros({ ...filtros, [name]: value })
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

        // Procesamiento de datos
        if (formData.semestre) {
          formData.semestre = Number.parseInt(formData.semestre, 10)
        } else {
          formData.semestre = 1
        }

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
            cargarDatos() // Recargar datos
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

  const renderDashboard = () => {
    return React.createElement(
      "div",
      { className: "space-y-6" },
      // Header con estadísticas
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" },
        React.createElement(
          "div",
          { className: "bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500" },
          React.createElement(
            "div",
            { className: "flex items-center justify-between" },
            React.createElement(
              "div",
              null,
              React.createElement("p", { className: "text-sm font-medium text-gray-600" }, "Total Estudiantes"),
              React.createElement(
                "p",
                { className: "text-3xl font-bold text-gray-900" },
                estadisticas.totalEstudiantes.toLocaleString(),
              ),
            ),
            React.createElement(Users, { className: "w-8 h-8 text-emerald-500" }),
          ),
        ),
        React.createElement(
          "div",
          { className: "bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500" },
          React.createElement(
            "div",
            { className: "flex items-center justify-between" },
            React.createElement(
              "div",
              null,
              React.createElement("p", { className: "text-sm font-medium text-gray-600" }, "Servicios Activos"),
              React.createElement(
                "p",
                { className: "text-3xl font-bold text-gray-900" },
                estadisticas.serviciosActivos,
              ),
            ),
            React.createElement(BarChart3, { className: "w-8 h-8 text-blue-500" }),
          ),
        ),
        React.createElement(
          "div",
          { className: "bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500" },
          React.createElement(
            "div",
            { className: "flex items-center justify-between" },
            React.createElement(
              "div",
              null,
              React.createElement("p", { className: "text-sm font-medium text-gray-600" }, "Riesgo Alto"),
              React.createElement("p", { className: "text-3xl font-bold text-gray-900" }, estadisticas.riesgoAlto),
            ),
            React.createElement(AlertCircle, { className: "w-8 h-8 text-red-500" }),
          ),
        ),
        React.createElement(
          "div",
          { className: "bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500" },
          React.createElement(
            "div",
            { className: "flex items-center justify-between" },
            React.createElement(
              "div",
              null,
              React.createElement("p", { className: "text-sm font-medium text-gray-600" }, "Tendencia"),
              React.createElement("p", { className: "text-3xl font-bold text-gray-900" }, "+12%"),
            ),
            React.createElement(TrendingUp, { className: "w-8 h-8 text-purple-500" }),
          ),
        ),
      ),

      // Filtros
      React.createElement(
        "div",
        { className: "bg-white rounded-xl shadow-lg p-6" },
        React.createElement(
          "div",
          { className: "flex items-center justify-between mb-4" },
          React.createElement("h3", { className: "text-lg font-semibold text-gray-800" }, "Filtros y Análisis"),
          React.createElement(
            "div",
            { className: "flex space-x-2" },
            React.createElement(
              "button",
              {
                onClick: cargarDatos,
                className:
                  "flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors",
              },
              React.createElement(RefreshCw, { className: "w-4 h-4" }),
              React.createElement("span", null, "Actualizar"),
            ),
            React.createElement(
              "button",
              {
                className:
                  "flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors",
              },
              React.createElement(Download, { className: "w-4 h-4" }),
              React.createElement("span", null, "Exportar"),
            ),
          ),
        ),
        React.createElement(
          "div",
          { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" },
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Servicio"),
            React.createElement(
              "select",
              {
                name: "servicio",
                value: filtros.servicio,
                onChange: handleFiltroChange,
                className:
                  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              },
              React.createElement("option", { value: "" }, "Todos los servicios"),
              servicios.map((servicio) =>
                React.createElement("option", { key: servicio.key, value: servicio.key }, servicio.nombre),
              ),
            ),
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Programa"),
            React.createElement(
              "select",
              {
                name: "programa",
                value: filtros.programa,
                onChange: handleFiltroChange,
                className:
                  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              },
              React.createElement("option", { value: "" }, "Todos los programas"),
              programas.map((programa) => React.createElement("option", { key: programa, value: programa }, programa)),
            ),
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Riesgo"),
            React.createElement(
              "select",
              {
                name: "riesgo",
                value: filtros.riesgo,
                onChange: handleFiltroChange,
                className:
                  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              },
              React.createElement("option", { value: "" }, "Todos los niveles"),
              riesgoOpciones.map((riesgo) => React.createElement("option", { key: riesgo, value: riesgo }, riesgo)),
            ),
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Fecha Inicio"),
            React.createElement("input", {
              type: "date",
              name: "fechaInicio",
              value: filtros.fechaInicio,
              onChange: handleFiltroChange,
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            }),
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Fecha Fin"),
            React.createElement("input", {
              type: "date",
              name: "fechaFin",
              value: filtros.fechaFin,
              onChange: handleFiltroChange,
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            }),
          ),
        ),
      ),

      // Tabla de datos
      React.createElement(
        "div",
        { className: "bg-white rounded-xl shadow-lg overflow-hidden" },
        React.createElement(
          "div",
          { className: "px-6 py-4 border-b border-gray-200" },
          React.createElement(
            "div",
            { className: "flex items-center justify-between" },
            React.createElement("h3", { className: "text-lg font-semibold text-gray-800" }, "Registros de Servicios"),
            React.createElement(
              "div",
              { className: "flex items-center space-x-2" },
              React.createElement(
                "div",
                { className: "relative" },
                React.createElement(Search, {
                  className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4",
                }),
                React.createElement("input", {
                  type: "text",
                  placeholder: "Buscar estudiante...",
                  className:
                    "pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                }),
              ),
              React.createElement(
                "button",
                {
                  onClick: () => setVistaActual("servicios"),
                  className:
                    "flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors",
                },
                React.createElement(Plus, { className: "w-4 h-4" }),
                React.createElement("span", null, "Nuevo Registro"),
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          { className: "overflow-x-auto" },
          React.createElement(
            "table",
            { className: "min-w-full divide-y divide-gray-200" },
            React.createElement(
              "thead",
              { className: "bg-gray-50" },
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { className: "px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider" },
                  "Estudiante",
                ),
                React.createElement(
                  "th",
                  { className: "px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider" },
                  "Documento",
                ),
                React.createElement(
                  "th",
                  { className: "px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider" },
                  "Programa",
                ),
                React.createElement(
                  "th",
                  { className: "px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider" },
                  "Servicio",
                ),
                React.createElement(
                  "th",
                  { className: "px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider" },
                  "Riesgo",
                ),
                React.createElement(
                  "th",
                  { className: "px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider" },
                  "Fecha",
                )
              ),
            ),
            React.createElement(
              "tbody",
              { className: "bg-white divide-y divide-gray-200" },
              loading
                ? React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { colSpan: 7, className: "px-6 py-4 text-center" },
                      React.createElement(
                        "div",
                        { className: "flex items-center justify-center space-x-2" },
                        React.createElement(Loader2, { className: "w-5 h-5 animate-spin text-blue-500" }),
                        React.createElement("span", { className: "text-gray-500" }, "Cargando datos..."),
                      ),
                    ),
                  )
                : Object.keys(datos).length === 0
                  ? React.createElement(
                      "tr",
                      null,
                      React.createElement(
                        "td",
                        { colSpan: 7, className: "px-6 py-4 text-center text-gray-500" },
                        "No hay datos disponibles",
                      ),
                    )
                  : Object.entries(datos).flatMap(([servicioKey, registros]) =>
                      (registros || []).slice(0, 10).map((registro, index) => {
                        const servicio = servicios.find((s) => s.key === servicioKey)
                        return React.createElement(
                          "tr",
                          { key: `${servicioKey}-${index}`, className: "hover:bg-gray-50" },
                          React.createElement(
                            "td",
                            { className: "px-6 py-4 whitespace-nowrap" },
                            React.createElement(
                              "div",
                              null,
                              React.createElement(
                                "div",
                                { className: "text-sm font-medium text-gray-900" },
                                `${registro.estudiante?.nombres || "N/A"} ${registro.estudiante?.apellidos || ""}`,
                              ),
                              React.createElement(
                                "div",
                                { className: "text-sm text-gray-500" },
                                registro.estudiante?.correo1 || "N/A",
                              ),
                            ),
                          ),
                          React.createElement(
                            "td",
                            { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" },
                            registro.estudiante?.numero_documento1 || "N/A",
                          ),
                          React.createElement(
                            "td",
                            { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" },
                            registro.estudiante?.programa_academico || "N/A",
                          ),
                          React.createElement(
                            "td",
                            { className: "px-6 py-4 whitespace-nowrap" },
                            React.createElement(
                              "span",
                              {
                                className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${servicio?.color || "from-gray-500 to-gray-600"} text-white`,
                              },
                              servicio?.nombre || servicioKey,
                            ),
                          ),
                          React.createElement(
                            "td",
                            { className: "px-6 py-4 whitespace-nowrap" },
                            React.createElement(
                              "span",
                              {
                                className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  registro.estudiante?.riesgo_desercion === "Alto" ||
                                  registro.estudiante?.riesgo_desercion === "Muy alto"
                                    ? "bg-red-100 text-red-800"
                                    : registro.estudiante?.riesgo_desercion === "Medio"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                }`,
                              },
                              registro.estudiante?.riesgo_desercion || "N/A",
                            ),
                          ),
                          React.createElement(
                            "td",
                            { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" },
                            registro.fecha_asignacion || registro.fecha_atencion || registro.fecha_solicitud || "N/A",
                          ),
                          
                        )
                      }),
                    ),
            ),
          ),
        ),
      ),
    )
  }

  const renderServicios = () => {
    return React.createElement(
      "div",
      { className: "space-y-6" },
      React.createElement(
        "div",
        { className: "flex items-center justify-between" },
        React.createElement(
          "div",
          null,
          React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Servicios de Permanencia"),
          React.createElement(
            "p",
            { className: "text-gray-600" },
            "Selecciona un servicio para registrar un nuevo estudiante",
          ),
        ),
        React.createElement(
          "button",
          {
            onClick: () => setVistaActual("dashboard"),
            className:
              "flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors",
          },
          React.createElement(BarChart3, { className: "w-4 h-4" }),
          React.createElement("span", null, "Ver Registros"),
        ),
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" },
        servicios.map((servicio) =>
          React.createElement(
            "div",
            {
              key: servicio.key,
              className:
                "bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer",
              onClick: () => setServicioActivo(servicio.key),
            },
            React.createElement(
              "div",
              { className: `bg-gradient-to-r ${servicio.color} p-6 rounded-t-xl text-white` },
              React.createElement("div", { className: "flex items-center justify-center mb-3" }, servicio.icono),
              React.createElement("h3", { className: "text-lg font-bold text-center" }, servicio.nombre),
            ),
            React.createElement(
              "div",
              { className: "p-6" },
              React.createElement("p", { className: "text-gray-600 text-center mb-4" }, servicio.descripcion),
              React.createElement(
                "button",
                {
                  className: `w-full py-2 px-4 bg-gradient-to-r ${servicio.color} text-white rounded-lg hover:opacity-90 transition-opacity font-medium`,
                },
                "Registrar",
              ),
            ),
          ),
        ),
      ),
    )
  }

  const renderCamposEstudiante = () => {
    return React.createElement(
      "div",
      { className: "space-y-4" },
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Tipo de Documento ",
            React.createElement("span", { className: "text-red-500" }, "*"),
          ),
          React.createElement(
            "select",
            {
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.tipo_documento ? "border-red-500" : "border-gray-300"}`,
              name: "tipo_documento",
              value: form.tipo_documento || "",
              onChange: handleChange,
            },
            React.createElement("option", { value: "" }, "Seleccione..."),
            tipoDocumentoOpciones.map((op) => React.createElement("option", { key: op, value: op }, op)),
          ),
          errores.tipo_documento &&
            React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.tipo_documento),
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Número de Documento ",
            React.createElement("span", { className: "text-red-500" }, "*"),
          ),
          React.createElement("input", {
            className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.numero_documento1 ? "border-red-500" : "border-gray-300"}`,
            name: "numero_documento1",
            value: form.numero_documento1 || "",
            onChange: handleChange,
            placeholder: "Número de Documento",
            maxLength: 10,
          }),
          errores.numero_documento1 &&
            React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.numero_documento1),
        ),
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Nombres ",
            React.createElement("span", { className: "text-red-500" }, "*"),
          ),
          React.createElement("input", {
            className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase ${errores.nombres ? "border-red-500" : "border-gray-300"}`,
            name: "nombres",
            value: form.nombres || "",
            onChange: handleChange,
            placeholder: "Nombres",
            maxLength: 50,
          }),
          errores.nombres && React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.nombres),
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Apellidos ",
            React.createElement("span", { className: "text-red-500" }, "*"),
          ),
          React.createElement("input", {
            className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase ${errores.apellidos ? "border-red-500" : "border-gray-300"}`,
            name: "apellidos",
            value: form.apellidos || "",
            onChange: handleChange,
            placeholder: "Apellidos",
            maxLength: 50,
          }),
          errores.apellidos &&
            React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.apellidos),
        ),
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Correo Electrónico ",
            React.createElement("span", { className: "text-red-500" }, "*"),
          ),
          React.createElement("input", {
            className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.correo1 ? "border-red-500" : "border-gray-300"}`,
            name: "correo1",
            value: form.correo1 || "",
            onChange: handleChange,
            placeholder: "correo@ejemplo.com",
            maxLength: 100,
          }),
          errores.correo1 && React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.correo1),
        ),
        React.createElement(
          "div",
          null,
          React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Teléfono"),
          React.createElement("input", {
            className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.telefono ? "border-red-500" : "border-gray-300"}`,
            name: "telefono",
            value: form.telefono || "",
            onChange: handleChange,
            placeholder: "3XX XXX XXXX",
            maxLength: 10,
          }),
          errores.telefono && React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.telefono),
        ),
      ),
      React.createElement(
        "div",
        null,
        React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Dirección"),
        React.createElement("input", {
          className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.direccion ? "border-red-500" : "border-gray-300"}`,
          name: "direccion",
          value: form.direccion || "",
          onChange: handleChange,
          placeholder: "Dirección de residencia",
          maxLength: 100,
        }),
        errores.direccion && React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.direccion),
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Programa Académico ",
            React.createElement("span", { className: "text-red-500" }, "*"),
          ),
          React.createElement(
            "select",
            {
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.programa_academico ? "border-red-500" : "border-gray-300"}`,
              name: "programa_academico",
              value: form.programa_academico || "",
              onChange: handleChange,
            },
            React.createElement("option", { value: "" }, "Seleccione..."),
            programas.map((op) => React.createElement("option", { key: op, value: op }, op)),
          ),
          errores.programa_academico &&
            React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.programa_academico),
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Semestre ",
            React.createElement("span", { className: "text-red-500" }, "*"),
          ),
          React.createElement("input", {
            className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.semestre ? "border-red-500" : "border-gray-300"}`,
            name: "semestre",
            value: form.semestre || "",
            onChange: handleChange,
            placeholder: "Semestre Actual",
            type: "number",
            min: 1,
            max: 20,
          }),
          errores.semestre && React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.semestre),
        ),
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Riesgo de Deserción ",
            React.createElement("span", { className: "text-red-500" }, "*"),
          ),
          React.createElement(
            "select",
            {
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.riesgo_desercion ? "border-red-500" : "border-gray-300"}`,
              name: "riesgo_desercion",
              value: form.riesgo_desercion || "",
              onChange: handleChange,
            },
            React.createElement("option", { value: "" }, "Seleccione..."),
            riesgoOpciones.map((op) => React.createElement("option", { key: op, value: op }, op)),
          ),
          errores.riesgo_desercion &&
            React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.riesgo_desercion),
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Estrato ",
            React.createElement("span", { className: "text-red-500" }, "*"),
          ),
          React.createElement(
            "select",
            {
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.estrato ? "border-red-500" : "border-gray-300"}`,
              name: "estrato",
              value: form.estrato || "",
              onChange: handleChange,
            },
            React.createElement("option", { value: "" }, "Seleccione..."),
            estratoOpciones.map((op) => React.createElement("option", { key: op, value: op }, op)),
          ),
          errores.estrato && React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.estrato),
        ),
      ),
    )
  }

  const renderCamposServicio = (key) => {
    switch (key) {
      case "tutoria":
        return React.createElement(
          "div",
          { className: "space-y-4" },
          React.createElement(
            "div",
            { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement(
              "div",
              null,
              React.createElement(
                "label",
                { className: "block text-sm font-medium text-gray-700 mb-1" },
                "Nivel de Riesgo ",
                React.createElement("span", { className: "text-red-500" }, "*"),
              ),
              React.createElement(
                "select",
                {
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.nivel_riesgo ? "border-red-500" : "border-gray-300"}`,
                  name: "nivel_riesgo",
                  value: form.nivel_riesgo || "",
                  onChange: handleChange,
                },
                React.createElement("option", { value: "" }, "Seleccione..."),
                riesgoOpciones.map((op) => React.createElement("option", { key: op, value: op }, op)),
              ),
              errores.nivel_riesgo &&
                React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.nivel_riesgo),
            ),
            React.createElement(
              "div",
              null,
              React.createElement(
                "label",
                { className: "block text-sm font-medium text-gray-700 mb-1" },
                "Fecha de Asignación ",
                React.createElement("span", { className: "text-red-500" }, "*"),
              ),
              React.createElement("input", {
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errores.fecha_asignacion ? "border-red-500" : "border-gray-300"}`,
                name: "fecha_asignacion",
                value: form.fecha_asignacion || "",
                onChange: handleChange,
                type: "date",
              }),
              errores.fecha_asignacion &&
                React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.fecha_asignacion),
            ),
          ),
          React.createElement(
            "div",
            { className: "flex items-center space-x-2" },
            React.createElement("input", {
              type: "checkbox",
              id: "requiere_tutoria",
              name: "requiere_tutoria",
              checked: form.requiere_tutoria || false,
              onChange: handleChange,
              className: "w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500",
            }),
            React.createElement(
              "label",
              { htmlFor: "requiere_tutoria", className: "text-sm font-medium text-gray-700" },
              "Requiere Tutoría",
            ),
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Acciones de Apoyo",
            ),
            React.createElement("textarea", {
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              name: "acciones_apoyo",
              value: form.acciones_apoyo || "",
              onChange: handleChange,
              placeholder: "Describa las acciones de apoyo recomendadas",
              maxLength: 255,
              rows: 3,
            }),
          ),
        )

      case "psicologia":
        return React.createElement(
          "div",
          { className: "space-y-4" },
          React.createElement(
            "div",
            { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement(
              "div",
              null,
              React.createElement(
                "label",
                { className: "block text-sm font-medium text-gray-700 mb-1" },
                "Motivo de Intervención ",
                React.createElement("span", { className: "text-red-500" }, "*"),
              ),
              React.createElement(
                "select",
                {
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.motivo_intervencion ? "border-red-500" : "border-gray-300"}`,
                  name: "motivo_intervencion",
                  value: form.motivo_intervencion || "",
                  onChange: handleChange,
                },
                React.createElement("option", { value: "" }, "Seleccione..."),
                motivoIntervencionOpciones.map((op) => React.createElement("option", { key: op, value: op }, op)),
              ),
              errores.motivo_intervencion &&
                React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.motivo_intervencion),
            ),
            React.createElement(
              "div",
              null,
              React.createElement(
                "label",
                { className: "block text-sm font-medium text-gray-700 mb-1" },
                "Tipo de Intervención ",
                React.createElement("span", { className: "text-red-500" }, "*"),
              ),
              React.createElement(
                "select",
                {
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.tipo_intervencion ? "border-red-500" : "border-gray-300"}`,
                  name: "tipo_intervencion",
                  value: form.tipo_intervencion || "",
                  onChange: handleChange,
                },
                React.createElement("option", { value: "" }, "Seleccione..."),
                tipoIntervencionOpciones.map((op) => React.createElement("option", { key: op, value: op }, op)),
              ),
              errores.tipo_intervencion &&
                React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.tipo_intervencion),
            ),
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Fecha de Atención ",
              React.createElement("span", { className: "text-red-500" }, "*"),
            ),
            React.createElement("input", {
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.fecha_atencion ? "border-red-500" : "border-gray-300"}`,
              name: "fecha_atencion",
              value: form.fecha_atencion || "",
              onChange: handleChange,
              type: "date",
            }),
            errores.fecha_atencion &&
              React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.fecha_atencion),
          ),
          React.createElement(
            "div",
            null,
            React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Seguimiento"),
            React.createElement("textarea", {
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              name: "seguimiento",
              value: form.seguimiento || "",
              onChange: handleChange,
              placeholder: "Notas de seguimiento",
              maxLength: 255,
              rows: 3,
            }),
          ),
        )

      case "vocacional":
        return React.createElement(
          "div",
          { className: "space-y-4" },
          React.createElement(
            "div",
            { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement(
              "div",
              null,
              React.createElement(
                "label",
                { className: "block text-sm font-medium text-gray-700 mb-1" },
                "Tipo de Participante ",
                React.createElement("span", { className: "text-red-500" }, "*"),
              ),
              React.createElement(
                "select",
                {
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errores.tipo_participante ? "border-red-500" : "border-gray-300"}`,
                  name: "tipo_participante",
                  value: form.tipo_participante || "",
                  onChange: handleChange,
                },
                React.createElement("option", { value: "" }, "Seleccione..."),
                tipoParticipanteOpciones.map((op) => React.createElement("option", { key: op, value: op }, op)),
              ),
              errores.tipo_participante &&
                React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.tipo_participante),
            ),
            React.createElement(
              "div",
              null,
              React.createElement(
                "label",
                { className: "block text-sm font-medium text-gray-700 mb-1" },
                "Nivel de Riesgo SPADIES ",
                React.createElement("span", { className: "text-red-500" }, "*"),
              ),
              React.createElement(
                "select",
                {
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errores.riesgo_spadies ? "border-red-500" : "border-gray-300"}`,
                  name: "riesgo_spadies",
                  value: form.riesgo_spadies || "",
                  onChange: handleChange,
                },
                React.createElement("option", { value: "" }, "Seleccione..."),
                nivelRiesgoSpadiesOpciones.map((op) => React.createElement("option", { key: op, value: op }, op)),
              ),
              errores.riesgo_spadies &&
                React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.riesgo_spadies),
            ),
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Fecha de Ingreso al Programa ",
              React.createElement("span", { className: "text-red-500" }, "*"),
            ),
            React.createElement("input", {
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errores.fecha_ingreso_programa ? "border-red-500" : "border-gray-300"}`,
              name: "fecha_ingreso_programa",
              value: form.fecha_ingreso_programa || "",
              onChange: handleChange,
              type: "date",
            }),
            errores.fecha_ingreso_programa &&
              React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.fecha_ingreso_programa),
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Observaciones",
            ),
            React.createElement("textarea", {
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
              name: "observaciones",
              value: form.observaciones || "",
              onChange: handleChange,
              placeholder: "Observaciones adicionales",
              maxLength: 255,
              rows: 3,
            }),
          ),
        )

      case "comedor":
        return React.createElement(
          "div",
          { className: "space-y-4" },
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Condición Socioeconómica ",
              React.createElement("span", { className: "text-red-500" }, "*"),
            ),
            React.createElement("input", {
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errores.condicion_socioeconomica ? "border-red-500" : "border-gray-300"}`,
              name: "condicion_socioeconomica",
              value: form.condicion_socioeconomica || "",
              onChange: handleChange,
              placeholder: "Describa la condición socioeconómica",
              maxLength: 100,
            }),
            errores.condicion_socioeconomica &&
              React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.condicion_socioeconomica),
          ),
          React.createElement(
            "div",
            { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement(
              "div",
              null,
              React.createElement(
                "label",
                { className: "block text-sm font-medium text-gray-700 mb-1" },
                "Fecha de Solicitud ",
                React.createElement("span", { className: "text-red-500" }, "*"),
              ),
              React.createElement("input", {
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errores.fecha_solicitud ? "border-red-500" : "border-gray-300"}`,
                name: "fecha_solicitud",
                value: form.fecha_solicitud || "",
                onChange: handleChange,
                type: "date",
              }),
              errores.fecha_solicitud &&
                React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.fecha_solicitud),
            ),
            React.createElement(
              "div",
              null,
              React.createElement(
                "label",
                { className: "block text-sm font-medium text-gray-700 mb-1" },
                "Tipo de Comida ",
                React.createElement("span", { className: "text-red-500" }, "*"),
              ),
              React.createElement(
                "select",
                {
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errores.tipo_comida ? "border-red-500" : "border-gray-300"}`,
                  name: "tipo_comida",
                  value: form.tipo_comida || "",
                  onChange: handleChange,
                },
                React.createElement("option", { value: "" }, "Seleccione..."),
                tipoComidaOpciones.map((op) => React.createElement("option", { key: op, value: op }, op)),
              ),
              errores.tipo_comida &&
                React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.tipo_comida),
            ),
          ),
          React.createElement(
            "div",
            { className: "flex items-center space-x-2" },
            React.createElement("input", {
              type: "checkbox",
              id: "aprobado",
              name: "aprobado",
              checked: form.aprobado || false,
              onChange: handleChange,
              className: "w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500",
            }),
            React.createElement(
              "label",
              { htmlFor: "aprobado", className: "text-sm font-medium text-gray-700" },
              "Solicitud Aprobada",
            ),
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Raciones Asignadas ",
              React.createElement("span", { className: "text-red-500" }, "*"),
            ),
            React.createElement("input", {
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errores.raciones_asignadas ? "border-red-500" : "border-gray-300"}`,
              name: "raciones_asignadas",
              value: form.raciones_asignadas || "",
              onChange: handleChange,
              type: "number",
              min: 1,
              placeholder: "Número de raciones",
            }),
            errores.raciones_asignadas &&
              React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.raciones_asignadas),
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Observaciones",
            ),
            React.createElement("textarea", {
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
              name: "observaciones",
              value: form.observaciones || "",
              onChange: handleChange,
              placeholder: "Observaciones adicionales",
              maxLength: 255,
              rows: 3,
            }),
          ),
        )

      case "socioeconomico":
        return React.createElement(
          "div",
          { className: "space-y-4" },
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Tipo de Vulnerabilidad",
            ),
            React.createElement("input", {
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
              name: "tipo_vulnerabilidad",
              value: form.tipo_vulnerabilidad || "",
              onChange: handleChange,
              placeholder: "Tipo de vulnerabilidad",
              maxLength: 50,
            }),
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Observaciones",
            ),
            React.createElement("textarea", {
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
              name: "observaciones",
              value: form.observaciones || "",
              onChange: handleChange,
              placeholder: "Observaciones adicionales",
              maxLength: 255,
              rows: 3,
            }),
          ),
        )

      case "talleres":
        return React.createElement(
          "div",
          { className: "space-y-4" },
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Nombre del Taller ",
              React.createElement("span", { className: "text-red-500" }, "*"),
            ),
            React.createElement("input", {
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
              name: "nombre_taller",
              value: form.nombre_taller || "",
              onChange: handleChange,
              placeholder: "Nombre del taller",
              maxLength: 100,
            }),
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Fecha del Taller ",
              React.createElement("span", { className: "text-red-500" }, "*"),
            ),
            React.createElement("input", {
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
              name: "fecha_taller",
              value: form.fecha_taller || "",
              onChange: handleChange,
              type: "date",
            }),
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Observaciones",
            ),
            React.createElement("textarea", {
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
              name: "observaciones",
              value: form.observaciones || "",
              onChange: handleChange,
              placeholder: "Observaciones adicionales",
              maxLength: 255,
              rows: 3,
            }),
          ),
        )

      case "seguimiento":
        return React.createElement(
          "div",
          { className: "space-y-4" },
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Estado de Participación ",
              React.createElement("span", { className: "text-red-500" }, "*"),
            ),
            React.createElement(
              "select",
              {
                className:
                  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
                name: "estado_participacion",
                value: form.estado_participacion || "",
                onChange: handleChange,
              },
              React.createElement("option", { value: "" }, "Seleccione..."),
              estadoParticipacionOpciones.map((op) => React.createElement("option", { key: op, value: op }, op)),
            ),
            errores.estado_participacion &&
              React.createElement("span", { className: "text-red-500 text-xs mt-1" }, errores.estado_participacion),
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Observaciones de Permanencia ",
              React.createElement("span", { className: "text-red-500" }, "*"),
            ),
            React.createElement("textarea", {
              className:
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
              name: "observaciones_permanencia",
              value: form.observaciones_permanencia || "",
              onChange: handleChange,
              placeholder: "Observaciones de permanencia",
              maxLength: 200,
              rows: 3,
            }),
          ),
        )

      default:
        return React.createElement(
          "div",
          { className: "text-center py-8 text-gray-500" },
          "Formulario en construcción para este servicio.",
        )
    }
  }

  const renderFormulario = (key) => {
    const servicio = servicios.find((s) => s.key === key)

    return React.createElement(
      "div",
      { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" },
      React.createElement(
        "div",
        { className: "bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" },
        React.createElement(
          "div",
          { className: `bg-gradient-to-r ${servicio.color} p-6 text-white rounded-t-xl` },
          React.createElement(
            "div",
            { className: "flex items-center justify-between" },
            React.createElement(
              "div",
              { className: "flex items-center space-x-3" },
              servicio.icono,
              React.createElement("h3", { className: "text-xl font-bold" }, servicio.nombre),
            ),
            React.createElement(
              "button",
              {
                onClick: () => setServicioActivo(null),
                className: "text-white hover:text-gray-200 text-2xl",
              },
              "×",
            ),
          ),
          React.createElement("p", { className: "mt-2 opacity-90" }, servicio.descripcion),
        ),
        React.createElement(
          "form",
          {
            onSubmit: (e) => handleSubmit(e, key),
            className: "p-6",
          },
          React.createElement(
            "div",
            { className: "mb-6" },
            React.createElement(
              "h4",
              { className: "text-lg font-semibold text-gray-800 mb-4" },
              "Información del Estudiante",
            ),
            renderCamposEstudiante(),
          ),
          React.createElement(
            "div",
            { className: "border-t pt-6" },
            React.createElement(
              "h4",
              { className: "text-lg font-semibold text-gray-800 mb-4" },
              "Información del Servicio",
            ),
            renderCamposServicio(key),
          ),
          mensaje.tipo &&
            React.createElement(
              "div",
              {
                className: `p-4 rounded-lg mb-4 flex items-center space-x-2 ${
                  mensaje.tipo === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`,
              },
              mensaje.tipo === "success"
                ? React.createElement(CheckCircle, { className: "w-5 h-5" })
                : React.createElement(AlertCircle, { className: "w-5 h-5" }),
              React.createElement("span", null, mensaje.texto),
            ),
          React.createElement(
            "div",
            { className: "flex justify-end space-x-3" },
            React.createElement(
              "button",
              {
                type: "button",
                onClick: () => setServicioActivo(null),
                className:
                  "px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors",
              },
              "Cancelar",
            ),
            React.createElement(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: `px-6 py-2 bg-gradient-to-r ${servicio.color} text-white rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 disabled:opacity-50`,
              },
              loading && React.createElement(Loader2, { className: "w-4 h-4 animate-spin" }),
              React.createElement("span", null, loading ? "Enviando..." : "Registrar"),
            ),
          ),
        ),
      ),
    )
  }

  return React.createElement(
    "div",
    { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" },
    React.createElement(
      "div",
      { className: "max-w-7xl mx-auto p-4" },
      React.createElement(
        "div",
        { className: "text-center mb-8" },
        React.createElement(
          "h1",
          { className: "text-4xl font-bold text-gray-800 mb-2" },
          "Servicios de Permanencia Estudiantil",
        ),
        React.createElement(
          "p",
          { className: "text-gray-600 text-lg" },
          "Sistema integral de registro y seguimiento para estudiantes UPC",
        ),
      ),
      React.createElement(
        "div",
        { className: "flex justify-center mb-6" },
        React.createElement(
          "div",
          { className: "bg-white rounded-lg p-1 shadow-lg" },
          React.createElement(
            "button",
            {
              onClick: () => setVistaActual("dashboard"),
              className: `px-6 py-2 rounded-md transition-colors ${
                vistaActual === "dashboard" ? "bg-institucional-verde1 text-white" : "text-gray-600 hover:text-blue-500"
              }`,
            },
            "Registros",
          ),
          React.createElement(
            "button",
            {
              onClick: () => setVistaActual("servicios"),
              className: `px-6 py-2 rounded-md transition-colors ${
                vistaActual === "servicios" ? "bg-institucional-verde1 text-white" : "text-gray-600 hover:text-blue-500"
              }`,
            },
            "Servicios",
          ),
        ),
      ),
      vistaActual === "dashboard" ? renderDashboard() : renderServicios(),
      servicioActivo && renderFormulario(servicioActivo),
    ),
  )
}

export default ServiciosPermanencia
