import { Coffee } from "lucide-react";
import { Card } from "@/components/ui/card";

const Variedades = () => {
  const variedades = [
    { nombre: "Castillo", ph: 4.2, temperatura: 28, descripcion: "Variedad resistente a enfermedades, muy productiva" },
    { nombre: "Caturra", ph: 4.5, temperatura: 25, descripcion: "Alta calidad en taza, tamaño compacto" },
    { nombre: "Bourbon", ph: 4.3, temperatura: 27, descripcion: "Excelente calidad, sabor dulce y complejo" },
    { nombre: "Típica", ph: 4.4, temperatura: 26, descripcion: "Variedad clásica, calidad excepcional" },
    { nombre: "Colombia", ph: 4.2, temperatura: 28, descripcion: "Resistente a roya, buena productividad" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Coffee className="w-8 h-8" />
          Variedades de Café
        </h1>
        <p className="text-muted-foreground">Conoce las características ideales de cada variedad</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {variedades.map((variedad) => (
          <Card key={variedad.nombre} className="p-6 hover:shadow-xl transition-all hover:scale-105">
            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-xl text-center">
                <Coffee className="w-12 h-12 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">{variedad.nombre}</h3>
              </div>

              <p className="text-muted-foreground text-center">{variedad.descripcion}</p>

              <div className="space-y-3 pt-2">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">pH Ideal</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{variedad.ph}</span>
                    <div className="h-2 flex-1 ml-4 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 dark:bg-blue-400 rounded-full" 
                        style={{ width: `${(variedad.ph / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Temperatura Ideal</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">{variedad.temperatura}°C</span>
                    <div className="h-2 flex-1 ml-4 bg-orange-200 dark:bg-orange-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-600 dark:bg-orange-400 rounded-full" 
                        style={{ width: `${(variedad.temperatura / 35) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Variedades;
