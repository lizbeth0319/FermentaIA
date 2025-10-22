import mongoose from "mongoose";

const productorSchema = new mongoose.Schema({
  nombre_completo: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
    maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
  },
  cedula: {
    type: Number,
    required: true,
    unique: true,
    min: [1000000, "La cédula debe tener al menos 7 dígitos"],
    max: [9999999999, "La cédula no puede exceder 10 dígitos"],
  },
  celular: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^3[0-9]{9}$/.test(v.toString());
      },
      message: "El celular debe empezar con 3 y tener 10 dígitos",
    },
  },
  telefono_fijo: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /^\([1-8]\)[0-9]{7}$/.test(v);
      },
      message: "El formato del teléfono fijo debe ser (X)XXXXXXX",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email no válido"],
  },
  regimen_tributario: {
    type: String,
    required: true,
    enum: {
      values: ["Responsable de IVA", "No responsable de IVA","Régimen Ordinario","Régimen Simple"],
      message: "Régimen tributario no válido",
    },
  },
  contrasena: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model("Productor", productorSchema);
