import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const Home = () => {
  const shortcuts = [
    { emoji: "🏡", label: "Registrar Finca", path: "/fincas", color: "bg-primary" },
    { emoji: "🛢️", label: "Registrar Tanque", path: "/tanques", color: "bg-secondary" },
    { emoji: "🫘", label: "Registrar Lote", path: "/lotes", color: "bg-accent" },
    { emoji: "📊", label: "Ver Mediciones", path: "/mediciones", color: "bg-primary" },
  ];

  const alerts = [
    { text: "Lote 'Castillo-001' listo para lavado", type: "success" },
    { text: "Temperatura alta en Tanque 2", type: "warning" },
    { text: "Niveles perfectos en Lote 'Bourbon-002'", type: "success" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Bienvenida */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">¡Bienvenido, Juan!</h1>
        <p className="text-lg text-muted-foreground">Gestiona tu proceso de fermentación fácilmente</p>
      </div>

      {/* Accesos Rápidos */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map((shortcut) => (
            <Link key={shortcut.path} to={shortcut.path}>
              <Card className="p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`${shortcut.color} p-4 rounded-2xl`}
                       aria-hidden="true"
                       title={shortcut.label}>
                    <span className="text-3xl select-none">{shortcut.emoji}</span>
                  </div>
                  <span className="font-semibold text-lg">{shortcut.label}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Alertas */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Alertas y Recomendaciones
        </h2>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <Card 
              key={index}
              className={`p-4 border-l-4 ${
                alert.type === 'success' 
                  ? 'border-l-[hsl(var(--status-optimal))] bg-green-50 dark:bg-green-950/20' 
                  : 'border-l-[hsl(var(--status-warning))] bg-orange-50 dark:bg-orange-950/20'
              }`}
            >
              <p className="font-medium">{alert.text}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Estado Actual</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">2</p>
              <p className="text-muted-foreground mt-2">Fincas Activas</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent">5</p>
              <p className="text-muted-foreground mt-2">Lotes en Proceso</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-secondary">12</p>
              <p className="text-muted-foreground mt-2">Mediciones Hoy</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
