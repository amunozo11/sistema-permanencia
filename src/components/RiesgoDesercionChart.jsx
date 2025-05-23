import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS = ["#007E5B", "#F2CC0C", "#D32F2F", "#7BDCB5", "#CDEAE1"]

export default function RiesgoDesercionChart({ data }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border-2 border-institucional-verde3/20 hover:shadow-lg transition-shadow">
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        Distribución por Riesgo de Deserción
      </h3>
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <p className="text-sm text-gray-600">
          Este gráfico muestra la distribución de estudiantes según su nivel de riesgo de deserción.
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="cantidad"
            nameKey="riesgo"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={true}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} estudiantes`, "Cantidad"]}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: 10,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
          />
          <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
