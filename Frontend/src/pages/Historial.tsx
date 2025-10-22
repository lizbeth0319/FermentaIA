import { useEffect, useMemo, useState } from "react";
import { History, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/api/http";
import { API } from "@/api/endpoints";
import { toast } from "@/components/ui/sonner";

const Historial = () => {
  const navigate = useNavigate();
  const [mediciones, setMediciones] = useState<any[]>([]);
  const [lotes, setLotes] = useState<any[]>([]);
  const [tanques, setTanques] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [meds, lots, tans] = await Promise.all([
          apiFetch<any[]>(API.mediciones.list()),
          apiFetch<any[]>(API.lotes.list()),
          apiFetch<any[]>(API.tanques.list()),
        ]);
        setMediciones(meds || []);
        setLotes(lots || []);
        setTanques(tans || []);
      } catch (error: any) {
        toast("Error al cargar historial", { description: error.message || "No se pudo cargar" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tanquesById = useMemo(() => {
    const map: Record<string, any> = {};
    tanques.forEach((t: any) => {
      map[t._id || t.id] = t;
    });
    return map;
  }, [tanques]);

  const lotesById = useMemo(() => {
    const map: Record<string, any> = {};
    lotes.forEach((l: any) => {
      map[l._id || l.id] = l;
    });
    return map;
  }, [lotes]);

  const getEstadoStyles = (estado: string) => {
    const styles: Record<string, string> = {
      "Óptimo": "bg-[hsl(var(--status-optimal))] text-white",
      "Bueno": "bg-[hsl(var(--status-good))] text-white",
      "Atención": "bg-[hsl(var(--status-warning))] text-white",
      "—": "bg-gray-500 text-white",
    };
    return styles[estado] || "bg-gray-500 text-white";
  };

  const faseLabel = (f: string) => (f === "medio" ? "Media" : f === "final" ? "Fin" : "Inicio");

  const computeEstado = async (m: any) => {
    try {
      const lote = lotesById[m.lote];
      if (!lote) return "—";
      const fasePerfil = m.fase === "medio" ? "media" : m.fase; // backend perfiles usa 'media'
      const perfil = await apiFetch<any>(API.perfiles.buscar({ variedad: lote.variedad, proceso: lote.proceso, fase: fasePerfil }));
      if (!perfil) return "—";
      const inPh = m.ph >= perfil.ph_min && m.ph <= perfil.ph_max;
      const inTemp = m.temperatura >= perfil.temp_min_c && m.temperatura <= perfil.temp_max_c;
      if (inPh && inTemp) return "Óptimo";
      const phDist = Math.min(Math.abs(m.ph - perfil.ph_min), Math.abs(m.ph - perfil.ph_max));
      const tDist = Math.min(Math.abs(m.temperatura - perfil.temp_min_c), Math.abs(m.temperatura - perfil.temp_max_c));
      if (phDist <= 0.5 || tDist <= 2) return "Bueno";
      return "Atención";
    } catch {
      return "—";
    }
  };

  const verComparativa = (m: any) => {
    const lote = lotesById[m.lote];
    const params = new URLSearchParams({
      loteId: String(m.lote),
      variedad: lote?.variedad || "",
      proceso: lote?.proceso || "",
      fase: m.fase === "medio" ? "media" : m.fase,
      ph: String(m.ph),
      temp: String(m.temperatura),
    });
    navigate(`/comparativas?${params.toString()}`);
  };

  const [estadosCache, setEstadosCache] = useState<Record<string, string>>({});
  useEffect(() => {
    const run = async () => {
      const entries: Record<string, string> = {};
      for (const m of mediciones) {
        const id = m._id || m.id;
        entries[id] = await computeEstado(m);
      }
      setEstadosCache(entries);
    };
    if (mediciones.length && lotes.length) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediciones, lotes]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <History className="w-8 h-8" />
          Historial de Mediciones
        </h1>
        <p className="text-muted-foreground">Revisa todas tus mediciones registradas</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Cargando historial...</div>
      ) : (
        <div className="space-y-4">
          {mediciones.map((medicion) => {
            const id = medicion._id || medicion.id;
            const lote = lotesById[medicion.lote];
            const tanque = lote ? tanquesById[lote.tanque_id?._id || lote.tanque_id] : null;
            const loteLabel = lote ? `${lote.variedad} - ${lote.proceso}${tanque?.codigo_tanque ? ` (Tanque ${tanque.codigo_tanque})` : ""}` : `Lote ${medicion.lote}`;
            return (
              <Card key={id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-foreground">{loteLabel}</h3>
                      <Badge className={getEstadoStyles(estadosCache[id] || "—")}>
                        {estadosCache[id] || "—"}
                      </Badge>
                      <Badge variant="outline">{faseLabel(medicion.fase)}</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{new Date(medicion.timestamp || medicion.createdAt).toLocaleString()}</p>

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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Historial;
