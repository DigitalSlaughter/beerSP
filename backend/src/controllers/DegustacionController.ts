import { Request, Response } from "express";
import { DegustacionService } from "../services/DegustacionService";

const service = new DegustacionService();

export class DegustacionController {
  crear = async (req: Request, res: Response) => {
    try {
      const degustacion = await service.crear(req.body);
      res.status(201).json(degustacion);
    } catch (error) {
      res.status(400).json({ mensaje: "Error al crear degustación", error });
    }
  };

  listar = async (req: Request, res: Response) => {
    const degustaciones = await service.listar();
    res.json(degustaciones);
  };

  obtener = async (req: Request, res: Response) => {
    const degustacion = await service.obtener(Number(req.params.id));
    if (!degustacion) return res.status(404).json({ mensaje: "Degustación no encontrada" });
    res.json(degustacion);
  };

  actualizar = async (req: Request, res: Response) => {
    const degustacion = await service.actualizar(Number(req.params.id), req.body);
    if (!degustacion) return res.status(404).json({ mensaje: "Degustación no encontrada" });
    res.json(degustacion);
  };

  eliminar = async (req: Request, res: Response) => {
    const eliminado = await service.eliminar(Number(req.params.id));
    if (!eliminado) return res.status(404).json({ mensaje: "Degustación no encontrada" });
    res.json({ mensaje: "Degustación eliminada" });
  };
}
