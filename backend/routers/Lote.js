import { Router } from 'express';
import * as loteController from '../controllers/Lote.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campo.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { 
    existeLotePorId, 
    existeTanque, 
    esProcesoValido,
    esEstadoValido 
} from '../helpers/Lote.js';

const router = Router();

// Middleware común para todas las rutas
router.use(validarJWT);

// GET todos los lotes
router.get('/', loteController.getAllLotes);

// GET lotes por tanque
router.get('/tanque/:tanqueId', loteController.getLotesByTanque);

// GET lote por ID
router.get('/:id', loteController.getLoteById);

// POST nuevo lote
router.post('/', [
    check('tanque_id', 'ID de tanque no válido').isMongoId(),
    check('tanque_id').custom(existeTanque),
    check('variedad', 'La variedad es obligatoria').not().isEmpty(),
    check('proceso').custom(esProcesoValido),
    check('fecha_inicio', 'Fecha de inicio no válida').isISO8601(),
    check('horas_estimadas', 'Las horas estimadas son requeridas').isNumeric(),
    check('cantidad_kg', 'La cantidad en kg es requerida').isNumeric(),
    check('estado').custom(esEstadoValido),
    check('premium_porcentaje')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('El porcentaje premium debe estar entre 0 y 100'),
    validarCampos
], loteController.createLote);

// PUT actualizar lote
router.put('/:id', [
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existeLotePorId),
    check('variedad').optional().not().isEmpty(),
    check('proceso').optional().custom(esProcesoValido),
    check('fecha_inicio').optional().isISO8601(),
    check('horas_estimadas').optional().isNumeric(),
    check('cantidad_kg').optional().isNumeric(),
    check('estado').optional().custom(esEstadoValido),
    check('premium_porcentaje')
        .optional()
        .isFloat({ min: 0, max: 100 }),
    validarCampos
], loteController.updateLote);

// DELETE eliminar lote
router.delete('/:id', loteController.deleteLote);

export default router;