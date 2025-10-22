import { Router } from 'express';
import * as recomendacionController from '../controllers/Recomendacion.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campo.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import {
    existeRecomendacionPorId,
    existeLote,
    existeMedicion,
    esPrioridadValida
} from '../helpers/Recomendacion.js';

const router = Router();

// Middleware común para todas las rutas
router.use(validarJWT);
// GET todas las recomendaciones
router.get('/', recomendacionController.getAllRecomendaciones);

// GET por medición
router.get('/medicion/:medicionId', recomendacionController.getRecomendacionesByMedicion);

// GET por lote
router.get('/lote/:loteId', recomendacionController.getRecomendacionesByLote);

// GET por ID
router.get('/:id', recomendacionController.getRecomendacionById);

// POST nueva recomendación
router.post('/', [
    check('lote_id', 'ID de lote no válido')
        .isMongoId()
        .custom(existeLote),
    check('medicion_id', 'ID de medición no válido')
        .isMongoId()
        .custom(existeMedicion),
    check('diagnostico')
        .not().isEmpty()
        .withMessage('El diagnóstico es obligatorio')
        .isLength({ min: 10 })
        .withMessage('El diagnóstico debe tener al menos 10 caracteres'),
    check('accion')
        .not().isEmpty()
        .withMessage('La acción es obligatoria')
        .isLength({ min: 10 })
        .withMessage('La acción debe tener al menos 10 caracteres'),
    check('prioridad')
        .not().isEmpty()
        .custom(esPrioridadValida),
    validarCampos
], recomendacionController.createRecomendacion);

// PUT actualizar recomendación
router.put('/:id', [
    check('id', 'ID no válido')
        .isMongoId()
        .custom(existeRecomendacionPorId),
    check('diagnostico')
        .optional()
        .isLength({ min: 10 })
        .withMessage('El diagnóstico debe tener al menos 10 caracteres'),
    check('accion')
        .optional()
        .isLength({ min: 10 })
        .withMessage('La acción debe tener al menos 10 caracteres'),
    check('prioridad')
        .optional()
        .custom(esPrioridadValida),
    validarCampos
], recomendacionController.updateRecomendacion);

// DELETE
router.delete('/:id', recomendacionController.deleteRecomendacion);

export default router;