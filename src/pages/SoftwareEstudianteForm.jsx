"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronUp, ChevronDown, AlertCircle, Search, Download, Eye, EyeOff } from "lucide-react"
import FormField from "../components/FormField"
import Notification from "../components/Notification"

export default function SoftwareEstudianteForm() {
  const [formData, setFormData] = useState({
    solicitud_id: "",
    numero_identificacion: "",
    nombre_estudiante: "",
    correo: "",
    telefono: "",
    semestre: "",
  })

  const [solicitudes, setSolicitudes] = useState([])
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState({ type: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingSolicitudes, setIsLoadingSolicitudes] = useState(false)

  // Estados para la tabla
  const [tableData, setTableData] = useState([])
  const [isLoadingTable, setIsLoadingTable] = useState(true)
  const [showTable, setShowTable] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Cargar solicitudes al montar el componente
  useEffect(() => {
  const fetchSolicitudes = async () => {
    setIsLoadingSolicitudes(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/solicitudes-software`)
      if (!response.ok) throw new Error("No se pudieron obtener las solicitudes")
      const data = await response.json()
      setSolicitudes(data)
    } catch (error) {
      console.error("Error:", error)
      setNotification({
        type: "error",
        message: "Error al cargar solicitudes: " + error.message,
      })
    } finally {
      setIsLoadingSolicitudes(false)
    }
  }

  fetchSolicitudes()
}, [])

  // Cargar datos de la tabla
  useEffect(() => {
  const loadTableData = async () => {
    setIsLoadingTable(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/software-estudiantes`)
      if (!response.ok) throw new Error("Error al obtener los datos de estudiantes")

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
      "Identificación",
      "Nombre",
      "Correo",
      "Teléfono",
      "Semestre",
      "Programa",
      "Asignatura",
      "Docente",
      "Fecha Registro",
    ]

    const csvRows = [
      headers.join(","),
      ...sortedAndFilteredData.map((row) =>
        [
          row.numero_identificacion,
          `"${row.nombre_estudiante}"`,
          row.correo,
          row.telefono,
          row.semestre,
          `"${row.programa}"`,
          `"${row.asignatura}"`,
          `"${row.docente}"`,
          new Date(row.createdAt).toLocaleDateString(),
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "estudiantes_software.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleChange = (name, value) => {
    let newValue = value

    if (["numero_identificacion", "telefono", "semestre"].includes(name)) {
      newValue = value.replace(/\D/g, "")
    }

    if (["nombre_estudiante"].includes(name)) {
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

    if (!formData.solicitud_id) {
      newErrors.solicitud_id = "La solicitud es requerida"
    }

    if (!formData.numero_identificacion || !/^\d{7,10}$/.test(formData.numero_identificacion)) {
      newErrors.numero_identificacion = "El número de identificación debe tener entre 7 y 10 dígitos"
    }

    if (!formData.nombre_estudiante.trim()) {
      newErrors.nombre_estudiante = "El nombre del estudiante es requerido"
    }

    if (!formData.correo.trim() || !emailRegex.test(formData.correo)) {
      newErrors.correo = "El correo electrónico es inválido"
    }

    if (!formData.telefono || !/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos"
    }

    if (!formData.semestre) {
      newErrors.semestre = "El semestre es requerido"
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
    const selectedSolicitud = solicitudes.find((s) => s._id === formData.solicitud_id)

    const payload = {
      ...formData,
      programa: selectedSolicitud?.estudiante_programa_academico || "",
      asignatura: selectedSolicitud?.nombre_asignatura || "",
      docente: selectedSolicitud?.docente_tutor || "",
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/software-estudiantes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error al registrar estudiante")
    }

    const savedRecord = await response.json()

    setNotification({
      type: "success",
      message: "Estudiante registrado exitosamente",
    })

    const newRecord = {
      id: savedRecord.id || Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
    }

    setTableData((prev) => [newRecord, ...prev])

    // Limpiar formulario
    setFormData({
      solicitud_id: "",
      numero_identificacion: "",
      nombre_estudiante: "",
      correo: "",
      telefono: "",
      semestre: "",
    })
  } catch (error) {
    console.error("Error:", error)
    setNotification({
      type: "error",
      message: "Error al registrar el estudiante: " + error.message,
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
          <h2 className="text-2xl font-bold">Registro de Estudiante para Software</h2>
          <p className="text-sm opacity-80">
            Complete el formulario para registrar un estudiante en una solicitud de software
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                label="Solicitud de Software"
                name="solicitud_id"
                type="select"
                value={formData.solicitud_id}
                onChange={handleChange}
                required
                options={solicitudes.map((s) => ({
                  value: s._id,
                  label: `${s.estudiante_programa_academico} - ${s.nombre_asignatura} (${s.docente_tutor})`,
                }))}
                error={errors.solicitud_id}
              />
              {isLoadingSolicitudes && <p className="text-sm text-gray-500 mt-1">Cargando solicitudes...</p>}
              {!isLoadingSolicitudes && solicitudes.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  No hay solicitudes disponibles. Por favor, cree una solicitud primero.
                </p>
              )}
            </div>

            <FormField
              label="Número de Identificación"
              name="numero_identificacion"
              value={formData.numero_identificacion}
              onChange={handleChange}
              required
              pattern="\d{7,10}"
              error={errors.numero_identificacion}
            />

            <FormField
              label="Nombre del Estudiante"
              name="nombre_estudiante"
              value={formData.nombre_estudiante}
              onChange={handleChange}
              required
              error={errors.nombre_estudiante}
            />

            <FormField
              label="Correo Electrónico"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              required
              error={errors.correo}
            />

            <FormField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              pattern="\d{10}"
              error={errors.telefono}
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

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300 transition-colors"
              onClick={() => {
                setFormData({
                  solicitud_id: "",
                  numero_identificacion: "",
                  nombre_estudiante: "",
                  correo: "",
                  telefono: "",
                  semestre: "",
                })
                setErrors({})
              }}
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-institucional-verde1 text-white rounded-md hover:bg-institucional-verde2 transition-colors"
              disabled={isSubmitting || solicitudes.length === 0}
            >
              {isSubmitting ? "Enviando..." : "Registrar Estudiante"}
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
              <h3 className="text-xl font-bold">Estudiantes Registrados en Software</h3>
              <p className="text-sm opacity-80">Lista de estudiantes asignados a solicitudes de software</p>
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
                  placeholder="Buscar estudiantes..."
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
                          ["numero_identificacion", "Identificación"],
                          ["nombre_estudiante", "Nombre"],
                          ["correo", "Correo"],
                          ["telefono", "Teléfono"],
                          ["semestre", "Semestre"],
                          ["programa", "Programa"],
                          ["asignatura", "Asignatura"],
                          ["docente", "Docente"],
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
                          <td colSpan={9} className="py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <AlertCircle className="h-12 w-12 mb-4 text-gray-300" />
                              <p className="text-lg font-medium">No hay estudiantes registrados</p>
                              <p className="text-sm">Los estudiantes aparecerán aquí una vez que se registren</p>
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
                            <td className="px-4 py-3 font-medium">{row.numero_identificacion}</td>
                            <td className="px-4 py-3">{row.nombre_estudiante}</td>
                            <td className="px-4 py-3">{row.correo}</td>
                            <td className="px-4 py-3">{row.telefono}</td>
                            <td className="px-4 py-3">{row.semestre}</td>
                            <td className="px-4 py-3">{row.programa}</td>
                            <td className="px-4 py-3">{row.asignatura}</td>
                            <td className="px-4 py-3">{row.docente}</td>
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
