"use client"

import { useState, useEffect } from "react"

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  options = [],
  placeholder = "",
  error = "",
  pattern = "",
  min = "",
  max = "",
  className = "",
  autoComplete = "on",
  helpText = "",
  showMatchWarning = false,
  matchValue = "",
  matchLabel = "",
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [localError, setLocalError] = useState("")
  const [isMatching, setIsMatching] = useState(true)

  // Verificar coincidencia si es necesario
  useEffect(() => {
    if (showMatchWarning && matchValue !== undefined) {
      setIsMatching(value === matchValue)
    }
  }, [value, matchValue, showMatchWarning])

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const handleChange = (e) => {
    // Limpiar error local cuando el usuario comienza a escribir
    if (localError) setLocalError("")

    // Llamar al onChange proporcionado
    onChange(name, e.target.type === "checkbox" ? e.target.checked : e.target.value)

  }

  // Determinar las clases de estilo para el campo
  const getInputClasses = () => {
    const baseClasses = "w-full p-2 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 "

    if (error || localError) {
      return baseClasses + "border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500"
    } else if (!isMatching && showMatchWarning) {
      return baseClasses + "border-yellow-500 bg-yellow-50 focus:ring-yellow-200 focus:border-yellow-500"
    } else if (isFocused) {
      return (
        baseClasses + "border-institucional-verde2 focus:ring-institucional-verde3/30 focus:border-institucional-verde2"
      )
    } else {
      return baseClasses + "border-gray-300 focus:ring-institucional-verde3/30 focus:border-institucional-verde2"
    }
  }

  if (type === "select") {
    return (
      <div className={`mb-4 ${className}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          id={name}
          name={name}
          value={value || ""}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          className={getInputClasses()}
          aria-invalid={!!error || !!localError}
          aria-describedby={error || localError ? `${name}-error` : helpText ? `${name}-help` : undefined}
        >
          <option value="">{placeholder || "Seleccione una opción"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {(error || localError) && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
            {error || localError}
          </p>
        )}
        {!error && !localError && helpText && (
          <p id={`${name}-help`} className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    )
  }

  if (type === "textarea") {
    return (
      <div className={`mb-4 ${className}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id={name}
          name={name}
          value={value || ""}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          placeholder={placeholder}
          className={getInputClasses()}
          rows={4}
          aria-invalid={!!error || !!localError}
          aria-describedby={error || localError ? `${name}-error` : helpText ? `${name}-help` : undefined}
        ></textarea>
        {(error || localError) && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
            {error || localError}
          </p>
        )}
        {!error && !localError && helpText && (
          <p id={`${name}-help`} className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}
        {showMatchWarning && !isMatching && (
          <p className="mt-1 text-sm text-yellow-600">
            Este campo debe coincidir con {matchLabel || "el valor anterior"}.
          </p>
        )}
      </div>
    )
  }

  if (type === "checkbox") {
    return (
      <div className={`mb-4 ${className}`}>
        <div className="flex items-center">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={value || false}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="h-4 w-4 text-institucional-verde2 focus:ring-institucional-verde3 border-gray-300 rounded"
            aria-invalid={!!error || !!localError}
            aria-describedby={error || localError ? `${name}-error` : helpText ? `${name}-help` : undefined}
          />
          <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
        {(error || localError) && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
            {error || localError}
          </p>
        )}
        {!error && !localError && helpText && (
          <p id={`${name}-help`} className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className={getInputClasses()}
        autoComplete={autoComplete}
        aria-invalid={!!error || !!localError}
        aria-describedby={error || localError ? `${name}-error` : helpText ? `${name}-help` : undefined}
      />
      {(error || localError) && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
          {error || localError}
        </p>
      )}
      {!error && !localError && helpText && (
        <p id={`${name}-help`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
      {showMatchWarning && !isMatching && (
        <p className="mt-1 text-sm text-yellow-600">
          Este campo debe coincidir con {matchLabel || "el valor anterior"}.
        </p>
      )}
    </div>
  )
}
