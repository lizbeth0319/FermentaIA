import Recomendacion from '../models/Recomendacion.js';
import Lote from '../models/Lote.js';
import Medicion from '../models/Medicion.js';

// Verificar si existe una recomendación
export const existeRecomendacionPorId = async (id) => {
    const recomendacion = await Recomendacion.findById(id);
    if (!recomendacion) {
        throw new Error(`La recomendación con id ${id} no existe`);
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

// Validar prioridad
export const esPrioridadValida = (prioridad) => {
    const prioridadesValidas = ['alta', 'media', 'baja'];
    if (!prioridadesValidas.includes(prioridad)) {
        throw new Error('La prioridad debe ser alta, media o baja');
    }
    return true;
};