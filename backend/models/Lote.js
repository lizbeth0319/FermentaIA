import mongoose from "mongoose";

const loteSchema = new mongoose.Schema(
  {
    tanque_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tanque",
      required: true,
      index: true,
    },
    variedad: { type: String, required: true },
    proceso: {
      type: String, 
      required: true,
      enum: ["Lavado", "Honey", "Natural"],
    },
    fecha_inicio: { type: Date, required: true },
    horas_estimadas: { type: Number, required: true },
    cantidad_kg: { type: Number, required: true },
    estado: {
      type: String,
      required: true,
      enum: [
        "En fermentación",
        "Listo para lavado",
        "Lavado",
        "Secado",
        "Completado",
        "Descarte",
      ],
      index: true,
    },
    premium_porcentaje: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

loteSchema.index({ fecha_inicio: -1 });

export default mongoose.model("Lote", loteSchema);
