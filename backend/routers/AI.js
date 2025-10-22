import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { procesarChat, obtenerRecomendacion } from '../controllers/AIController.js';

const router = Router();

router.post('/chat', validarJWT, procesarChat);
router.post('/recomendacion', validarJWT, obtenerRecomendacion);

export default router;