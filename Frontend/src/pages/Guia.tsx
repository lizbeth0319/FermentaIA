import { Coffee, Droplet, FileText, BarChart3, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const Guia = () => {
  const pasos = [
    {
      numero: 1,
      icon: Coffee,
      titulo: "Registra tu Finca",
      descripcion: "Comienza registrando tu finca cafetera con su ubicación y área en hectáreas.",
      color: "bg-primary",
    },
    {
      numero: 2,
      icon: Droplet,
      titulo: "Añade tus Tanques",
      descripcion: "Registra los tanques de fermentación asociándolos a tu finca y especificando su capacidad.",
      color: "bg-secondary",
    },
    {
      numero: 3,
      icon: Coffee,
      titulo: "Crea Lotes",
      descripcion: "Registra cada lote de café especificando la variedad, proceso y cantidad en kilos.",
      color: "bg-accent",
    },
    {
      numero: 4,
      icon: FileText,
      titulo: "Registra Mediciones",
      descripcion: "Mide el pH y temperatura regularmente. El sistema te dará recomendaciones automáticas.",
      color: "bg-primary",
    },
    {
      numero: 5,
      icon: BarChart3,
      titulo: "Consulta Comparativas",
      descripcion: "Revisa gráficas que comparan tus valores con los rangos ideales de cada variedad.",
      color: "bg-secondary",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Guía de Uso</h1>
        <p className="text-lg text-muted-foreground">Aprende a usar FermentaCafé en 5 pasos simples</p>
      </div>

      <div className="space-y-6 pt-6">
        {pasos.map((paso, index) => {
          const Icon = paso.icon;
          return (
            <Card 
              key={paso.numero} 
              className="p-6 hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <div className={`${paso.color} p-4 rounded-2xl shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  {index < pasos.length - 1 && (
                    <div className="w-1 h-16 bg-border mt-4" />
                  )}
                </div>

                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${paso.color} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg`}>
                      {paso.numero}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{paso.titulo}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground">{paso.descripcion}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-8 bg-primary text-primary-foreground">
        <div className="flex items-start gap-4">
          <CheckCircle className="w-12 h-12 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold mb-2">¡Listo para comenzar!</h3>
            <p className="text-lg">
              Sigue estos pasos y optimiza tu proceso de fermentación. El asistente virtual está disponible 
              para ayudarte en cualquier momento. ¡Haz clic en el botón de chat para consultarle!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Guia;
