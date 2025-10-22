import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { register } from "@/api/auth";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    celular: "",
    telefono: "",
    email: "",
    password: "",
    regimen: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await register({
        name: formData.nombre,
        email: formData.email,
        password: formData.password
      });
      toast("Registro exitoso", { description: "Tu cuenta ha sido creada correctamente" });
      navigate("/");
    } catch (error: any) {
      toast("Error en el registro", { 
        description: error.message || "No se pudo crear la cuenta" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12">
      <Card className="w-full max-w-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Coffee className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Registro</h1>
          <p className="text-muted-foreground">Crea tu cuenta en FermentaCafé</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                placeholder="123456789"
                value={formData.cedula}
                onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular">Celular</Label>
              <Input
                id="celular"
                type="tel"
                placeholder="300 123 4567"
                value={formData.celular}
                onChange={(e) => setFormData({...formData, celular: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono Fijo (opcional)</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="8 123 456"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="regimen">Régimen Tributario</Label>
            <Select value={formData.regimen} onValueChange={(value) => setFormData({...formData, regimen: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu régimen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simplificado">Régimen Simplificado</SelectItem>
                <SelectItem value="comun">Régimen Común</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full text-base py-6"
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => navigate("/")}
            className="text-primary hover:underline"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Registro;
