import { useEffect, useState } from "react";
import { Package, Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const storageKey = "lotes";

const Lotes = () => {
  const [lotes, setLotes] = useState([
    { id: 1, tanque: "Tanque 1", variedad: "Caturra", proceso: "Lavado", fecha: "2024-10-01", cantidad: 500, estado: "En fermentación" },
    { id: 2, tanque: "Tanque 2", variedad: "Bourbon", proceso: "Honey", fecha: "2024-10-05", cantidad: 300, estado: "En reposo" },
  ]);

  const [newLote, setNewLote] = useState({ tanque: "", variedad: "", proceso: "", fecha: "", cantidad: "", estado: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setLotes(JSON.parse(saved));
      } else {
        localStorage.setItem(storageKey, JSON.stringify(lotes));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    const nextId = (lotes.reduce((m, l) => Math.max(m, l.id), 0) || 0) + 1;
    const nuevo = {
      id: nextId,
      tanque: newLote.tanque || `Tanque ${nextId}`,
      variedad: newLote.variedad || "Sin variedad",
      proceso: newLote.proceso || "Sin proceso",
      fecha: newLote.fecha || new Date().toISOString().slice(0, 10),
      cantidad: Number(newLote.cantidad) || 0,
      estado: newLote.estado || "Pendiente",
    };
    const next = [...lotes, nuevo];
    setLotes(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    toast("Lote creado", { description: `Lote en ${nuevo.tanque} fue agregado.` });
    setNewLote({ tanque: "", variedad: "", proceso: "", fecha: "", cantidad: "", estado: "" });
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    const lote = lotes.find((l) => l.id === id);
    if (!lote) return;
    const ok = window.confirm(`¿Eliminar lote del ${lote.tanque}?`);
    if (!ok) return;
    const next = lotes.filter((l) => l.id !== id);
    setLotes(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    toast("Lote eliminado", { description: `Lote de ${lote.tanque} fue eliminado.` });
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
                <Input
                  placeholder="Ej: Tanque 1"
                  value={newLote.tanque}
                  onChange={(e) => setNewLote({ ...newLote, tanque: e.target.value })}
                />
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
                <Input
                  placeholder="Ej: Lavado"
                  value={newLote.proceso}
                  onChange={(e) => setNewLote({ ...newLote, proceso: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={newLote.fecha}
                  onChange={(e) => setNewLote({ ...newLote, fecha: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cantidad (kg)</Label>
                <Input
                  type="number"
                  placeholder="Ej: 500"
                  value={newLote.cantidad}
                  onChange={(e) => setNewLote({ ...newLote, cantidad: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input
                  placeholder="Ej: En fermentación"
                  value={newLote.estado}
                  onChange={(e) => setNewLote({ ...newLote, estado: e.target.value })}
                />
              </div>
              <Button onClick={handleAdd} className="w-full">Guardar Lote</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lotes.map((lote) => (
          <Card key={lote.id} className="p-6 hover:shadow-xl transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" asChild>
                    <Link to={`/lotes/${lote.id}/editar`} aria-label="Editar lote">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(lote.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground">{lote.variedad} - {lote.proceso}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <Calendar className="w-4 h-4" />
                  <span>{lote.fecha}</span>
                </div>
                <p className="text-sm text-muted-foreground">Tanque: {lote.tanque}</p>
                <p className="text-lg font-semibold text-primary mt-3">
                  {lote.cantidad} kg - {lote.estado}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Lotes;
