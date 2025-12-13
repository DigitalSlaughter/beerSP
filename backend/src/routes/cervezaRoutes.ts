import { Router } from "express";
import { CervezaController } from "../controllers/CervezaController";
import { upload } from "../config/r2Multer"; // Multer configurado para R2

const router = Router();
const controller = new CervezaController();

// POST con multer para recibir FormData
router.post("/", upload.single("foto"), controller.crear.bind(controller));
router.get("/", controller.listar.bind(controller));
router.get("/:id", controller.obtener.bind(controller));
router.put("/:id", controller.actualizar.bind(controller));
router.delete("/:id", controller.eliminar.bind(controller));

export default router;
