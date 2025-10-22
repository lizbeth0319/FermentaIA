import Finca from '../models/Finca.js';

// GET /api/fincas
export const getAllFincas = async (req, res) => {
    try {
        const fincas = await Finca.find().populate('productor_id');
        res.status(200).json(fincas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las fincas', error });
    }
};

// GET /api/fincas/productor/:productorId
export const getFincasByProductor = async (req, res) => {
    try {
        const fincas = await Finca.find({ productor_id: req.params.productorId });
        if (fincas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron fincas para este productor' });
        }
        res.status(200).json(fincas);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar fincas por productor', error });
    }
};

// GET /api/fincas/:id
export const getFincaById = async (req, res) => {
    try {
        const finca = await Finca.findById(req.params.id).populate('productor_id');
        if (!finca) {
            return res.status(404).json({ message: 'Finca no encontrada' });
        }
        res.status(200).json(finca);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la finca', error });
    }
};

// POST /api/fincas
export const createFinca = async (req, res) => {
    try {
        const nuevaFinca = new Finca(req.body);
        const fincaGuardada = await nuevaFinca.save();

        // Preparar respuesta
        const fincaResponse = {
            id: fincaGuardada._id,
            nombre_finca: fincaGuardada.nombre_finca,
            productor_id: fincaGuardada.productor_id,
            ubicacion: {
                departamento: fincaGuardada.departamento,
                municipio: fincaGuardada.municipio,
                vereda: fincaGuardada.vereda,
                direccion: fincaGuardada.direccion
            },
            datos_tecnicos: {
                nit: fincaGuardada.nit,
                ciiu: fincaGuardada.ciiu,
                altitud_ms_nm: fincaGuardada.altitud_ms_nm
            }
        };

        res.status(201).json({
            success: true,
            message: 'Finca creada exitosamente',
            data: fincaResponse
        });

    } catch (error) {
        console.error('Error en createFinca:', error);
        res.status(400).json({
            success: false,
            message: 'Error al crear la finca',
            error: error.message
        });
    }
};


// PUT /api/fincas/:id
export const updateFinca = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre_finca,
            departamento,
            municipio,
            vereda,
            direccion,
            nit,
            ciiu,
            altitud_ms_nm
        } = req.body;

        // Crear objeto con las actualizaciones
        const actualizaciones = {};
        
        // Agregar solo los campos que vienen en la petición
        if (nombre_finca) actualizaciones.nombre_finca = nombre_finca;
        if (departamento) actualizaciones.departamento = departamento;
        if (municipio) actualizaciones.municipio = municipio;
        if (vereda) actualizaciones.vereda = vereda;
        if (direccion) actualizaciones.direccion = direccion;
        if (nit) actualizaciones.nit = nit;
        if (ciiu) actualizaciones.ciiu = ciiu;
        if (altitud_ms_nm) actualizaciones.altitud_ms_nm = altitud_ms_nm;

        // Realizar la actualización
        const fincaActualizada = await Finca.findByIdAndUpdate(
            id,
            actualizaciones,
            { new: true }
        ).populate('productor_id');

        if (!fincaActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Finca no encontrada'
            });
        }

        // Preparar respuesta estructurada
        const fincaResponse = {
            id: fincaActualizada._id,
            nombre_finca: fincaActualizada.nombre_finca,
            productor_id: fincaActualizada.productor_id,
            ubicacion: {
                departamento: fincaActualizada.departamento,
                municipio: fincaActualizada.municipio,
                vereda: fincaActualizada.vereda,
                direccion: fincaActualizada.direccion
            },
            datos_tecnicos: {
                nit: fincaActualizada.nit,
                ciiu: fincaActualizada.ciiu,
                altitud_ms_nm: fincaActualizada.altitud_ms_nm
            }
        };

        res.status(200).json({
            success: true,
            message: 'Finca actualizada correctamente',
            data: fincaResponse
        });

    } catch (error) {
        console.error('Error en updateFinca:', error);
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la finca',
            error: error.message
        });
    }
};

// DELETE /api/fincas/:id
export const deleteFinca = async (req, res) => {
    try {
        const fincaEliminada = await Finca.findByIdAndDelete(req.params.id);
        if (!fincaEliminada) {
            return res.status(404).json({ message: 'Finca no encontrada' });
        }
        res.status(200).json({ message: 'Finca eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la finca', error });
    }
};