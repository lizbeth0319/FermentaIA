import Productor from "../models/Productor.js";
import bcrypt from "bcryptjs";
import { generarJWT } from "../middlewares/generar-jwt.js";

export const registerUser = async (req, res) => {
  try {
    const { 
      nombre_completo,
      cedula,
      celular,
      telefono_fijo,
      email,
      regimen_tributario,
      contrasena 
    } = req.body;

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(contrasena, salt);

    // Crear nuevo productor
    const nuevoProductor = new Productor({
      nombre_completo,
      cedula,
      celular,
      telefono_fijo,
      email,
      regimen_tributario,
      contrasena: hashPassword
    });

    // Guardar productor
    const productorGuardado = await nuevoProductor.save();

    // Crear objeto de respuesta
    const productorResponse = {
      id: productorGuardado._id,
      nombre_completo: productorGuardado.nombre_completo,
      email: productorGuardado.email,
      regimen_tributario: productorGuardado.regimen_tributario,
      celular: productorGuardado.celular
    };

    console.log('Productor registrado exitosamente');
    res.status(201).json({
      success: true,
      message: 'Productor creado exitosamente',
      data: productorResponse
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(400).json({
      success: false,
      message: 'Error al registrar el productor',
      error: error.message
    });
  }
};

export const loginUser = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        // Verificar si existe el productor
        const productor = await Productor.findOne({ email });
        if (!productor) {
            return res.status(400).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const passwordValida = await bcrypt.compare(contrasena, productor.contrasena);
        if (!passwordValida) {
            return res.status(400).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        try {
            // Generar token usando el ID del productor
            const token = await generarJWT(productor._id);

            return res.json({
                success: true,
                productor: {
                    id: productor._id,
                    nombre: productor.nombre_completo,
                    email: productor.email,
                    regimen_tributario: productor.regimen_tributario
                },
                token
            });

        } catch (tokenError) {
            console.error('Error al generar token:', tokenError);
            return res.status(500).json({
                success: false,
                message: 'Error al generar el token de autenticación'
            });
        }

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};