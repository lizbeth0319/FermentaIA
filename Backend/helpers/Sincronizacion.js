import Sincronizacion from '../models/Sincronizacion.js';
import Lote from '../models/Lote.js';
import Medicion from '../models/Medicion.js';

// Verificar si existe una sincronización
export const existeSincronizacionPorId = async (id) => {
    const sincronizacion = await Sincronizacion.findById(id);
    if (!sincronizacion) {
        throw new Error(`La sincronización con id ${id} no existe`);
    }
};

// Verificar si existe el lote
export const existeLote = async (id) => {
    const lote = await Lote.findById(id);
    if (!lote) {
        throw new Error(`El lote con id ${id} no existe`);
    }
};

// Verificar si existe la medición
export const existeMedicion = async (id) => {
    const medicion = await Medicion.findById(id);
    if (!medicion) {
        throw new Error(`La medición con id ${id} no existe`);
    }
};

// Validar estado de sincronización
export const esEstadoSyncValido = (estado) => {
    const estadosValidos = ['local', 'pendiente', 'sincronizado'];
    if (!estadosValidos.includes(estado)) {
        throw new Error('Estado de sincronización no válido');
    }
    return true;
};