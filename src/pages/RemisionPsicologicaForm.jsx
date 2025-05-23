"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronUp, ChevronDown, AlertCircle, Search, Download, Eye, EyeOff } from "lucide-react"
import FormField from "../components/FormField"
import Notification from "../components/Notification"

export default function RemisionPsicologicaForm() {
  const [formData, setFormData] = useState({
    nombre_estudiante: "",
    numero_documento: "",
    estudiante_programa_academico_academico: "",
    semestre: "",
    motivo_remision: "",
    docente_remite: "",
    correo_docente: "",
    telefono_docente: "",
    fecha: "",
    hora: "",
    tipo_remision: "",
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/remisiones-psicologicas`)
      if (!response.ok) throw new Error("Error al obtener remisiones")
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
      "Nombre Estudiante",
      "Documento",
      "Programa",
      "Semestre",
      "Motivo",
      "Docente",
      "Correo Docente",
      "Teléfono",
      "Fecha",
      "Hora",
      "Tipo",
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
          `"${row.motivo_remision}"`,
          `"${row.docente_remite}"`,
          row.correo_docente,
          row.telefono_docente,
          row.fecha,
          row.hora,
          row.tipo_remision,
          `"${row.observaciones || ""}"`,
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "remisiones_psicologicas.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleChange = (name, value) => {
    let newValue = value

    if (["numero_documento", "telefono_docente", "semestre"].includes(name)) {
      newValue = value.replace(/\D/g, "")
    }

    if (["nombre_estudiante", "estudiante_programa_academico_academico", "docente_remite"].includes(name)) {
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

    if (!formData.motivo_remision.trim()) {
      newErrors.motivo_remision = "El motivo de remisión es requerido"
    }

    if (!formData.docente_remite.trim()) {
      newErrors.docente_remite = "El docente que remite es requerido"
    }

    if (!formData.correo_docente.trim() || !emailRegex.test(formData.correo_docente)) {
      newErrors.correo_docente = "El correo del docente es inválido"
    }

    if (!formData.telefono_docente || !/^\d{10}$/.test(formData.telefono_docente)) {
      newErrors.telefono_docente = "El teléfono del docente debe tener 10 dígitos"
    }

    if (!formData.fecha) {
      newErrors.fecha = "La fecha es requerida"
    }

    if (!formData.hora) {
      newErrors.hora = "La hora es requerida"
    }

    if (!formData.tipo_remision) {
      newErrors.tipo_remision = "El tipo de remisión es requerido"
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
    const payload = { ...formData }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/remisiones-psicologicas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error al registrar la remisión")
    }

    const saved = await response.json()

    setNotification({
      type: "success",
      message: "Remisión psicológica registrada exitosamente",
    })

    const newRecord = {
      id: saved.id || Date.now(),
      ...payload,
      createdAt: saved.createdAt || new Date().toISOString(),
    }

    setTableData((prev) => [newRecord, ...prev])

    setFormData({
      nombre_estudiante: "",
      numero_documento: "",
      estudiante_programa_academico_academico: "",
      semestre: "",
      motivo_remision: "",
      docente_remite: "",
      correo_docente: "",
      telefono_docente: "",
      fecha: "",
      hora: "",
      tipo_remision: "",
      observaciones: "",
    })
  } catch (error) {
    console.error("Error:", error)
    setNotification({
      type: "error",
      message: "Error al registrar la remisión psicológica: " + error.message,
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
          <h2 className="text-2xl font-bold">Remisión Psicológica</h2>
          <p className="text-sm opacity-80">Complete el formulario para registrar una remisión psicológica</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Información del Estudiante</h3>
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
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Información de la Remisión</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormField
                  label="Motivo de la Remisión"
                  name="motivo_remision"
                  type="textarea"
                  value={formData.motivo_remision}
                  onChange={handleChange}
                  required
                  error={errors.motivo_remision}
                />
              </div>

              <FormField
                label="Docente que Remite"
                name="docente_remite"
                value={formData.docente_remite}
                onChange={handleChange}
                required
                error={errors.docente_remite}
              />

              <FormField
                label="Correo del Docente"
                name="correo_docente"
                type="email"
                value={formData.correo_docente}
                onChange={handleChange}
                required
                error={errors.correo_docente}
              />

              <FormField
                label="Teléfono del Docente"
                name="telefono_docente"
                value={formData.telefono_docente}
                onChange={handleChange}
                required
                pattern="\d{10}"
                error={errors.telefono_docente}
              />

              <FormField
                label="Tipo de Remisión"
                name="tipo_remision"
                type="select"
                value={formData.tipo_remision}
                onChange={handleChange}
                required
                options={[
                  { value: "individual", label: "Individual" },
                  { value: "grupal", label: "Grupal" },
                ]}
                error={errors.tipo_remision}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Programación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Fecha"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                required
                error={errors.fecha}
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
                  motivo_remision: "",
                  docente_remite: "",
                  correo_docente: "",
                  telefono_docente: "",
                  fecha: "",
                  hora: "",
                  tipo_remision: "",
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
              {isSubmitting ? "Enviando..." : "Registrar Remisión"}
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
              <h3 className="text-xl font-bold">Registros de Remisiones Psicológicas</h3>
              <p className="text-sm opacity-80">Historial de remisiones registradas en el sistema</p>
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
                  placeholder="Buscar en registros..."
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
                          ["motivo_remision", "Motivo"],
                          ["docente_remite", "Docente"],
                          ["tipo_remision", "Tipo"],
                          ["fecha", "Fecha"],
                          ["hora", "Hora"],
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
                          <td colSpan={10} className="py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <AlertCircle className="h-12 w-12 mb-4 text-gray-300" />
                              <p className="text-lg font-medium">No hay registros disponibles</p>
                              <p className="text-sm">Los registros aparecerán aquí una vez que se agreguen</p>
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
                            <td className="px-4 py-3 max-w-xs truncate" title={row.motivo_remision}>
                              {row.motivo_remision}
                            </td>
                            <td className="px-4 py-3">{row.docente_remite}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  row.tipo_remision === "individual"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {row.tipo_remision}
                              </span>
                            </td>
                            <td className="px-4 py-3">{row.fecha}</td>
                            <td className="px-4 py-3">{row.hora}</td>
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
