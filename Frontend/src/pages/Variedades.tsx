import { Coffee } from "lucide-react";
import { Card } from "@/components/ui/card";

const Variedades = () => {
  const variedades = [
    { 
      nombre: "Castillo", 
      phRango: "4.0 - 5.5", 
      tempRango: "18 - 28°C", 
      descripcion: "Variedad resistente a la roya del café, desarrollada por Cenicafé. Alta productividad y adaptabilidad.",
      caracteristicas: ["Resistente a enfermedades", "Alta productividad", "Buena adaptación climática"],
      altitud: "1,200 - 2,000 msnm"
    },
    { 
      nombre: "Caturra", 
      phRango: "4.1 - 5.6", 
      tempRango: "19 - 29°C", 
      descripcion: "Mutación natural del Bourbon. Porte bajo, alta calidad en taza y excelente para altitudes medias.",
      caracteristicas: ["Porte compacto", "Alta calidad", "Productividad media-alta"],
      altitud: "1,200 - 2,100 msnm"
    },
    { 
      nombre: "Bourbon", 
      phRango: "3.9 - 5.4", 
      tempRango: "18 - 32°C", 
      descripcion: "Variedad tradicional de alta calidad. Sabor dulce y complejo, ideal para cafés especiales.",
      caracteristicas: ["Excelente calidad", "Sabor complejo", "Tradicional"],
      altitud: "1,000 - 2,000 msnm"
    },
    { 
      nombre: "Típica", 
      phRango: "4.0 - 5.5", 
      tempRango: "18 - 27°C", 
      descripcion: "Variedad ancestral del café arábica. Calidad excepcional pero menor productividad.",
      caracteristicas: ["Calidad excepcional", "Variedad ancestral", "Baja productividad"],
      altitud: "1,200 - 2,200 msnm"
    },
    { 
      nombre: "Colombia", 
      phRango: "4.0 - 5.4", 
      tempRango: "18 - 28°C", 
      descripcion: "Variedad desarrollada por Cenicafé, resistente a roya y con buena calidad en taza.",
      caracteristicas: ["Resistente a roya", "Buena calidad", "Adaptable"],
      altitud: "1,200 - 1,900 msnm"
    },
    { 
      nombre: "Geisha", 
      phRango: "4.2 - 5.8", 
      tempRango: "16 - 25°C", 
      descripcion: "Variedad premium de origen etíope. Perfil floral y frutal único, muy valorada en cafés especiales.",
      caracteristicas: ["Perfil único", "Alta valoración", "Delicada"],
      altitud: "1,400 - 2,200 msnm"
    },
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
        {variedades.map((variedad, index) => (
          <Card key={variedad.nombre} className="p-6 hover:shadow-xl transition-all hover:scale-105">
            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-xl text-center">
                <Coffee className="w-12 h-12 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">{variedad.nombre}</h3>
              </div>

              <p className="text-muted-foreground text-center">{variedad.descripcion}</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-blue-700">Rango pH</span>
                    <p className="text-lg font-semibold text-blue-800">{variedad.phRango}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-red-700">Temperatura</span>
                    <p className="text-lg font-semibold text-red-800">{variedad.tempRango}</p>
                  </div>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-green-700">Altitud óptima</span>
                  <p className="text-lg font-semibold text-green-800">{variedad.altitud}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Características principales</span>
                  <div className="flex flex-wrap gap-2">
                    {variedad.caracteristicas.map((caracteristica, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {caracteristica}
                      </span>
                    ))}
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
