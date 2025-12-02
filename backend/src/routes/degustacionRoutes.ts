import { Router } from "express";
import { DegustacionController } from "../controllers/DegustacionController";

const router = Router();
const controller = new DegustacionController();

router.get("/:idDegustacion/comentarios", controller.listarComentarios);
router.get("/:idDegustacion", controller.obtener);
router.get("/", controller.listar);
router.post("/:idDegustacion/comentarios", controller.crearComentario);
router.post("/", controller.crear);
router.put("/:idDegustacion", controller.actualizar);
router.delete("/:idDegustacion", controller.eliminar);

export default router;
