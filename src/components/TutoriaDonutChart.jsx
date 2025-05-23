import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS = ["#57A641", "#F2CC0C"]

export default function TutoriaDonutChart({ data }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border-2 border-institucional-verde3/20 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-4 text-institucional-verde1">Requerimiento de Tutoría</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} estudiantes`, "Cantidad"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
