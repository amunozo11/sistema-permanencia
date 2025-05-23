"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronUp, ChevronDown, AlertCircle, Search, Download, Eye, EyeOff } from "lucide-react"
import FormField from "../components/FormField"
import Notification from "../components/Notification"

export default function FichaDocenteForm() {
  const [formData, setFormData] = useState({
    nombres_apellidos: "",
    documento_identidad: "",
    fecha_nacimiento_dia: "",
    fecha_nacimiento_mes: "",
    fecha_nacimiento_ano: "",
    direccion_residencia: "",
    celular: "",
    correo_institucional: "",
    correo_personal: "",
    preferencia_correo: "",
    facultad: "",
    estudiante_programa_academico: "",
    asignaturas: "",
    creditos_asignaturas: "",
    ciclo_formacion: "",
    pregrado: "",
    especializacion: "",
    maestria: "",
    doctorado: "",
    grupo_investigacion: "",
    cual_grupo: "",
    horas_semanales: "",
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
            nombres_apellidos: "Dr. Carlos Alberto Mendoza García",
            documento_identidad: "1234567890",
            fecha_nacimiento: "15/03/1980",
            direccion_residencia: "Calle 15 #12-34, Valledupar",
            celular: "3001234567",
            correo_institucional: "carlos.mendoza@upc.edu.co",
            correo_personal: "carlos.mendoza@gmail.com",
            preferencia_correo: "institucional",
            facultad: "Ingeniería",
            estudiante_programa_academico: "Ingeniería de Sistemas",
            asignaturas: "Programación Avanzada, Base de Datos",
            creditos_asignaturas: "8",
            ciclo_formacion: "Profesional",
            pregrado: "Ingeniería de Sistemas",
            especializacion: "Desarrollo de Software",
            maestria: "Ciencias de la Computación",
            doctorado: "Inteligencia Artificial",
            grupo_investigacion: "sí",
            cual_grupo: "GIDIS - Grupo de Investigación en Desarrollo de Software",
            horas_semanales: "40",
            estado: "Activo",
            createdAt: "2024-01-15T10:00:00Z",
          },
          {
            id: 2,
            nombres_apellidos: "Dra. Ana María Rodríguez Silva",
            documento_identidad: "9876543210",
            fecha_nacimiento: "22/07/1975",
            direccion_residencia: "Carrera 20 #8-45, Valledupar",
            celular: "3009876543",
            correo_institucional: "ana.rodriguez@upc.edu.co",
            correo_personal: "ana.rodriguez@hotmail.com",
            preferencia_correo: "institucional",
            facultad: "Ciencias Económicas",
            estudiante_programa_academico: "Administración de Empresas",
            asignaturas: "Gestión Empresarial, Liderazgo",
            creditos_asignaturas: "6",
            ciclo_formacion: "Profesional",
            pregrado: "Administración de Empresas",
            especializacion: "Gerencia Estratégica",
            maestria: "MBA",
            doctorado: "",
            grupo_investigacion: "sí",
            cual_grupo: "GIAE - Grupo de Investigación en Administración Empresarial",
            horas_semanales: "36",
            estado: "Activo",
            createdAt: "2024-01-16T14:30:00Z",
          },
          {
            id: 3,
            nombres_apellidos: "Mg. Luis Fernando Pérez Torres",
            documento_identidad: "5555666677",
            fecha_nacimiento: "10/11/1985",
            direccion_residencia: "Avenida Simón Bolívar #25-67, Valledupar",
            celular: "3005556666",
            correo_institucional: "luis.perez@upc.edu.co",
            correo_personal: "luis.perez@yahoo.com",
            preferencia_correo: "personal",
            facultad: "Ciencias de la Salud",
            estudiante_programa_academico: "Psicología",
            asignaturas: "Psicología Clínica, Terapia Cognitiva",
            creditos_asignaturas: "10",
            ciclo_formacion: "Profesional",
            pregrado: "Psicología",
            especializacion: "Psicología Clínica",
            maestria: "Psicología de la Salud",
            doctorado: "",
            grupo_investigacion: "no",
            cual_grupo: "",
            horas_semanales: "32",
            estado: "Activo",
            createdAt: "2024-01-17T09:15:00Z",
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
      "Nombres y Apellidos",
      "Documento",
      "Fecha Nacimiento",
      "Celular",
      "Correo Institucional",
      "Facultad",
      "Programa",
      "Asignaturas",
      "Créditos",
      "Pregrado",
      "Maestría",
      "Doctorado",
      "Grupo Investigación",
      "Horas Semanales",
      "Estado",
    ]

    const csvRows = [
      headers.join(","),
      ...sortedAndFilteredData.map((row) =>
        [
          `"${row.nombres_apellidos}"`,
          row.documento_identidad,
          row.fecha_nacimiento,
          row.celular,
          row.correo_institucional,
          `"${row.facultad}"`,
          `"${row.estudiante_programa_academico}"`,
          `"${row.asignaturas}"`,
          row.creditos_asignaturas,
          `"${row.pregrado}"`,
          `"${row.maestria || ""}"`,
          `"${row.doctorado || ""}"`,
          row.grupo_investigacion,
          row.horas_semanales,
          row.estado,
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "fichas_docentes.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleChange = (name, value) => {
    let newValue = value

    // Validaciones específicas
    if (
      [
        "documento_identidad",
        "fecha_nacimiento_dia",
        "fecha_nacimiento_mes",
        "fecha_nacimiento_ano",
        "celular",
        "creditos_asignaturas",
        "horas_semanales",
      ].includes(name)
    ) {
      newValue = value.replace(/\D/g, "")
    }

    if (
      [
        "nombres_apellidos",
        "facultad",
        "estudiante_programa_academico",
        "pregrado",
        "especializacion",
        "maestria",
        "doctorado",
        "cual_grupo",
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

    if (!formData.nombres_apellidos.trim()) {
      newErrors.nombres_apellidos = "Los nombres y apellidos son requeridos"
    }

    if (!formData.documento_identidad || !/^\d{7,10}$/.test(formData.documento_identidad)) {
      newErrors.documento_identidad = "El documento de identidad debe tener entre 7 y 10 dígitos"
    }

    if (!formData.fecha_nacimiento_dia || !formData.fecha_nacimiento_mes || !formData.fecha_nacimiento_ano) {
      newErrors.fecha_nacimiento_dia = "La fecha de nacimiento completa es requerida"
    }

    if (!formData.direccion_residencia.trim()) {
      newErrors.direccion_residencia = "La dirección de residencia es requerida"
    }

    if (!formData.celular || !/^\d{10}$/.test(formData.celular)) {
      newErrors.celular = "El celular debe tener 10 dígitos"
    }

    if (!formData.correo_institucional.trim() || !emailRegex.test(formData.correo_institucional)) {
      newErrors.correo_institucional = "El correo institucional es inválido"
    }

    if (!formData.correo_personal.trim() || !emailRegex.test(formData.correo_personal)) {
      newErrors.correo_personal = "El correo personal es inválido"
    }

    if (!formData.preferencia_correo) {
      newErrors.preferencia_correo = "La preferencia de correo es requerida"
    }

    if (!formData.facultad.trim()) {
      newErrors.facultad = "La facultad es requerida"
    }

    if (!formData.estudiante_programa_academico.trim()) {
      newErrors.estudiante_programa_academico = "El programa es requerido"
    }

    if (!formData.asignaturas.trim()) {
      newErrors.asignaturas = "Las asignaturas son requeridas"
    }

    if (!formData.creditos_asignaturas) {
      newErrors.creditos_asignaturas = "Los créditos de asignaturas son requeridos"
    }

    if (!formData.ciclo_formacion.trim()) {
      newErrors.ciclo_formacion = "El ciclo de formación es requerido"
    }

    if (!formData.pregrado.trim()) {
      newErrors.pregrado = "El pregrado es requerido"
    }

    if (!formData.grupo_investigacion) {
      newErrors.grupo_investigacion = "Debe indicar si pertenece a un grupo de investigación"
    }

    if (formData.grupo_investigacion === "sí" && !formData.cual_grupo.trim()) {
      newErrors.cual_grupo = "Debe indicar a qué grupo de investigación pertenece"
    }

    if (!formData.horas_semanales) {
      newErrors.horas_semanales = "Las horas semanales son requeridas"
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
        message: "Ficha docente registrada exitosamente",
      })

      // Agregar a la tabla local
      const newRecord = {
        id: Date.now(),
        ...formData,
        fecha_nacimiento: `${formData.fecha_nacimiento_dia}/${formData.fecha_nacimiento_mes}/${formData.fecha_nacimiento_ano}`,
        estado: "Activo",
        createdAt: new Date().toISOString(),
      }
      setTableData((prev) => [newRecord, ...prev])

      // Limpiar formulario
      setFormData({
        nombres_apellidos: "",
        documento_identidad: "",
        fecha_nacimiento_dia: "",
        fecha_nacimiento_mes: "",
        fecha_nacimiento_ano: "",
        direccion_residencia: "",
        celular: "",
        correo_institucional: "",
        correo_personal: "",
        preferencia_correo: "",
        facultad: "",
        estudiante_programa_academico: "",
        asignaturas: "",
        creditos_asignaturas: "",
        ciclo_formacion: "",
        pregrado: "",
        especializacion: "",
        maestria: "",
        doctorado: "",
        grupo_investigacion: "",
        cual_grupo: "",
        horas_semanales: "",
      })
    } catch (error) {
      console.error("Error:", error)
      setNotification({
        type: "error",
        message: "Error al registrar la ficha docente: " + error.message,
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
          <h2 className="text-2xl font-bold">Ficha Técnica Docente</h2>
          <p className="text-sm opacity-80">Complete el formulario para registrar la información del docente</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nombres y Apellidos"
                name="nombres_apellidos"
                value={formData.nombres_apellidos}
                onChange={handleChange}
                required
                error={errors.nombres_apellidos}
              />

              <FormField
                label="Documento de Identidad"
                name="documento_identidad"
                value={formData.documento_identidad}
                onChange={handleChange}
                required
                pattern="\d{7,10}"
                error={errors.documento_identidad}
              />

              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</h4>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    label="Día"
                    name="fecha_nacimiento_dia"
                    value={formData.fecha_nacimiento_dia}
                    onChange={handleChange}
                    required
                    pattern="\d{1,2}"
                    error={errors.fecha_nacimiento_dia}
                  />

                  <FormField
                    label="Mes"
                    name="fecha_nacimiento_mes"
                    value={formData.fecha_nacimiento_mes}
                    onChange={handleChange}
                    required
                    pattern="\d{1,2}"
                  />

                  <FormField
                    label="Año"
                    name="fecha_nacimiento_ano"
                    value={formData.fecha_nacimiento_ano}
                    onChange={handleChange}
                    required
                    pattern="\d{4}"
                  />
                </div>
              </div>

              <FormField
                label="Dirección de Residencia"
                name="direccion_residencia"
                value={formData.direccion_residencia}
                onChange={handleChange}
                required
                error={errors.direccion_residencia}
              />

              <FormField
                label="Celular"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                required
                pattern="\d{10}"
                error={errors.celular}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Correo Institucional"
                name="correo_institucional"
                type="email"
                value={formData.correo_institucional}
                onChange={handleChange}
                required
                error={errors.correo_institucional}
              />

              <FormField
                label="Correo Personal"
                name="correo_personal"
                type="email"
                value={formData.correo_personal}
                onChange={handleChange}
                required
                error={errors.correo_personal}
              />

              <FormField
                label="Preferencia de Correo"
                name="preferencia_correo"
                type="select"
                value={formData.preferencia_correo}
                onChange={handleChange}
                required
                options={[
                  { value: "institucional", label: "Institucional" },
                  { value: "personal", label: "Personal" },
                ]}
                error={errors.preferencia_correo}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Información Académica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Facultad"
                name="facultad"
                value={formData.facultad}
                onChange={handleChange}
                required
                error={errors.facultad}
              />

              <FormField
                label="Programa"
                name="estudiante_programa_academico"
                value={formData.estudiante_programa_academico}
                onChange={handleChange}
                required
                error={errors.estudiante_programa_academico}
              />

              <FormField
                label="Asignaturas"
                name="asignaturas"
                value={formData.asignaturas}
                onChange={handleChange}
                required
                error={errors.asignaturas}
              />

              <FormField
                label="Créditos Asignaturas"
                name="creditos_asignaturas"
                type="number"
                value={formData.creditos_asignaturas}
                onChange={handleChange}
                required
                error={errors.creditos_asignaturas}
              />

              <FormField
                label="Ciclo de Formación"
                name="ciclo_formacion"
                value={formData.ciclo_formacion}
                onChange={handleChange}
                required
                error={errors.ciclo_formacion}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Formación Académica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Pregrado"
                name="pregrado"
                value={formData.pregrado}
                onChange={handleChange}
                required
                error={errors.pregrado}
              />

              <FormField
                label="Especialización (opcional)"
                name="especializacion"
                value={formData.especializacion}
                onChange={handleChange}
                error={errors.especializacion}
              />

              <FormField
                label="Maestría (opcional)"
                name="maestria"
                value={formData.maestria}
                onChange={handleChange}
                error={errors.maestria}
              />

              <FormField
                label="Doctorado (opcional)"
                name="doctorado"
                value={formData.doctorado}
                onChange={handleChange}
                error={errors.doctorado}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Investigación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="¿Pertenece a un grupo de investigación?"
                name="grupo_investigacion"
                type="select"
                value={formData.grupo_investigacion}
                onChange={handleChange}
                required
                options={[
                  { value: "sí", label: "Sí" },
                  { value: "no", label: "No" },
                ]}
                error={errors.grupo_investigacion}
              />

              {formData.grupo_investigacion === "sí" && (
                <FormField
                  label="¿Cuál grupo?"
                  name="cual_grupo"
                  value={formData.cual_grupo}
                  onChange={handleChange}
                  required={formData.grupo_investigacion === "sí"}
                  error={errors.cual_grupo}
                />
              )}

              <FormField
                label="Horas Semanales"
                name="horas_semanales"
                type="number"
                value={formData.horas_semanales}
                onChange={handleChange}
                required
                min="1"
                error={errors.horas_semanales}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300 transition-colors"
              onClick={() => {
                setFormData({
                  nombres_apellidos: "",
                  documento_identidad: "",
                  fecha_nacimiento_dia: "",
                  fecha_nacimiento_mes: "",
                  fecha_nacimiento_ano: "",
                  direccion_residencia: "",
                  celular: "",
                  correo_institucional: "",
                  correo_personal: "",
                  preferencia_correo: "",
                  facultad: "",
                  estudiante_programa_academico: "",
                  asignaturas: "",
                  creditos_asignaturas: "",
                  ciclo_formacion: "",
                  pregrado: "",
                  especializacion: "",
                  maestria: "",
                  doctorado: "",
                  grupo_investigacion: "",
                  cual_grupo: "",
                  horas_semanales: "",
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
              {isSubmitting ? "Enviando..." : "Registrar Ficha"}
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
              <h3 className="text-xl font-bold">Registro de Fichas Docentes</h3>
              <p className="text-sm opacity-80">Base de datos de docentes registrados en el sistema</p>
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
                  placeholder="Buscar docentes..."
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
                          ["nombres_apellidos", "Nombres y Apellidos"],
                          ["documento_identidad", "Documento"],
                          ["celular", "Celular"],
                          ["correo_institucional", "Correo"],
                          ["facultad", "Facultad"],
                          ["estudiante_programa_academico", "Programa"],
                          ["asignaturas", "Asignaturas"],
                          ["creditos_asignaturas", "Créditos"],
                          ["pregrado", "Pregrado"],
                          ["maestria", "Maestría"],
                          ["grupo_investigacion", "Investigación"],
                          ["horas_semanales", "Horas"],
                          ["estado", "Estado"],
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
                          <td colSpan={13} className="py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <AlertCircle className="h-12 w-12 mb-4 text-gray-300" />
                              <p className="text-lg font-medium">No hay fichas registradas</p>
                              <p className="text-sm">Las fichas aparecerán aquí una vez que se registren</p>
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
                            <td className="px-4 py-3 font-medium">{row.nombres_apellidos}</td>
                            <td className="px-4 py-3">{row.documento_identidad}</td>
                            <td className="px-4 py-3">{row.celular}</td>
                            <td className="px-4 py-3">{row.correo_institucional}</td>
                            <td className="px-4 py-3">{row.facultad}</td>
                            <td className="px-4 py-3">{row.estudiante_programa_academico}</td>
                            <td className="px-4 py-3 max-w-xs truncate" title={row.asignaturas}>
                              {row.asignaturas}
                            </td>
                            <td className="px-4 py-3">{row.creditos_asignaturas}</td>
                            <td className="px-4 py-3">{row.pregrado}</td>
                            <td className="px-4 py-3">{row.maestria || "N/A"}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  row.grupo_investigacion === "sí"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {row.grupo_investigacion === "sí" ? "Sí" : "No"}
                              </span>
                            </td>
                            <td className="px-4 py-3">{row.horas_semanales}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {row.estado}
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
