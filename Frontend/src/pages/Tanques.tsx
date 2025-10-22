import { useEffect, useState } from "react";
import { Wine, Droplets, Plus, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/api/http";
import { API } from "@/api/endpoints";

const Tanques = () => {
  const [tanques, setTanques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fincas, setFincas] = useState([]);

  const [newTanque, setNewTanque] = useState({
    finca_id: "",
    codigo_tanque: "",
    capacidad_kg: "",
    material: ""
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Cargar tanques y fincas en paralelo
      const [tanquesData, fincasData] = await Promise.all([
        apiFetch(API.tanques.list()),
        apiFetch(API.fincas.list())
      ]);
      setTanques(tanquesData || []);
      setFincas(fincasData || []);
    } catch (error: any) {
      toast("Error al cargar datos", { 
        description: error.message || "No se pudieron cargar los datos" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const payload = {
        finca_id: newTanque.finca_id,
        codigo_tanque: newTanque.codigo_tanque,
        capacidad_kg: Number(newTanque.capacidad_kg) || 0,
        material: newTanque.material,
      };

      await apiFetch(API.tanques.create(), { method: "POST", body: payload });
      toast("Tanque creado", { description: `Código ${payload.codigo_tanque} agregado.` });

      setNewTanque({ finca_id: "", codigo_tanque: "", capacidad_kg: "", material: "" });
      setOpen(false);
      loadData(); // recargar lista
    } catch (error: any) {
      toast("Error al crear tanque", { description: error.message || "No se pudo crear el tanque" });
    }
  };

  const handleDelete = async (id: string) => {
    const tanque = tanques.find((t: any) => t._id === id);
    if (!tanque) return;
    const ok = window.confirm(`¿Eliminar "${tanque.codigo_tanque}"?`);
    if (!ok) return;
    try {
      await apiFetch(API.tanques.remove(id), { method: "DELETE" });
      toast("Tanque eliminado", { description: `Código ${tanque.codigo_tanque} eliminado.` });
      loadData();
    } catch (error: any) {
      toast("Error al eliminar tanque", { description: error.message || "No se pudo eliminar el tanque" });
    }
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
                <Label>Código del Tanque</Label>
                <Input
                  placeholder="Ej: TQ-001"
                  value={newTanque.codigo_tanque}
                  onChange={(e) => setNewTanque({ ...newTanque, codigo_tanque: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Finca</Label>
                <select
                  className="w-full border rounded-md px-3 py-2 bg-background"
                  value={newTanque.finca_id}
                  onChange={(e) => setNewTanque({ ...newTanque, finca_id: e.target.value })}
                >
                  <option value="">Seleccione una finca</option>
                  {fincas.map((finca: any) => (
                    <option key={finca._id} value={finca._id}>{finca.nombre_finca}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Capacidad (kg)</Label>
                <Input
                  type="number"
                  placeholder="Ej: 2000"
                  value={newTanque.capacidad_kg}
                  onChange={(e) => setNewTanque({ ...newTanque, capacidad_kg: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Material</Label>
                <Input
                  placeholder="Ej: Acero inoxidable"
                  value={newTanque.material}
                  onChange={(e) => setNewTanque({ ...newTanque, material: e.target.value })}
                />
              </div>
              <Button onClick={handleAdd} className="w-full">Guardar Tanque</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando tanques...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tanques.map((tanque: any) => {
            const finca = fincas.find((f: any) => f._id === tanque.finca_id);
            return (
              <Card key={tanque._id} className="p-6 hover:shadow-xl transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <Wine className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" asChild>
                        <Link to={`/tanques/${tanque._id}/editar`} aria-label="Editar tanque">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(tanque._id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground">{tanque.codigo_tanque}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                      <Droplets className="w-4 h-4" />
                      <span>{finca ? finca.nombre_finca : tanque.finca_id}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Material: {tanque.material}</p>
                    <p className="text-lg font-semibold text-primary mt-3">
                      Capacidad: {tanque.capacidad_kg} kg
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
       )}
     </div>
   );
};

export default Tanques;
