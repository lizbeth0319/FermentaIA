import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { register } from "@/api/auth";
import backgroundImage from "@/assets/fondo.png";
import logo from "@/assets/LogoFermentaIA.png";

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
    <div
      className="min-h-screen grid place-items-center px-4 py-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Card className="w-full max-w-2xl rounded-2xl p-8 md:p-10 shadow-xl border bg-white">
        <div className="text-center space-y-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-white overflow-hidden ring-1 ring-primary/20">
            <img src={logo} alt="Fermenta IA" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Registro</h1>
          <p className="text-sm text-muted-foreground">Crea tu cuenta en Fermenta IA</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium">Nombre Completo</Label>
              <Input
                id="nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula" className="text-sm font-medium">Cédula</Label>
              <Input
                id="cedula"
                placeholder="123456789"
                value={formData.cedula}
                onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                required
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular" className="text-sm font-medium">Celular</Label>
              <Input
                id="celular"
                type="tel"
                placeholder="300 123 4567"
                value={formData.celular}
                onChange={(e) => setFormData({...formData, celular: e.target.value})}
                required
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-medium">Teléfono Fijo (opcional)</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="8 123 456"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="h-11 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="regimen" className="text-sm font-medium">Régimen Tributario</Label>
            <Select value={formData.regimen} onValueChange={(value) => setFormData({...formData, regimen: value})}>
              <SelectTrigger className="h-11">
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
            variant="outline"
            size="lg"
            disabled={loading}
            className="w-full h-12 text-base rounded-lg bg-white text-foreground border border-gray-300 shadow-md hover:shadow-lg hover:bg-gray-100 hover:border-gray-400 transition-colors active:translate-y-px focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:border-neutral-600"
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Registro;
