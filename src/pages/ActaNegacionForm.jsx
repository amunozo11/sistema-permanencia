"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Save,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Search,
  Download,
  Eye,
  EyeOff,
} from "lucide-react"
import FormField from "../components/FormField"
import Notification from "../components/Notification"

export default function ActaNegacionForm() {
  const [formData, setFormData] = useState({
    nombre_estudiante: "",
    documento_tipo: "",
    documento_numero: "",
    documento_expedido_en: "",
    estudiante_programa_academico: "",
    semestre: "",
    fecha_firma_dia: "",
    fecha_firma_mes: "",
    fecha_firma_anio: "",
    firma_estudiante: "",
    documento_firma_estudiante: "",
    docente_permanencia: "",
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/actas-negacion`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
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
      "Nombre",
      "Tipo Doc",
      "Número Doc",
      "Expedido En",
      "Programa",
      "Semestre",
      "Día Firma",
      "Mes Firma",
      "Año Firma",
      "Docente",
      "Estado",
      "Fecha Registro",
    ]

    const csvRows = [
      headers.join(","),
      ...sortedAndFilteredData.map((row) =>
        [
          `"${row.nombre_estudiante}"`,
          row.documento_tipo,
          row.documento_numero,
          `"${row.documento_expedido_en}"`,
          `"${row.estudiante_programa_academico}"`,
          row.semestre,
          row.fecha_firma_dia,
          row.fecha_firma_mes,
          row.fecha_firma_anio,
          `"${row.docente_permanencia}"`,
          row.estado,
          new Date(row.createdAt).toLocaleDateString(),
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "actas_negacion.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleChange = (name, value, type = "text", checked = false) => {
    let newValue = value

    // Validaciones específicas
    if (
      name === "documento_numero" ||
      name === "documento_firma_estudiante" ||
      name === "fecha_firma_dia" ||
      name === "fecha_firma_mes" ||
      name === "fecha_firma_anio"
    ) {
      newValue = value.replace(/\D/g, "")
    }

    if (
      name === "nombre_estudiante" ||
      name === "documento_expedido_en" ||
      name === "estudiante_programa_academico" ||
      name === "firma_estudiante" ||
      name === "docente_permanencia"
    ) {
      newValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "")
    }

    if (name === "nombre_estudiante") {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
        firma_estudiante: newValue,
      }))
    } else if (name === "documento_numero") {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
        documento_firma_estudiante: newValue,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : newValue,
      }))
    }

    // Limpiar error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre_estudiante.trim()) {
      newErrors.nombre_estudiante = "El nombre del estudiante es requerido"
    }

    if (!formData.documento_tipo) {
      newErrors.documento_tipo = "El tipo de documento es requerido"
    }

    if (!formData.documento_numero || !/^\d{7,10}$/.test(formData.documento_numero)) {
      newErrors.documento_numero = "El número de documento debe tener entre 7 y 10 dígitos"
    }

    if (!formData.documento_expedido_en.trim()) {
      newErrors.documento_expedido_en = "El lugar de expedición es requerido"
    }

    if (!formData.estudiante_programa_academico.trim()) {
      newErrors.estudiante_programa_academico = "El programa académico es requerido"
    }

    if (!formData.semestre.trim()) {
      newErrors.semestre = "El semestre es requerido"
    }

    if (!formData.fecha_firma_dia || !formData.fecha_firma_mes || !formData.fecha_firma_anio) {
      newErrors.fecha_firma_dia = "La fecha completa es requerida"
    }

    if (formData.firma_estudiante !== formData.nombre_estudiante) {
      newErrors.firma_estudiante = "La firma debe coincidir con el nombre del estudiante"
    }

    if (formData.documento_firma_estudiante !== formData.documento_numero) {
      newErrors.documento_firma_estudiante = "El documento debe coincidir con el número de documento"
    }

    if (!formData.docente_permanencia.trim()) {
      newErrors.docente_permanencia = "El nombre del docente es requerido"
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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/actas-negacion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error desconocido al enviar el acta")
    }

    const savedRecord = await response.json()

    setNotification({
      type: "success",
      message: "Acta de negación registrada exitosamente",
    })

    // Agregar a la tabla local (si tu backend no retorna el acta completa, puedes ajustar esto)
    const newRecord = {
      id: savedRecord.id || Date.now(), // usar ID real si lo devuelve el backend
      ...formData,
      estado: "Procesada",
      createdAt: new Date().toISOString(),
    }

    setTableData((prev) => [newRecord, ...prev])

    // Limpiar formulario
    setFormData({
      nombre_estudiante: "",
      documento_tipo: "",
      documento_numero: "",
      documento_expedido_en: "",
      estudiante_programa_academico: "",
      semestre: "",
      fecha_firma_dia: "",
      fecha_firma_mes: "",
      fecha_firma_anio: "",
      firma_estudiante: "",
      documento_firma_estudiante: "",
      docente_permanencia: "",
    })
  } catch (error) {
    console.error("Error:", error)
    setNotification({
      type: "error",
      message: "Error al registrar el acta: " + error.message,
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Acta de Negación de Acompañamiento Psicosocial</h2>
              <p className="text-sm opacity-80">
                Complete el formulario para registrar la negación de acompañamiento psicosocial
              </p>
            </div>
            <FileText className="h-10 w-10 opacity-80" />
          </div>
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
              helpText="Este valor se copiará automáticamente al campo de firma"
            />

            <FormField
              label="Tipo de Documento"
              name="documento_tipo"
              type="select"
              value={formData.documento_tipo}
              onChange={handleChange}
              required
              options={[
                { value: "C.C.", label: "Cédula de Ciudadanía" },
                { value: "T.I.", label: "Tarjeta de Identidad" },
              ]}
              error={errors.documento_tipo}
            />

            <FormField
              label="Número de Documento"
              name="documento_numero"
              value={formData.documento_numero}
              onChange={handleChange}
              required
              pattern="\d{7,10}"
              error={errors.documento_numero}
              helpText="Este valor se copiará automáticamente al campo de documento en firma"
            />

            <FormField
              label="Lugar de Expedición"
              name="documento_expedido_en"
              value={formData.documento_expedido_en}
              onChange={handleChange}
              required
              error={errors.documento_expedido_en}
            />

            <FormField
              label="Programa Académico"
              name="estudiante_programa_academico"
              value={formData.estudiante_programa_academico}
              onChange={handleChange}
              required
              error={errors.estudiante_programa_academico}
            />

            <FormField
              label="Semestre"
              name="semestre"
              value={formData.semestre}
              onChange={handleChange}
              required
              error={errors.semestre}
            />

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Fecha de Firma</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Día"
                  name="fecha_firma_dia"
                  value={formData.fecha_firma_dia}
                  onChange={handleChange}
                  required
                  pattern="\d{1,2}"
                  error={errors.fecha_firma_dia}
                />

                <FormField
                  label="Mes"
                  name="fecha_firma_mes"
                  value={formData.fecha_firma_mes}
                  onChange={handleChange}
                  required
                  pattern="\d{1,2}"
                  error={errors.fecha_firma_mes}
                />

                <FormField
                  label="Año"
                  name="fecha_firma_anio"
                  value={formData.fecha_firma_anio}
                  onChange={handleChange}
                  required
                  pattern="\d{4}"
                  error={errors.fecha_firma_anio}
                />
              </div>
            </div>

            <FormField
              label="Firma del Estudiante (Nombre completo)"
              name="firma_estudiante"
              value={formData.firma_estudiante}
              onChange={handleChange}
              required
              error={errors.firma_estudiante}
              showMatchWarning={true}
              matchValue={formData.nombre_estudiante}
              matchLabel="el nombre del estudiante"
              helpText="Debe coincidir exactamente con el nombre del estudiante"
            />

            <FormField
              label="Documento (Firma Estudiante)"
              name="documento_firma_estudiante"
              value={formData.documento_firma_estudiante}
              onChange={handleChange}
              required
              pattern="\d{7,10}"
              error={errors.documento_firma_estudiante}
              showMatchWarning={true}
              matchValue={formData.documento_numero}
              matchLabel="el número de documento"
              helpText="Debe coincidir exactamente con el número de documento"
            />

            <FormField
              label="Nombre Docente Permanencia"
              name="docente_permanencia"
              value={formData.docente_permanencia}
              onChange={handleChange}
              required
              error={errors.docente_permanencia}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300 transition-colors flex items-center"
              onClick={() => {
                setFormData({
                  nombre_estudiante: "",
                  documento_tipo: "",
                  documento_numero: "",
                  documento_expedido_en: "",
                  estudiante_programa_academico: "",
                  semestre: "",
                  fecha_firma_dia: "",
                  fecha_firma_mes: "",
                  fecha_firma_anio: "",
                  firma_estudiante: "",
                  documento_firma_estudiante: "",
                  docente_permanencia: "",
                })
                setErrors({})
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpiar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-institucional-verde1 text-white rounded-md hover:bg-institucional-verde2 transition-colors flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Registrar Acta
                </>
              )}
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
              <h3 className="text-xl font-bold">Registro de Actas de Negación</h3>
              <p className="text-sm opacity-80">Historial de actas de negación de acompañamiento psicosocial</p>
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
                  placeholder="Buscar actas..."
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
                          ["documento_tipo", "Tipo Doc"],
                          ["documento_numero", "Documento"],
                          ["documento_expedido_en", "Expedido En"],
                          ["estudiante_programa_academico", "Programa"],
                          ["semestre", "Semestre"],
                          ["fecha_firma_dia", "Día"],
                          ["fecha_firma_mes", "Mes"],
                          ["fecha_firma_anio", "Año"],
                          ["docente_permanencia", "Docente"],
                          ["estado", "Estado"],
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
                          <td colSpan={12} className="py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <AlertCircle className="h-12 w-12 mb-4 text-gray-300" />
                              <p className="text-lg font-medium">No hay actas registradas</p>
                              <p className="text-sm">Las actas aparecerán aquí una vez que se registren</p>
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
                            <td className="px-4 py-3">{row.documento_tipo}</td>
                            <td className="px-4 py-3">{row.documento_numero}</td>
                            <td className="px-4 py-3">{row.documento_expedido_en}</td>
                            <td className="px-4 py-3">{row.estudiante_programa_academico}</td>
                            <td className="px-4 py-3">{row.semestre}</td>
                            <td className="px-4 py-3">{row.fecha_firma_dia}</td>
                            <td className="px-4 py-3">{row.fecha_firma_mes}</td>
                            <td className="px-4 py-3">{row.fecha_firma_anio}</td>
                            <td className="px-4 py-3">{row.docente_permanencia}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  row.estado === "Procesada"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {row.estado}
                              </span>
                            </td>
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
