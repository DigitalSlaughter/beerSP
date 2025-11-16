import { Request, Response } from "express";
import { CervezaService } from "../services/CervezaService";

const service = new CervezaService();

export class CervezaController {
  crear = async (req: Request, res: Response) => {
    try {
      const cerveza = await service.crear(req.body);
      res.status(201).json(cerveza);
    } catch (error) {
      res.status(400).json({ mensaje: "Error al crear cerveza", error });
    }
  };

  listar = async (req: Request, res: Response) => {
    const cervezas = await service.listar();
    res.json(cervezas);
  };

  obtener = async (req: Request, res: Response) => {
    const cerveza = await service.obtener(Number(req.params.id));
    if (!cerveza) return res.status(404).json({ mensaje: "Cerveza no encontrada" });
    res.json(cerveza);
  };

  actualizar = async (req: Request, res: Response) => {
    const cerveza = await service.actualizar(Number(req.params.id), req.body);
    if (!cerveza) return res.status(404).json({ mensaje: "Cerveza no encontrada" });
    res.json(cerveza);
  };

  eliminar = async (req: Request, res: Response) => {
    const eliminado = await service.eliminar(Number(req.params.id));
    if (!eliminado) return res.status(404).json({ mensaje: "Cerveza no encontrada" });
    res.json({ mensaje: "Cerveza eliminada" });
  };
}
