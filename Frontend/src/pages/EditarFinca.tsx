import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

const storageKey = "fincas";

type Finca = {
  id: number;
  nombre: string;
  ubicacion: string;
  area: number;
};

const EditarFinca = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: "", ubicacion: "", area: "" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fincaId = Number(id);
    if (!fincaId) return;
    try {
      const saved = localStorage.getItem(storageKey);
      const list: Finca[] = saved ? JSON.parse(saved) : [];
      const finca = list.find((f) => f.id === fincaId);
      if (!finca) {
        toast("Finca no encontrada", { description: "Volviendo al listado." });
        navigate("/fincas");
        return;
      }
      setFormData({
        nombre: finca.nombre,
        ubicacion: finca.ubicacion,
        area: String(finca.area ?? ""),
      });
      setLoaded(true);
    } catch {
      toast("Error", { description: "No se pudo cargar la finca." });
      navigate("/fincas");
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fincaId = Number(id);
    try {
      const saved = localStorage.getItem(storageKey);
      const list: Finca[] = saved ? JSON.parse(saved) : [];
      const idx = list.findIndex((f) => f.id === fincaId);
      if (idx === -1) throw new Error("not-found");
      const updated: Finca = {
        id: fincaId,
        nombre: formData.nombre.trim(),
        ubicacion: formData.ubicacion.trim(),
        area: Number(formData.area) || 0,
      };
      const next = [...list];
      next[idx] = updated;
      localStorage.setItem(storageKey, JSON.stringify(next));
      toast("Cambios guardados", { description: `${updated.nombre} actualizado correctamente.` });
      navigate("/fincas");
    } catch {
      toast("Error", { description: "No se pudo guardar la finca." });
    }
  };

  if (!loaded) return null;

  return (
    <div className="p-6">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Editar Finca</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Ubicación</Label>
            <Input value={formData.ubicacion} onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Área (hectáreas)</Label>
            <Input type="number" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Guardar cambios</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/fincas")}>Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditarFinca;