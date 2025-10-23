import { useEffect, useState } from "react";
import { Thermometer, Droplet, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/api/http";
import { API } from "@/api/endpoints";
import { currentUserId } from "@/api/auth";

const Mediciones = () => {
  const navigate = useNavigate();
  const [lotes, setLotes] = useState<any[]>([]);
  const [loadingLotes, setLoadingLotes] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    lote: "",
    fase: "",
    ph: "",
    temperatura: "",
    observaciones: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingLotes(true);
        const userId = currentUserId();
        
        if (userId) {
          // Usuario autenticado: cargar solo sus lotes
          const [userFincas, allLotes, allTanques] = await Promise.all([
            apiFetch<any[]>(API.fincas.byProductor(userId)),
            apiFetch<any[]>(API.lotes.list()),
            apiFetch<any[]>(API.tanques.list()),
          ]);
          
          // Obtener IDs de fincas del usuario
          const userFincaIds = (userFincas || []).map(f => f._id || f.id);
          
          // Filtrar tanques que pertenecen a las fincas del usuario
          const userTanques = (allTanques || []).filter(t => 
            userFincaIds.includes(t.finca_id?._id || t.finca_id)
          );
          const userTanqueIds = userTanques.map(t => t._id || t.id);
          
          // Filtrar lotes que pertenecen a los tanques del usuario
          const userLotes = (allLotes || []).filter(l => 
            userTanqueIds.includes(l.tanque_id?._id || l.tanque_id)
          );
          
          setLotes(userLotes);
        } else {
          // Sin usuario autenticado: cargar todos los lotes (fallback)
          const lotesResp = await apiFetch<any[]>(API.lotes.list());
          setLotes(lotesResp || []);
        }
      } catch (error: any) {
        toast("Error al cargar lotes", { description: error.message || "No se pudieron cargar los lotes" });
      } finally {
        setLoadingLotes(false);
      }
    };
    load();
  }, []);

  const mapFaseToBackend = (fase: string) => {
    // Backend espera: 'inicio' | 'medio' | 'final'
    if (fase === "media") return "medio";
    if (fase === "fin") return "final";
    return fase; // "inicio" mantiene igual
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.lote) {
        toast("Selecciona un lote", { description: "Debes elegir un lote para guardar" });
        return;
      }

      const selectedLote = lotes.find((l) => (l._id || l.id) === formData.lote);

      const payload = {
        lote_id: formData.lote,
        fase: mapFaseToBackend(formData.fase),
        temperatura_c: Number(formData.temperatura),
        ph: Number(formData.ph),
        texto_voz: formData.observaciones,
      };

      await apiFetch(API.mediciones.create(), { method: "POST", body: payload });

      toast("Medición guardada", { description: "Tus datos se han registrado correctamente." });

      // Navegamos a Comparativas con datos suficientes para buscar perfil
      const params = new URLSearchParams({
        loteId: String(formData.lote),
        variedad: selectedLote?.variedad || "",
        proceso: selectedLote?.proceso || "",
        fase: mapFaseToBackend(formData.fase),
        ph: formData.ph || "0",
        temp: formData.temperatura || "0",
      });
      navigate(`/comparativas?${params.toString()}`);
    } catch (error: any) {
      toast("Error al guardar medición", { description: error.message || "No se pudo guardar la medición" });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Registrar Medición</h1>
        <p className="text-muted-foreground">Registra pH y temperatura de tus lotes</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-lg">Selecciona el Lote</Label>
              <Select value={formData.lote} onValueChange={(value) => setFormData({...formData, lote: value})}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={loadingLotes ? "Cargando lotes..." : "Elige un lote"} />
                </SelectTrigger>
                <SelectContent>
                  {lotes.map((l: any) => (
                    <SelectItem key={l._id || l.id} value={String(l._id || l.id)}>
                      {`${l.variedad} - ${l.proceso}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-lg">Fase de Fermentación</Label>
              <Select value={formData.fase} onValueChange={(value) => setFormData({...formData, fase: value})}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Selecciona fase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inicio">Inicio</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="fin">Fin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500 p-3 rounded-xl">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                <Label className="text-xl font-semibold">Nivel de pH</Label>
              </div>
              <Input
                type="number"
                step="0.1"
                placeholder="Ej: 4.5"
                className="h-14 text-2xl font-bold text-center"
                value={formData.ph}
                onChange={(e) => setFormData({...formData, ph: e.target.value})}
                required
              />
            </Card>

            <Card className="p-6 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-500 p-3 rounded-xl">
                  <Thermometer className="w-6 h-6 text-white" />
                </div>
                <Label className="text-xl font-semibold">Temperatura (°C)</Label>
              </div>
              <Input
                type="number"
                step="0.1"
                placeholder="Ej: 28.5"
                className="h-14 text-2xl font-bold text-center"
                value={formData.temperatura}
                onChange={(e) => setFormData({...formData, temperatura: e.target.value})}
                required
              />
            </Card>
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Observaciones</Label>
            <Textarea
              placeholder="Escribe tus observaciones sobre el lote..."
              className="min-h-32 text-base"
              value={formData.observaciones}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
            />
            {/* Botón de grabar audio eliminado */}
          </div>

          <Button type="submit" size="lg" className="w-full text-lg py-6">
            <Plus className="w-5 h-5 mr-2" />
            Guardar Medición
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-primary/10 border-2 border-primary">
        <h3 className="font-semibold text-lg mb-2">💡 Recomendación Automática</h3>
        <p className="text-muted-foreground">
          Los valores ingresados se compararán automáticamente con los rangos ideales de la variedad seleccionada.
        </p>
      </Card>
    </div>
  );
};

export default Mediciones;
