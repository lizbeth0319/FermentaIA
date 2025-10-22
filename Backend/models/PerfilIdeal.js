import mongoose from "mongoose";

const perfilIdealSchema = new mongoose.Schema({
  variedad: { type: String, required: true },
  proceso: {
    type: String,
    required: true,
    enum: ["Lavado", "Honey", "Natural"],
  },
  fase: { type: String, required: true, enum: ["inicio", "media", "fin"] },
  temp_min_c: { type: Number, required: true },
  temp_max_c: { type: Number, required: true },
  ph_min: { type: Number, required: true },
  ph_max: { type: Number, required: true },
});

perfilIdealSchema.index({ variedad: 1, proceso: 1, fase: 1 });

export default mongoose.model("PerfilIdeal", perfilIdealSchema);
