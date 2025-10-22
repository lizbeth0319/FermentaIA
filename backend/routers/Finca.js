import { Router } from 'express';
import * as fincaController from '../controllers/Finca.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campo.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { 
    existeFincaPorId, 
    existeProductor, 
    esAltitudValida,
    esCIIUValido 
} from '../helpers/Finca.js';

const router = Router();

// Middleware común para todas las rutas
router.use(validarJWT);

// GET todas las fincas
router.get('/', fincaController.getAllFincas);

// GET fincas por productor
router.get('/productor/:productorId', [
    check('productorId', 'ID de productor no válido').isMongoId(),
    check('productorId').custom(existeProductor),
    validarCampos
], fincaController.getFincasByProductor);

// GET finca por ID
router.get('/:id', [
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existeFincaPorId),
    validarCampos
], fincaController.getFincaById);

// POST nueva finca
router.post('/', [
    check('productor_id', 'ID de productor no válido').isMongoId(),
    check('productor_id').custom(existeProductor),
    check('nombre_finca', 'El nombre de la finca es obligatorio').not().isEmpty(),
    check('departamento', 'El departamento es obligatorio').not().isEmpty(),
    check('municipio', 'El municipio es obligatorio').not().isEmpty(),
    check('vereda', 'La vereda es obligatoria').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    check('nit', 'El NIT es obligatorio').not().isEmpty(),
    check('ciiu', 'El código CIIU es obligatorio').custom(esCIIUValido),
    check('altitud_ms_nm', 'La altitud es obligatoria').isNumeric().custom(esAltitudValida),
    validarCampos
], fincaController.createFinca);

// PUT actualizar finca
router.put('/:id', [
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existeFincaPorId),
    check('nombre_finca').optional().not().isEmpty(),
    check('departamento').optional().not().isEmpty(),
    check('municipio').optional().not().isEmpty(),
    check('vereda').optional().not().isEmpty(),
    check('direccion').optional().not().isEmpty(),
    check('nit').optional().not().isEmpty(),
    check('ciiu').optional().custom(esCIIUValido),
    check('altitud_ms_nm').optional().isNumeric().custom(esAltitudValida),
    validarCampos
], fincaController.updateFinca);

// DELETE eliminar finca
router.delete('/:id', [
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existeFincaPorId),
    validarCampos
], fincaController.deleteFinca);

export default router;