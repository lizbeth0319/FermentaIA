import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { login } from "@/api/auth";
import backgroundImage from "@/assets/fondo.png";
import logo from "@/assets/LogoFermentaIA.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login({ email, password });
      toast("Inicio de sesión exitoso", { description: "Bienvenido a FermentaIA" });
      navigate("/home");
    } catch (error: any) {
      toast("Error al iniciar sesión", { 
        description: error.message || "Credenciales incorrectas" 
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
      <Card className="w-full max-w-md rounded-2xl p-8 md:p-10 shadow-xl border bg-white">
        <div className="text-center space-y-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-white overflow-hidden ring-1 ring-primary/20">
            <img src={logo} alt="Fermenta IA" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Fermenta IA</h1>
          <p className="text-sm text-muted-foreground">Gestión inteligente de fermentación</p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 text-base"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 shadow-sm hover:shadow-md active:translate-y-px focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/registro")}
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            ¿No tienes cuenta? Regístrate aquí
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
