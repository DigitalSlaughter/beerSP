import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import multer from "multer";

const router = Router();
const usuarioController = new UsuarioController();

// Configuración de multer para subir fotos
const upload = multer({ dest: "uploads/" }); // Puedes reemplazar "uploads/" con tu storage real

// Ruta de creación de usuario con foto opcional
router.post("/", upload.single("foto"), usuarioController.crearUsuario);
router.get("/:id", usuarioController.obtenerUsuario);
router.put("/:id", usuarioController.actualizarUsuario);
router.delete("/:id", usuarioController.eliminarUsuario);
router.get("/", usuarioController.listarUsuarios);

// Rutas de verificación
router.get("/verify/:token", usuarioController.verificarUsuario);
router.post("/verify/resend", usuarioController.reenviarVerificacion);

export default router;
