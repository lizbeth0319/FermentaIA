import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { procesarChat, obtenerRecomendacion } from '../controllers/AIController.js';

const router = Router();

// Endpoints protegidos con autenticación
router.post('/chat', validarJWT, procesarChat);
router.post('/recomendacion', validarJWT, obtenerRecomendacion);

// Endpoints de prueba sin autenticación (solo para testing)
router.post('/test/chat', procesarChat);
router.post('/test/recomendacion', obtenerRecomendacion);

export default router;