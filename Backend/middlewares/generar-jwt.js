import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generarJWT = (email) => {
    return new Promise((resolve, reject) => {
        const payload = { email };
        
        if (!process.env.JWT_SECRET) {
            reject(new Error('No se ha configurado la clave secreta JWT'));
            return;
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '4h' },
            (err, token) => {
                if (err) {
                    console.error('Error al generar token:', err);
                    reject('No se pudo generar el token');
                } else {
                    resolve(token);
                }
            }
        );
    });
};