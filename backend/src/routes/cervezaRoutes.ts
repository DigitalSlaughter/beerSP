import { Router } from "express";
import { CervezaController } from "../controllers/CervezaController";

const router = Router();
const controller = new CervezaController();

router.post("/", controller.crear);
router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.put("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);

export default router;
