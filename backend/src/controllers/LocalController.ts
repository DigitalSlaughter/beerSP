import { Request, Response } from "express";
import { LocalService } from "../services/LocalService";

const service = new LocalService();

export class LocalController {
  crear = async (req: Request, res: Response) => {
    try {
      const local = await service.crear(req.body);
      res.status(201).json(local);
    } catch (error) {
      res.status(400).json({ mensaje: "Error al crear local", error });
    }
  };

  listar = async (req: Request, res: Response) => {
    const locales = await service.listar();
    res.json(locales);
  };

  obtener = async (req: Request, res: Response) => {
    const local = await service.obtener(Number(req.params.id));
    if (!local) return res.status(404).json({ mensaje: "Local no encontrado" });
    res.json(local);
  };

  actualizar = async (req: Request, res: Response) => {
    const local = await service.actualizar(Number(req.params.id), req.body);
    if (!local) return res.status(404).json({ mensaje: "Local no encontrado" });
    res.json(local);
  };

  eliminar = async (req: Request, res: Response) => {
    const eliminado = await service.eliminar(Number(req.params.id));
    if (!eliminado) return res.status(404).json({ mensaje: "Local no encontrado" });
    res.json({ mensaje: "Local eliminado" });
  };
}
