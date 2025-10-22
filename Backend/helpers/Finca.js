import Finca from '../models/Finca.js';
import Productor from '../models/Productor.js';

// Verificar si existe una finca por ID
export const existeFincaPorId = async (id) => {
    const finca = await Finca.findById(id);
    if (!finca) {
        throw new Error(`La finca con id ${id} no existe`);
    }
};

// Verificar si existe el productor
export const existeProductor = async (id) => {
    const productor = await Productor.findById(id);
    if (!productor) {
        throw new Error(`El productor con id ${id} no existe`);
    }
};

// Validar altitud
export const esAltitudValida = (altitud) => {
    if (altitud < 0 || altitud > 5000) {
        throw new Error('La altitud debe estar entre 0 y 5000 metros sobre el nivel del mar');
    }
    return true;
};

// Validar CIIU (Código de 4 dígitos)
export const esCIIUValido = (ciiu) => {
    if (!/^\d{3}$/.test(ciiu)) {
        throw new Error('El código CIIU debe ser un número de 3 dígitos');
    }
    return true;
};