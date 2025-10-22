import { Router } from 'express';
import * as controladorSincronizacion from '../controllers/Sincronizacion.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campo.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import {
    existeSincronizacionPorId,
    existeLote,
    existeMedicion,
    esEstadoSyncValido
} from '../helpers/Sincronizacion.js';

const router = Router();

// Middleware común
router.use(validarJWT);

// GET todas las sincronizaciones
router.get('/', controladorSincronizacion.getAllSincronizaciones);

// GET por medición
router.get('/medicion/:medicionId', controladorSincronizacion.getSincronizacionesByMedicion);

// GET por lote
router.get('/lote/:loteId', controladorSincronizacion.getSincronizacionesByLote);

// GET por ID
router.get('/:id', controladorSincronizacion.getSincronizacionById);

// POST nueva sincronización
router.post('/', [
    check('lote_id', 'ID de lote no válido')
        .isMongoId()
        .custom(existeLote),
    check('medicion_id', 'ID de medición no válido')
        .isMongoId()
        .custom(existeMedicion),
    check('estado_sync')
        .not().isEmpty()
        .custom(esEstadoSyncValido),
    check('fecha_sync')
        .optional()
        .isISO8601()
        .withMessage('Formato de fecha inválido'),
    validarCampos
], controladorSincronizacion.createSincronizacion);

// PUT actualizar sincronización
router.put('/:id', [
    check('id', 'ID no válido')
        .isMongoId()
        .custom(existeSincronizacionPorId),
    check('estado_sync')
        .optional()
        .custom(esEstadoSyncValido),
    check('fecha_sync')
        .optional()
        .isISO8601()
        .withMessage('Formato de fecha inválido'),
    validarCampos
], controladorSincronizacion.updateSincronizacion);

// DELETE sincronización
router.delete('/:id', controladorSincronizacion.deleteSincronizacion);

export default router;