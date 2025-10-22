import mongoose from "mongoose";
const tanqueSchema = new mongoose.Schema(
  {
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finca",
      required: true,
      index: true,
    },
    codigo_tanque: { type: String, required: true, unique: true },
    capacidad_kg: { type: Number, required: true },
    material: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Tanque", tanqueSchema);
