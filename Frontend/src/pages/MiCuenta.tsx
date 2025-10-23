import { User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MiCuenta = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
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
            <h2 className="text-2xl font-bold text-foreground">Juan Pérez</h2>
            <p className="text-muted-foreground">juan.perez@email.com</p>
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
