import mediciones from "../models/Medicion.js";

// GET /api/mediciones
export const getAllMediciones = async (req, res) => {
  try {
    const allMediciones = await mediciones.find();
    res.status(200).json(allMediciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las mediciones", error });
  }
};
// get /api/mediciones/:id
export const getMedicionById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicion = await mediciones.findById(id);
    if (!medicion) {
      return res.status(404).json({ message: "Medición no encontrada" });
    }
    res.status(200).json(medicion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la medición", error });
  }
};
// GET /api/mediciones/lote/:loteId
export const getMedicionesByLoteId = async (req, res) => {
  try {
    const { loteId } = req.params;
    const medicionesPorLote = await mediciones.find({ lote: loteId });
    res.status(200).json(medicionesPorLote);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las mediciones por lote", error });
  }
};

// POST /api/mediciones
export const createMedicion = async (req, res) => {
  try {
    const { 
      lote_id,      // Este es el nombre que viene del cliente
      timestamp,
      fase,
      temperatura_c,
      ph,
      texto_voz,
      condiciones 
    } = req.body;

    // Validar que los campos requeridos existan
    if (!lote_id || !temperatura_c || !ph || !fase) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
        camposFaltantes: {
          lote_id: !lote_id,
          temperatura_c: !temperatura_c,
          ph: !ph,
          fase: !fase
        }
      });
    }

    // Crear la nueva medición - nota el cambio de lote_id a lote
    const nuevaMedicion = new mediciones({
      lote: lote_id,    // Aquí hacemos la conversión del nombre del campo
      timestamp: timestamp || new Date(),
      fase,
      temperatura: temperatura_c,
      ph,
      observaciones: `Texto voz: ${texto_voz || 'No registrado'}\nCondiciones: ${condiciones || 'No registradas'}`
    });

    // Guardar y popular
    const medicionGuardada = await nuevaMedicion.save();
    await medicionGuardada.populate({
      path: 'lote',
      select: '_id variedad proceso estado'
    });

    // Preparar respuesta estructurada
    const medicionResponse = {
      id: medicionGuardada._id,
      lote: {
        id: medicionGuardada.lote._id,
        variedad: medicionGuardada.lote.variedad,
        proceso: medicionGuardada.lote.proceso,
        estado: medicionGuardada.lote.estado
      },
      datos_medicion: {
        timestamp: medicionGuardada.timestamp,
        fase: medicionGuardada.fase,
        temperatura: medicionGuardada.temperatura,
        ph: medicionGuardada.ph
      },
      datos_adicionales: {
        texto_voz: texto_voz || 'No registrado',
        condiciones: condiciones || 'No registradas'
      },
      timestamps: {
        creado: medicionGuardada.createdAt,
        actualizado: medicionGuardada.updatedAt
      }
    };

    res.status(201).json({
      success: true,
      message: "Medición creada exitosamente",
      data: medicionResponse
    });

  } catch (error) {
    console.error("Error en createMedicion:", error);
    res.status(400).json({
      success: false,
      message: "Error al crear la medición",
      error: error.message
    });
  }
};

// PUT /api/mediciones/:id
export const updateMedicion = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      temperatura,
      ph,
      brix,
      observaciones 
    } = req.body;

    // Verificar si la medición existe
    const medicionExistente = await mediciones.findById(id);
    if (!medicionExistente) {
      return res.status(404).json({
        success: false,
        message: "Medición no encontrada"
      });
    }

    // Crear objeto con las actualizaciones válidas
    const actualizaciones = {};
    if (temperatura !== undefined) actualizaciones.temperatura = temperatura;
    if (ph !== undefined) actualizaciones.ph = ph;
    if (brix !== undefined) actualizaciones.brix = brix;
    if (observaciones !== undefined) actualizaciones.observaciones = observaciones;

    // Actualizar y popular
    const medicionActualizada = await mediciones.findByIdAndUpdate(
      id,
      actualizaciones,
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'lote',
      select: '_id variedad proceso estado'
    });

    // Preparar respuesta estructurada
    const medicionResponse = {
      id: medicionActualizada._id,
      lote: {
        id: medicionActualizada.lote._id,
        variedad: medicionActualizada.lote.variedad,
        proceso: medicionActualizada.lote.proceso,
        estado: medicionActualizada.lote.estado
      },
      datos_medicion: {
        temperatura: medicionActualizada.temperatura,
        ph: medicionActualizada.ph,
        brix: medicionActualizada.brix
      },
      observaciones: medicionActualizada.observaciones,
      timestamps: {
        creado: medicionActualizada.createdAt,
        actualizado: medicionActualizada.updatedAt
      }
    };

    res.status(200).json({
      success: true,
      message: "Medición actualizada correctamente",
      data: medicionResponse
    });

  } catch (error) {
    console.error("Error en updateMedicion:", error);
    res.status(400).json({
      success: false,
      message: "Error al actualizar la medición",
      error: error.message
    });
  }
};

//  DELETE /api/mediciones/:id
export const deleteMedicion = async (req, res) => {
  try {
    const { id } = req.params;
    const medicionEliminada = await mediciones.findByIdAndDelete(id);
    if (!medicionEliminada) {
      return res.status(404).json({ message: "Medición no encontrada" });
    }
    res.status(200).json(medicionEliminada);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la medición", error });
  }
};
