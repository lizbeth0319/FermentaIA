import Lote from '../models/Lote.js';
import Tanque from '../models/Tanque.js';

// Verificar si existe un lote por ID
export const existeLotePorId = async (id) => {
    const lote = await Lote.findById(id);
    if (!lote) {
        throw new Error(`El lote con id ${id} no existe`);
    }
};

// Verificar si existe el tanque
export const existeTanque = async (id) => {
    const tanque = await Tanque.findById(id);
    if (!tanque) {
        throw new Error(`El tanque con id ${id} no existe`);
    }
};

// Validar proceso
export const esProcesoValido = (proceso) => {
    const procesosValidos = ['Lavado', 'Honey', 'Natural'];
    if (!procesosValidos.includes(proceso)) {
        throw new Error('Proceso no válido');
    }
    return true;
};

// Validar estado
export const esEstadoValido = (estado) => {
    const estadosValidos = [
        'En fermentación',
        'Listo para lavado',
        'Lavado',
        'Secado',
        'Completado',
        'Descarte'
    ];
    if (!estadosValidos.includes(estado)) {
        throw new Error('Estado no válido');
    }
    return true;
};