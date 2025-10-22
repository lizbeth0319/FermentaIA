import { useEffect, useState } from "react";
import { Coffee, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const storageKey = "fincas";

const Fincas = () => {
  const [fincas, setFincas] = useState([
    { id: 1, nombre: "Finca El Paraíso", ubicacion: "Pitalito, Huila", area: 5 },
    { id: 2, nombre: "Finca La Esperanza", ubicacion: "Garzón, Huila", area: 3 },
  ]);

  const [newFinca, setNewFinca] = useState({ nombre: "", ubicacion: "", area: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setFincas(JSON.parse(saved));
      } else {
        localStorage.setItem(storageKey, JSON.stringify(fincas));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    const nextId = (fincas.reduce((m, f) => Math.max(m, f.id), 0) || 0) + 1;
    const nueva = {
      id: nextId,
      nombre: newFinca.nombre || `Finca ${nextId}`,
      ubicacion: newFinca.ubicacion || "Sin ubicación",
      area: Number(newFinca.area) || 0,
    };
    const next = [...fincas, nueva];
    setFincas(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    toast("Finca creada", { description: `${nueva.nombre} fue agregada.` });
    setNewFinca({ nombre: "", ubicacion: "", area: "" });
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    const finca = fincas.find((f) => f.id === id);
    if (!finca) return;
    const ok = window.confirm(`¿Eliminar "${finca.nombre}"?`);
    if (!ok) return;
    const next = fincas.filter((f) => f.id !== id);
    setFincas(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    toast("Finca eliminada", { description: `${finca.nombre} fue eliminada.` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Fincas</h1>
          <p className="text-muted-foreground">Administra tus fincas cafeteras</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Nueva Finca
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nueva Finca</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nombre de la Finca</Label>
                <Input
                  placeholder="Ej: Finca El Paraíso"
                  value={newFinca.nombre}
                  onChange={(e) => setNewFinca({...newFinca, nombre: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Input
                  placeholder="Ej: Pitalito, Huila"
                  value={newFinca.ubicacion}
                  onChange={(e) => setNewFinca({...newFinca, ubicacion: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Área (hectáreas)</Label>
                <Input
                  type="number"
                  placeholder="Ej: 5"
                  value={newFinca.area}
                  onChange={(e) => setNewFinca({...newFinca, area: e.target.value})}
                />
              </div>
              <Button onClick={handleAdd} className="w-full">Guardar Finca</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fincas.map((finca) => (
          <Card key={finca.id} className="p-6 hover:shadow-xl transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Coffee className="w-8 h-8 text-primary" />
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" asChild>
                    <Link to={`/fincas/${finca.id}/editar`} aria-label="Editar finca">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(finca.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-foreground">{finca.nombre}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{finca.ubicacion}</span>
                </div>
                <p className="text-lg font-semibold text-primary mt-3">
                  {finca.area} hectáreas
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Fincas;
