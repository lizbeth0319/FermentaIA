import PerfilIdeal from '../models/PerfilIdeal.js';

// Verificar si existe un perfil ideal por ID
export const existePerfilIdealPorId = async (id) => {
    const perfil = await PerfilIdeal.findById(id);
    if (!perfil) {
        throw new Error(`El perfil ideal con id ${id} no existe`);
    }
};

// Validar variedad
export const esVariedadValida = (variedad) => {
    const variedadesValidas = ['Castillo', 'Caturra', 'Colombia', 'Tabi', 'Geisha'];
    if (!variedadesValidas.includes(variedad)) {
        throw new Error('Variedad no válida');
    }
    return true;
};

// Validar proceso
export const esProcesoValido = (proceso) => {
    const procesosValidos = ['Lavado', 'Honey', 'Natural'];
    if (!procesosValidos.includes(proceso)) {
        throw new Error('Proceso no válido');
    }
    return true;
};

// Validar fase
export const esFaseValida = (fase) => {
    const fasesValidas = ['Inicial', 'Media', 'Final'];
    if (!fasesValidas.includes(fase)) {
        throw new Error('Fase no válida');
    }
    return true;
};

// Validar rango de temperatura
export const esTemperaturaValida = (temperatura) => {
    if (temperatura < 15 || temperatura > 40) {
        throw new Error('La temperatura debe estar entre 15°C y 40°C');
    }
    return true;
};

// Validar rango de pH
export const esPHValido = (ph) => {
    if (ph < 3 || ph > 7) {
        throw new Error('El pH debe estar entre 3 y 7');
    }
    return true;
};