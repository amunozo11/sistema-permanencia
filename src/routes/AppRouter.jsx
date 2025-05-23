import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import ActaNegacionForm from "../pages/ActaNegacionForm"
import AsistenciaActividadForm from "../pages/AsistenciaActividadForm"
import FichaDocenteForm from "../pages/FichaDocenteForm"
import GrupalSolicitudForm from "../pages/GrupalSolicitudForm"
import RemisionPsicologicaForm from "../pages/RemisionPsicologicaForm"
import SoftwareSolicitudForm from "../pages/SoftwareSolicitudForm"
import SoftwareEstudianteForm from "../pages/SoftwareEstudianteForm"
import Navigation from "../components/Navigation"

export default function AppRouter() {
  return (
    <Router>
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/acta-negacion" element={<ActaNegacionForm />} />
          <Route path="/asistencia-actividad" element={<AsistenciaActividadForm />} />
          <Route path="/ficha-docente" element={<FichaDocenteForm />} />
          <Route path="/grupal-solicitud" element={<GrupalSolicitudForm />} />
          <Route path="/remision-psicologica" element={<RemisionPsicologicaForm />} />
          <Route path="/software-solicitud" element={<SoftwareSolicitudForm />} />
          <Route path="/software-estudiante" element={<SoftwareEstudianteForm />} />
        </Routes>
      </div>
    </Router>
  )
}
