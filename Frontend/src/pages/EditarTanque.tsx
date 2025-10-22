import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

const storageKey = "tanques";

type Tanque = {
  id: number;
  nombre: string;
  finca: string;
  capacidad: number;
};

const EditarTanque = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: "", finca: "", capacidad: "" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const tanqueId = Number(id);
    if (!tanqueId) return;
    try {
      const saved = localStorage.getItem(storageKey);
      const list: Tanque[] = saved ? JSON.parse(saved) : [];
      const tanque = list.find((t) => t.id === tanqueId);
      if (!tanque) {
        toast("Tanque no encontrado", { description: "Volviendo al listado." });
        navigate("/tanques");
        return;
      }
      setFormData({
        nombre: tanque.nombre,
        finca: tanque.finca,
        capacidad: String(tanque.capacidad ?? ""),
      });
      setLoaded(true);
    } catch {
      toast("Error", { description: "No se pudo cargar el tanque." });
      navigate("/tanques");
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tanqueId = Number(id);
    try {
      const saved = localStorage.getItem(storageKey);
      const list: Tanque[] = saved ? JSON.parse(saved) : [];
      const idx = list.findIndex((t) => t.id === tanqueId);
      if (idx === -1) throw new Error("not-found");
      const updated: Tanque = {
        id: tanqueId,
        nombre: formData.nombre.trim(),
        finca: formData.finca.trim(),
        capacidad: Number(formData.capacidad) || 0,
      };
      const next = [...list];
      next[idx] = updated;
      localStorage.setItem(storageKey, JSON.stringify(next));
      toast("Cambios guardados", { description: `${updated.nombre} actualizado correctamente.` });
      navigate("/tanques");
    } catch {
      toast("Error", { description: "No se pudo guardar el tanque." });
    }
  };

  if (!loaded) return null;

  return (
    <div className="p-6">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Editar Tanque</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Finca</Label>
            <Input value={formData.finca} onChange={(e) => setFormData({ ...formData, finca: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Capacidad (litros)</Label>
            <Input type="number" value={formData.capacidad} onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })} />
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