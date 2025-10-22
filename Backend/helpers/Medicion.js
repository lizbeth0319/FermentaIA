import Medicion from '../models/Medicion.js';
import Lote from '../models/Lote.js';

// Verificar si existe una medición por ID
export const existeMedicionPorId = async (id) => {
    const medicion = await Medicion.findById(id);
    if (!medicion) {
        throw new Error(`La medición con id ${id} no existe`);
    }
};

// Verificar si existe el lote
export const existeLote = async (id) => {
    console.log(id)
    const lote = await Lote.findById(id);
    if (!lote) {
        throw new Error(`El lote con id ${id} no existe`);
    }
};

// Validar temperatura
export const esTemperaturaValida = (temperatura) => {
    if (temperatura < 0 || temperatura > 100) {
        throw new Error('La temperatura debe estar entre 0 y 100°C');
    }
    return true;
};

// Validar pH
export const esPHValido = (ph) => {
    if (ph < 0 || ph > 14) {
        throw new Error('El pH debe estar entre 0 y 14');
    }
    return true;
};

// Validar brix
export const esBrixValido = (brix) => {
    if (brix < 0 || brix > 100) {
        throw new Error('Los grados Brix deben estar entre 0 y 100');
    }
    return true;
};