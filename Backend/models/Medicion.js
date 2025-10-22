import mongoose from "mongoose";
const { Schema } = mongoose;

const medicionSchema = new Schema({
    lote: {
        type: Schema.Types.ObjectId,
        ref: 'Lote',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    fase: {
        type: String,
        enum: ['inicio', 'medio', 'final'],
        required: true
    },
    temperatura: {
        type: Number,
        required: true
    },
    ph: {
        type: Number,
        required: true
    },
    observaciones: String
}, {
    timestamps: true
});

export default mongoose.model('Medicion', medicionSchema);
