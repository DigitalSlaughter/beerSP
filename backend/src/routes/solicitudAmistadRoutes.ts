import { Router } from "express";
import { SolicitudAmistadController } from "../controllers/SolicitudAmistadController";

const router = Router();
const controller = new SolicitudAmistadController();

router.post("/", controller.crear);
router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.put("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);

export default router;
