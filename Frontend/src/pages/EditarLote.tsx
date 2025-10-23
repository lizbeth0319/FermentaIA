import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/api/http";
import { API } from "@/api/endpoints";

// Form alineado con backend
type LoteForm = {
  tanque_id: string;
  variedad: string;
  proceso: "Lavado" | "Honey" | "Natural" | string;
  fecha_inicio: string; // yyyy-mm-dd en el input
  horas_estimadas: string;
  cantidad_kg: string;
  estado: string;
  premium_porcentaje: string;
};

const initialForm: LoteForm = {
  tanque_id: "",
  variedad: "",
  proceso: "Lavado",
  fecha_inicio: "",
  horas_estimadas: "",
  cantidad_kg: "",
  estado: "En fermentación",
  premium_porcentaje: "",
};

const EditarLote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoteForm>(initialForm);
  const [tanques, setTanques] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!id) throw new Error("ID inválido");
        const lote: any = await apiFetch(API.lotes.byId(id));
        setFormData({
          tanque_id: lote?.tanque_id?._id || lote?.tanque_id || "",
          variedad: lote?.variedad ?? "",
          proceso: lote?.proceso ?? "Lavado",
          fecha_inicio: lote?.fecha_inicio ? new Date(lote.fecha_inicio).toISOString().slice(0, 10) : "",
          horas_estimadas: String(lote?.horas_estimadas ?? ""),
          cantidad_kg: String(lote?.cantidad_kg ?? ""),
          estado: lote?.estado ?? "En fermentación",
          premium_porcentaje: String(lote?.premium_porcentaje ?? ""),
        });

        // Cargar tanques para el select
        const tanquesResp: any[] = await apiFetch(API.tanques.list());
        setTanques(Array.isArray(tanquesResp) ? tanquesResp : []);
        setLoaded(true);
      } catch (error: any) {
        toast("No se pudo cargar el lote", { description: error?.message || "Error de red" });
        navigate("/lotes");
      }
    })();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      const payload = {
        tanque_id: formData.tanque_id,
        variedad: formData.variedad.trim(),
        proceso: formData.proceso,
        fecha_inicio: formData.fecha_inicio,
        horas_estimadas: Number(formData.horas_estimadas) || 0,
        cantidad_kg: Number(formData.cantidad_kg) || 0,
        estado: formData.estado,
        premium_porcentaje: formData.premium_porcentaje === "" ? 0 : Number(formData.premium_porcentaje),
      };
      await apiFetch(API.lotes.update(id), { method: "PUT", body: payload });
      toast("Cambios guardados", { description: `Lote actualizado correctamente.` });
      navigate("/lotes");
    } catch (error: any) {
      toast("Error al guardar", { description: error?.message || "No se pudo actualizar el lote" });
    }
  };

  if (!loaded) return (
    <div className="p-6"><div className="text-muted-foreground">Cargando lote...</div></div>
  );

  return (
    <div className="p-6">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Editar Lote</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tanque</Label>
            <select
              className="w-full border rounded-md p-2 bg-white"
              value={formData.tanque_id}
              onChange={(e) => setFormData({ ...formData, tanque_id: e.target.value })}
            >
              <option value="">Selecciona un tanque</option>
              {tanques.map((t: any) => (
                <option key={t._id} value={t._id}>{t.codigo_tanque} ({t.material}, {t.capacidad_kg} kg)</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Variedad</Label>
            <Input value={formData.variedad} onChange={(e) => setFormData({ ...formData, variedad: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Proceso</Label>
            <select
              className="w-full border rounded-md p-2 bg-white"
              value={formData.proceso}
              onChange={(e) => setFormData({ ...formData, proceso: e.target.value })}
            >
              <option>Lavado</option>
              <option>Honey</option>
              <option>Natural</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Fecha de inicio</Label>
            <Input type="date" value={formData.fecha_inicio} onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Horas estimadas</Label>
              <Input type="number" value={formData.horas_estimadas} onChange={(e) => setFormData({ ...formData, horas_estimadas: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Cantidad (kg)</Label>
              <Input type="number" value={formData.cantidad_kg} onChange={(e) => setFormData({ ...formData, cantidad_kg: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <select
              className="w-full border rounded-md p-2 bg-background"
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
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
            <Input type="number" value={formData.premium_porcentaje} onChange={(e) => setFormData({ ...formData, premium_porcentaje: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Guardar cambios</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/lotes")}>Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditarLote;