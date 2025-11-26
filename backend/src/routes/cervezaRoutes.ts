import { Router } from "express";
import { CervezaController } from "../controllers/CervezaController";
import { upload } from "../config/r2Multer"; // Multer configurado para R2

const router = Router();
const controller = new CervezaController();

// POST con multer para recibir FormData
router.post("/", upload.single("foto"), controller.crear);
router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.put("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);

export default router;
