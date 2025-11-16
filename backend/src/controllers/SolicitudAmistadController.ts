import { Request, Response } from "express";
import { SolicitudAmistadService } from "../services/SolicitudAmistadService";

const service = new SolicitudAmistadService();

export class SolicitudAmistadController {
  crear = async (req: Request, res: Response) => {
    try {
      const solicitud = await service.crear(req.body);
      res.status(201).json(solicitud);
    } catch (error) {
      res.status(400).json({ mensaje: "Error al crear solicitud", error });
    }
  };

  listar = async (req: Request, res: Response) => {
    const solicitudes = await service.listar();
    res.json(solicitudes);
  };

  obtener = async (req: Request, res: Response) => {
    const solicitud = await service.obtener(Number(req.params.id));
    if (!solicitud) return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    res.json(solicitud);
  };

  actualizar = async (req: Request, res: Response) => {
    const solicitud = await service.actualizar(Number(req.params.id), req.body);
    if (!solicitud) return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    res.json(solicitud);
  };

  eliminar = async (req: Request, res: Response) => {
    const eliminado = await service.eliminar(Number(req.params.id));
    if (!eliminado) return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    res.json({ mensaje: "Solicitud eliminada" });
  };
}
