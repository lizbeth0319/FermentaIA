import Sincronizacion from "../models/Sincronizacion.js";

// Obtener todas las sincronizaciones
export const getAllSincronizaciones = async (req, res) => {
  try {
    const sincronizaciones = await Sincronizacion.find();
    res.json(sincronizaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Obtener sincronizaciones por medición
export const getSincronizacionesByMedicion = async (req, res) => {
  try {
    const { medicionId } = req.params;
    const sincronizaciones = await Sincronizacion.find({
      medicion: medicionId,
    });
    res.json(sincronizaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Obtener sincronizaciones por lote
export const getSincronizacionesByLote = async (req, res) => {
  try {
    const { loteId } = req.params;
    const sincronizaciones = await Sincronizacion.find({ lote: loteId });
    res.json(sincronizaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Obtener sincronización por ID
export const getSincronizacionById = async (req, res) => {
  try {
    const { id } = req.params;

    const sincronizacion = await Sincronizacion.findById(id).populate([
      "lote_id",
      "medicion_id",
    ]);

    if (!sincronizacion) {
      return res.status(404).json({
        success: false,
        message: "Sincronización no encontrada",
      });
    }

    // Preparar respuesta estructurada
    const sincronizacionResponse = {
      id: sincronizacion._id,
      referencias: {
        lote: {
          id: sincronizacion.lote_id._id,
          variedad: sincronizacion.lote_id.variedad,
        },
        medicion: {
          id: sincronizacion.medicion_id._id,
          fecha: sincronizacion.medicion_id.createdAt,
        },
      },
      datos_sincronizacion: {
        estado: sincronizacion.estado_sync,
        fecha_sync: sincronizacion.fecha_sync,
        creado: sincronizacion.createdAt,
        actualizado: sincronizacion.updatedAt,
      },
    };

    res.status(200).json({
      success: true,
      data: sincronizacionResponse,
    });
  } catch (error) {
    console.error("Error en getSincronizacionById:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la sincronización",
      error: error.message,
    });
  }
};
// Crear nueva sincronización
export const createSincronizacion = async (req, res) => {
  try {
    const { lote_id, medicion_id, estado_sync, fecha_sync } = req.body;

    const nuevaSincronizacion = new Sincronizacion({
      lote_id,
      medicion_id,
      estado_sync,
      fecha_sync: fecha_sync || new Date(),
    });

    const sincronizacionGuardada = await nuevaSincronizacion.save();
    await sincronizacionGuardada.populate(["lote_id", "medicion_id"]);

    // Preparar respuesta estructurada
    const sincronizacionResponse = {
      id: sincronizacionGuardada._id,
      referencias: {
        lote: {
          id: sincronizacionGuardada.lote_id._id,
          variedad: sincronizacionGuardada.lote_id.variedad,
        },
        medicion: {
          id: sincronizacionGuardada.medicion_id._id,
          fecha: sincronizacionGuardada.medicion_id.createdAt,
        },
      },
      datos_sincronizacion: {
        estado: sincronizacionGuardada.estado_sync,
        fecha_sync: sincronizacionGuardada.fecha_sync,
        creado: sincronizacionGuardada.createdAt,
      },
    };

    res.status(201).json({
      success: true,
      message: "Sincronización creada exitosamente",
      data: sincronizacionResponse,
    });
  } catch (error) {
    console.error("Error en createSincronizacion:", error);
    res.status(400).json({
      success: false,
      message: "Error al crear la sincronización",
      error: error.message,
    });
  }
};
// Actualizar sincronización
export const updateSincronizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_sync, fecha_sync } = req.body;

    // Crear objeto con las actualizaciones
    const actualizaciones = {};

    if (estado_sync) actualizaciones.estado_sync = estado_sync;
    if (fecha_sync) actualizaciones.fecha_sync = fecha_sync;

    const sincronizacionActualizada = await Sincronizacion.findByIdAndUpdate(
      id,
      actualizaciones,
      {
        new: true,
        runValidators: true,
      }
    ).populate(["lote_id", "medicion_id"]);

    if (!sincronizacionActualizada) {
      return res.status(404).json({
        success: false,
        message: "Sincronización no encontrada",
      });
    }

    // Preparar respuesta estructurada
    const sincronizacionResponse = {
      id: sincronizacionActualizada._id,
      referencias: {
        lote: {
          id: sincronizacionActualizada.lote_id._id,
          variedad: sincronizacionActualizada.lote_id.variedad,
        },
        medicion: {
          id: sincronizacionActualizada.medicion_id._id,
          fecha: sincronizacionActualizada.medicion_id.createdAt,
        },
      },
      datos_sincronizacion: {
        estado: sincronizacionActualizada.estado_sync,
        fecha_sync: sincronizacionActualizada.fecha_sync,
        actualizado: sincronizacionActualizada.updatedAt,
      },
    };

    res.status(200).json({
      success: true,
      message: "Sincronización actualizada correctamente",
      data: sincronizacionResponse,
    });
  } catch (error) {
    console.error("Error en updateSincronizacion:", error);
    res.status(400).json({
      success: false,
      message: "Error al actualizar la sincronización",
      error: error.message,
    });
  }
};
// Eliminar sincronización
export const deleteSincronizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const sincronizacion = await Sincronizacion.findByIdAndDelete(id);
    if (!sincronizacion) {
      return res.status(404).json({ message: "Sincronización no encontrada" });
    }
    res.json({ message: "Sincronización eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
