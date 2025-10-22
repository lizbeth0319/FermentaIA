import { Router } from 'express';
import * as perfilIdealController from '../controllers/PerfilIdeal.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campo.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import {
    existePerfilIdealPorId,
    esVariedadValida,
    esProcesoValido,
    esFaseValida,
    esTemperaturaValida,
    esPHValido
} from '../helpers/PerfilIdeal.js';

const router = Router();

// Middleware común para todas las rutas
router.use(validarJWT);


// GET todos los perfiles ideales
router.get('/', perfilIdealController.getAllPerfilesIdeales);

// GET por combinación variedad + proceso + fase
router.get('/buscar', perfilIdealController.buscarPerfilesIdeales);

// GET por ID
router.get('/:id', perfilIdealController.getPerfilIdealById);

// POST nuevo perfil
router.post('/', [
    check('variedad').custom(esVariedadValida),
    check('proceso').custom(esProcesoValido),
    check('fase').custom(esFaseValida),
    check('temperatura_ideal').custom(esTemperaturaValida),
    check('ph_ideal').custom(esPHValido),
    check('brix_ideal', 'Los grados Brix deben estar entre 0 y 100')
        .isFloat({ min: 0, max: 100 }),
    validarCampos
], perfilIdealController.createPerfilIdeal);

// PUT actualizar perfil
router.put('/:id', [
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existePerfilIdealPorId),
    check('variedad').optional().custom(esVariedadValida),
    check('proceso').optional().custom(esProcesoValido),
    check('fase').optional().custom(esFaseValida),
    check('temperatura_ideal').optional().custom(esTemperaturaValida),
    check('ph_ideal').optional().custom(esPHValido),
    check('brix_ideal').optional().isFloat({ min: 0, max: 100 }),
    validarCampos
], perfilIdealController.updatePerfilIdeal);
// DELETE perfil
router.delete('/:id', perfilIdealController.deletePerfilIdeal);

export default router;