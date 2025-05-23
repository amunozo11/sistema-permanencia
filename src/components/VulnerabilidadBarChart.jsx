import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export default function VulnerabilidadBarChart({ data }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border-2 border-institucional-verde3/20 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-4 text-institucional-verde1">Tipos de Vulnerabilidad</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tipo" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#57A641" name="Cantidad de Estudiantes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
