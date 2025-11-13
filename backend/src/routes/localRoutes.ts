import { Router } from "express";
import { LocalController } from "../controllers/LocalController";

const router = Router();
const controller = new LocalController();

router.post("/", controller.crear);
router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.put("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);

export default router;
