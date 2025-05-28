"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

// Colores para cada estrato (1–6)
const ESTRATO_COLORS = {
  "1": "#007E5B",
  "2": "#00B388",
  "3": "#7BDCB5",
  "4": "#CDEAE1",
  "5": "#005B40",
  "6": "#A7D1C5",
}

export default function ServiciosEstratoChart({ data }) {
  const grouped = {}
  data.forEach(({ servicio, estrato }) => {
    if (!grouped[servicio]) grouped[servicio] = { servicio }
    const key = String(estrato)
    grouped[servicio][key] = (grouped[servicio][key] || 0) + 1
  })
  const chartData = Object.values(grouped)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-md border-2 border-institucional-verde3/20 hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-semibold mb-4 text-institucional-verde1 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 3v18h18" />
        </svg>
        Suma de Estrato por Servicio y Estrato
      </h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="servicio" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(ESTRATO_COLORS).map((estratoKey) => (
              <Bar
                key={estratoKey}
                dataKey={estratoKey}
                name={`Estrato ${estratoKey}`}
                stackId="a"
                fill={ESTRATO_COLORS[estratoKey]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
