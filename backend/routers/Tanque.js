import { Router } from 'express';
import * as tanqueController from '../controllers/Tanque.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campo.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { 
    existeTanquePorId, 
    existeFinca,
    existeCodigoTanque,
    esCapacidadValida 
} from '../helpers/Tanque.js';

const router = Router();

router.use(validarJWT);

// GET todos los tanques
router.get('/', tanqueController.getAllTanques);

// GET tanques por finca
router.get('/finca/:fincaId', tanqueController.getTanquesByFinca);

// GET tanque por ID
router.get('/:id', tanqueController.getTanqueById);

// POST nuevo tanque
router.post('/', [
    check('finca_id', 'ID de finca no válido').isMongoId(),
    check('finca_id').custom(existeFinca),
    check('codigo_tanque', 'El código del tanque es obligatorio')
        .not().isEmpty()
        .custom(existeCodigoTanque),
    check('capacidad_kg')
        .isNumeric()
        .custom(esCapacidadValida),
    check('material', 'El material es obligatorio').not().isEmpty(),
    validarCampos
], tanqueController.createTanque);
// PUT actualizar tanque
router.put('/:id', [
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existeTanquePorId),
    check('codigo_tanque')
        .optional()
        .custom(existeCodigoTanque),
    check('capacidad_kg')
        .optional()
        .isNumeric()
        .custom(esCapacidadValida),
    check('material').optional().not().isEmpty(),
    validarCampos
], tanqueController.updateTanque);
// DELETE eliminar tanque
router.delete('/:id', tanqueController.deleteTanque);

export default router;