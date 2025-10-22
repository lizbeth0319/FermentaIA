import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Comparativas = () => {
  const comparativa = {
    lote: "Castillo - Tanque 1",
    fecha: "2024-01-22 10:30",
    variedad: "Castillo",
    ph: { actual: 4.5, ideal: 4.2, diferencia: 0.3 },
    temperatura: { actual: 29, ideal: 28, diferencia: 1 },
  };

  const getDiferencia = (actual: number, ideal: number) => {
    const diff = Math.abs(actual - ideal);
    if (diff < 0.5) return "Óptimo";
    if (diff < 1) return "Bueno";
    return "Atención";
  };

  const getBarWidth = (actual: number, max: number) => {
    return `${(actual / max) * 100}%`;
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="w-8 h-8" />
          Comparativa de Mediciones
        </h1>
        <p className="text-muted-foreground">Compara tus valores con los rangos ideales</p>
      </div>

      <Card className="p-6 bg-primary/5 border-2 border-primary">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{comparativa.lote}</h2>
            <p className="text-muted-foreground">{comparativa.fecha}</p>
          </div>
          <Badge className="text-base px-4 py-2">Variedad: {comparativa.variedad}</Badge>
        </div>
      </Card>

      {/* Comparativa pH */}
      <Card className="p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-3 rounded-xl">
              <span className="text-white font-bold text-xl">pH</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Nivel de pH</h3>
              <Badge className={`
                ${getDiferencia(comparativa.ph.actual, comparativa.ph.ideal) === 'Óptimo' ? 'bg-[hsl(var(--status-optimal))]' : ''}
                ${getDiferencia(comparativa.ph.actual, comparativa.ph.ideal) === 'Bueno' ? 'bg-[hsl(var(--status-good))]' : ''}
                ${getDiferencia(comparativa.ph.actual, comparativa.ph.ideal) === 'Atención' ? 'bg-[hsl(var(--status-warning))]' : ''}
                text-white
              `}>
                {getDiferencia(comparativa.ph.actual, comparativa.ph.ideal)}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Valor Ideal</span>
                <span className="text-2xl font-bold text-blue-600">{comparativa.ph.ideal}</span>
              </div>
              <div className="h-8 bg-blue-100 dark:bg-blue-950 rounded-xl overflow-hidden">
                <div 
                  className="h-full bg-blue-600 dark:bg-blue-400 flex items-center justify-end pr-4"
                  style={{ width: getBarWidth(comparativa.ph.ideal, 7) }}
                >
                  <span className="text-white font-bold">{comparativa.ph.ideal}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Valor Actual</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">{comparativa.ph.actual}</span>
                  {comparativa.ph.actual > comparativa.ph.ideal ? (
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              <div className="h-8 bg-blue-100 dark:bg-blue-950 rounded-xl overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-end pr-4"
                  style={{ width: getBarWidth(comparativa.ph.actual, 7) }}
                >
                  <span className="text-white font-bold">{comparativa.ph.actual}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Comparativa Temperatura */}
      <Card className="p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-3 rounded-xl">
              <span className="text-white font-bold text-xl">°C</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Temperatura</h3>
              <Badge className={`
                ${getDiferencia(comparativa.temperatura.actual, comparativa.temperatura.ideal) === 'Óptimo' ? 'bg-[hsl(var(--status-optimal))]' : ''}
                ${getDiferencia(comparativa.temperatura.actual, comparativa.temperatura.ideal) === 'Bueno' ? 'bg-[hsl(var(--status-good))]' : ''}
                ${getDiferencia(comparativa.temperatura.actual, comparativa.temperatura.ideal) === 'Atención' ? 'bg-[hsl(var(--status-warning))]' : ''}
                text-white
              `}>
                {getDiferencia(comparativa.temperatura.actual, comparativa.temperatura.ideal)}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Temperatura Ideal</span>
                <span className="text-2xl font-bold text-orange-600">{comparativa.temperatura.ideal}°C</span>
              </div>
              <div className="h-8 bg-orange-100 dark:bg-orange-950 rounded-xl overflow-hidden">
                <div 
                  className="h-full bg-orange-600 dark:bg-orange-400 flex items-center justify-end pr-4"
                  style={{ width: getBarWidth(comparativa.temperatura.ideal, 40) }}
                >
                  <span className="text-white font-bold">{comparativa.temperatura.ideal}°C</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Temperatura Actual</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-orange-600">{comparativa.temperatura.actual}°C</span>
                  {comparativa.temperatura.actual > comparativa.temperatura.ideal ? (
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              <div className="h-8 bg-orange-100 dark:bg-orange-950 rounded-xl overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-end pr-4"
                  style={{ width: getBarWidth(comparativa.temperatura.actual, 40) }}
                >
                  <span className="text-white font-bold">{comparativa.temperatura.actual}°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recomendaciones */}
      <Card className="p-6 bg-primary/10 border-2 border-primary">
        <h3 className="text-xl font-bold mb-3">📋 Recomendaciones</h3>
        <div className="space-y-2 text-foreground">
          <p>• El pH está ligeramente alto. Considera revisar el proceso de fermentación.</p>
          <p>• La temperatura está 1°C por encima del ideal. Intenta mejorar la ventilación.</p>
          <p>• Realiza mediciones cada 12 horas para un mejor seguimiento.</p>
        </div>
      </Card>
    </div>
  );
};

export default Comparativas;
