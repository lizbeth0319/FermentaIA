import Recomendacion from '../models/Recomendacion.js';

// GET todas las recomendaciones
export const getAllRecomendaciones = async (req, res) => {
  try {
    const recomendaciones = await Recomendacion.find();
    res.json(recomendaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET recomendaciones por medición
export const getRecomendacionesByMedicion = async (req, res) => {
  try {
    const { medicionId } = req.params;
    const recomendaciones = await Recomendacion.find({ medicion: medicionId });
    res.json(recomendaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET recomendaciones por lote
export const getRecomendacionesByLote = async (req, res) => {
  try {
    const { loteId } = req.params;
    const recomendaciones = await Recomendacion.find({ lote: loteId });
    res.json(recomendaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET recomendación por ID
export const getRecomendacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const recomendacion = await Recomendacion.findById(id);
    if (!recomendacion) {
      return res.status(404).json({ message: 'Recomendación no encontrada' });
    }
    res.json(recomendacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// POST nueva recomendación
export const createRecomendacion = async (req, res) => {
    try {
        const {
            lote_id,
            medicion_id,
            diagnostico,
            accion,
            prioridad
        } = req.body;

        const nuevaRecomendacion = new Recomendacion({
            lote_id,
            medicion_id,
            diagnostico,
            accion,
            prioridad
        });

        const recomendacionGuardada = await nuevaRecomendacion.save();
        await recomendacionGuardada.populate(['lote_id', 'medicion_id']);

        // Preparar respuesta
        const recomendacionResponse = {
            id: recomendacionGuardada._id,
            referencias: {
                lote: {
                    id: recomendacionGuardada.lote_id._id,
                    variedad: recomendacionGuardada.lote_id.variedad
                },
                medicion: {
                    id: recomendacionGuardada.medicion_id._id,
                    fecha: recomendacionGuardada.medicion_id.createdAt
                }
            },
            datos_recomendacion: {
                diagnostico: recomendacionGuardada.diagnostico,
                accion: recomendacionGuardada.accion,
                prioridad: recomendacionGuardada.prioridad
            },
            fecha_creacion: recomendacionGuardada.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'Recomendación creada exitosamente',
            data: recomendacionResponse
        });

    } catch (error) {
        console.error('Error en createRecomendacion:', error);
        res.status(400).json({
            success: false,
            message: 'Error al crear la recomendación',
            error: error.message
        });
    }
};
// PUT actualizar recomendación
export const updateRecomendacion = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizaciones = req.body;

        const recomendacionActualizada = await Recomendacion.findByIdAndUpdate(
            id,
            actualizaciones,
            { 
                new: true,
                runValidators: true 
            }
        ).populate(['lote_id', 'medicion_id']);

        if (!recomendacionActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Recomendación no encontrada'
            });
        }

        // Preparar respuesta
        const recomendacionResponse = {
            id: recomendacionActualizada._id,
            referencias: {
                lote: {
                    id: recomendacionActualizada.lote_id._id,
                    variedad: recomendacionActualizada.lote_id.variedad
                },
                medicion: {
                    id: recomendacionActualizada.medicion_id._id,
                    fecha: recomendacionActualizada.medicion_id.createdAt
                }
            },
            datos_recomendacion: {
                diagnostico: recomendacionActualizada.diagnostico,
                accion: recomendacionActualizada.accion,
                prioridad: recomendacionActualizada.prioridad
            },
            fecha_actualizacion: recomendacionActualizada.updatedAt
        };

        res.status(200).json({
            success: true,
            message: 'Recomendación actualizada correctamente',
            data: recomendacionResponse
        });

    } catch (error) {
        console.error('Error en updateRecomendacion:', error);
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la recomendación',
            error: error.message
        });
    }
};

// DELETE
export const deleteRecomendacion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecomendacion = await Recomendacion.findByIdAndDelete(id);
    if (!deletedRecomendacion) {
      return res.status(404).json({ message: 'Recomendación no encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
