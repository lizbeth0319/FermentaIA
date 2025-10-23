import Tanque from "../models/Tanque.js";
import mongoose from "mongoose";
// Obtener todos los tanques
export const getAllTanques = async (req, res) => {
  try {
    const tanques = await Tanque.find();
    res.status(200).json(tanques);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los tanques", error });
  }
};
// Obtener tanques por finca
export const getTanquesByFinca = async (req, res) => {
  const { fincaId } = req.params;
  try {
    console.log('🔍 getTanquesByFinca - fincaId recibido:', fincaId);
    console.log('🔍 Tipo de fincaId:', typeof fincaId);
    
    // Buscar todos los tanques primero para debug
    const todosTanques = await Tanque.find();
    console.log('🔍 Todos los tanques en BD:', todosTanques);
    
    const tanques = await Tanque.find({ finca_id: fincaId });
    console.log('🔍 Tanques encontrados para finca', fincaId, ':', tanques);
    
    // Prueba adicional: buscar como ObjectId
    const tanquesObjectId = await Tanque.find({ finca_id: new mongoose.Types.ObjectId(fincaId) });
    console.log('🔍 Tanques encontrados con ObjectId:', tanquesObjectId);
    
    res.status(200).json(tanques);
  } catch (error) {
    console.error('❌ Error en getTanquesByFinca:', error);
    res
      .status(500)
      .json({ message: "Error al obtener los tanques por finca", error });
  }
};

// Obtener tanque por ID
export const getTanqueById = async (req, res) => {
  const { id } = req.params;
  try {
    const tanque = await Tanque.findById(id);
    if (!tanque) {
      return res.status(404).json({ message: "Tanque no encontrado" });
    }
    res.status(200).json(tanque);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el tanque por ID", error });
  }
};
// Crear nuevo tanque
export const createTanque = async (req, res) => {
  try {
     console.log('🔍 createTanque - Datos recibidos:', req.body);
    const { finca_id, codigo_tanque, capacidad_kg, material } = req.body;
    console.log('🔍 finca_id extraído:', finca_id, 'tipo:', typeof finca_id);

    const nuevoTanque = new Tanque({
      finca_id,
      codigo_tanque,
      capacidad_kg,
      material,
    });
    console.log('🔍 Tanque antes de guardar:', nuevoTanque);

    const tanqueGuardado = await nuevoTanque.save();
    console.log('🔍 Tanque guardado en BD:', tanqueGuardado);
    await tanqueGuardado.populate("finca_id");

    const tanqueResponse = {
      id: tanqueGuardado._id,
      codigo_tanque: tanqueGuardado.codigo_tanque,
      especificaciones: {
        capacidad_kg: tanqueGuardado.capacidad_kg,
        material: tanqueGuardado.material,
      },
      finca: {
        id: tanqueGuardado.finca_id._id,
        nombre: tanqueGuardado.finca_id.nombre_finca,
      },
    };

    res.status(201).json({
      success: true,
      message: "Tanque creado exitosamente",
      data: tanqueResponse,
    });
  } catch (error) {
    console.error("Error en createTanque:", error);
    res.status(400).json({
      success: false,
      message: "Error al crear el tanque",
      error: error.message,
    });
  }
};

// Actualizar tanque
export const updateTanque = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = req.body;

    const tanqueActualizado = await Tanque.findByIdAndUpdate(
      id,
      actualizaciones,
      {
        new: true,
        runValidators: true,
      }
    ).populate("finca_id");

    if (!tanqueActualizado) {
      return res.status(404).json({
        success: false,
        message: "Tanque no encontrado",
      });
    }

    const tanqueResponse = {
      id: tanqueActualizado._id,
      codigo_tanque: tanqueActualizado.codigo_tanque,
      especificaciones: {
        capacidad_kg: tanqueActualizado.capacidad_kg,
        material: tanqueActualizado.material,
      },
      finca: {
        id: tanqueActualizado.finca_id._id,
        nombre: tanqueActualizado.finca_id.nombre_finca,
      },
    };

    res.status(200).json({
      success: true,
      message: "Tanque actualizado correctamente",
      data: tanqueResponse,
    });
  } catch (error) {
    console.error("Error en updateTanque:", error);
    res.status(400).json({
      success: false,
      message: "Error al actualizar el tanque",
      error: error.message,
    });
  }
};

// Eliminar tanque
export const deleteTanque = async (req, res) => {
  const { id } = req.params;
  try {
    const tanqueEliminado = await Tanque.findByIdAndDelete(id);
    if (!tanqueEliminado) {
      return res.status(404).json({ message: "Tanque no encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el tanque", error });
  }
};
