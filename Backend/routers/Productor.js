import { Router } from "express";
import {
  getAllProductores,
  getProductorById,
  updateProductor,
  deleteProductor,
} from "../controllers/Productor.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campo.js";
import {
  existeProductorPorId,
  existeEmail,
  existeCedula,
  esRegimenTributarioValido,
} from "../helpers/Productor.js";

const router = Router();

// GET todos los productores
router.get("/", validarJWT, getAllProductores);

// GET un productor por ID
router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductorPorId),
    validarCampos,
  ],
  getProductorById
);

// PUT actualizar productor por ID
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductorPorId),
    check("nombre_completo")
      .optional()
      .not()
      .isEmpty()
      .withMessage("El nombre no puede estar vacío si se proporciona"),
    check("email")
      .optional()
      .isEmail()
      .withMessage("El email debe ser válido")
      .custom(existeEmail),
    check("cedula")
      .optional()
      .not()
      .isEmpty()
      .withMessage("La cédula no puede estar vacía si se proporciona"),
    check("celular")
      .optional()
      .not()
      .isEmpty()
      .withMessage("El celular no puede estar vacío si se proporciona"),
    check("regimen_tributario").optional().custom(esRegimenTributarioValido),
    validarCampos,
  ],
  updateProductor
);

// DELETE eliminar productor por ID
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductorPorId),
    validarCampos,
  ],
  deleteProductor
);

export default router;
