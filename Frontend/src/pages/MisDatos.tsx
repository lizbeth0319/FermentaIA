import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MisDatos = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    celular: "300 123 4567",
    telefono: "8 123 456",
    regimen: "simplificado",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardar cambios
    navigate("/mi-cuenta");
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/mi-cuenta")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Datos</h1>
          <p className="text-muted-foreground">Actualiza tu información personal</p>
        </div>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-base">Nombre Completo</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="h-12 text-base"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="celular" className="text-base">Celular</Label>
              <Input
                id="celular"
                value={formData.celular}
                onChange={(e) => setFormData({...formData, celular: e.target.value})}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-base">Teléfono Fijo</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="h-12 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="regimen" className="text-base">Régimen Tributario</Label>
            <Select value={formData.regimen} onValueChange={(value) => setFormData({...formData, regimen: value})}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simplificado">Régimen Simplificado</SelectItem>
                <SelectItem value="comun">Régimen Común</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-12 text-base"
              onClick={() => navigate("/mi-cuenta")}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 h-12 text-base">
              <Save className="w-5 h-5 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default MisDatos;
