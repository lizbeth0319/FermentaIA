import Tanque from '../models/Tanque.js';
import Finca from '../models/Finca.js';

// Verificar si existe un tanque por ID
export const existeTanquePorId = async (id) => {
    const tanque = await Tanque.findById(id);
    if (!tanque) {
        throw new Error(`El tanque con id ${id} no existe`);
    }
};

// Verificar si existe la finca
export const existeFinca = async (id) => {
    const finca = await Finca.findById(id);
    if (!finca) {
        throw new Error(`La finca con id ${id} no existe`);
    }
};

// Verificar si existe un código de tanque
export const existeCodigoTanque = async (codigo) => {
    const tanque = await Tanque.findOne({ codigo_tanque: codigo });
    if (tanque) {
        throw new Error(`Ya existe un tanque con el código ${codigo}`);
    }
};

// Validar capacidad del tanque
export const esCapacidadValida = (capacidad) => {
    if (capacidad <= 0) {
        throw new Error('La capacidad debe ser mayor a 0 kg');
    }
    return true;
};

// Validar estado del tanque
export const esEstadoValido = (estado) => {
    const estadosValidos = ['Activo', 'Inactivo', 'En Mantenimiento'];
    if (!estadosValidos.includes(estado)) {
        throw new Error('Estado no válido');
    }
    return true;
};