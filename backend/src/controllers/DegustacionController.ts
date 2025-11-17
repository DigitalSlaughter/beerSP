import { Request, Response } from "express";
import { DegustacionService } from "../services/DegustacionService";

const service = new DegustacionService();

export class DegustacionController {
  crear = async (req: Request, res: Response) => {
    console.log("[CREAR] Body recibido:", req.body);
    try {
      const degustacion = await service.crear(req.body);
      console.log("[CREAR] Degustación creada:", degustacion);
      res.status(201).json(degustacion);
    } catch (error) {
      console.error("[CREAR] Error al crear degustación:", error);
      res.status(400).json({ mensaje: "Error al crear degustación", error });
    }
  };

  listar = async (req: Request, res: Response) => {
    console.log("[LISTAR] Solicitud de lista de degustaciones");
    try {
      const degustaciones = await service.listar();
      console.log("[LISTAR] Degustaciones obtenidas:", degustaciones);
      res.json(degustaciones);
    } catch (error) {
      console.error("[LISTAR] Error al listar degustaciones:", error);
      res.status(500).json({ mensaje: "Error al listar degustaciones", error });
    }
  };

  obtener = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("[OBTENER] ID recibido:", id);
    try {
      const degustacion = await service.obtener(id);
      if (!degustacion) {
        console.warn("[OBTENER] Degustación no encontrada con ID:", id);
        return res.status(404).json({ mensaje: "Degustación no encontrada" });
      }
      console.log("[OBTENER] Degustación obtenida:", degustacion);
      res.json(degustacion);
    } catch (error) {
      console.error("[OBTENER] Error al obtener degustación:", error);
      res.status(500).json({ mensaje: "Error al obtener degustación", error });
    }
  };

  actualizar = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("[ACTUALIZAR] ID:", id, "Body:", req.body);
    try {
      const degustacion = await service.actualizar(id, req.body);
      if (!degustacion) {
        console.warn("[ACTUALIZAR] Degustación no encontrada con ID:", id);
        return res.status(404).json({ mensaje: "Degustación no encontrada" });
      }
      console.log("[ACTUALIZAR] Degustación actualizada:", degustacion);
      res.json(degustacion);
    } catch (error) {
      console.error("[ACTUALIZAR] Error al actualizar degustación:", error);
      res.status(500).json({ mensaje: "Error al actualizar degustación", error });
    }
  };

  eliminar = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("[ELIMINAR] ID recibido:", id);
    try {
      const eliminado = await service.eliminar(id);
      if (!eliminado) {
        console.warn("[ELIMINAR] Degustación no encontrada con ID:", id);
        return res.status(404).json({ mensaje: "Degustación no encontrada" });
      }
      console.log("[ELIMINAR] Degustación eliminada con ID:", id);
      res.json({ mensaje: "Degustación eliminada" });
    } catch (error) {
      console.error("[ELIMINAR] Error al eliminar degustación:", error);
      res.status(500).json({ mensaje: "Error al eliminar degustación", error });
    }
  };
}
