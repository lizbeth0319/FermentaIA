import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/api/http";
import { API } from "@/api/endpoints";

// Modelo simplificado alineado con backend
type FincaForm = {
  nombre_finca: string;
  departamento: string;
  municipio: string;
  vereda: string;
  direccion: string;
  nit: string;
  ciiu: string;
  altitud_ms_nm: string; // como string en el form
};

const initialForm: FincaForm = {
  nombre_finca: "",
  departamento: "",
  municipio: "",
  vereda: "",
  direccion: "",
  nit: "",
  ciiu: "",
  altitud_ms_nm: "",
};

const EditarFinca = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FincaForm>(initialForm);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id) {
      toast("ID inválido", { description: "No se proporcionó un identificador." });
      return;
    }
    (async () => {
      try {
        const finca: any = await apiFetch(API.fincas.byId(id));
        setFormData({
          nombre_finca: finca?.nombre_finca ?? "",
          departamento: finca?.departamento ?? "",
          municipio: finca?.municipio ?? "",
          vereda: finca?.vereda ?? "",
          direccion: finca?.direccion ?? "",
          nit: finca?.nit ?? "",
          ciiu: finca?.ciiu ?? "",
          altitud_ms_nm: String(finca?.altitud_ms_nm ?? ""),
        });
        setLoaded(true);
      } catch (error: any) {
        toast("No se pudo cargar la finca", { description: error?.message || "Error de red" });
        navigate("/fincas");
      }
    })();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const payload = {
        nombre_finca: formData.nombre_finca.trim(),
        departamento: formData.departamento.trim(),
        municipio: formData.municipio.trim(),
        vereda: formData.vereda.trim(),
        direccion: formData.direccion.trim(),
        nit: formData.nit.trim(),
        ciiu: formData.ciiu.trim(),
        altitud_ms_nm: Number(formData.altitud_ms_nm) || 0,
      };

      await apiFetch(API.fincas.update(id), { method: "PUT", body: payload });
      toast("Cambios guardados", { description: `${payload.nombre_finca} actualizado correctamente.` });
      navigate("/fincas");
    } catch (error: any) {
      toast("Error al guardar", { description: error?.message || "No se pudo actualizar la finca" });
    }
  };

  if (!loaded) return (
    <div className="p-6"><div className="text-muted-foreground">Cargando finca...</div></div>
  );

  return (
    <div className="p-6">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Editar Finca</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre de la Finca</Label>
            <Input value={formData.nombre_finca} onChange={(e) => setFormData({ ...formData, nombre_finca: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Input value={formData.departamento} onChange={(e) => setFormData({ ...formData, departamento: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Municipio</Label>
              <Input value={formData.municipio} onChange={(e) => setFormData({ ...formData, municipio: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Vereda</Label>
            <Input value={formData.vereda} onChange={(e) => setFormData({ ...formData, vereda: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Dirección</Label>
            <Input value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>NIT</Label>
              <Input value={formData.nit} onChange={(e) => setFormData({ ...formData, nit: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>CIIU</Label>
              <Input value={formData.ciiu} maxLength={3} onChange={(e) => setFormData({ ...formData, ciiu: e.target.value.replace(/\D/g, '').slice(0,3) })} />
            </div>
            <div className="space-y-2">
              <Label>Altitud (m.s.n.m)</Label>
              <Input type="number" value={formData.altitud_ms_nm} onChange={(e) => setFormData({ ...formData, altitud_ms_nm: e.target.value })} />
            </div>
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