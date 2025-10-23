import { Home, Coffee, Droplet, Thermometer, History, BarChart3, BookOpen, FileText, User, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { APP_NAME } from "@/config/constants";
import LogoFermentaIA from "@/assets/LogoFermentaIA.png";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Inicio", path: "/home" },
    { icon: Coffee, label: "Fincas", path: "/fincas" },
    { icon: Droplet, label: "Tanques", path: "/tanques" },
    { icon: Coffee, label: "Lotes", path: "/lotes" },
    { icon: Thermometer, label: "Mediciones", path: "/mediciones" },
    { icon: History, label: "Historial", path: "/historial" },
    { icon: BarChart3, label: "Comparativas", path: "/comparativas" },
    { icon: Coffee, label: "Variedades", path: "/variedades" },
    { icon: BookOpen, label: "Guía", path: "/guia" },
    { icon: FileText, label: "Glosario", path: "/glosario" },
    { icon: User, label: "Mi Cuenta", path: "/mi-cuenta" },
  ];

  // Cerrar con tecla ESC cuando está abierto (útil en móvil)
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Bloquear scroll del body cuando el menú esté abierto
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Menu */}
      <aside 
        role="dialog"
        aria-modal={isOpen}
        aria-label="Menú de navegación"
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 text-foreground shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-y-auto border-r border-gray-200 dark:border-gray-700`}
        style={{ backgroundColor: 'white' }}
      >
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 flex items-center justify-between p-6" style={{ backgroundColor: 'white' }}>
          <div className="flex items-center gap-2">
            <img src={LogoFermentaIA} alt="FermentaIA" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl text-black">{APP_NAME}</span>
           </div>
          <button onClick={onClose} className="lg:hidden text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" aria-label="Cerrar menú">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="px-6 pt-2 pb-10 space-y-1 bg-white dark:bg-gray-900" style={{ backgroundColor: 'white' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all outline-none focus-visible:ring-2 ring-offset-2 ring-primary/40 ${
                  isActive 
                    ? 'bg-gray-200 text-gray-900 shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-900 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 text-gray-900" />
                <span className="font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default SideMenu;