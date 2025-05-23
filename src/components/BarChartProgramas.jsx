"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList } from "recharts"
import { motion } from "framer-motion"

export default function BarChartProgramas({ data }) {
  // Agrupar datos por programa
  const programaStats = {}

  data.forEach((item) => {
    if (!programaStats[item.programa]) {
      programaStats[item.programa] = {
        programa: item.programa,
        total: 0,
        riesgoAlto: 0,
        riesgoMedio: 0,
        riesgoBajo: 0,
      }
    }

    programaStats[item.programa].total += 1

    // Contar por nivel de riesgo
    if (item.riesgo_desercion === "Alto") {
      programaStats[item.programa].riesgoAlto += 1
    } else if (item.riesgo_desercion === "Medio") {
      programaStats[item.programa].riesgoMedio += 1
    } else if (item.riesgo_desercion === "Bajo") {
      programaStats[item.programa].riesgoBajo += 1
    }
  })

  // Convertir a array para el gráfico
  const chartData = Object.values(programaStats)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-md mt-8 border-2 border-institucional-verde3/20 hover:shadow-lg transition-shadow"
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Distribución de Riesgo por Programa
      </h3>
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <p className="text-sm text-gray-600">
          Este gráfico muestra la distribución de estudiantes por nivel de riesgo de deserción en cada programa
          académico.
        </p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="programa" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: 20 }} iconType="circle" />
          <Bar dataKey="riesgoAlto" stackId="a" fill="#D32F2F" name="Riesgo Alto" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="riesgoAlto" position="top" fill="#333" fontSize={11} />
          </Bar>
          <Bar dataKey="riesgoMedio" stackId="a" fill="#F2CC0C" name="Riesgo Medio" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="riesgoMedio" position="top" fill="#333" fontSize={11} />
          </Bar>
          <Bar dataKey="riesgoBajo" stackId="a" fill="#57A641" name="Riesgo Bajo" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="riesgoBajo" position="top" fill="#333" fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
