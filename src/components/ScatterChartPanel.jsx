"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { motion } from "framer-motion"

export default function ScatterChartPanel({ data, xKey, yKey, xLabel, yLabel, title }) {
  // Filtrar datos para asegurarnos de que solo incluimos puntos con valores válidos
  const validData = data.filter(
    (item) => item[xKey] !== undefined && item[xKey] !== null && item[yKey] !== undefined && item[yKey] !== null,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-md border-2 border-institucional-verde3/20 hover:shadow-lg transition-shadow"
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
        {title}
      </h3>
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <p className="text-sm text-gray-600">
          Este gráfico muestra la relación entre {xLabel} y {yLabel}.
        </p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            dataKey={xKey}
            name={xLabel}
            label={{ value: xLabel, position: "insideBottom", offset: -5 }}
          />
          <YAxis
            type="number"
            dataKey={yKey}
            name={yLabel}
            label={{ value: yLabel, angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
            formatter={(value, name) => [value, name === xKey ? xLabel : yLabel]}
          />
          <Legend />
          <Scatter
            name={title}
            data={validData}
            fill="#57A641"
            shape="circle"
            line={{ stroke: "#57A641", strokeWidth: 1, strokeDasharray: "5 5" }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
