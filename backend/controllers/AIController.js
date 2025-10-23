import AIService from '../services/AIService.js';

export const procesarChat = async (req, res) => {
  try {
    const { mensaje, message } = req.body;
    const inputMessage = mensaje || message;
    const respuesta = await AIService.processChatRequest(inputMessage);
    res.json(respuesta);
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al procesar el chat',
      error: error.message
    });
  }
};

export const obtenerRecomendacion = async (req, res) => {
  try {
    const medicionData = req.body;
    const recomendacion = await AIService.processRecomendacion(medicionData);
    res.json(recomendacion);
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener recomendación',
      error: error.message
    });
  }
};