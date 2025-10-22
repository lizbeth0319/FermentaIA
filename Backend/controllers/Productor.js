import Productor from '../models/Productor.js';

// GET /api/productores
export const getAllProductores = async (req, res) => {
    try {
        const productores = await Productor.find();
        res.status(200).json(productores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productores', error });
    }
};

// GET /api/productores/:id
export const getProductorById = async (req, res) => {
    try {
        const productor = await Productor.findById(req.params.id)
            .select('-contrasena');

        if (!productor) {
            return res.status(404).json({
                success: false,
                message: `No se encontró el productor con ID: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: productor
        });
    } catch (error) {
        console.error('Error en getProductorById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el productor',
            error: error.message
        });
    }
};



// PUT /api/productores/:id
export const updateProductor = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre_completo,
            celular,
            telefono_fijo,
            email,
            regimen_tributario
        } = req.body;

        const actualizaciones = {};
        
        if (nombre_completo) actualizaciones.nombre_completo = nombre_completo;
        if (celular) actualizaciones.celular = celular;
        if (telefono_fijo) actualizaciones.telefono_fijo = telefono_fijo;
        if (email) actualizaciones.email = email;
        if (regimen_tributario) actualizaciones.regimen_tributario = regimen_tributario;

        // Realizar la actualización
        const productorActualizado = await Productor.findByIdAndUpdate(
            id,
            actualizaciones,
            { new: true }
        ).select('-contrasena');

        if (!productorActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Productor no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Productor actualizado correctamente',
            data: {
                id: productorActualizado._id,
                nombre_completo: productorActualizado.nombre_completo,
                email: productorActualizado.email,
                celular: productorActualizado.celular,
                telefono_fijo: productorActualizado.telefono_fijo,
                regimen_tributario: productorActualizado.regimen_tributario
            }
        });

    } catch (error) {
        console.error('Error en updateProductor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el productor',
            error: error.message
        });
    }
};

// DELETE /api/productores/:id
export const deleteProductor = async (req, res) => {
    try {
        const productorEliminado = await Productor.findByIdAndDelete(req.params.id);
        if (!productorEliminado) {
            return res.status(404).json({ message: 'Productor no encontrado' });
        }
        res.status(200).json({ message: 'Productor eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el productor', error });
    }
};