import mongoose from "mongoose";

const sincronizacionSchema = new mongoose.Schema(
  {
    lote_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lote",
      required: true,
    },
    medicion_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicion",
      required: true,
    },
    estado_sync: {
      type: String,
      required: true,
      enum: ["local", "pendiente", "sincronizado"],
      index: true,
    },
    fecha_sync: { type: Date },
  },
  { timestamps: true }
);

sincronizacionSchema.index({ lote_id: 1, medicion_id: 1 });

export default mongoose.model("Sincronizacion", sincronizacionSchema);
