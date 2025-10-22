import mongoose from 'mongoose';

const recomendacionSchema = new mongoose.Schema({
  lote_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lote', required: true, index: true },
  medicion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicion', required: true, index: true },
  diagnostico: { type: String, required: true },
  accion: { type: String, required: true },
  prioridad: { type: String, required: true, enum: ['alta', 'media', 'baja'], index: true }
}, { timestamps: true });

export default mongoose.model('Recomendacion', recomendacionSchema);