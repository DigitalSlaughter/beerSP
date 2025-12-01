// src/controllers/SolicitudAmistadController.ts
import { Request, Response } from "express";
import { SolicitudAmistadService } from "../services/SolicitudAmistadService";
import { generateSignedUrl } from "../files/r2SignedUrl";

const service = new SolicitudAmistadService();

export class SolicitudAmistadController {

listar = async (req: Request, res: Response) => {
  const idUsuario = Number(req.params.idUsuario);

  if (isNaN(idUsuario)) {
    return res.status(400).json({ mensaje: "ID de usuario inválido" });
  }

  try {
    const solicitudes = await service.listarPorUsuario(idUsuario);

    // Generar signed URL para el usuario amigo (distinto al idUsuario)
    const solicitudesConSignedUrl = await Promise.all(
      solicitudes.map(async (sol) => {
        const amigo = sol.usuario1.id === idUsuario ? sol.usuario2 : sol.usuario1;

        if (amigo.foto) {
          // Suponiendo que generateSignedUrl es una función que devuelve la URL firmada
          amigo.foto = await generateSignedUrl(amigo.foto);
        }

        return {
          ...sol,
          usuario1: sol.usuario1.id === idUsuario ? sol.usuario1 : amigo,
          usuario2: sol.usuario2.id === idUsuario ? sol.usuario2 : amigo,
        };
      })
    );

    res.json(solicitudesConSignedUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar solicitudes" });
  }
};


  crear = async (req: Request, res: Response) => {
    try {
      const usuario1Id = Number(req.params.idUsuario);
      const usuario2Id = Number(req.body.usuario2);

      if (!usuario2Id) {
        return res.status(400).json({ mensaje: "Debe indicar el usuario destinatario" });
      }

      if (usuario1Id === usuario2Id) {
        return res.status(400).json({ mensaje: "No puedes enviarte una solicitud a ti mismo." });
      }

      // ✔ Comprobar si ya existe relación (amistad o solicitud previa)
      const conflicto = await service.existeRelacion(usuario1Id, usuario2Id);

      if (conflicto) {
        return res.status(400).json({ mensaje: conflicto });
      }

      const solicitud = await service.crear({
        usuario1: { id: usuario1Id } as any,
        usuario2: { id: usuario2Id } as any
      });

      res.status(201).json(solicitud);

    } catch (error) {
      res.status(400).json({ mensaje: "Error al crear solicitud", error });
    }
  };

  obtener = async (req: Request, res: Response) => {
    const idSolicitud = Number(req.params.idSolicitud);

    const solicitud = await service.obtener(idSolicitud);
    if (!solicitud) return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    res.json(solicitud);
  };

  actualizar = async (req: Request, res: Response) => {
    const idUsuario = Number(req.params.idUsuario);
    const idSolicitud = Number(req.params.idSolicitud);
    const { estado_solicitud } = req.body;

    if (!["aceptada", "rechazada", "cancelada", "pendiente"].includes(estado_solicitud)) {
      return res.status(400).json({ mensaje: "Estado inválido" });
    }

    const resultado = await service.cambiarEstado(idSolicitud, idUsuario, estado_solicitud);

    if (!resultado.ok) {
      return res.status(400).json({ mensaje: resultado.mensaje });
    }

    res.json(resultado.solicitud);
  };

  eliminar = async (req: Request, res: Response) => {
    const idSolicitud = Number(req.params.idSolicitud);

    const eliminado = await service.eliminar(idSolicitud);
    if (!eliminado) return res.status(404).json({ mensaje: "Solicitud no encontrada" });

    res.json({ mensaje: "Solicitud eliminada" });
  };
}
