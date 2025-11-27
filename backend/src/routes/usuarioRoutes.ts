import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { upload } from "../config/r2Multer"; // Multer configurado para R2

const router = Router();
const usuarioController = new UsuarioController();

// Ruta de creación de usuario con foto opcional
router.post("/", upload.single("foto"), usuarioController.crearUsuario);

// Listar degustaciones de un usuario
router.get("/:id/degustaciones", usuarioController.listarDegustaciones);

// Obtener galardones de usuario
router.get("/:id/galardones", usuarioController.obtenerGalardones);

// Obtener usuario por ID
router.get("/:id", usuarioController.obtenerUsuario);

// Actualizar usuario con foto opcional
router.put("/:id", upload.single("foto"), usuarioController.actualizarUsuario);

// Eliminar usuario
router.delete("/:id", usuarioController.eliminarUsuario);

// Listar todos los usuarios
router.get("/", usuarioController.listarUsuarios);

// Rutas de verificación de cuenta
router.get("/verify/:token", usuarioController.verificarUsuario);
router.post("/verify/resend", usuarioController.reenviarVerificacion);

export default router;
