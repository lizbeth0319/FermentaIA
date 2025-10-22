import { Router } from 'express';
import * as MedicionController from '../controllers/Medicion.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campo.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { 
    existeMedicionPorId, 
    existeLote,
    esTemperaturaValida,
    esPHValido,
    esBrixValido 
} from '../helpers/Medicion.js';

const router = Router();

// Middleware común
router.use(validarJWT);

// GET todas las mediciones
router.get('/', MedicionController.getAllMediciones);

// GET mediciones por lote
router.get('/lote/:loteId', MedicionController.getMedicionesByLoteId);

// GET medición por ID
router.get('/:id', MedicionController.getMedicionById);

// POST nueva medición
router.post('/', [
    check('lote_id', 'ID de lote no válido')
        .isMongoId()
        .custom(existeLote),
    check('temperatura_c')
        .isNumeric()
        .custom(esTemperaturaValida),
    check('ph')
        .isNumeric()
        .custom(esPHValido),
    check('brix')
        .optional()  // Si no es obligatorio en tu caso
        .isNumeric()
        .custom(esBrixValido),
    check('texto_voz')
        .optional()
        .isString()
        .trim(),
    check('condiciones')
        .optional()
        .isString()
        .trim(),
    validarCampos
], MedicionController.createMedicion);
// PUT actualizar medición
router.put('/:id', [
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existeMedicionPorId),
    check('temperatura')
        .optional()
        .isNumeric()
        .custom(esTemperaturaValida),
    check('ph')
        .optional()
        .isNumeric()
        .custom(esPHValido),
    check('brix')
        .optional()
        .isNumeric()
        .custom(esBrixValido),
    check('observaciones')
        .optional()
        .isString()
        .trim(),
    validarCampos
], MedicionController.updateMedicion);

// DELETE eliminar medición
router.delete('/:id', MedicionController.deleteMedicion);

export default router;