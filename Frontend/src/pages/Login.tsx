import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login (se mantiene para facilitar el diseño)
    navigate("/home");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 py-8">
      <Card className="w-full max-w-md rounded-2xl p-8 md:p-10 shadow-lg border bg-card">
        <div className="text-center space-y-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15">
            <Coffee className="h-8 w-8 text-primary" />
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

          <Button type="submit" className="w-full h-11 text-base bg-primary text-primary-foreground hover:bg-primary/90">
            Iniciar Sesión
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
