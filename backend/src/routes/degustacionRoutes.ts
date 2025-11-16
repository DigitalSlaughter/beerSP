import { Router } from "express";
import { DegustacionController } from "../controllers/DegustacionController";

const router = Router();
const controller = new DegustacionController();

router.post("/", controller.crear);
router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.put("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);

export default router;
