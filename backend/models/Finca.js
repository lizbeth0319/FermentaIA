import mongoose from "mongoose";

const fincaSchema = new mongoose.Schema(
  {
    productor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Productor",
      required: true,
      index: true,
    },
    nombre_finca: { type: String, required: true },
    departamento: { type: String, required: true },
    municipio: { type: String, required: true },
    vereda: { type: String, required: true },
    direccion: { type: String, required: true },
    nit: { type: String, required: true },
    ciiu: { type: String, required: true },
    altitud_ms_nm: { type: Number, required: true },
  },
  { timestamps: true }
);

fincaSchema.index({ departamento: 1, municipio: 1 });

export default mongoose.model("Finca", fincaSchema);
