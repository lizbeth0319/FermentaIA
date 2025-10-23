import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/api/http";
import { API } from "@/api/endpoints";
import { currentUserId } from "@/api/auth";

// Form alineado con backend
type TanqueForm = {
  finca_id: string;
  codigo_tanque: string;
  capacidad_kg: string; // como string en el form
  material: string;
};

const initialForm: TanqueForm = {
  finca_id: "",
  codigo_tanque: "",
  capacidad_kg: "",
  material: "",
};

const EditarTanque = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TanqueForm>(initialForm);
  const [fincas, setFincas] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Cargar tanque
        if (!id) throw new Error("ID inválido");
        const tanque: any = await apiFetch(API.tanques.byId(id));
        setFormData({
          finca_id: tanque?.finca_id ?? "",
          codigo_tanque: tanque?.codigo_tanque ?? "",
          capacidad_kg: String(tanque?.capacidad_kg ?? ""),
          material: tanque?.material ?? "",
        });

        // Cargar fincas para el select
        const pid = currentUserId();
        const fincasResp: any[] = pid
          ? await apiFetch(API.fincas.byProductor(pid))
          : await apiFetch(API.fincas.list());
        setFincas(Array.isArray(fincasResp) ? fincasResp : []);
        setLoaded(true);
      } catch (error: any) {
        toast("No se pudo cargar el tanque", { description: error?.message || "Error de red" });
        navigate("/tanques");
      }
    })();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      const payload = {
        finca_id: formData.finca_id,
        codigo_tanque: formData.codigo_tanque.trim(),
        capacidad_kg: Number(formData.capacidad_kg) || 0,
        material: formData.material.trim(),
      };
      await apiFetch(API.tanques.update(id), { method: "PUT", body: payload });
      toast("Cambios guardados", { description: `Tanque ${payload.codigo_tanque} actualizado.` });
      navigate("/tanques");
    } catch (error: any) {
      toast("Error al guardar", { description: error?.message || "No se pudo actualizar el tanque" });
    }
  };

  if (!loaded) return (
    <div className="p-6"><div className="text-muted-foreground">Cargando tanque...</div></div>
  );

  return (
    <div className="p-6">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Editar Tanque</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Código del Tanque</Label>
            <Input value={formData.codigo_tanque} onChange={(e) => setFormData({ ...formData, codigo_tanque: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Finca</Label>
            <select
              className="w-full border rounded-md px-3 py-2 bg-white"
              value={formData.finca_id}
              onChange={(e) => setFormData({ ...formData, finca_id: e.target.value })}
            >
              <option value="">Seleccione una finca</option>
              {fincas.map((f: any) => (
                <option key={f._id} value={f._id}>{f.nombre_finca}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Capacidad (kg)</Label>
            <Input type="number" value={formData.capacidad_kg} onChange={(e) => setFormData({ ...formData, capacidad_kg: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Material</Label>
            <Input value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Guardar cambios</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/tanques")}>Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditarTanque;