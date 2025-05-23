"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from "recharts"
import { motion } from "framer-motion"

const COLORS = [
  "#007E5B",
  "#00B388",
  "#7BDCB5",
  "#CDEAE1",
  "#005B40",
  "#A7D1C5",
  "#7FA998",
  "#B1D8C1",
  "#66C2A5",
  "#4DB6AC",
]

export default function PieChartProgramas({ data }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const safeData = Array.isArray(data) ? data : []

  // Agrupar datos por programa
  const programaCount = {}
  safeData.forEach(item => {
    const prog = item.programa ?? item.estudiante_programa_academico ?? "Desconocido"
    programaCount[prog] = (programaCount[prog] || 0) + 1
  })

  // Convertir a formato para el gráfico
  const chartData = Object.entries(programaCount)
    .map(([programa, value]) => ({ programa, value }))
    .sort((a, b) => b.value - a.value)

  // Limitar a los 5 programas principales y agrupar el resto
  let processed = chartData
  if (chartData.length > 5) {
    const top = chartData.slice(0, 5)
    const others = chartData.slice(5)
    const othersValue = others.reduce((sum, x) => sum + x.value, 0)
    processed = [...top, { programa: "Otros programas", value: othersValue }]
  }

  // Calcular el total para los porcentajes
  const total = processed.reduce((sum, x) => sum + x.value, 0)
  const formattedData = processed.map(x => ({
    ...x,
    porcentaje: ((x.value / total) * 100).toFixed(1)
  }))

  const onPieEnter = (_, index) => setActiveIndex(index)

  const renderActiveShape = props => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    return (
      <g>
        <text x={cx} y={cy - 10} textAnchor="middle" fill="#333" className="text-sm font-medium">
          {payload.programa}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#333" className="text-lg font-bold">
          {(percent * 100).toFixed(1)}%
        </text>
        <text x={cx} y={cy + 30} textAnchor="middle" fill="#666" className="text-xs">
          {value} estudiantes
        </text>
        <Sector
          cx={cx} cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx} cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-md border-2 border-institucional-verde3/20 hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-semibold mb-4 text-institucional-verde1 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
          />
        </svg>
        Distribución por Programa Académico
      </h3>
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <p className="text-sm text-gray-600">
          Este gráfico muestra la distribución porcentual de estudiantes por programa académico. Haz clic en un segmento
          para ver más detalles.
        </p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              onMouseEnter={onPieEnter}
              paddingAngle={2}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                if (name === "value") {
                  return [`${value} estudiantes (${props.payload.porcentaje}%)`, "Cantidad"]
                }
                return [value, name]
              }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 10,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: "none",
              }}
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{
                paddingLeft: "10px",
                fontSize: "12px",
              }}
              formatter={(value, entry, index) => (
                <span className="text-xs md:text-sm">
                  {value} ({formattedData[index]?.porcentaje}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla para dispositivos pequeños */}
      <div className="mt-6 md:hidden">
        <h4 className="text-sm font-semibold mb-2 text-institucional-verde2">Resumen de Programas</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border border-gray-200 rounded-lg">
            <thead className="bg-institucional-verde1 text-white">
              <tr>
                <th className="px-2 py-1 text-left">Programa</th>
                <th className="px-2 py-1 text-right">Estudiantes</th>
                <th className="px-2 py-1 text-right">Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-institucional-verde3/10"}>
                  <td className="px-2 py-1 font-medium">{item.estudiante_programa_academico}</td>
                  <td className="px-2 py-1 text-right">{item.value}</td>
                  <td className="px-2 py-1 text-right">{item.porcentaje}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
