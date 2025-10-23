import { useEffect, useState } from "react";
import { Coffee, MapPin, Plus, Edit, Trash2 } from "lucide-react";
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

const Fincas = () => {
  const [fincas, setFincas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newFinca, setNewFinca] = useState({ 
    nombre: "", departamento: "", municipio: "", vereda: "", 
    direccion: "", area: "", altitud: "", nit: "", ciiu: "" 
  });
  const [open, setOpen] = useState(false);

  // Normaliza CIIU a exactamente 3 dígitos
  const normalizeCIIU = (s: string) => {
    const digits = (s || "").replace(/\D/g, "");
    if (digits.length === 4 && digits.startsWith("0")) return digits.slice(1);
    if (digits.length > 3) return digits.slice(0, 3);
    return digits.padStart(3, "0");
  };

  useEffect(() => {
    loadFincas();
  }, []);

  const loadFincas = async () => {
    try {
      setLoading(true);
      const pid = currentUserId();
      if (pid) {
        // Usuario autenticado: cargar solo sus fincas
        try {
          const data = await apiFetch(API.fincas.byProductor(pid));
          setFincas(Array.isArray(data) ? data : []);
        } catch (err: any) {
          // Backend devuelve 404 cuando no hay fincas: tratar como lista vacía
          if (err?.status === 404) {
            setFincas([]);
          } else {
            throw err;
          }
        }
      } else {
        // Sin token: cargar todas (fallback)
        const data = await apiFetch(API.fincas.list());
        setFincas(Array.isArray(data) ? data : []);
      }
    } catch (error: any) {
      toast("Error al cargar fincas", { 
        description: error.message || "No se pudieron cargar las fincas" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const pid = currentUserId();
      if (!pid) {
        toast("No autenticado", { description: "Inicia sesión para crear fincas" });
        return;
      }

      const required = {
        nombre: newFinca.nombre?.trim(),
        departamento: newFinca.departamento?.trim(),
        municipio: newFinca.municipio?.trim(),
        vereda: newFinca.vereda?.trim(),
        direccion: newFinca.direccion?.trim(),
        nit: newFinca.nit?.trim(),
        ciiu: newFinca.ciiu?.trim(),
      } as const;

      if (!required.nombre || !required.departamento || !required.municipio || !required.vereda || !required.direccion || !required.nit || !required.ciiu) {
        toast("Campos requeridos", { description: "Completa nombre, departamento, municipio, vereda, dirección, NIT y CIIU." });
        return;
      }

      const alt = Number(newFinca.altitud);
      if (!Number.isFinite(alt) || alt < 0 || alt > 5000) {
        toast("Altitud inválida", { description: "Ingresa un valor entre 0 y 5000 m.s.n.m." });
        return;
      }

      const ciiuNorm = normalizeCIIU(newFinca.ciiu);

      const fincaData = {
        productor_id: pid,
        nombre_finca: required.nombre,
        departamento: required.departamento,
        municipio: required.municipio,
        vereda: required.vereda,
        direccion: required.direccion,
        altitud_ms_nm: alt,
        nit: required.nit,
        ciiu: ciiuNorm
      };
      
      await apiFetch(API.fincas.create(), {
        method: "POST",
        body: fincaData
      });
      
      toast("Finca creada", { description: `${fincaData.nombre_finca} fue agregada.` });
      setNewFinca({ 
        nombre: "", departamento: "", municipio: "", vereda: "", 
        direccion: "", area: "", altitud: "", nit: "", ciiu: "" 
      });
      setOpen(false);
      loadFincas(); // Recargar la lista
    } catch (error: any) {
      toast("Error al crear finca", { 
        description: error.message || "No se pudo crear la finca" 
      });
    }
  };

  const handleDelete = async (id: string) => {
    const finca = fincas.find((f) => f._id === id);
    if (!finca) return;
    const ok = window.confirm(`¿Eliminar "${finca.nombre_finca}"?`);
    if (!ok) return;
    
    try {
      await apiFetch(API.fincas.remove(id), { method: "DELETE" });
      toast("Finca eliminada", { description: `${finca.nombre_finca} fue eliminada.` });
      loadFincas(); // Recargar la lista
    } catch (error: any) {
      toast("Error al eliminar finca", { 
        description: error.message || "No se pudo eliminar la finca" 
      });
    }
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
            <div className="space-y-4 pt-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label>Nombre de la Finca</Label>
                <Input
                  placeholder="Ej: Finca El Paraíso"
                  value={newFinca.nombre}
                  onChange={(e) => setNewFinca({...newFinca, nombre: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Input
                    placeholder="Ej: Huila"
                    value={newFinca.departamento}
                    onChange={(e) => setNewFinca({...newFinca, departamento: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Municipio</Label>
                  <Input
                    placeholder="Ej: Pitalito"
                    value={newFinca.municipio}
                    onChange={(e) => setNewFinca({...newFinca, municipio: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Vereda</Label>
                <Input
                  placeholder="Ej: La Esperanza"
                  value={newFinca.vereda}
                  onChange={(e) => setNewFinca({...newFinca, vereda: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input
                  placeholder="Ej: Km 5 vía Pitalito - San Agustín"
                  value={newFinca.direccion}
                  onChange={(e) => setNewFinca({...newFinca, direccion: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Altitud (m.s.n.m)</Label>
                <Input
                  type="number"
                  placeholder="Ej: 1500"
                  value={newFinca.altitud}
                  onChange={(e) => setNewFinca({...newFinca, altitud: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>NIT</Label>
                  <Input
                    placeholder="Ej: 123456789-0"
                    value={newFinca.nit}
                    onChange={(e) => setNewFinca({...newFinca, nit: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CIIU</Label>
                  <Input
                    placeholder="Ej: 141"
                    maxLength={3}
                    value={newFinca.ciiu}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
                      setNewFinca({ ...newFinca, ciiu: digits });
                    }}
                  />
                </div>
              </div>
              <Button onClick={handleAdd} className="w-full">Guardar Finca</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando fincas...</p>
          </div>
        </div>
      ) : (
        fincas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aún no tienes fincas registradas.</p>
            <Button className="mt-4" onClick={() => setOpen(true)}>Registrar primera finca</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fincas.map((finca) => (
              <Card key={finca._id} className="p-6 hover:shadow-xl transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <Coffee className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" asChild>
                        <Link to={`/fincas/${finca._id}/editar`} aria-label="Editar finca">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(finca._id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{finca.nombre_finca}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>{finca.municipio}, {finca.departamento}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {finca.vereda && `${finca.vereda} - `}{finca.direccion}
                    </p>
                    <p className="text-lg font-semibold text-primary mt-3">
                      Altitud: {finca.altitud_ms_nm} m.s.n.m
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Fincas;
