import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./styles/globals.css";

import SideMenu from "@/components/layout/SideMenu";
import FloatingControls from "@/components/layout/FloatingControls";
import FloatingAIWidget from "@/components/layout/FloatingAIWidget";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Fincas from "./pages/Fincas";
import Tanques from "./pages/Tanques";
import Lotes from "./pages/Lotes";
import Mediciones from "./pages/Mediciones";
import Historial from "./pages/Historial";
import Variedades from "./pages/Variedades";
import Comparativas from "./pages/Comparativas";
import Guia from "./pages/Guia";
import Glosario from "./pages/Glosario";
import MiCuenta from "./pages/MiCuenta";
import MisDatos from "./pages/MisDatos";
import NotFound from "./pages/NotFound";
import EditarFinca from "./pages/EditarFinca";
import EditarTanque from "./pages/EditarTanque";
import EditarLote from "./pages/EditarLote";

const queryClient = new QueryClient();

const AppContent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  const noMenuRoutes = ["/", "/registro", "/chat"];
  const showMenu = !noMenuRoutes.includes(location.pathname);

  // Cierra el menú hamburguesa al navegar a cualquier ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {showMenu && (
        <>
          <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
          <div className="lg:ml-64">
            <header className="bg-card border-b border-border p-4 lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
                <Menu className="w-6 h-6" />
              </Button>
            </header>
            <main>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/fincas" element={<Fincas />} />
                <Route path="/fincas/:id/editar" element={<EditarFinca />} />
                <Route path="/tanques" element={<Tanques />} />
                <Route path="/tanques/:id/editar" element={<EditarTanque />} />
                <Route path="/lotes" element={<Lotes />} />
                <Route path="/lotes/:id/editar" element={<EditarLote />} />
                <Route path="/mediciones" element={<Mediciones />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/variedades" element={<Variedades />} />
                <Route path="/comparativas" element={<Comparativas />} />
                <Route path="/guia" element={<Guia />} />
                <Route path="/glosario" element={<Glosario />} />
                <Route path="/mi-cuenta" element={<MiCuenta />} />
                <Route path="/mis-datos" element={<MisDatos />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <FloatingControls />
          <FloatingAIWidget />
        </>
      )}
      
      {!showMenu && (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
