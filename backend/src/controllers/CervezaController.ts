import { Request, Response } from "express";
import { CervezaService } from "../services/CervezaService";

const service = new CervezaService();

export class CervezaController {
  crear = async (req: Request, res: Response) => {
    try {
      console.log("REQ.BODY recibido en backend:", req.body);
      console.log("REQ.FILE recibido:", req.file);

      // Convierte los campos numéricos de string a number si es necesario
      const nuevaCerveza = {
        ...req.body,
        porcentaje_alcohol: req.body.porcentaje_alcohol ? Number(req.body.porcentaje_alcohol) : 0,
        amargor: req.body.amargor ? Number(req.body.amargor) : 0,
      };

      // Si quieres guardar la foto, req.file.buffer contiene el archivo en memoria
      if (req.file) {
        nuevaCerveza.foto = req.file.buffer.toString("base64"); // o súbelo a Firebase/Cloud
      }

      const cerveza = await service.crear(nuevaCerveza);

      res.status(201).json(cerveza);
    } catch (error: any) {
      console.error("Error al crear cerveza:", error);
      res.status(500).json({ mensaje: "Error al crear cerveza", error: error.message });
    }
  };

  listar = async (req: Request, res: Response) => {
    try {
      const cervezas = await service.listar();
      res.json(cervezas);
    } catch (error: any) {
      console.error("Error al listar cervezas:", error);
      res.status(500).json({ mensaje: "Error al listar cervezas", error });
    }
  };

  obtener = async (req: Request, res: Response) => {
    try {
      const cerveza = await service.obtener(Number(req.params.id));
      if (!cerveza) {
        return res.status(404).json({ mensaje: "Cerveza no encontrada" });
      }
      res.json(cerveza);
    } catch (error: any) {
      console.error("Error al obtener cerveza:", error);
      res.status(500).json({
        mensaje: "Error al obtener cerveza",
        error: error.message,
      });
    }
  };

  actualizar = async (req: Request, res: Response) => {
    try {
      console.log("REQ.BODY actualizar:", req.body);

      const cerveza = await service.actualizar(Number(req.params.id), req.body);

      if (!cerveza) {
        return res.status(404).json({ mensaje: "Cerveza no encontrada" });
      }

      res.json(cerveza);
    } catch (error: any) {
      console.error("Error al actualizar cerveza:", error);
      res.status(500).json({
        mensaje: "Error al actualizar cerveza",
        error: error.message,
      });
    }
  };

  eliminar = async (req: Request, res: Response) => {
    try {
      const eliminado = await service.eliminar(Number(req.params.id));
      if (!eliminado) {
        return res.status(404).json({ mensaje: "Cerveza no encontrada" });
      }
      res.json({ mensaje: "Cerveza eliminada" });
    } catch (error: any) {
      console.error("Error al eliminar cerveza:", error);
      res.status(500).json({
        mensaje: "Error al eliminar cerveza",
        error: error.message,
      });
    }
  };
}
