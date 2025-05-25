import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Database,
  Users,
} from "lucide-react"

function Header({ activeTab, setActiveTab }) {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        // Si está casi arriba, siempre mostrar header
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY) {
        // Scroll hacia abajo: ocultar header
        setShowHeader(false);
      } else {
        // Scroll hacia arriba: mostrar header
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {showHeader && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="sticky top-0 z-10"
          style={{ position: "sticky" }}
        >
          <div className="mx-auto px-6 py-4 w-fit rounded-3xl bg-institucional-verde1 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                    activeTab === "dashboard"
                      ? "bg-white text-institucional-verde1"
                      : "bg-institucional-verde2 text-white hover:bg-institucional-verde3"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("data")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                    activeTab === "data"
                      ? "bg-white text-institucional-verde1"
                      : "bg-institucional-verde2 text-white hover:bg-institucional-verde3"
                  }`}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Datos
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("services")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                    activeTab === "services"
                      ? "bg-white text-institucional-verde1"
                      : "bg-institucional-verde2 text-white hover:bg-institucional-verde3"
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Servicios
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}

export default Header;