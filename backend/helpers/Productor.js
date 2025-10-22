import Productor from '../models/Productor.js';

// Verificar si existe un productor por ID
export const existeProductorPorId = async (id) => {
    const productor = await Productor.findById(id);
    if (!productor) {
        throw new Error(`El productor con id ${id} no existe`);
    }
};

// Verificar si existe un email
export const existeEmail = async (email) => {
    const existeEmail = await Productor.findOne({ email });
    if (existeEmail) {
        throw new Error(`El email ${email} ya está registrado`);
    }
};

// Verificar si existe una cédula
export const existeCedula = async (cedula) => {
    const existeCedula = await Productor.findOne({ cedula });
    if (existeCedula) {
        throw new Error(`La cédula ${cedula} ya está registrada`);
    }
};

// Validar régimen tributario
export const esRegimenTributarioValido = (regimen) => {
    const regimenesValidos = ['Común', 'Simplificado'];
    if (!regimenesValidos.includes(regimen)) {
        throw new Error(`El régimen tributario ${regimen} no es válido`);
    }
    return true;
};