import { useEffect, useState } from "react";
import { User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/api/http";
import { API } from "@/api/endpoints";
import { authToken, currentUserId } from "@/api/auth";

const MiCuenta = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState<string>("...");
  const [email, setEmail] = useState<string>("...");

  useEffect(() => {
    const run = async () => {
      try {
        const uid = currentUserId();
        if (!uid) return; // deja los placeholders si no hay sesión
        const res: any = await apiFetch(API.productores.byId(uid));
        // El backend responde { success, data }
        const data = res?.data || res;
        if (data) {
          setNombre(data.nombre_completo || data.nombre || nombre);
          setEmail(data.email || email);
        }
      } catch (err) {
        // Silencioso: mantenemos placeholders si falla
        console.warn("No se pudo cargar el perfil del usuario", err);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    try { authToken.clear(); } catch {}
    navigate("/");
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mi Cuenta</h1>
        <p className="text-muted-foreground">Gestiona tu perfil y preferencias</p>
      </div>

      <Card className="p-8">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <div className="bg-primary p-6 rounded-full">
            <User className="w-16 h-16 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">{nombre}</h2>
            <p className="text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start text-lg h-14"
            onClick={() => navigate("/mis-datos")}
          >
            <Settings className="w-5 h-5 mr-3" />
            Mis Datos
          </Button>

          <Button 
            variant="destructive" 
            className="w-full text-lg h-14"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MiCuenta;
