import Lote from "../models/Lote.js";

// GET /api/lotes
export const getAllLotes = async (req, res) => {
  try {
    const lotes = await Lote.find().populate("tanque_id");
    res.status(200).json(lotes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los lotes", error });
  }
};

// GET /api/lotes/tanque/:tanqueId
export const getLotesByTanque = async (req, res) => {
  try {
    const lotes = await Lote.find({ tanque_id: req.params.tanqueId });
    if (lotes.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron lotes para este tanque" });
    }
    res.status(200).json(lotes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar lotes por tanque", error });
  }
};

// GET /api/lotes/:id
export const getLoteById = async (req, res) => {
  try {
    const lote = await Lote.findById(req.params.id).populate("tanque_id");
    if (!lote) {
      return res.status(404).json({ message: "Lote no encontrado" });
    }
    res.status(200).json(lote);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el lote", error });
  }
};

// POST /api/lotes
export const createLote = async (req, res) => {
  try {
    const {
      tanque_id,
      variedad,
      proceso,
      fecha_inicio,
      horas_estimadas,
      cantidad_kg,
      estado,
      premium_porcentaje,
    } = req.body;

    const nuevoLote = new Lote({
      tanque_id,
      variedad,
      proceso,
      fecha_inicio,
      horas_estimadas,
      cantidad_kg,
      estado,
      premium_porcentaje,
    });

    const loteGuardado = await nuevoLote.save();
    await loteGuardado.populate("tanque_id");

    // Preparar respuesta
    const loteResponse = {
      id: loteGuardado._id,
      tanque: {
        id: loteGuardado.tanque_id._id,
        nombre: loteGuardado.tanque_id.nombre,
      },
      datos_proceso: {
        variedad: loteGuardado.variedad,
        proceso: loteGuardado.proceso,
        fecha_inicio: loteGuardado.fecha_inicio,
        horas_estimadas: loteGuardado.horas_estimadas,
      },
      datos_cantidad: {
        cantidad_kg: loteGuardado.cantidad_kg,
        premium_porcentaje: loteGuardado.premium_porcentaje,
      },
      estado: loteGuardado.estado,
    };

    res.status(201).json({
      success: true,
      message: "Lote creado exitosamente",
      data: loteResponse,
    });
  } catch (error) {
    console.error("Error en createLote:", error);
    res.status(400).json({
      success: false,
      message: "Error al crear el lote",
      error: error.message,
    });
  }
};

// PUT /api/lotes/:id
export const updateLote = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = req.body;

    const loteActualizado = await Lote.findByIdAndUpdate(id, actualizaciones, {
      new: true,
      runValidators: true,
    }).populate("tanque_id");

    if (!loteActualizado) {
      return res.status(404).json({
        success: false,
        message: "Lote no encontrado",
      });
    }

    // Preparar respuesta
    const loteResponse = {
      id: loteActualizado._id,
      tanque: {
        id: loteActualizado.tanque_id._id,
        nombre: loteActualizado.tanque_id.nombre,
      },
      datos_proceso: {
        variedad: loteActualizado.variedad,
        proceso: loteActualizado.proceso,
        fecha_inicio: loteActualizado.fecha_inicio,
        horas_estimadas: loteActualizado.horas_estimadas,
      },
      datos_cantidad: {
        cantidad_kg: loteActualizado.cantidad_kg,
        premium_porcentaje: loteActualizado.premium_porcentaje,
      },
      estado: loteActualizado.estado,
    };

    res.status(200).json({
      success: true,
      message: "Lote actualizado correctamente",
      data: loteResponse,
    });
  } catch (error) {
    console.error("Error en updateLote:", error);
    res.status(400).json({
      success: false,
      message: "Error al actualizar el lote",
      error: error.message,
    });
  }
};

// DELETE /api/lotes/:id
export const deleteLote = async (req, res) => {
  try {
    const loteEliminado = await Lote.findByIdAndDelete(req.params.id);
    if (!loteEliminado) {
      return res.status(404).json({ message: "Lote no encontrado" });
    }
    res.status(200).json({ message: "Lote eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el lote", error });
  }
};
