import { History, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Historial = () => {
  const navigate = useNavigate();
  const mediciones = [
    { id: 1, lote: "Castillo - Tanque 1", fecha: "2024-01-20 10:30", fase: "Inicio", ph: 5.2, temperatura: 26, estado: "Óptimo" },
    { id: 2, lote: "Castillo - Tanque 1", fecha: "2024-01-21 14:15", fase: "Media", ph: 4.5, temperatura: 28, estado: "Óptimo" },
    { id: 3, lote: "Caturra - Tanque 2", fecha: "2024-01-21 16:00", fase: "Inicio", ph: 4.8, temperatura: 24, estado: "Bueno" },
    { id: 4, lote: "Bourbon - Tanque 3", fecha: "2024-01-22 09:00", fase: "Media", ph: 3.9, temperatura: 30, estado: "Atención" },
  ];

  const getEstadoStyles = (estado: string) => {
    const styles: Record<string, string> = {
      "Óptimo": "bg-[hsl(var(--status-optimal))] text-white",
      "Bueno": "bg-[hsl(var(--status-good))] text-white",
      "Atención": "bg-[hsl(var(--status-warning))] text-white",
    };
    return styles[estado] || "bg-gray-500 text-white";
  };

  const verComparativa = (m: { lote: string; ph: number; temperatura: number }) => {
    const params = new URLSearchParams({ lote: m.lote, ph: String(m.ph), temp: String(m.temperatura) });
    navigate(`/comparativas?${params.toString()}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <History className="w-8 h-8" />
          Historial de Mediciones
        </h1>
        <p className="text-muted-foreground">Revisa todas tus mediciones registradas</p>
      </div>

      <div className="space-y-4">
        {mediciones.map((medicion) => (
          <Card key={medicion.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-xl font-bold text-foreground">{medicion.lote}</h3>
                  <Badge className={getEstadoStyles(medicion.estado)}>
                    {medicion.estado}
                  </Badge>
                  <Badge variant="outline">{medicion.fase}</Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">{medicion.fecha}</p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <span className="text-white font-bold text-sm">pH</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{medicion.ph}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-500 p-2 rounded-lg">
                      <span className="text-white font-bold text-sm">°C</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{medicion.temperatura}°</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="lg" className="lg:w-auto w-full" onClick={() => verComparativa(medicion)}>
                <BarChart3 className="w-5 h-5 mr-2" />
                Ver Comparativa
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Historial;
