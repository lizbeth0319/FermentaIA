import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";

const Glosario = () => {
  const terminos = [
    {
      termino: "Fermentación",
      definicion: "Proceso bioquímico donde microorganismos descomponen el mucílago del café, desarrollando sabores y aromas únicos.",
    },
    {
      termino: "pH",
      definicion: "Medida de acidez o alcalinidad. En café, el pH ideal varía entre 4.0 y 4.5 durante la fermentación.",
    },
    {
      termino: "Temperatura",
      definicion: "Factor crítico en la fermentación. La temperatura óptima suele estar entre 25°C y 30°C.",
    },
    {
      termino: "Lote",
      definicion: "Cantidad específica de café en proceso de fermentación, identificado por variedad y características únicas.",
    },
    {
      termino: "Mucílago",
      definicion: "Capa pegajosa y dulce que rodea el grano de café, rica en azúcares que alimentan la fermentación.",
    },
    {
      termino: "Proceso Lavado",
      definicion: "Método donde el mucílago se fermenta y luego se retira con agua antes del secado.",
    },
    {
      termino: "Proceso Honey",
      definicion: "Método donde se retira parte del mucílago pero se deja algo en el grano durante el secado.",
    },
    {
      termino: "Proceso Natural",
      definicion: "El café se seca con toda la cereza intacta, fermentando naturalmente al sol.",
    },
    {
      termino: "Variedad Castillo",
      definicion: "Variedad colombiana resistente a la roya, con buen balance entre productividad y calidad.",
    },
    {
      termino: "Variedad Caturra",
      definicion: "Mutación del Bourbon, de porte bajo y alta producción, con excelente calidad en taza.",
    },
    {
      termino: "Variedad Bourbon",
      definicion: "Variedad tradicional apreciada por su dulzura y complejidad, aunque de menor producción.",
    },
    {
      termino: "Variedad Típica",
      definicion: "Una de las variedades más antiguas y puras, valorada por su calidad excepcional en taza.",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="bg-primary p-4 rounded-2xl">
            <BookOpen className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Glosario de Términos</h1>
        <p className="text-lg text-muted-foreground">Aprende sobre fermentación y café</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {terminos.map((item) => (
          <Card 
            key={item.termino} 
            className="p-6 hover:shadow-xl transition-all hover:scale-105"
          >
            <h3 className="text-xl font-bold text-primary mb-3">{item.termino}</h3>
            <p className="text-foreground leading-relaxed">{item.definicion}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Glosario;
