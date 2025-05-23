import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export default function ServiciosBarChart({ data }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border-2 border-institucional-verde3/20 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-4 text-institucional-verde1">Servicios de Permanencia Utilizados</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="servicio" width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#007E5B" name="Cantidad de Estudiantes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
