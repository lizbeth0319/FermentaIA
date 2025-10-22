import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/api/http";
import { API } from "@/api/endpoints";

const Comparativas = () => {
  const [params] = useSearchParams();
  const [perfil, setPerfil] = useState<any | null>(null);
  const variedad = params.get("variedad") || "";
  const proceso = params.get("proceso") || "";
  const fase = params.get("fase") || ""; // se espera 'inicio' | 'media' | 'fin'
  const phActual = Number(params.get("ph") || 0);
  const tempActual = Number(params.get("temp") || 0);

  useEffect(() => {
    const load = async () => {
      if (!variedad || !proceso || !fase) return;
      try {
        const p = await apiFetch<any>(API.perfiles.buscar({ variedad, proceso, fase }));
        setPerfil(p);
      } catch {
        setPerfil(null);
      }
    };
    load();
  }, [variedad, proceso, fase]);

  const estadoPh = useMemo(() => {
    if (!perfil) return "—";
    if (phActual >= perfil.ph_min && phActual <= perfil.ph_max) return "Óptimo";
    const dist = Math.min(Math.abs(phActual - perfil.ph_min), Math.abs(phActual - perfil.ph_max));
    if (dist <= 0.5) return "Bueno";
    return "Atención";
  }, [perfil, phActual]);

  const estadoTemp = useMemo(() => {
    if (!perfil) return "—";
    if (tempActual >= perfil.temp_min_c && tempActual <= perfil.temp_max_c) return "Óptimo";
    const dist = Math.min(Math.abs(tempActual - perfil.temp_min_c), Math.abs(tempActual - perfil.temp_max_c));
    if (dist <= 2) return "Bueno";
    return "Atención";
  }, [perfil, tempActual]);

  const getDiferencia = (estado: string) => estado; // reutilizamos badges existentes

  const getBarWidth = (actual: number, max: number) => `${(actual / max) * 100}%`;

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
            <h2 className="text-2xl font-bold text-foreground">{`${variedad || "Variedad"} - ${proceso || "Proceso"}`}</h2>
            <p className="text-muted-foreground">Fase: {fase || "N/D"}</p>
          </div>
          {variedad && <Badge className="text-base px-4 py-2">Variedad: {variedad}</Badge>}
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
                ${getDiferencia(estadoPh) === 'Óptimo' ? 'bg-[hsl(var(--status-optimal))]' : ''}
                ${getDiferencia(estadoPh) === 'Bueno' ? 'bg-[hsl(var(--status-good))]' : ''}
                ${getDiferencia(estadoPh) === 'Atención' ? 'bg-[hsl(var(--status-warning))]' : ''}
                text-white
              `}>
                {getDiferencia(estadoPh)}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Rango Ideal</span>
                <span className="text-2xl font-bold text-blue-600">{perfil ? `${perfil.ph_min} – ${perfil.ph_max}` : '—'}</span>
              </div>
              <div className="h-8 bg-blue-100 dark:bg-blue-950 rounded-xl overflow-hidden">
                <div 
                  className="h-full bg-blue-600 dark:bg-blue-400 flex items-center justify-end pr-4"
                  style={{ width: getBarWidth(perfil ? (perfil.ph_max) : 7, 7) }}
                >
                  <span className="text-white font-bold">{perfil ? `${perfil.ph_min}–${perfil.ph_max}` : '—'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Valor Actual</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">{phActual}</span>
                  {perfil && phActual > perfil.ph_max ? (
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              <div className="h-8 bg-blue-100 dark:bg-blue-950 rounded-xl overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-end pr-4"
                  style={{ width: getBarWidth(phActual, 7) }}
                >
                  <span className="text-white font-bold">{phActual}</span>
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
                ${getDiferencia(estadoTemp) === 'Óptimo' ? 'bg-[hsl(var(--status-optimal))]' : ''}
                ${getDiferencia(estadoTemp) === 'Bueno' ? 'bg-[hsl(var(--status-good))]' : ''}
                ${getDiferencia(estadoTemp) === 'Atención' ? 'bg-[hsl(var(--status-warning))]' : ''}
                text-white
              `}>
                {getDiferencia(estadoTemp)}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Rango Ideal</span>
                <span className="text-2xl font-bold text-orange-600">{perfil ? `${perfil.temp_min_c} – ${perfil.temp_max_c}°C` : '—'}</span>
              </div>
              <div className="h-8 bg-orange-100 dark:bg-orange-950 rounded-xl overflow-hidden">
                <div 
                  className="h-full bg-orange-600 dark:bg-orange-400 flex items-center justify-end pr-4"
                  style={{ width: getBarWidth(perfil ? perfil.temp_max_c : 40, 40) }}
                >
                  <span className="text-white font-bold">{perfil ? `${perfil.temp_min_c}–${perfil.temp_max_c}°C` : '—'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Temperatura Actual</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-orange-600">{tempActual}°C</span>
                  {perfil && tempActual > perfil.temp_max_c ? (
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              <div className="h-8 bg-orange-100 dark:bg-orange-950 rounded-xl overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-end pr-4"
                  style={{ width: getBarWidth(tempActual, 40) }}
                >
                  <span className="text-white font-bold">{tempActual}°C</span>
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
          {!perfil ? (
            <p>• No se encontró perfil ideal para la combinación seleccionada.</p>
          ) : (
            <>
              <p>• Mantén pH en rango {perfil.ph_min}–{perfil.ph_max}. Actual: {phActual}.</p>
              <p>• Mantén temperatura entre {perfil.temp_min_c}–{perfil.temp_max_c}°C. Actual: {tempActual}°C.</p>
              <p>• Repite mediciones cada 12 horas para un mejor seguimiento.</p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Comparativas;
