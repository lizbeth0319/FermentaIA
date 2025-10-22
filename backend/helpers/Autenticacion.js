import Productor from '../models/Productor.js';

// Verificar si existe email
export const emailExiste = async (email) => {
    const existente = await Productor.findOne({ email: email.toLowerCase() });
    if (existente) {
        throw new Error('El email ya está registrado');
    }
    return true;
};

// Verificar si existe cédula
export const cedulaExiste = async (cedula) => {
    if (cedula < 1000000 || cedula > 9999999999) {
        throw new Error('La cédula debe tener entre 7 y 10 dígitos');
    }
    const existente = await Productor.findOne({ cedula });
    if (existente) {
        throw new Error('La cédula ya está registrada');
    }
    return true;
};

// Validar régimen tributario
export const esRegimenValido = (regimen) => {
    const regimenesValidos = ['Responsable de IVA',"Régimen Ordinario","Régimen Simple", 'No responsable de IVA'];
    if (!regimenesValidos.includes(regimen)) {
        throw new Error('Régimen tributario no válido');
    }
    return true;
};

// Validar formato de celular
export const esCelularValido = (celular) => {
    if (!/^3[0-9]{9}$/.test(celular.toString())) {
        throw new Error('El celular debe empezar con 3 y tener 10 dígitos');
    }
    return true;
};

// Validar formato de teléfono fijo
export const esTelefonoFijoValido = (telefono) => {
    if (telefono && !/^\([1-8]\)[0-9]{7}$/.test(telefono)) {
        throw new Error('El formato del teléfono fijo debe ser (X)XXXXXXX');
    }
    return true;
};