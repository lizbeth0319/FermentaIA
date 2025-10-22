import jwt from "jsonwebtoken";
import "dotenv/config";
import Productor from "../models/Productor.js";

export const validarJWT = async (req, res, next) => {
    try {
        const token = req.header("x-token");
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No se proporcionó token de autenticación"
            });
        }

        try {
            const { email } = jwt.verify(token, process.env.JWT_SECRET);
            
            try {
                const productor = await Productor.findOne({ email })
                    .maxTimeMS(5000); // Timeout de 5 segundos
                
                if (!productor) {
                    return res.status(401).json({
                        success: false,
                        message: "Token no válido - productor no encontrado"
                    });
                }

                if (productor.estado === false) {
                    return res.status(401).json({
                        success: false,
                        message: "Token no válido - productor inactivo"
                    });
                }

                req.productor = productor;
                next();

            } catch (dbError) {
                console.error('Error en consulta a DB:', dbError);
                return res.status(500).json({
                    success: false,
                    message: "Error de conexión con la base de datos"
                });
            }

        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                message: jwtError.name === 'TokenExpiredError' 
                    ? "El token ha expirado"
                    : "Token no válido"
            });
        }

    } catch (error) {
        console.error('Error en validación JWT:', error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
};
