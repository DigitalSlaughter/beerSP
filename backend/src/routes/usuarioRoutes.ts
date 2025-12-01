import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { SolicitudAmistadController } from "../controllers/SolicitudAmistadController";
import { upload } from "../config/r2Multer";

const router = Router();
const usuarioController = new UsuarioController();
const solicitudController = new SolicitudAmistadController();

// ---------------------------
// RUTAS DE USUARIOS
// ---------------------------

// CRUD de usuarios
router.get("/", usuarioController.listarUsuarios);
router.post("/", upload.single("foto"), usuarioController.crearUsuario);
router.get("/:idUsuario", usuarioController.obtenerUsuario);
router.put("/:idUsuario", upload.single("foto"), usuarioController.actualizarUsuario);
router.delete("/:idUsuario", usuarioController.eliminarUsuario);

// Sub-recursos relacionados con usuario
router.get("/:idUsuario/degustaciones", usuarioController.listarDegustaciones);
router.get("/:idUsuario/galardones", usuarioController.obtenerGalardones);

// Verificación de cuenta
router.get("/verification/:token", usuarioController.verificarUsuario);
router.post("/verification/resend", usuarioController.reenviarVerificacion);

// ---------------------------
// SUB-RECURSOS: SOLICITUDES
// ---------------------------

// Listar solicitudes de un usuario (puedes filtrar por estado usando query param)
router.get("/:idUsuario/solicitudes", solicitudController.listar);

// Crear solicitud desde este usuario hacia otro
router.post("/:idUsuario/solicitudes", solicitudController.crear);

// Obtener, actualizar o eliminar solicitud específica
router.get("/:idUsuario/solicitudes/:idSolicitud", solicitudController.obtener);
router.put("/:idUsuario/solicitudes/:idSolicitud", solicitudController.actualizar);
router.delete("/:idUsuario/solicitudes/:idSolicitud", solicitudController.eliminar);

export default router;
