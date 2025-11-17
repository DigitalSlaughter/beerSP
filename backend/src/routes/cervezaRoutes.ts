import { Router } from "express";
import { CervezaController } from "../controllers/CervezaController";
import multer from "multer";

const router = Router();
const controller = new CervezaController();

// Configuración de multer (memoria o disco)
const upload = multer({ dest: "uploads/" }); // Puedes reemplazar "uploads/" con tu storage real

// POST con multer para recibir FormData
router.post("/", upload.single("foto"), controller.crear);
router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.put("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);

export default router;
