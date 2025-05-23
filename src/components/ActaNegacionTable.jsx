"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronUp, ChevronDown, AlertCircle } from "lucide-react"

export default function ActaNegacionTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })

  const sortedData = useMemo(() => {
    const sortable = [...data]
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key] ?? ""
        const bVal = b[sortConfig.key] ?? ""
        const cmp = typeof aVal === "string"
          ? aVal.localeCompare(bVal)
          : aVal - bVal
        return sortConfig.direction === "ascending" ? cmp : -cmp
      })
    }
    return sortable
  }, [data, sortConfig])

  const requestSort = key => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending")
      direction = "descending"
    setSortConfig({ key, direction })
  }

  const renderSortIndicator = key => (
    sortConfig.key !== key
      ? <ChevronUp className="h-4 w-4 opacity-30"/>
      : sortConfig.direction === "ascending"
        ? <ChevronUp className="h-4 w-4"/>
        : <ChevronDown className="h-4 w-4"/>
  )

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
      className="bg-white rounded-xl p-6 shadow-md"
    >
      <table className="min-w-full border">
        <thead className="bg-institucional-verde1 text-white">
          <tr>
            {[
              ["nombre_estudiante","Nombre"],
              ["documento_tipo","Tipo Doc."],
              ["documento_numero","Núm. Doc."],
              ["documento_expedido_en","Expedido En"],
              ["estudiante_programa_academico","Programa"],
              ["semestre","Semestre"],
              ["fecha_firma_dia","Día Firma"],
              ["fecha_firma_mes","Mes Firma"],
              ["fecha_firma_anio","Año Firma"],
              ["firma_estudiante","Firma"],
              ["documento_firma_estudiante","Doc. Firma"],
              ["docente_permanencia","Docente"],
              ["createdAt","Creado"]
            ].map(([key,label]) => (
              <th key={key}
                className="px-3 py-2 cursor-pointer hover:bg-institucional-verde2 transition-colors"
                onClick={() => requestSort(key)}
              >
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  {renderSortIndicator(key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={13} className="py-6 text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <AlertCircle className="h-8 w-8 mb-2"/>
                  No hay registros
                </div>
              </td>
            </tr>
          )}
          {sortedData.map((row, idx) => (
            <tr key={idx} className={idx%2===0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-3 py-1">{row.nombre_estudiante}</td>
              <td className="px-3 py-1">{row.documento_tipo}</td>
              <td className="px-3 py-1">{row.documento_numero}</td>
              <td className="px-3 py-1">{row.documento_expedido_en}</td>
              <td className="px-3 py-1">{row.estudiante_programa_academico}</td>
              <td className="px-3 py-1">{row.semestre}</td>
              <td className="px-3 py-1">{row.fecha_firma_dia}</td>
              <td className="px-3 py-1">{row.fecha_firma_mes}</td>
              <td className="px-3 py-1">{row.fecha_firma_anio}</td>
              <td className="px-3 py-1">{row.firma_estudiante}</td>
              <td className="px-3 py-1">{row.documento_firma_estudiante}</td>
              <td className="px-3 py-1">{row.docente_permanencia}</td>
              <td className="px-3 py-1">{new Date(row.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}
