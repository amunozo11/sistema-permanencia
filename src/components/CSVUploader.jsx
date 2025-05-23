"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle, Upload, FileText, Info, ChevronDown, ChevronUp } from "lucide-react"

export default function CSVUploader({ onDataLoaded }) {
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [csvPreview, setCsvPreview] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (file) => {
    if (!file) return

    // Verificar que sea un archivo CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Por favor, sube un archivo CSV válido.")
      return
    }

    setFileName(file.name)
    setError("")
    setSuccess("")
    setIsLoading(true)
    setUploadProgress(0)
    setIsExpanded(true)

    // Mostrar una vista previa del CSV
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const lines = text.split("\n")
      const headers = lines[0].split(",")
      const previewData = []

      for (let i = 1; i < Math.min(lines.length, 4); i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(",")
          const row = {}
          headers.forEach((header, index) => {
            row[header.trim()] = values[index] ? values[index].trim() : ""
          })
          previewData.push(row)
        }
      }

      setCsvPreview({
        headers: headers.map((h) => h.trim()),
        rows: previewData,
      })
    }
    reader.readAsText(file)

    // Simular progreso de carga
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData()
      formData.append("file", file)
      // Enviar el archivo al backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-csv`, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al procesar el archivo CSV")
      }

      const result = await response.json()

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Notificar al componente padre con los datos procesados
      onDataLoaded(result.data)

      setSuccess(`¡Archivo procesado correctamente! Se han importado ${result.inserted} registros.`)

      setTimeout(() => {
        setIsLoading(false)
        setUploadProgress(0)
      }, 500)
      window.location.reload()
    } catch (error) {
      clearInterval(progressInterval)
      console.error("Error al procesar el CSV:", error)
      setError("Error al procesar el archivo: " + error.message)
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileUpload(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border-2 border-institucional-verde3/20 overflow-hidden"
    >
      <div className="p-4 cursor-pointer flex items-center justify-between" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center">
          <Upload className="h-5 w-5 mr-2 text-institucional-verde1" />
          <h3 className="text-lg font-semibold text-institucional-verde1">Importar Datos CSV</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div
                className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                  isDragging
                    ? "border-institucional-verde1 bg-institucional-verde1/10"
                    : "border-gray-300 hover:border-institucional-verde2 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center">
                  <FileText
                    className={`h-12 w-12 mb-4 transition-colors ${isDragging ? "text-institucional-verde1" : "text-gray-400"}`}
                  />

                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Haz clic para seleccionar</span> o arrastra y suelta
                  </p>
                  <p className="text-xs text-gray-500">CSV (hasta 10MB)</p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleButtonClick}
                    className="mt-4 px-4 py-2 bg-institucional-verde1 text-white rounded-lg hover:bg-institucional-verde2 transition-colors flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Seleccionar archivo CSV
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {isLoading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-institucional-verde1">Procesando archivo...</span>
                    <span className="text-sm font-medium text-institucional-verde1">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="bg-institucional-verde1 h-2.5 rounded-full"
                    ></motion.div>
                  </div>
                </div>
              )}

              {success && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center p-3 bg-green-50 text-green-800 rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>{success}</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center p-3 bg-red-50 text-red-800 rounded-lg"
                >
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </motion.div>
              )}

              {fileName && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center p-3 bg-blue-50 text-blue-800 rounded-lg"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="font-medium">Archivo cargado:</span>
                  <span className="ml-2 truncate">{fileName}</span>
                </motion.div>
              )}

              {csvPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Info className="h-5 w-5 mr-2 text-blue-500" />
                      <h4 className="text-sm font-semibold">Vista previa del CSV</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                          <tr>
                            {csvPreview.headers.slice(0, 5).map((header, index) => (
                              <th key={index} className="px-2 py-1 text-left">
                                {header}
                              </th>
                            ))}
                            {csvPreview.headers.length > 5 && <th className="px-2 py-1 text-left">...</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              {csvPreview.headers.slice(0, 5).map((header, colIndex) => (
                                <td key={colIndex} className="px-2 py-1 truncate max-w-[150px]">
                                  {row[header] || ""}
                                </td>
                              ))}
                              {csvPreview.headers.length > 5 && <td className="px-2 py-1">...</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Información importante
                </h4>
                <ul className="text-xs text-blue-700 space-y-1 list-disc pl-5">
                  <li>El archivo CSV debe contener las columnas necesarias para el procesamiento correcto.</li>
                  <li>Los datos se procesarán en el servidor y se guardarán en la base de datos.</li>
                  <li>Asegúrate de que los encabezados del CSV coincidan con los esperados por el sistema.</li>
                  <li>
                    Columnas recomendadas: estudiante_programa_academico, estudiante_semestre,
                    estudiante_riesgo_desercion, etc.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
