import { useEffect, useState } from "react";
import { Wine, Droplets, Plus, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const storageKey = "tanques";

const Tanques = () => {
  const [tanques, setTanques] = useState([
    { id: 1, nombre: "Tanque 1", finca: "Finca El Paraíso", capacidad: 2000 },
    { id: 2, nombre: "Tanque 2", finca: "Finca La Esperanza", capacidad: 1500 },
  ]);

  const [newTanque, setNewTanque] = useState({ nombre: "", finca: "", capacidad: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setTanques(JSON.parse(saved));
      } else {
        localStorage.setItem(storageKey, JSON.stringify(tanques));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    const nextId = (tanques.reduce((m, t) => Math.max(m, t.id), 0) || 0) + 1;
    const nuevo = {
      id: nextId,
      nombre: newTanque.nombre || `Tanque ${nextId}`,
      finca: newTanque.finca || "Sin finca",
      capacidad: Number(newTanque.capacidad) || 0,
    };
    const next = [...tanques, nuevo];
    setTanques(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    toast("Tanque creado", { description: `${nuevo.nombre} fue agregado.` });
    setNewTanque({ nombre: "", finca: "", capacidad: "" });
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    const tanque = tanques.find((t) => t.id === id);
    if (!tanque) return;
    const ok = window.confirm(`¿Eliminar "${tanque.nombre}"?`);
    if (!ok) return;
    const next = tanques.filter((t) => t.id !== id);
    setTanques(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    toast("Tanque eliminado", { description: `${tanque.nombre} fue eliminado.` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tanques de Fermentación</h1>
          <p className="text-muted-foreground">Administra tus tanques y capacidades</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Nuevo Tanque
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Tanque</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nombre del Tanque</Label>
                <Input
                  placeholder="Ej: Tanque 1"
                  value={newTanque.nombre}
                  onChange={(e) => setNewTanque({ ...newTanque, nombre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Finca</Label>
                <Input
                  placeholder="Ej: Finca El Paraíso"
                  value={newTanque.finca}
                  onChange={(e) => setNewTanque({ ...newTanque, finca: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Capacidad (litros)</Label>
                <Input
                  type="number"
                  placeholder="Ej: 2000"
                  value={newTanque.capacidad}
                  onChange={(e) => setNewTanque({ ...newTanque, capacidad: e.target.value })}
                />
              </div>
              <Button onClick={handleAdd} className="w-full">Guardar Tanque</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tanques.map((tanque) => (
          <Card key={tanque.id} className="p-6 hover:shadow-xl transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Wine className="w-8 h-8 text-primary" />
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" asChild>
                    <Link to={`/tanques/${tanque.id}/editar`} aria-label="Editar tanque">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(tanque.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground">{tanque.nombre}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <Droplets className="w-4 h-4" />
                  <span>{tanque.finca}</span>
                </div>
                <p className="text-lg font-semibold text-primary mt-3">
                  {tanque.capacidad} litros
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tanques;
