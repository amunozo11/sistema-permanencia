"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { FileBarChart, Filter, RefreshCw, Download } from "lucide-react"

export default function EstratoServicioChart() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedServicios, setSelectedServicios] = useState([])
  const [availableServicios, setAvailableServicios] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Obtener datos de la API
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/datos-permanencia`)
        if (!response.ok) {
          throw new Error("Error al cargar datos")
        }
        const rawData = await response.json()

        // Procesar datos para el gráfico
        processChartData(rawData)
      } catch (error) {
        console.error("Error al cargar datos para el gráfico:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const processChartData = (rawData) => {
    // Extraer servicios únicos
    const servicios = [...new Set(rawData.filter((item) => item.servicio).map((item) => item.servicio))]
    setAvailableServicios(servicios)

    // Por defecto, seleccionar los primeros 4 servicios o todos si hay menos
    setSelectedServicios(servicios.slice(0, Math.min(4, servicios.length)))

    // Agrupar datos por servicio y estrato
    const groupedData = {}

    rawData.forEach((item) => {
      if (item.servicio && item.estrato) {
        const servicio = item.servicio
        const estrato = item.estrato.toString()

        if (!groupedData[servicio]) {
          groupedData[servicio] = {}
        }

        if (!groupedData[servicio][estrato]) {
          groupedData[servicio][estrato] = 0
        }

        // Incrementar el contador (podemos usar inscritos o simplemente contar registros)
        groupedData[servicio][estrato] += item.inscritos || 1
      }
    })

    // Transformar datos agrupados al formato esperado por Recharts
    const chartData = Object.keys(groupedData).map((servicio) => {
      const servicioData = { servicio }

      // Añadir datos para cada estrato (1-6)
      for (let i = 1; i <= 6; i++) {
        servicioData[`estrato${i}`] = groupedData[servicio][i.toString()] || 0
      }

      return servicioData
    })

    setData(chartData)
  }

  const toggleServicioSelection = (servicio) => {
    if (selectedServicios.includes(servicio)) {
      setSelectedServicios(selectedServicios.filter((s) => s !== servicio))
    } else {
      setSelectedServicios([...selectedServicios, servicio])
    }
  }

  const filteredData = data.filter((item) => selectedServicios.includes(item.servicio))

  // Colores para los estratos
  const colors = ["#38bdf8", "#2563eb", "#f97316", "#8b5cf6", "#ec4899", "#10b981"]

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ["Servicio", "Estrato 1", "Estrato 2", "Estrato 3", "Estrato 4", "Estrato 5", "Estrato 6"]

    const csvRows = [
      headers.join(","),
      ...filteredData.map((row) =>
        [`"${row.servicio}"`, row.estrato1, row.estrato2, row.estrato3, row.estrato4, row.estrato5, row.estrato6].join(
          ",",
        ),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "estrato_por_servicio.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
          <FileBarChart className="h-6 w-6 mr-2" />
          Distribución de Estratos por Servicio
        </h3>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedServicios(availableServicios)}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Todos
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="px-3 py-1.5 bg-institucional-verde2 text-white rounded-lg text-sm font-medium flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            Exportar
          </motion.button>
        </div>
      </div>

      {/* Filtros de servicios */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Filter className="h-4 w-4 mr-1 text-gray-500" />
          <h4 className="text-sm font-medium text-gray-700">Filtrar servicios:</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableServicios.map((servicio) => (
            <button
              key={servicio}
              onClick={() => toggleServicioSelection(servicio)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedServicios.includes(servicio)
                  ? "bg-institucional-verde1 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {servicio}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-institucional-verde1"></div>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="servicio" />
              <YAxis label={{ value: "Suma de estrato", angle: -90, position: "insideLeft" }} />
              <Tooltip
                formatter={(value, name) => [value, `Estrato ${name.replace("estrato", "")}`]}
                labelFormatter={(label) => `Servicio: ${label}`}
              />
              <Legend formatter={(value) => `Estrato ${value.replace("estrato", "")}`} />
              {[1, 2, 3, 4, 5, 6].map((estrato, index) => (
                <Bar
                  key={`estrato${estrato}`}
                  dataKey={`estrato${estrato}`}
                  stackId="a"
                  fill={colors[index]}
                  name={`estrato${estrato}`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          Este gráfico muestra la distribución de estudiantes por estrato socioeconómico en cada servicio de
          permanencia. Los datos están agrupados por servicio y apilados por estrato, permitiendo visualizar la
          composición socioeconómica de los usuarios de cada servicio.
        </p>
      </div>
    </motion.div>
  )
}
