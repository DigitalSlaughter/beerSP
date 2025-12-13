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
router.get("/", usuarioController.listarUsuarios.bind(usuarioController));
router.post("/", upload.single("foto"), usuarioController.crearUsuario.bind(usuarioController));
router.get("/:idUsuario", usuarioController.obtenerUsuario.bind(usuarioController));
router.put("/:idUsuario", upload.single("foto"), usuarioController.actualizarUsuario.bind(usuarioController));
router.delete("/:idUsuario", usuarioController.eliminarUsuario.bind(usuarioController));

// Sub-recursos relacionados con usuario
router.get("/:idUsuario/degustaciones", usuarioController.listarDegustaciones.bind(usuarioController));
router.get("/:idUsuario/galardones", usuarioController.obtenerGalardones.bind(usuarioController));

// Verificación de cuenta
router.get("/verification/:token", usuarioController.verificarUsuario.bind(usuarioController));
router.post("/verification/resend", usuarioController.reenviarVerificacion.bind(usuarioController));
router.post("/password/recovery", usuarioController.recuperarContrasena.bind(usuarioController));

// ---------------------------
// SUB-RECURSOS: SOLICITUDES
// ---------------------------

// Listar solicitudes de un usuario (puedes filtrar por estado usando query param)
router.get("/:idUsuario/solicitudes", solicitudController.listar.bind(solicitudController));

// Crear solicitud desde este usuario hacia otro
router.post("/:idUsuario/solicitudes", solicitudController.crear.bind(solicitudController));

// Obtener, actualizar o eliminar solicitud específica
router.get("/:idUsuario/solicitudes/:idSolicitud", solicitudController.obtener.bind(solicitudController));
router.put("/:idUsuario/solicitudes/:idSolicitud", solicitudController.actualizar.bind(solicitudController));
router.delete("/:idUsuario/solicitudes/:idSolicitud", solicitudController.eliminar.bind(solicitudController));

export default router;
