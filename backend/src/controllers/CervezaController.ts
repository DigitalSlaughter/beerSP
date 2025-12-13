import { Request, Response } from "express";
import { CervezaService } from "../services/CervezaService";
import { generateSignedUrl } from "../files/r2SignedUrl";


export class CervezaController {
   constructor(
    private service = new CervezaService()
  ) {}
  crear = async (req: Request, res: Response) => {
    try {
      // Convierte los campos numéricos de string a number si es necesario
      const nuevaCerveza = {
        ...req.body,
        porcentaje_alcohol: req.body.porcentaje_alcohol ? Number(req.body.porcentaje_alcohol) : 0,
        amargor: req.body.amargor ? Number(req.body.amargor) : 0,
      };

      // Si quieres guardar la foto, req.file.buffer contiene el archivo en memoria
      if (req.file) {
        nuevaCerveza.foto = (req.file as any).key; // Guardamos el key, no la URL
      }
      const cerveza = await this.service.crear(nuevaCerveza);

      res.status(201).json(cerveza);
    } catch (error: any) {
      console.error("Error al crear cerveza:", error);
      res.status(400).json({ mensaje: "Error al crear cerveza", error: error.message });
    }
  };

  listar = async (req: Request, res: Response) => {
    try {
      const cervezas = await this.service.listar();

      // --- INICIO DE LA MODIFICACIÓN ---
      // Usamos Promise.all para esperar a que todas las URLs se generen
      const cervezasConUrl = await Promise.all(
        cervezas.map(async (cerveza) => {
          if (cerveza.foto) {
            // Devolvemos un nuevo objeto con la propiedad 'foto' actualizada
            return {
              ...cerveza,
              foto: await generateSignedUrl(cerveza.foto)
            };
          }
          return cerveza; // Devuelve la cerveza sin cambios si no tiene foto
        })
      );
      // --- FIN DE LA MODIFICACIÓN ---

      res.json(cervezasConUrl); // Enviamos la lista ya procesada
    } catch (error: any) {
      console.error("Error al listar cervezas:", error);
      res.status(400).json({ mensaje: "Error al listar cervezas", error });
    }
  };

  obtener = async (req: Request, res: Response) => {
    try {
      const cerveza = await this.service.obtener(Number(req.params.id));
      if (!cerveza) {
        return res.status(404).json({ mensaje: "Cerveza no encontrada" });
      }
      if (cerveza.foto) {
        cerveza.foto = await generateSignedUrl(cerveza.foto);
      }
      res.json(cerveza);
    } catch (error: any) {
      console.error("Error al obtener cerveza:", error);
      res.status(400).json({
        mensaje: "Error al obtener cerveza",
        error: error.message,
      });
    }
  };

  actualizar = async (req: Request, res: Response) => {
    try {
      console.log("REQ.BODY actualizar:", req.body);

      const cerveza = await this.service.actualizar(Number(req.params.id), req.body);

      if (!cerveza) {
        return res.status(404).json({ mensaje: "Cerveza no encontrada" });
      }

      res.json(cerveza);
    } catch (error: any) {
      console.error("Error al actualizar cerveza:", error);
      res.status(400).json({
        mensaje: "Error al actualizar cerveza",
        error: error.message,
      });
    }
  };

  eliminar = async (req: Request, res: Response) => {
    try {
      const eliminado = await this.service.eliminar(Number(req.params.id));
      if (!eliminado) {
        return res.status(404).json({ mensaje: "Cerveza no encontrada" });
      }
      res.json({ mensaje: "Cerveza eliminada" });
    } catch (error: any) {
      console.error("Error al eliminar cerveza:", error);
      res.status(400).json({
        mensaje: "Error al eliminar cerveza",
        error: error.message,
      });
    }
  };
}
