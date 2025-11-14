// src/routes/usuarioRoutes.ts
import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";

const router = Router();
const usuarioController = new UsuarioController();

router.post("/", usuarioController.crearUsuario);
router.get("/:id", usuarioController.obtenerUsuario);
router.put("/:id", usuarioController.actualizarUsuario);
router.delete("/:id", usuarioController.eliminarUsuario);
router.get("/", usuarioController.listarUsuarios);

// Rutas de verificación
router.get("/verify/:token", usuarioController.verificarUsuario);
router.post("/verify/resend", usuarioController.reenviarVerificacion);

export default router;
