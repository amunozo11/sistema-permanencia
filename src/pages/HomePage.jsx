"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Download,
  Filter,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  UserCheck,
  GraduationCap,
  BookOpen,
  Upload,
} from "lucide-react"

// Componentes
import DataTable from "../components/DataTable"
import PieChartProgramas from "../components/PieChartProgramas"
import ScatterChartPanel from "../components/ScatterChartPanel"
import RiesgoDesercionChart from "../components/RiesgoDesercionChart"
import VulnerabilidadBarChart from "../components/VulnerabilidadBarChart"
import TutoriaDonutChart from "../components/TutoriaDonutChart"
import ServiciosBarChart from "../components/ServiciosBarChart"
import ServiciosPermanencia from "../components/ServiciosPermanencia"
import CSVUploader from "../components/CSVUploader"
import Header from "../components/Header"
import EstratoServicioChart from "../components/EstratoServicioChart"

export default function HomePage() {
  // Estado para almacenar los datos
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    estudiante_programa_academico: "",
    riesgo: "",
    servicio: "",
    periodo: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showUploader, setShowUploader] = useState(false)

  // Estados para datos derivados
  const [stats, setStats] = useState({
    totals: { inscritos: 0, matriculados: 0, desertores: 0, graduados: 0 },
    programaStats: [],
    riesgoDesercionData: [],
    tutoriaData: [],
    vulnerabilidadData: [],
    serviciosData: [],
    edadDesertores: [],
    estratoInscritos: [],
  })

  // Cargar datos al iniciar
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      try {
        // Cargar datos desde el backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/datos-permanencia`)
        if (!response.ok) {
          throw new Error("Error al cargar datos")
        }
        const data = await response.json()
        setData(data)

        // Cargar estadísticas
        const statsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/estadisticas`)
        if (!statsResponse.ok) {
          throw new Error("Error al cargar estadísticas")
        }
        const stats = await statsResponse.json()
        setStats(stats)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Función para manejar los datos cargados desde el CSV
  const handleDataLoaded = (newData) => {
    setData(newData)
    // Después de cargar nuevos datos, actualizar las estadísticas
    fetch(`${import.meta.env.VITE_API_URL}/api/estadisticas`)
      .then((response) => response.json())
      .then((stats) => setStats(stats))
      .catch((error) => console.error("Error al actualizar estadísticas:", error))
  }

  // Obtener valores únicos para los filtros
  const filterOptions = useMemo(() => {
    if (!Array.isArray(data)) {
      return {
        programas: [],
        riesgos: [],
        servicios: [],
        periodos: [],
      }
    }

    const programas = [...new Set(data.map((item) => item.estudiante_programa_academico))].filter(Boolean).sort()
    const riesgos = [...new Set(data.map((item) => item.riesgo_desercion))].filter(Boolean).sort()
    const servicios = [...new Set(data.map((item) => item.servicio))].filter(Boolean).sort()
    const periodos = [...new Set(data.map((item) => item.periodo))].filter(Boolean).sort()

    return { programas, riesgos, servicios, periodos }
  }, [data])

  // Datos filtrados
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return []

    return data.filter((item) => {
      // Búsqueda global
      const matchesSearch =
        searchTerm === "" ||
        Object.values(item).some((val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase()))

      // Filtros específicos
      const matchesPrograma =
        !filters.estudiante_programa_academico ||
        item.estudiante_programa_academico === filters.estudiante_programa_academico
      const matchesRiesgo = !filters.riesgo || item.riesgo_desercion === filters.riesgo
      const matchesServicio = !filters.servicio || item.servicio === filters.servicio
      const matchesPeriodo = !filters.periodo || item.periodo === filters.periodo

      return matchesSearch && matchesPrograma && matchesRiesgo && matchesServicio && matchesPeriodo
    })
  }, [data, searchTerm, filters])

  // Función para exportar datos a CSV
  const exportToCSV = () => {
    const headers = [
      "Programa",
      "Semestre",
      "Periodo",
      "Inscritos",
      "Matriculados",
      "Desertores",
      "Graduados",
      "Estrato",
      "Riesgo",
      "Vulnerabilidad",
      "Requiere Tutoría",
      "Servicio",
    ]

    const csvRows = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          `"${row.estudiante_programa_academico || ""}"`,
          row.semestre || 0,
          `"${row.periodo || ""}"`,
          row.inscritos || 0,
          row.matriculados || 0,
          row.desertores || 0,
          row.graduados || 0,
          row.estrato || 0,
          `"${row.riesgo_desercion || ""}"`,
          `"${row.tipo_vulnerabilidad || ""}"`,
          row.requiere_tutoria ? "Sí" : "No",
          `"${row.servicio || ""}"`,
        ].join(","),
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

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      estudiante_programa_academico: "",
      riesgo: "",
      servicio: "",
      periodo: "",
    })
  }

  // Calcular KPIs adicionales
  const additionalKPIs = useMemo(() => {
    if (!stats.totals) return {}

    const tasaDesercion =
      stats.totals.matriculados > 0 ? ((stats.totals.desertores / stats.totals.matriculados) * 100).toFixed(1) : 0

    const tasaGraduacion =
      stats.totals.matriculados > 0 ? ((stats.totals.graduados / stats.totals.matriculados) * 100).toFixed(1) : 0

    const retencion = 100 - Number.parseFloat(tasaDesercion)

    return {
      tasaDesercion,
      tasaGraduacion,
      retencion,
    }
  }, [stats.totals])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-6 py-8">
        {/* Barra superior con acciones */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-institucional-verde1">
              {activeTab === "dashboard"
                ? "Panel de Control"
                : activeTab === "data"
                  ? "Datos de Permanencia"
                  : "Servicios de Permanencia"}
            </h1>
            <p className="text-gray-600">
              {activeTab === "dashboard"
                ? "Análisis y visualización de datos de permanencia estudiantil"
                : activeTab === "data"
                  ? "Exploración y gestión de datos detallados"
                  : "Gestión de servicios de permanencia"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploader(!showUploader)}
              className="px-4 py-2 bg-institucional-verde1 text-white rounded-lg text-sm font-medium flex items-center hover:bg-institucional-verde2 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar Datos
            </motion.button>
            {activeTab === "data" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToCSV}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center hover:bg-gray-800 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </motion.button>
            )}
          </div>
        </div>

        {/* Componente para cargar CSV (colapsable) */}
        <AnimatePresence>
          {showUploader && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <CSVUploader onDataLoaded={handleDataLoaded} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barra de búsqueda y filtros */}
        {activeTab === "data" && (
          <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar en todos los campos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-institucional-verde2 focus:border-institucional-verde2"
                />
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center hover:bg-gray-200 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpiar
                </motion.button>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
                  <select
                    value={filters.estudiante_programa_academico}
                    onChange={(e) => setFilters({ ...filters, estudiante_programa_academico: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-institucional-verde2 focus:border-institucional-verde2"
                  >
                    <option value="">Todos los programas</option>
                    {filterOptions.programas.map((estudiante_programa_academico) => (
                      <option key={estudiante_programa_academico} value={estudiante_programa_academico}>
                        {estudiante_programa_academico}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Riesgo</label>
                  <select
                    value={filters.riesgo}
                    onChange={(e) => setFilters({ ...filters, riesgo: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-institucional-verde2 focus:border-institucional-verde2"
                  >
                    <option value="">Todos los riesgos</option>
                    {filterOptions.riesgos.map((riesgo) => (
                      <option key={riesgo} value={riesgo}>
                        {riesgo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
                  <select
                    value={filters.servicio}
                    onChange={(e) => setFilters({ ...filters, servicio: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-institucional-verde2 focus:border-institucional-verde2"
                  >
                    <option value="">Todos los servicios</option>
                    {filterOptions.servicios.map((servicio) => (
                      <option key={servicio} value={servicio}>
                        {servicio}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
                  <select
                    value={filters.periodo}
                    onChange={(e) => setFilters({ ...filters, periodo: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-institucional-verde2 focus:border-institucional-verde2"
                  >
                    <option value="">Todos los periodos</option>
                    {filterOptions.periodos.map((periodo) => (
                      <option key={periodo} value={periodo}>
                        {periodo}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-institucional-verde1"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* KPIs principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Estudiantes Matriculados</p>
                        <h3 className="text-3xl font-bold text-gray-800">
                          {stats.totals.matriculados.toLocaleString()}
                        </h3>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <UserCheck className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl p-6 shadow-md border-l-4 border-red-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Tasa de Deserción</p>
                        <h3 className="text-3xl font-bold text-gray-800">{additionalKPIs.tasaDesercion}%</h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-lg">
                        <Percent className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Tasa de Graduación</p>
                        <h3 className="text-3xl font-bold text-gray-800">{additionalKPIs.tasaGraduacion}%</h3>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Carga Estudiantil</p>
                        <h3 className="text-3xl font-bold text-gray-800">{additionalKPIs.retencion}%</h3>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <BookOpen className="h-6 w-6 text-purple-500" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Gráficos principales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PieChartProgramas data={data} />
                  <RiesgoDesercionChart data={stats.riesgoDesercionData} />
                </div>

                {/* Nuevo gráfico de Estrato por Servicio */}
                <EstratoServicioChart />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TutoriaDonutChart data={stats.tutoriaData} />
                  <VulnerabilidadBarChart data={stats.vulnerabilidadData} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ServiciosBarChart data={stats.serviciosData} />
                  <ScatterChartPanel
                    data={stats.estratoInscritos}
                    xKey="estrato"
                    yKey="inscritos"
                    xLabel="Estrato"
                    yLabel="Estudiantes"
                    title="Estrato con relación a los Inscritos"
                  />
                </div>
              </motion.div>
            ) : activeTab === "data" ? (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DataTable data={filteredData} />
              </motion.div>
            ) : (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ServiciosPermanencia />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      <footer className="mt-12 p-6 bg-institucional-verde1 text-white rounded-3xl">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Universidad Popular del Cesar</h3>
              <p className="text-white/80">Sistema de Información para la Unidad de Permanencia</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-white/80">
                © {new Date().getFullYear()} Grupo 01 - Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
