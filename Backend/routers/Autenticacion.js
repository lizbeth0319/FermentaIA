import { Router } from "express";
import { registerUser, loginUser } from "../controllers/Autenticacion.js";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validar-campo.js';
import { 
    emailExiste, 
    cedulaExiste, 
    esRegimenValido,
    esCelularValido,
    esTelefonoFijoValido 
} from "../helpers/Autenticacion.js";

const router = Router();

// Ruta de registro con validaciones
router.post("/register", [
    check('nombre_completo')
        .not().isEmpty().withMessage('El nombre es obligatorio')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    check('cedula')
        .not().isEmpty().withMessage('La cédula es obligatoria')
        .isNumeric().withMessage('La cédula debe ser numérica')
        .custom(cedulaExiste),
    check('celular')
        .not().isEmpty().withMessage('El celular es obligatorio')
        .isNumeric().withMessage('El celular debe ser numérico')
        .custom(esCelularValido),
    check('telefono_fijo')
        .optional()
        .custom(esTelefonoFijoValido),
    check('email')
        .not().isEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email válido')
        .custom(emailExiste),
    check('regimen_tributario')
        .not().isEmpty().withMessage('El régimen tributario es obligatorio')
        .custom(esRegimenValido),
    check('contrasena')
        .not().isEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    validarCampos
], registerUser);

// Ruta de login con validaciones
router.post("/login", [
    check('email')
        .not().isEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email válido'),
    check('contrasena')
        .not().isEmpty().withMessage('La contraseña es obligatoria'),
    validarCampos
], loginUser);

export default router;