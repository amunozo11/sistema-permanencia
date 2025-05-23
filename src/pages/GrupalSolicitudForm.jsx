"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronUp, ChevronDown, AlertCircle, Search, Download, Eye, EyeOff } from "lucide-react"
import FormField from "../components/FormField"
import Notification from "../components/Notification"

export default function GrupalSolicitudForm() {
  const [formData, setFormData] = useState({
    fecha_solicitud: "",
    nombre_docente_permanencia: "",
    celular_permanencia: "",
    correo_permanencia: "",
    estudiante_programa_academico_permanencia: "",
    tipo_poblacion: "",
    nombre_docente_asignatura: "",
    celular_docente_asignatura: "",
    correo_docente_asignatura: "",
    estudiante_programa_academico_docente_asignatura: "",
    asignatura_intervenir: "",
    grupo: "",
    semestre: "",
    numero_estudiantes: "",
    tematica_sugerida: "",
    fecha_estudiante_programa_academicoda: "",
    hora: "",
    aula: "",
    bloque: "",
    sede: "",
    estado: "",
    motivo: "",
  })

  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState({ type: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para la tabla
  const [tableData, setTableData] = useState([])
  const [isLoadingTable, setIsLoadingTable] = useState(true)
  const [showTable, setShowTable] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Cargar datos de la tabla
  useEffect(() => {
  const loadTableData = async () => {
    setIsLoadingTable(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/intervenciones-grupales`)
      if (!response.ok) {
        throw new Error(`Error al obtener intervenciones: ${response.statusText}`)
      }

      const data = await response.json()
      setTableData(data)
    } catch (error) {
      console.error("Error al cargar datos:", error)
    } finally {
      setIsLoadingTable(false)
    }
  }

  if (showTable) {
    loadTableData()
  }
}, [showTable])


  // Datos ordenados y filtrados
  const sortedAndFilteredData = useMemo(() => {
    const filteredData = tableData.filter((item) =>
      Object.values(item).some((val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const aVal = a[sortConfig.key] ?? ""
        const bVal = b[sortConfig.key] ?? ""
        const cmp = typeof aVal === "string" ? aVal.localeCompare(bVal) : aVal - bVal
        return sortConfig.direction === "ascending" ? cmp : -cmp
      })
    }

    return filteredData
  }, [tableData, sortConfig, searchTerm])

  // Paginación
  const totalPages = Math.ceil(sortedAndFilteredData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedData = sortedAndFilteredData.slice(startIndex, startIndex + rowsPerPage)

  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") direction = "descending"
    setSortConfig({ key, direction })
  }

  const renderSortIndicator = (key) =>
    sortConfig.key !== key ? (
      <ChevronUp className="h-4 w-4 opacity-30" />
    ) : sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )

  const exportToCSV = () => {
    const headers = [
      "Fecha Solicitud",
      "Docente Permanencia",
      "Programa Permanencia",
      "Tipo Población",
      "Docente Asignatura",
      "Programa Asignatura",
      "Asignatura",
      "Grupo",
      "Semestre",
      "Estudiantes",
      "Fecha Programada",
      "Hora",
      "Aula",
      "Bloque",
      "Sede",
      "Estado",
      "Motivo",
      "Efectividad",
    ]

    const csvRows = [
      headers.join(","),
      ...sortedAndFilteredData.map((row) =>
        [
          row.fecha_solicitud,
          `"${row.nombre_docente_permanencia}"`,
          `"${row.estudiante_programa_academico_permanencia}"`,
          `"${row.tipo_poblacion}"`,
          `"${row.nombre_docente_asignatura}"`,
          `"${row.estudiante_programa_academico_docente_asignatura}"`,
          `"${row.asignatura_intervenir}"`,
          row.grupo,
          row.semestre,
          row.numero_estudiantes,
          row.fecha_estudiante_programa_academicoda,
          row.hora,
          row.aula,
          row.bloque,
          `"${row.sede}"`,
          row.estado,
          `"${row.motivo || ""}"`,
          row.efectividad,
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "intervenciones_grupales.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleChange = (name, value) => {
    let newValue = value

    // Validaciones específicas
    if (
      ["celular_permanencia", "celular_docente_asignatura", "grupo", "semestre", "numero_estudiantes"].includes(name)
    ) {
      newValue = value.replace(/\D/g, "")
    }

    if (
      [
        "nombre_docente_permanencia",
        "estudiante_programa_academico_permanencia",
        "tipo_poblacion",
        "nombre_docente_asignatura",
        "estudiante_programa_academico_docente_asignatura",
        "asignatura_intervenir",
        "sede",
      ].includes(name)
    ) {
      newValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "")
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Limpiar error cuando el usuario comienza a corregir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.fecha_solicitud) {
      newErrors.fecha_solicitud = "La fecha de solicitud es requerida"
    }

    if (!formData.nombre_docente_permanencia.trim()) {
      newErrors.nombre_docente_permanencia = "El nombre del docente de permanencia es requerido"
    }

    if (!formData.celular_permanencia || !/^\d{10}$/.test(formData.celular_permanencia)) {
      newErrors.celular_permanencia = "El celular debe tener 10 dígitos"
    }

    if (!formData.correo_permanencia.trim() || !emailRegex.test(formData.correo_permanencia)) {
      newErrors.correo_permanencia = "El correo de permanencia es inválido"
    }

    if (!formData.estudiante_programa_academico_permanencia.trim()) {
      newErrors.estudiante_programa_academico_permanencia = "El programa de permanencia es requerido"
    }

    if (!formData.tipo_poblacion.trim()) {
      newErrors.tipo_poblacion = "El tipo de población es requerido"
    }

    if (!formData.nombre_docente_asignatura.trim()) {
      newErrors.nombre_docente_asignatura = "El nombre del docente de asignatura es requerido"
    }

    if (!formData.celular_docente_asignatura || !/^\d{10}$/.test(formData.celular_docente_asignatura)) {
      newErrors.celular_docente_asignatura = "El celular debe tener 10 dígitos"
    }

    if (!formData.correo_docente_asignatura.trim() || !emailRegex.test(formData.correo_docente_asignatura)) {
      newErrors.correo_docente_asignatura = "El correo del docente de asignatura es inválido"
    }

    if (!formData.estudiante_programa_academico_docente_asignatura.trim()) {
      newErrors.estudiante_programa_academico_docente_asignatura = "El programa del docente de asignatura es requerido"
    }

    if (!formData.asignatura_intervenir.trim()) {
      newErrors.asignatura_intervenir = "La asignatura a intervenir es requerida"
    }

    if (!formData.grupo) {
      newErrors.grupo = "El grupo es requerido"
    }

    if (!formData.semestre) {
      newErrors.semestre = "El semestre es requerido"
    }

    if (!formData.numero_estudiantes) {
      newErrors.numero_estudiantes = "El número de estudiantes es requerido"
    }

    if (!formData.fecha_estudiante_programa_academicoda) {
      newErrors.fecha_estudiante_programa_academicoda = "La fecha programada es requerida"
    }

    if (!formData.hora) {
      newErrors.hora = "La hora es requerida"
    }

    if (!formData.aula.trim()) {
      newErrors.aula = "El aula es requerida"
    }

    if (!formData.bloque.trim()) {
      newErrors.bloque = "El bloque es requerido"
    }

    if (!formData.sede.trim()) {
      newErrors.sede = "La sede es requerida"
    }

    if (!formData.estado) {
      newErrors.estado = "El estado es requerido"
    }

    if (formData.estado !== "se hizo" && !formData.motivo.trim()) {
      newErrors.motivo = "El motivo es requerido cuando el estado no es 'se hizo'"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!validateForm()) {
    setNotification({
      type: "error",
      message: "Por favor, corrige los errores en el formulario",
    })
    return
  }

  setIsSubmitting(true)

  try {
    const payload = {
      ...formData,
      efectividad: formData.estado === "se hizo" ? "Pendiente evaluación" : "N/A",
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/intervenciones-grupales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error desconocido al registrar la intervención")
    }

    const savedRecord = await response.json()

    setNotification({
      type: "success",
      message: "Intervención grupal registrada exitosamente",
    })

    const newRecord = {
      id: savedRecord.id || Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
    }

    setTableData((prev) => [newRecord, ...prev])

    // Limpiar formulario
    setFormData({
      fecha_solicitud: "",
      nombre_docente_permanencia: "",
      celular_permanencia: "",
      correo_permanencia: "",
      estudiante_programa_academico_permanencia: "",
      tipo_poblacion: "",
      nombre_docente_asignatura: "",
      celular_docente_asignatura: "",
      correo_docente_asignatura: "",
      estudiante_programa_academico_docente_asignatura: "",
      asignatura_intervenir: "",
      grupo: "",
      semestre: "",
      numero_estudiantes: "",
      tematica_sugerida: "",
      fecha_estudiante_programa_academicoda: "",
      hora: "",
      aula: "",
      bloque: "",
      sede: "",
      estado: "",
      motivo: "",
    })
  } catch (error) {
    console.error("Error:", error)
    setNotification({
      type: "error",
      message: "Error al registrar la intervención grupal: " + error.message,
    })
  } finally {
    setIsSubmitting(false)
  }
}

  const closeNotification = () => {
    setNotification({ type: "", message: "" })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Notification type={notification.type} message={notification.message} onClose={closeNotification} />

      {/* Formulario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-institucional-verde1 p-4 text-white">
          <h2 className="text-2xl font-bold">Solicitud de Intervención Grupal</h2>
          <p className="text-sm opacity-80">
            Complete el formulario para registrar una solicitud de intervención grupal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Información de Permanencia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Fecha de Solicitud"
                name="fecha_solicitud"
                type="date"
                value={formData.fecha_solicitud}
                onChange={handleChange}
                required
                error={errors.fecha_solicitud}
              />

              <FormField
                label="Nombre Docente Permanencia"
                name="nombre_docente_permanencia"
                value={formData.nombre_docente_permanencia}
                onChange={handleChange}
                required
                error={errors.nombre_docente_permanencia}
              />

              <FormField
                label="Celular Permanencia"
                name="celular_permanencia"
                value={formData.celular_permanencia}
                onChange={handleChange}
                required
                pattern="\d{10}"
                error={errors.celular_permanencia}
              />

              <FormField
                label="Correo Permanencia"
                name="correo_permanencia"
                type="email"
                value={formData.correo_permanencia}
                onChange={handleChange}
                required
                error={errors.correo_permanencia}
              />

              <FormField
                label="Programa Permanencia"
                name="estudiante_programa_academico_permanencia"
                value={formData.estudiante_programa_academico_permanencia}
                onChange={handleChange}
                required
                error={errors.estudiante_programa_academico_permanencia}
              />

              <FormField
                label="Tipo de Población"
                name="tipo_poblacion"
                value={formData.tipo_poblacion}
                onChange={handleChange}
                required
                error={errors.tipo_poblacion}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Información del Docente de Asignatura</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nombre Docente Asignatura"
                name="nombre_docente_asignatura"
                value={formData.nombre_docente_asignatura}
                onChange={handleChange}
                required
                error={errors.nombre_docente_asignatura}
              />

              <FormField
                label="Celular Docente Asignatura"
                name="celular_docente_asignatura"
                value={formData.celular_docente_asignatura}
                onChange={handleChange}
                required
                pattern="\d{10}"
                error={errors.celular_docente_asignatura}
              />

              <FormField
                label="Correo Docente Asignatura"
                name="correo_docente_asignatura"
                type="email"
                value={formData.correo_docente_asignatura}
                onChange={handleChange}
                required
                error={errors.correo_docente_asignatura}
              />

              <FormField
                label="Programa Docente Asignatura"
                name="estudiante_programa_academico_docente_asignatura"
                value={formData.estudiante_programa_academico_docente_asignatura}
                onChange={handleChange}
                required
                error={errors.estudiante_programa_academico_docente_asignatura}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Información de la Intervención</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Asignatura a Intervenir"
                name="asignatura_intervenir"
                value={formData.asignatura_intervenir}
                onChange={handleChange}
                required
                error={errors.asignatura_intervenir}
              />

              <FormField
                label="Grupo"
                name="grupo"
                type="number"
                value={formData.grupo}
                onChange={handleChange}
                required
                min="1"
                error={errors.grupo}
              />

              <FormField
                label="Semestre"
                name="semestre"
                type="number"
                value={formData.semestre}
                onChange={handleChange}
                required
                min="1"
                error={errors.semestre}
              />

              <FormField
                label="Número de Estudiantes"
                name="numero_estudiantes"
                type="number"
                value={formData.numero_estudiantes}
                onChange={handleChange}
                required
                min="1"
                error={errors.numero_estudiantes}
              />

              <div className="md:col-span-2">
                <FormField
                  label="Temática Sugerida (opcional)"
                  name="tematica_sugerida"
                  type="textarea"
                  value={formData.tematica_sugerida}
                  onChange={handleChange}
                  error={errors.tematica_sugerida}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Programación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Fecha Programada"
                name="fecha_estudiante_programa_academicoda"
                type="date"
                value={formData.fecha_estudiante_programa_academicoda}
                onChange={handleChange}
                required
                error={errors.fecha_estudiante_programa_academicoda}
              />

              <FormField
                label="Hora"
                name="hora"
                type="time"
                value={formData.hora}
                onChange={handleChange}
                required
                error={errors.hora}
              />

              <FormField
                label="Aula"
                name="aula"
                value={formData.aula}
                onChange={handleChange}
                required
                error={errors.aula}
              />

              <FormField
                label="Bloque"
                name="bloque"
                value={formData.bloque}
                onChange={handleChange}
                required
                error={errors.bloque}
              />

              <FormField
                label="Sede"
                name="sede"
                value={formData.sede}
                onChange={handleChange}
                required
                error={errors.sede}
              />

              <FormField
                label="Estado"
                name="estado"
                type="select"
                value={formData.estado}
                onChange={handleChange}
                required
                options={[
                  { value: "se hizo", label: "Se hizo" },
                  { value: "no se hizo", label: "No se hizo" },
                  { value: "espera", label: "En espera" },
                  { value: "sin disponibilidad de tallerista", label: "Sin disponibilidad de tallerista" },
                ]}
                error={errors.estado}
              />

              {formData.estado !== "se hizo" && (
                <div className="md:col-span-2">
                  <FormField
                    label="Motivo"
                    name="motivo"
                    type="textarea"
                    value={formData.motivo}
                    onChange={handleChange}
                    required={formData.estado !== "se hizo"}
                    error={errors.motivo}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300 transition-colors"
              onClick={() => {
                setFormData({
                  fecha_solicitud: "",
                  nombre_docente_permanencia: "",
                  celular_permanencia: "",
                  correo_permanencia: "",
                  estudiante_programa_academico_permanencia: "",
                  tipo_poblacion: "",
                  nombre_docente_asignatura: "",
                  celular_docente_asignatura: "",
                  correo_docente_asignatura: "",
                  estudiante_programa_academico_docente_asignatura: "",
                  asignatura_intervenir: "",
                  grupo: "",
                  semestre: "",
                  numero_estudiantes: "",
                  tematica_sugerida: "",
                  fecha_estudiante_programa_academicoda: "",
                  hora: "",
                  aula: "",
                  bloque: "",
                  sede: "",
                  estado: "",
                  motivo: "",
                })
                setErrors({})
              }}
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-institucional-verde1 text-white rounded-md hover:bg-institucional-verde2 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Registrar Intervención"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Sección de tabla */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-institucional-verde2 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Registro de Intervenciones Grupales</h3>
              <p className="text-sm opacity-80">Historial de solicitudes de intervención grupal</p>
            </div>
            <button
              onClick={() => setShowTable(!showTable)}
              className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {showTable ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showTable ? "Ocultar" : "Ver"} Registros
            </button>
          </div>
        </div>

        {showTable && (
          <div className="p-6">
            {/* Controles de tabla */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar intervenciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-institucional-verde2"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-institucional-verde1 text-white rounded-lg hover:bg-institucional-verde2 transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </button>
              </div>
            </div>

            {/* Tabla */}
            {isLoadingTable ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-institucional-verde1"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-institucional-verde1 text-white">
                      <tr>
                        {[
                          ["fecha_solicitud", "Fecha"],
                          ["nombre_docente_permanencia", "Doc. Permanencia"],
                          ["estudiante_programa_academico_permanencia", "Prog. Permanencia"],
                          ["nombre_docente_asignatura", "Doc. Asignatura"],
                          ["asignatura_intervenir", "Asignatura"],
                          ["grupo", "Grupo"],
                          ["semestre", "Semestre"],
                          ["numero_estudiantes", "Estudiantes"],
                          ["fecha_estudiante_programa_academicoda", "Fecha Prog."],
                          ["hora", "Hora"],
                          ["aula", "Aula"],
                          ["sede", "Sede"],
                          ["estado", "Estado"],
                          ["efectividad", "Efectividad"],
                        ].map(([key, label]) => (
                          <th
                            key={key}
                            className="px-4 py-3 text-left cursor-pointer hover:bg-institucional-verde2 transition-colors"
                            onClick={() => requestSort(key)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{label}</span>
                              {renderSortIndicator(key)}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length === 0 ? (
                        <tr>
                          <td colSpan={14} className="py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <AlertCircle className="h-12 w-12 mb-4 text-gray-300" />
                              <p className="text-lg font-medium">No hay intervenciones registradas</p>
                              <p className="text-sm">Las intervenciones aparecerán aquí una vez que se registren</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((row, idx) => (
                          <tr
                            key={row.id}
                            className={`${
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-institucional-verde3/10 transition-colors`}
                          >
                            <td className="px-4 py-3">{row.fecha_solicitud}</td>
                            <td className="px-4 py-3 font-medium">{row.nombre_docente_permanencia}</td>
                            <td className="px-4 py-3">{row.estudiante_programa_academico_permanencia}</td>
                            <td className="px-4 py-3">{row.nombre_docente_asignatura}</td>
                            <td className="px-4 py-3 max-w-xs truncate" title={row.asignatura_intervenir}>
                              {row.asignatura_intervenir}
                            </td>
                            <td className="px-4 py-3">{row.grupo}</td>
                            <td className="px-4 py-3">{row.semestre}</td>
                            <td className="px-4 py-3">{row.numero_estudiantes}</td>
                            <td className="px-4 py-3">{row.fecha_estudiante_programa_academicoda}</td>
                            <td className="px-4 py-3">{row.hora}</td>
                            <td className="px-4 py-3">{row.aula}</td>
                            <td className="px-4 py-3">{row.sede}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  row.estado === "se hizo"
                                    ? "bg-green-100 text-green-800"
                                    : row.estado === "no se hizo"
                                      ? "bg-red-100 text-red-800"
                                      : row.estado === "espera"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {row.estado}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  row.efectividad === "Alta"
                                    ? "bg-green-100 text-green-800"
                                    : row.efectividad === "Media"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : row.efectividad === "Baja"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {row.efectividad}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-600">
                      Mostrando {startIndex + 1} a {Math.min(startIndex + rowsPerPage, sortedAndFilteredData.length)} de{" "}
                      {sortedAndFilteredData.length} registros
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                      >
                        Anterior
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded transition-colors ${
                              currentPage === pageNum
                                ? "bg-institucional-verde1 text-white"
                                : "border border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
