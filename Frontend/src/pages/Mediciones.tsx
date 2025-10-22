import { useState } from "react";
import { Thermometer, Droplet, Mic, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const Mediciones = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lote: "",
    fase: "",
    ph: "",
    temperatura: "",
    observaciones: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardado local simulado
    const params = new URLSearchParams({
      lote: formData.lote || "lote",
      ph: formData.ph || "0",
      temp: formData.temperatura || "0",
    });

    toast("Medición guardada", { description: "Tus datos se han registrado correctamente." });
    navigate(`/comparativas?${params.toString()}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Registrar Medición</h1>
        <p className="text-muted-foreground">Registra pH y temperatura de tus lotes</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-lg">Selecciona el Lote</Label>
              <Select value={formData.lote} onValueChange={(value) => setFormData({...formData, lote: value})}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Elige un lote" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Castillo - Tanque 1">Castillo - Tanque 1</SelectItem>
                  <SelectItem value="Caturra - Tanque 2">Caturra - Tanque 2</SelectItem>
                  <SelectItem value="Bourbon - Tanque 3">Bourbon - Tanque 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-lg">Fase de Fermentación</Label>
              <Select value={formData.fase} onValueChange={(value) => setFormData({...formData, fase: value})}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Selecciona fase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inicio">Inicio</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="fin">Fin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500 p-3 rounded-xl">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                <Label className="text-xl font-semibold">Nivel de pH</Label>
              </div>
              <Input
                type="number"
                step="0.1"
                placeholder="Ej: 4.5"
                className="h-14 text-2xl font-bold text-center"
                value={formData.ph}
                onChange={(e) => setFormData({...formData, ph: e.target.value})}
                required
              />
            </Card>

            <Card className="p-6 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-500 p-3 rounded-xl">
                  <Thermometer className="w-6 h-6 text-white" />
                </div>
                <Label className="text-xl font-semibold">Temperatura (°C)</Label>
              </div>
              <Input
                type="number"
                step="0.1"
                placeholder="Ej: 28.5"
                className="h-14 text-2xl font-bold text-center"
                value={formData.temperatura}
                onChange={(e) => setFormData({...formData, temperatura: e.target.value})}
                required
              />
            </Card>
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Observaciones</Label>
            <Textarea
              placeholder="Escribe tus observaciones sobre el lote..."
              className="min-h-32 text-base"
              value={formData.observaciones}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
            />
            <Button type="button" variant="outline" className="mt-2">
              <Mic className="w-4 h-4 mr-2" />
              Grabar Audio
            </Button>
          </div>

          <Button type="submit" size="lg" className="w-full text-lg py-6">
            <Plus className="w-5 h-5 mr-2" />
            Guardar Medición
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-primary/10 border-2 border-primary">
        <h3 className="font-semibold text-lg mb-2">💡 Recomendación Automática</h3>
        <p className="text-muted-foreground">
          Los valores ingresados se compararán automáticamente con los rangos ideales de la variedad seleccionada.
        </p>
      </Card>
    </div>
  );
};

export default Mediciones;
