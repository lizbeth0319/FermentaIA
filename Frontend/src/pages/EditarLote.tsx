import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

const storageKey = "lotes";

type Lote = {
  id: number;
  tanque: string;
  variedad: string;
  proceso: string;
  fecha: string;
  cantidad: number;
  estado: string;
};

const EditarLote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ tanque: "", variedad: "", proceso: "", fecha: "", cantidad: "", estado: "" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loteId = Number(id);
    if (!loteId) return;
    try {
      const saved = localStorage.getItem(storageKey);
      const list: Lote[] = saved ? JSON.parse(saved) : [];
      const lote = list.find((l) => l.id === loteId);
      if (!lote) {
        toast("Lote no encontrado", { description: "Volviendo al listado." });
        navigate("/lotes");
        return;
      }
      setFormData({
        tanque: lote.tanque,
        variedad: lote.variedad,
        proceso: lote.proceso,
        fecha: lote.fecha,
        cantidad: String(lote.cantidad ?? ""),
        estado: lote.estado,
      });
      setLoaded(true);
    } catch {
      toast("Error", { description: "No se pudo cargar el lote." });
      navigate("/lotes");
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loteId = Number(id);
    try {
      const saved = localStorage.getItem(storageKey);
      const list: Lote[] = saved ? JSON.parse(saved) : [];
      const idx = list.findIndex((l) => l.id === loteId);
      if (idx === -1) throw new Error("not-found");
      const updated: Lote = {
        id: loteId,
        tanque: formData.tanque.trim(),
        variedad: formData.variedad.trim(),
        proceso: formData.proceso.trim(),
        fecha: formData.fecha,
        cantidad: Number(formData.cantidad) || 0,
        estado: formData.estado.trim(),
      };
      const next = [...list];
      next[idx] = updated;
      localStorage.setItem(storageKey, JSON.stringify(next));
      toast("Cambios guardados", { description: `Lote actualizado correctamente.` });
      navigate("/lotes");
    } catch {
      toast("Error", { description: "No se pudo guardar el lote." });
    }
  };

  if (!loaded) return null;

  return (
    <div className="p-6">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Editar Lote</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tanque</Label>
            <Input value={formData.tanque} onChange={(e) => setFormData({ ...formData, tanque: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Variedad</Label>
            <Input value={formData.variedad} onChange={(e) => setFormData({ ...formData, variedad: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Proceso</Label>
            <Input value={formData.proceso} onChange={(e) => setFormData({ ...formData, proceso: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Cantidad (kg)</Label>
            <Input type="number" value={formData.cantidad} onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Input value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} />
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