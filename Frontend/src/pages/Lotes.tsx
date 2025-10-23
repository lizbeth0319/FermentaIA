import { useEffect, useState } from "react";
import { Package, Calendar, Thermometer, Plus, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/api/http";
import { API } from "@/api/endpoints";
import { currentUserId } from "@/api/auth";

const Lotes = () => {
  const [lotes, setLotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tanques, setTanques] = useState<any[]>([]);
  const [fincas, setFincas] = useState<any[]>([]);

  const [newLote, setNewLote] = useState({
    tanque_id: "",
    variedad: "",
    proceso: "Lavado",
    fecha_inicio: "",
    horas_estimadas: "",
    cantidad_kg: "",
    estado: "En fermentación",
    premium_porcentaje: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const pid = currentUserId();
      if (pid) {
        // Usuario autenticado: cargar fincas -> tanques -> lotes del usuario
        const fincasResp: any[] = await apiFetch(API.fincas.byProductor(pid));
        setFincas(fincasResp || []);
        
        // Para cada finca del usuario, obtener sus tanques
        const tanquesPromises = (fincasResp || []).map((finca: any) => 
          apiFetch(API.tanques.byFinca(finca._id))
        );
        const tanquesLists = await Promise.allSettled(tanquesPromises);
        const tanquesFlat: any[] = tanquesLists
          .filter((r: any) => r.status === 'fulfilled')
          .flatMap((r: any) => r.value || []);
        setTanques(tanquesFlat || []);
        
        // Para cada tanque del usuario, obtener sus lotes
        const lotesPromises = (tanquesFlat || []).map((tanque: any) => 
          apiFetch(API.lotes.byTanque(tanque._id))
        );
        const lotesSettled = await Promise.allSettled(lotesPromises);
        const lotesFlat = lotesSettled
          .filter((r: any) => r.status === 'fulfilled')
          .flatMap((r: any) => r.value || []);
        setLotes(lotesFlat || []);
      } else {
        // Sin token: cargar todos (fallback)
        const [lotesResp, tanquesResp, fincasResp] = await Promise.all([
          apiFetch(API.lotes.list()),
          apiFetch(API.tanques.list()),
          apiFetch(API.fincas.list()),
        ]);
        setLotes(lotesResp || []);
        setTanques(tanquesResp || []);
        setFincas(fincasResp || []);
      }
    } catch (error: any) {
      toast("Error al cargar datos", { 
        description: error.message || "No se pudieron cargar lotes/tanques/fincas" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const horas = Number(newLote.horas_estimadas);
      const cantidad = Number(newLote.cantidad_kg);
      const premium = newLote.premium_porcentaje !== "" ? Number(newLote.premium_porcentaje) : 0;

      if (!newLote.tanque_id || !newLote.variedad?.trim() || !newLote.fecha_inicio) {
        toast("Datos incompletos", { description: "Selecciona tanque y completa variedad y fecha." });
        return;
      }
      if (!Number.isFinite(horas) || horas <= 0) {
        toast("Horas inválidas", { description: "Ingresa un número de horas mayor a 0." });
        return;
      }
      if (!Number.isFinite(cantidad) || cantidad <= 0) {
        toast("Cantidad inválida", { description: "Ingresa la cantidad en kg mayor a 0." });
        return;
      }
      if (!(premium >= 0 && premium <= 100)) {
        toast("Premium inválido", { description: "El porcentaje debe estar entre 0 y 100." });
        return;
      }

      const payload = {
        tanque_id: newLote.tanque_id,
        variedad: newLote.variedad.trim(),
        proceso: newLote.proceso,
        fecha_inicio: newLote.fecha_inicio,
        horas_estimadas: horas,
        cantidad_kg: cantidad,
        estado: newLote.estado,
        premium_porcentaje: premium,
      };

      await apiFetch(API.lotes.create(), { method: "POST", body: payload });
      toast("Lote creado", { description: `Lote en tanque ${payload.tanque_id} agregado.` });

      setNewLote({
        tanque_id: "",
        variedad: "",
        proceso: "Lavado",
        fecha_inicio: "",
        horas_estimadas: "",
        cantidad_kg: "",
        estado: "En fermentación",
        premium_porcentaje: "",
      });
      setOpen(false);
      loadData();
    } catch (error: any) {
      toast("Error al crear lote", { description: error.message || "No se pudo crear el lote" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const ok = window.confirm("¿Eliminar este lote?");
      if (!ok) return;
      await apiFetch(API.lotes.remove(id), { method: "DELETE" });
      toast("Lote eliminado", { description: `Lote ${id} fue eliminado.` });
      loadData();
    } catch (error: any) {
      toast("Error al eliminar lote", { description: error.message || "No se pudo eliminar el lote" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lotes</h1>
          <p className="text-muted-foreground">Administra tus lotes en fermentación</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Nuevo Lote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Lote</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Tanque</Label>
                <select
                  className="w-full border rounded-md p-2 bg-white"
                  value={newLote.tanque_id}
                  onChange={(e) => setNewLote({ ...newLote, tanque_id: e.target.value })}
                >
                  <option value="">Selecciona un tanque</option>
                  {tanques.map((t: any) => (
                    <option key={t._id} value={t._id}>
                      {t.codigo_tanque} ({t.material}, {t.capacidad_kg} kg)
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Variedad</Label>
                <Input
                  placeholder="Ej: Caturra"
                  value={newLote.variedad}
                  onChange={(e) => setNewLote({ ...newLote, variedad: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Proceso</Label>
                <select
                  className="w-full border rounded-md p-2 bg-white"
                  value={newLote.proceso}
                  onChange={(e) => setNewLote({ ...newLote, proceso: e.target.value })}
                >
                  <option>Lavado</option>
                  <option>Honey</option>
                  <option>Natural</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Fecha de inicio</Label>
                <Input
                  type="date"
                  value={newLote.fecha_inicio}
                  onChange={(e) => setNewLote({ ...newLote, fecha_inicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Horas estimadas</Label>
                <Input
                  type="number"
                  placeholder="Ej: 48"
                  value={newLote.horas_estimadas}
                  onChange={(e) => setNewLote({ ...newLote, horas_estimadas: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cantidad (kg)</Label>
                <Input
                  type="number"
                  placeholder="Ej: 500"
                  value={newLote.cantidad_kg}
                  onChange={(e) => setNewLote({ ...newLote, cantidad_kg: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <select
                  className="w-full border rounded-md p-2 bg-background"
                  value={newLote.estado}
                  onChange={(e) => setNewLote({ ...newLote, estado: e.target.value })}
                >
                  <option>En fermentación</option>
                  <option>Listo para lavado</option>
                  <option>Lavado</option>
                  <option>Secado</option>
                  <option>Completado</option>
                  <option>Descarte</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Premium (%)</Label>
                <Input
                  type="number"
                  placeholder="Ej: 10"
                  value={newLote.premium_porcentaje}
                  onChange={(e) => setNewLote({ ...newLote, premium_porcentaje: e.target.value })}
                />
              </div>
              <Button onClick={handleAdd} className="w-full">Guardar Lote</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Cargando lotes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotes.map((lote: any) => (
            <Card key={lote._id || lote.id} className="p-6 hover:shadow-xl transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" asChild>
                      <Link to={`/lotes/${lote._id || lote.id}/editar`} aria-label="Editar lote">
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(lote._id || lote.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground">{lote.variedad} - {lote.proceso}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <Calendar className="w-4 h-4" />
                    <span>{lote.fecha_inicio ? new Date(lote.fecha_inicio).toISOString().slice(0, 10) : lote.fecha}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Tanque: {lote.tanque_id?.codigo_tanque || lote.tanque || "N/D"}</p>
                  <p className="text-sm text-muted-foreground">Horas estimadas: {lote.horas_estimadas ?? "N/D"} h</p>
                  <p className="text-lg font-semibold text-primary mt-3">
                    {(lote.cantidad_kg ?? lote.cantidad) + " kg"} - {lote.estado}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lotes;
