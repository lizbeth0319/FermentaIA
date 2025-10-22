import jwt from "jsonwebtoken";
import Productor from "../models/Productor.js";

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No hay token en la petición"
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar el productor por ID
        const productor = await Productor.findById(id);
        
        if (!productor) {
            return res.status(401).json({
                success: false,
                message: "Token no válido - productor no existe"
            });
        }

        // Agregar el productor a la request
        req.productor = productor;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Token no válido"
        });
    }
};
