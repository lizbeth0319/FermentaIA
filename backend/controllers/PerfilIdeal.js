import PerfilIdeal from '../models/PerfilIdeal.js';

// Obtener todos los perfiles ideales
export const getAllPerfilesIdeales = async (req, res) => {
  try {
    const perfiles = await PerfilIdeal.find();
    res.status(200).json(perfiles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los perfiles ideales', error });
  }
};
// Obtener perfil ideal por ID
export const getPerfilIdealById = async (req, res) => {
  try {
    const perfil = await PerfilIdeal.findById(req.params.id);
    if (!perfil) {
      return res.status(404).json({ message: 'Perfil ideal no encontrado' });
    }
    res.status(200).json(perfil);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil ideal', error });
  }
};
// Buscar perfiles ideales por variedad, proceso y fase – Buscar por combinación
export const buscarPerfilesIdeales = async (req, res) => {
  try {
    const { variedad, proceso, fase } = req.query;
    if (!variedad || !proceso || !fase) {
        return res.status(400).json({ message: 'Los parámetros variedad, proceso y fase son requeridos' });
    }
    const perfil = await PerfilIdeal.findOne({ variedad, proceso, fase });
    if (!perfil) {
      return res.status(404).json({ message: 'Perfil ideal no encontrado para esa combinación' });
    }
    res.status(200).json(perfil);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el perfil', error });
  }
};

// Crear nuevo perfil ideal
export const createPerfilIdeal = async (req, res) => {
    try {
        const {
            variedad,
            proceso,
            fase,
            temperatura_ideal,
            ph_ideal,
            brix_ideal,
            observaciones
        } = req.body;

        const nuevoPerfil = new PerfilIdeal({
            variedad,
            proceso,
            fase,
            temperatura_ideal,
            ph_ideal,
            brix_ideal,
            observaciones
        });

        const perfilGuardado = await nuevoPerfil.save();

        // Preparar respuesta estructurada
        const perfilResponse = {
            id: perfilGuardado._id,
            caracteristicas: {
                variedad: perfilGuardado.variedad,
                proceso: perfilGuardado.proceso,
                fase: perfilGuardado.fase
            },
            parametros_ideales: {
                temperatura: perfilGuardado.temperatura_ideal,
                ph: perfilGuardado.ph_ideal,
                brix: perfilGuardado.brix_ideal
            },
            observaciones: perfilGuardado.observaciones,
            creado: perfilGuardado.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'Perfil ideal creado exitosamente',
            data: perfilResponse
        });

    } catch (error) {
        console.error('Error en createPerfilIdeal:', error);
        res.status(400).json({
            success: false,
            message: 'Error al crear el perfil ideal',
            error: error.message
        });
    }
};

// Actualizar perfil ideal
export const updatePerfilIdeal = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizaciones = req.body;

        const perfilActualizado = await PerfilIdeal.findByIdAndUpdate(
            id,
            actualizaciones,
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!perfilActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Perfil ideal no encontrado'
            });
        }

        // Preparar respuesta estructurada
        const perfilResponse = {
            id: perfilActualizado._id,
            caracteristicas: {
                variedad: perfilActualizado.variedad,
                proceso: perfilActualizado.proceso,
                fase: perfilActualizado.fase
            },
            parametros_ideales: {
                temperatura: perfilActualizado.temperatura_ideal,
                ph: perfilActualizado.ph_ideal,
                brix: perfilActualizado.brix_ideal
            },
            observaciones: perfilActualizado.observaciones,
            actualizado: perfilActualizado.updatedAt
        };

        res.status(200).json({
            success: true,
            message: 'Perfil ideal actualizado correctamente',
            data: perfilResponse
        });

    } catch (error) {
        console.error('Error en updatePerfilIdeal:', error);
        res.status(400).json({
            success: false,
            message: 'Error al actualizar el perfil ideal',
            error: error.message
        });
    }
};

// Eliminar perfil ideal
export const deletePerfilIdeal = async (req, res) => {
  try {
    const perfilEliminado = await PerfilIdeal.findByIdAndDelete(req.params.id);
    if (!perfilEliminado) {
      return res.status(404).json({ message: 'Perfil ideal no encontrado' });
    }
    res.status(200).json({ message: 'Perfil ideal eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el perfil ideal', error });
  }
};