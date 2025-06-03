import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import {
  HiChartBar,
  HiUser,
  HiUsers,
  HiHeart,
  HiCode,
  HiUserAdd,
  HiDocumentText,
  HiChevronDown,
} from "react-icons/hi"

export default function Navigation() {
  const location = useLocation()
  const dropdownRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const iconMap = {
    "chart-bar": HiChartBar,
    "file-text": HiDocumentText,
    "users": HiUsers,
    "user": HiUser,
    "heart": HiHeart,
    "code": HiCode,
    "user-plus": HiUserAdd,
  }

  const groupedMenu = [
    { path: "/", label: "Dashboard", icon: "chart-bar" },
    {
      label: "Formularios",
      submenu: [
        { path: "/acta-negacion", label: "Acta de Negación", icon: "file-text" },
        { path: "/asistencia-actividad", label: "Asistencia a Actividad", icon: "users" },
        { path: "/ficha-docente", label: "Ficha Docente", icon: "user" },
        { path: "/grupal-solicitud", label: "Intervención Grupal", icon: "users" },
        { path: "/remision-psicologica", label: "Remisión Psicológica", icon: "heart" },
        { path: "/software-solicitud", label: "Solicitud Software", icon: "code" },
        { path: "/software-estudiante", label: "Estudiante Software", icon: "user-plus" },
      ],
    },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev)

  // Cierra el dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Detectar si estamos en una ruta de formulario
  const currentForm = groupedMenu[1]?.submenu.find((sub) => location.pathname === sub.path)
  const currentFormLabel = currentForm?.label || groupedMenu[1].label

  return (
    <nav className="bg-institucional-verde1 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center bg-white text-institucional-verde1 rounded-xl mr-4 ml-2 p-1">
            <img src="/logo-upc.png" alt="Logo UPC" className="h-10 mr-3 ml-2" />
             <div className="mr-4">
                <h1 className="text-2xl font-bold">SIGPEBI</h1>
                <p className="text-xxs opacity-80">Sistema de Informacion de Gestion de Permanencia</p>
              </div>
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-institucional-verde2 transition-colors"
            onClick={toggleMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Menú de escritorio */}
          <div className="hidden md:flex space-x-4 items-center">
            {groupedMenu.map((item) => {
              if (item.submenu) {
                return (
                  <div key={item.label} ref={dropdownRef} className="relative group mr-4 pr-16">
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-institucional-verde2"
                    >
                      {currentFormLabel} <HiChevronDown className="w-4 h-4" />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 z-10 bg-white text-institucional-verde1 rounded-md shadow-md mt-1 min-w-[220px]">
                        {item.submenu.map((sub) => {
                          const Icon = iconMap[sub.icon]
                          return (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              className="flex items-center gap-2 px-4 py-2 hover:bg-institucional-verde2/10 transition-colors"
                            >
                              <Icon className="w-4 h-4" />
                              {sub.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              } else {
                const Icon = iconMap[item.icon]
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                        ? "bg-white text-institucional-verde1"
                        : "hover:bg-institucional-verde2"
                      }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    {item.label}
                  </Link>
                )
              }
            })}
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col space-y-2">
              {groupedMenu.map((item) => {
                if (item.submenu) {
                  return (
                    <div key={item.label} className="border-t border-white pt-2">
                      <p className="px-3 py-1 font-semibold">{currentFormLabel}</p>
                      {item.submenu.map((sub) => {
                        const Icon = iconMap[sub.icon]
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === sub.path
                                ? "bg-white text-institucional-verde1"
                                : "hover:bg-institucional-verde2"
                              }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icon className="w-4 h-4" />
                            {sub.label}
                          </Link>
                        )
                      })}
                    </div>
                  )
                } else {
                  const Icon = iconMap[item.icon]
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                          ? "bg-white text-institucional-verde1"
                          : "hover:bg-institucional-verde2"
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      {item.label}
                    </Link>
                  )
                }
              })}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
