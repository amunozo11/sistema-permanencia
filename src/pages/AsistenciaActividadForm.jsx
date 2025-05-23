"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronUp, ChevronDown, AlertCircle, Search, Download, Eye, EyeOff } from "lucide-react"
import FormField from "../components/FormField"
import Notification from "../components/Notification"

export default function AsistenciaActividadForm() {
  const [formData, setFormData] = useState({
    nombre_estudiante: "",
    numero_documento: "",
    estudiante_programa_academico_academico: "",
    semestre: "",
    nombre_actividad: "",
    modalidad: "",
    tipo_actividad: "",
    fecha_actividad: "",
    hora_inicio: "",
    hora_fin: "",
    modalidad_registro: "",
    observaciones: "",
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
        // Simular datos para demostración
        const mockData = [
          {
            id: 1,
            nombre_estudiante: "Carlos Andrés Ruiz",
            numero_documento: "1234567890",
            estudiante_programa_academico_academico: "Psicología",
            semestre: 4,
            nombre_actividad: "Taller de Manejo del Estrés",
            modalidad: "presencial",
            tipo_actividad: "Taller grupal",
            fecha_actividad: "2024-01-20",
            hora_inicio: "09:00",
            hora_fin: "11:00",
            modalidad_registro: "digital",
            observaciones: "Participación activa en el taller",
            createdAt: "2024-01-20T09:00:00Z",
          },
          {
            id: 2,
            nombre_estudiante: "Laura Sofía Martínez",
            numero_documento: "9876543210",
            estudiante_programa_academico_academico: "Administración de Empresas",
            semestre: 6,
            nombre_actividad: "Conferencia de Liderazgo",
            modalidad: "virtual",
            tipo_actividad: "Conferencia",
            fecha_actividad: "2024-01-21",
            hora_inicio: "14:00",
            hora_fin: "16:00",
            modalidad_registro: "manual",
            observaciones: "Excelente participación en preguntas",
            createdAt: "2024-01-21T14:00:00Z",
          },
          {
            id: 3,
            nombre_estudiante: "Miguel Ángel Torres",
            numero_documento: "5555666677",
            estudiante_programa_academico_academico: "Ingeniería de Sistemas",
            semestre: 8,
            nombre_actividad: "Sesión de Mindfulness",
            modalidad: "híbrida",
            tipo_actividad: "Sesión terapéutica",
            fecha_actividad: "2024-01-22",
            hora_inicio: "10:30",
            hora_fin: "12:00",
            modalidad_registro: "digital",
            observaciones: "Primera sesión, mostró interés",
            createdAt: "2024-01-22T10:30:00Z",
          },
        ]
        setTableData(mockData)
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
      "Nombre",
      "Documento",
      "Programa",
      "Semestre",
      "Actividad",
      "Modalidad",
      "Tipo",
      "Fecha",
      "Hora Inicio",
      "Hora Fin",
      "Registro",
      "Observaciones",
    ]

    const csvRows = [
      headers.join(","),
      ...sortedAndFilteredData.map((row) =>
        [
          `"${row.nombre_estudiante}"`,
          row.numero_documento,
          `"${row.estudiante_programa_academico_academico}"`,
          row.semestre,
          `"${row.nombre_actividad}"`,
          row.modalidad,
          `"${row.tipo_actividad}"`,
          row.fecha_actividad,
          row.hora_inicio,
          row.hora_fin,
          row.modalidad_registro,
          `"${row.observaciones || ""}"`,
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "asistencias_actividades.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleChange = (name, value) => {
    let newValue = value

    if (name === "numero_documento") {
      newValue = value.replace(/\D/g, "")
    }

    if (name === "nombre_estudiante" || name === "estudiante_programa_academico_academico") {
      newValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "")
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre_estudiante.trim()) {
      newErrors.nombre_estudiante = "El nombre del estudiante es requerido"
    }

    if (!formData.numero_documento || !/^\d{7,10}$/.test(formData.numero_documento)) {
      newErrors.numero_documento = "El número de documento debe tener entre 7 y 10 dígitos"
    }

    if (!formData.estudiante_programa_academico_academico.trim()) {
      newErrors.estudiante_programa_academico_academico = "El programa académico es requerido"
    }

    if (!formData.semestre) {
      newErrors.semestre = "El semestre es requerido"
    }

    if (!formData.nombre_actividad.trim()) {
      newErrors.nombre_actividad = "El nombre de la actividad es requerido"
    }

    if (!formData.modalidad) {
      newErrors.modalidad = "La modalidad es requerida"
    }

    if (!formData.tipo_actividad.trim()) {
      newErrors.tipo_actividad = "El tipo de actividad es requerido"
    }

    if (!formData.fecha_actividad) {
      newErrors.fecha_actividad = "La fecha de la actividad es requerida"
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = "La hora de inicio es requerida"
    }

    if (!formData.hora_fin) {
      newErrors.hora_fin = "La hora de finalización es requerida"
    }

    if (!formData.modalidad_registro) {
      newErrors.modalidad_registro = "La modalidad de registro es requerida"
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
      // Simular envío exitoso
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setNotification({
        type: "success",
        message: "Asistencia a actividad registrada exitosamente",
      })

      // Agregar a la tabla local
      const newRecord = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      }
      setTableData((prev) => [newRecord, ...prev])

      // Limpiar formulario
      setFormData({
        nombre_estudiante: "",
        numero_documento: "",
        estudiante_programa_academico_academico: "",
        semestre: "",
        nombre_actividad: "",
        modalidad: "",
        tipo_actividad: "",
        fecha_actividad: "",
        hora_inicio: "",
        hora_fin: "",
        modalidad_registro: "",
        observaciones: "",
      })
    } catch (error) {
      console.error("Error:", error)
      setNotification({
        type: "error",
        message: "Error al registrar la asistencia: " + error.message,
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
          <h2 className="text-2xl font-bold">Asistencia a Actividad Psicológica</h2>
          <p className="text-sm opacity-80">
            Complete el formulario para registrar la asistencia a una actividad psicológica
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Nombre del Estudiante"
              name="nombre_estudiante"
              value={formData.nombre_estudiante}
              onChange={handleChange}
              required
              error={errors.nombre_estudiante}
            />

            <FormField
              label="Número de Documento"
              name="numero_documento"
              value={formData.numero_documento}
              onChange={handleChange}
              required
              pattern="\d{7,10}"
              error={errors.numero_documento}
            />

            <FormField
              label="Programa Académico"
              name="estudiante_programa_academico_academico"
              value={formData.estudiante_programa_academico_academico}
              onChange={handleChange}
              required
              error={errors.estudiante_programa_academico_academico}
            />

            <FormField
              label="Semestre"
              name="semestre"
              type="number"
              value={formData.semestre}
              onChange={handleChange}
              required
              min="1"
              max="10"
              error={errors.semestre}
            />

            <FormField
              label="Nombre de la Actividad"
              name="nombre_actividad"
              value={formData.nombre_actividad}
              onChange={handleChange}
              required
              error={errors.nombre_actividad}
            />

            <FormField
              label="Modalidad"
              name="modalidad"
              type="select"
              value={formData.modalidad}
              onChange={handleChange}
              required
              options={[
                { value: "presencial", label: "Presencial" },
                { value: "virtual", label: "Virtual" },
                { value: "híbrida", label: "Híbrida" },
              ]}
              error={errors.modalidad}
            />

            <FormField
              label="Tipo de Actividad"
              name="tipo_actividad"
              value={formData.tipo_actividad}
              onChange={handleChange}
              required
              error={errors.tipo_actividad}
            />

            <FormField
              label="Fecha de la Actividad"
              name="fecha_actividad"
              type="date"
              value={formData.fecha_actividad}
              onChange={handleChange}
              required
              error={errors.fecha_actividad}
            />

            <FormField
              label="Hora de Inicio"
              name="hora_inicio"
              type="time"
              value={formData.hora_inicio}
              onChange={handleChange}
              required
              error={errors.hora_inicio}
            />

            <FormField
              label="Hora de Finalización"
              name="hora_fin"
              type="time"
              value={formData.hora_fin}
              onChange={handleChange}
              required
              error={errors.hora_fin}
            />

            <FormField
              label="Modalidad de Registro"
              name="modalidad_registro"
              type="select"
              value={formData.modalidad_registro}
              onChange={handleChange}
              required
              options={[
                { value: "manual", label: "Manual" },
                { value: "digital", label: "Digital" },
              ]}
              error={errors.modalidad_registro}
            />

            <div className="md:col-span-2">
              <FormField
                label="Observaciones (opcional)"
                name="observaciones"
                type="textarea"
                value={formData.observaciones}
                onChange={handleChange}
                error={errors.observaciones}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300 transition-colors"
              onClick={() => {
                setFormData({
                  nombre_estudiante: "",
                  numero_documento: "",
                  estudiante_programa_academico_academico: "",
                  semestre: "",
                  nombre_actividad: "",
                  modalidad: "",
                  tipo_actividad: "",
                  fecha_actividad: "",
                  hora_inicio: "",
                  hora_fin: "",
                  modalidad_registro: "",
                  observaciones: "",
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
              {isSubmitting ? "Enviando..." : "Registrar Asistencia"}
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
              <h3 className="text-xl font-bold">Registro de Asistencias a Actividades</h3>
              <p className="text-sm opacity-80">Historial de asistencias a actividades psicológicas</p>
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
                  placeholder="Buscar asistencias..."
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
                          ["nombre_estudiante", "Estudiante"],
                          ["numero_documento", "Documento"],
                          ["estudiante_programa_academico_academico", "Programa"],
                          ["semestre", "Semestre"],
                          ["nombre_actividad", "Actividad"],
                          ["modalidad", "Modalidad"],
                          ["tipo_actividad", "Tipo"],
                          ["fecha_actividad", "Fecha"],
                          ["hora_inicio", "Inicio"],
                          ["hora_fin", "Fin"],
                          ["createdAt", "Registrado"],
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
                          <td colSpan={11} className="py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <AlertCircle className="h-12 w-12 mb-4 text-gray-300" />
                              <p className="text-lg font-medium">No hay asistencias registradas</p>
                              <p className="text-sm">Las asistencias aparecerán aquí una vez que se registren</p>
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
                            <td className="px-4 py-3 font-medium">{row.nombre_estudiante}</td>
                            <td className="px-4 py-3">{row.numero_documento}</td>
                            <td className="px-4 py-3">{row.estudiante_programa_academico_academico}</td>
                            <td className="px-4 py-3">{row.semestre}</td>
                            <td className="px-4 py-3 max-w-xs truncate" title={row.nombre_actividad}>
                              {row.nombre_actividad}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  row.modalidad === "presencial"
                                    ? "bg-blue-100 text-blue-800"
                                    : row.modalidad === "virtual"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {row.modalidad}
                              </span>
                            </td>
                            <td className="px-4 py-3">{row.tipo_actividad}</td>
                            <td className="px-4 py-3">{row.fecha_actividad}</td>
                            <td className="px-4 py-3">{row.hora_inicio}</td>
                            <td className="px-4 py-3">{row.hora_fin}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {new Date(row.createdAt).toLocaleDateString()}
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
