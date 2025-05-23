"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, Filter, ChevronDown, ChevronUp } from "lucide-react"

export default function TendenciaDesercionChart({ data }) {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProgramas, setSelectedProgramas] = useState([])

  // Procesar datos para el gráfico
  const processData = () => {
    if (!data || !Array.isArray(data)) return []

    // Agrupar por periodo
    const periodoMap = new Map()

    data.forEach((item) => {
      if (!item.periodo || !item.desertores || !item.estudiante_programa_academico) return

      if (!periodoMap.has(item.periodo)) {
        periodoMap.set(item.periodo, { periodo: item.periodo })
      }

      const periodoData = periodoMap.get(item.periodo)
      const programa = item.estudiante_programa_academico

      if (!periodoData[programa]) {
        periodoData[programa] = 0
      }

      periodoData[programa] += item.desertores
    })

    // Convertir a array y ordenar por periodo
    return Array.from(periodoMap.values()).sort((a, b) => {
      // Ordenar por año y semestre (formato: YYYY-S)
      const [yearA, semA] = a.periodo.split("-")
      const [yearB, semB] = b.periodo.split("-")

      if (yearA !== yearB) return yearA - yearB
      return semA - semB
    })
  }

  const chartData = processData()

  // Obtener programas únicos
  const programas =
    data && Array.isArray(data)
      ? [
          ...new Set(
            data.filter((item) => item.estudiante_programa_academico).map((item) => item.estudiante_programa_academico),
          ),
        ]
      : []

  // Si no hay programas seleccionados, seleccionar los 5 primeros
  if (selectedProgramas.length === 0 && programas.length > 0) {
    setSelectedProgramas(programas.slice(0, 5))
  }

  const togglePrograma = (programa) => {
    if (selectedProgramas.includes(programa)) {
      setSelectedProgramas(selectedProgramas.filter((p) => p !== programa))
    } else {
      setSelectedProgramas([...selectedProgramas, programa])
    }
  }

  // Colores para las líneas
  const colors = [
    "#3b82f6", // Azul
    "#ef4444", // Rojo
    "#10b981", // Verde
    "#f59e0b", // Ámbar
    "#8b5cf6", // Violeta
    "#ec4899", // Rosa
    "#06b6d4", // Cyan
    "#f97316", // Naranja
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-lg border-2 border-institucional-verde3/20"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-xl font-semibold text-institucional-verde1 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2" />
          Tendencia de Deserción por Programa
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="mt-2 md:mt-0 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center hover:bg-gray-200 transition-colors"
        >
          <Filter className="h-4 w-4 mr-2" />
          Programas
          {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
        </motion.button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="font-medium mb-2 text-gray-700">Seleccionar Programas</h4>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {programas.map((programa, index) => (
              <button
                key={programa}
                onClick={() => togglePrograma(programa)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedProgramas.includes(programa) ? "text-white" : "bg-gray-200 text-gray-700"
                }`}
                style={{
                  backgroundColor: selectedProgramas.includes(programa) ? colors[index % colors.length] : "",
                }}
              >
                {programa}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis label={{ value: "Número de desertores", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            {selectedProgramas.map((programa, index) => (
              <Line
                key={programa}
                type="monotone"
                dataKey={programa}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
                name={programa}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
