"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  ChevronUp,
  ChevronDown,
  FileText,
  AlertCircle,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Calendar,
  User,
  BookOpen,
  School,
  AlertTriangle,
  Heart,
  FileCheck,
  Clock,
  Tag,
  Search,
} from "lucide-react"

export default function DataTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })
  const [searchTerm, setSearchTerm] = useState("")
  const rowsPerPage = 10

  // Función para ordenar datos
  const sortedData = useMemo(() => {
    const sortableData = [...data]
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] === null) return 1
        if (b[sortConfig.key] === null) return -1
        if (a[sortConfig.key] === b[sortConfig.key]) return 0

        const aValue = typeof a[sortConfig.key] === "string" ? a[sortConfig.key].toLowerCase() : a[sortConfig.key]
        const bValue = typeof b[sortConfig.key] === "string" ? b[sortConfig.key].toLowerCase() : b[sortConfig.key]

        if (sortConfig.direction === "ascending") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }
    return sortableData
  }, [data, sortConfig])

  // Filtrar datos por término de búsqueda
  const filteredData = useMemo(() => {
    return sortedData.filter((item) =>
      Object.values(item).some(
        (val) => val !== null && val !== undefined && val.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }, [sortedData, searchTerm])

  // Función para solicitar ordenamiento
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Calcular páginas
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage)

  // Función para manejar el cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Función para exportar a CSV
  const exportToCSV = () => {
    // Obtener todas las claves únicas de los objetos
    const allKeys = new Set()
    filteredData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "_id" && key !== "__v") {
          allKeys.add(key)
        }
      })
    })

    const headers = Array.from(allKeys)

    const csvRows = [
      headers.join(","),
      ...filteredData.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            if (value === null || value === undefined) return '""'
            if (typeof value === "boolean") return value ? '"Sí"' : '"No"'
            if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`
            return `"${value}"`
          })
          .join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "datos_permanencia.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Renderizar indicador de ordenamiento
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return <Filter className="h-4 w-4 ml-1 text-gray-400" />
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    )
  }

  // Determinar qué columnas mostrar basado en los datos disponibles
  const getVisibleColumns = () => {
    if (!data || data.length === 0) return []

    // Priorizar estas columnas si existen en los datos
    const priorityColumns = [
      "estudiante_programa_academico",
      "periodo",
      "semestre",
      "inscritos",
      "matriculados",
      "desertores",
      "graduados",
      "estrato",
      "riesgo_desercion",
      "tipo_vulnerabilidad",
      "requiere_tutoria",
      "servicio",
      "numero_documento",
      "fecha_remision",
      "intervencion_estado",
      "remision_tipo",
      "asistencia_fecha",
    ]

    // Obtener todas las claves disponibles en los datos
    const availableKeys = new Set()
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "_id" && key !== "__v" && key !== "createdAt") {
          availableKeys.add(key)
        }
      })
    })

    // Filtrar las columnas prioritarias que existen en los datos
    const visibleColumns = priorityColumns.filter((col) => availableKeys.has(col))

    // Si hay menos de 8 columnas, agregar otras columnas disponibles
    if (visibleColumns.length < 8) {
      Array.from(availableKeys)
        .filter((key) => !visibleColumns.includes(key))
        .slice(0, 8 - visibleColumns.length)
        .forEach((key) => visibleColumns.push(key))
    }

    return visibleColumns
  }

  const visibleColumns = getVisibleColumns()

  // Renderizar el icono apropiado para cada columna
  const getColumnIcon = (column) => {
    const iconMap = {
      estudiante_programa_academico: <School className="h-4 w-4 mr-1" />,
      periodo: <Calendar className="h-4 w-4 mr-1" />,
      semestre: <BookOpen className="h-4 w-4 mr-1" />,
      inscritos: <User className="h-4 w-4 mr-1" />,
      matriculados: <FileCheck className="h-4 w-4 mr-1" />,
      desertores: <AlertTriangle className="h-4 w-4 mr-1" />,
      graduados: <School className="h-4 w-4 mr-1" />,
      estrato: <Tag className="h-4 w-4 mr-1" />,
      riesgo_desercion: <AlertCircle className="h-4 w-4 mr-1" />,
      tipo_vulnerabilidad: <Heart className="h-4 w-4 mr-1" />,
      requiere_tutoria: <User className="h-4 w-4 mr-1" />,
      servicio: <FileText className="h-4 w-4 mr-1" />,
      numero_documento: <FileText className="h-4 w-4 mr-1" />,
      fecha_remision: <Calendar className="h-4 w-4 mr-1" />,
      intervencion_estado: <Clock className="h-4 w-4 mr-1" />,
      remision_tipo: <Tag className="h-4 w-4 mr-1" />,
      asistencia_fecha: <Calendar className="h-4 w-4 mr-1" />,
    }

    return iconMap[column] || <FileText className="h-4 w-4 mr-1" />
  }

  // Formatear el nombre de la columna para mostrar
  const formatColumnName = (column) => {
    const nameMap = {
      estudiante_programa_academico: "Programa",
      periodo: "Periodo",
      semestre: "Semestre",
      inscritos: "Inscritos",
      matriculados: "Matriculados",
      desertores: "Desertores",
      graduados: "Graduados",
      estrato: "Estrato",
      riesgo_desercion: "Riesgo",
      tipo_vulnerabilidad: "Vulnerabilidad",
      requiere_tutoria: "Tutoría",
      servicio: "Servicio",
      numero_documento: "Documento",
      fecha_remision: "Fecha Remisión",
      intervencion_estado: "Estado",
      remision_tipo: "Tipo Remisión",
      asistencia_fecha: "Fecha Asistencia",
      intervencion_recepcion: "Recepción",
      intervencion_cedula_titular: "Cédula Titular",
      asistencia_numero: "Número Asistencia",
      condicion_socioeconomica: "Condición Socioeconómica",
      aprobado: "Aprobado",
      cumplimiento_requisitos: "Cumple Requisitos",
      tipo_intervencion: "Tipo Intervención",
    }

    return (
      nameMap[column] ||
      column
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
  }

  // Renderizar el valor de la celda con formato apropiado
  const renderCellValue = (row, column) => {
    const value = row[column]

    if (value === null || value === undefined) return "N/A"

    // Formatear según el tipo de dato
    if (typeof value === "boolean") {
      return value ? (
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
          <Check className="h-3 w-3 mr-1" />
          Sí
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
          <X className="h-3 w-3 mr-1" />
          No
        </span>
      )
    }

    // Formatear riesgo de deserción
    if (column === "riesgo_desercion" && value) {
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Alto" || value === "Muy Alto"
              ? "bg-red-100 text-red-800"
              : value === "Medio"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {value}
        </span>
      )
    }

    // Formatear servicio
    if (column === "servicio" && value) {
      return (
        <span className="px-2 py-1 rounded-full bg-institucional-verde3/20 text-institucional-verde1 text-xs font-medium">
          {value}
        </span>
      )
    }

    // Formatear estado de intervención
    if (column === "intervencion_estado" && value) {
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Completado" || value === "Aprobado"
              ? "bg-green-100 text-green-800"
              : value === "En proceso" || value === "Pendiente"
                ? "bg-yellow-100 text-yellow-800"
                : value === "Rechazado" || value === "Cancelado"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
          }`}
        >
          {value}
        </span>
      )
    }

    return value
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-lg border-2 border-institucional-verde3/20"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h3 className="text-xl font-semibold text-institucional-verde1 flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          Datos de Permanencia Estudiantil
        </h3>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-institucional-verde2 focus:border-institucional-verde2"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="px-3 py-1.5 bg-institucional-verde2 text-white rounded-lg text-sm font-medium flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            Exportar CSV
          </motion.button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-institucional-verde1 text-white">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-left cursor-pointer hover:bg-institucional-verde2 transition-colors"
                  onClick={() => requestSort(column)}
                >
                  <div className="flex items-center">
                    {getColumnIcon(column)}
                    {formatColumnName(column)}
                    {renderSortIndicator(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-institucional-verde3/10 hover:bg-institucional-verde3/20"
                  }
                >
                  {visibleColumns.map((column) => (
                    <td key={column} className="px-4 py-3">
                      {renderCellValue(row, column)}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumns.length} className="px-4 py-6 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-lg font-medium">No se encontraron resultados</p>
                    <p className="text-sm">Intenta con otros criterios de búsqueda</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(startIndex + rowsPerPage, filteredData.length)} de{" "}
            {filteredData.length} registros
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 transition-colors hover:bg-gray-100 inline-flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </motion.button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Mostrar 5 páginas centradas en la página actual
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
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === pageNum
                      ? "bg-institucional-verde1 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </motion.button>
              )
            })}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 transition-colors hover:bg-gray-100 inline-flex items-center"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
