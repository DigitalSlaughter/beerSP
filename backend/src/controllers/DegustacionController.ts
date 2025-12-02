import { Request, Response } from "express";
import { DegustacionService } from "../services/DegustacionService";
import { GalardonService } from "../services/GalardonService";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { ComentarioDegustacionService } from "../services/ComentarioDegustacionService";

const comentarioService = new ComentarioDegustacionService();
const service = new DegustacionService();
const galardonService = new GalardonService();

export class DegustacionController {
  crear = async (req: Request, res: Response) => {
    console.log("[CREAR] Body recibido:", req.body);
    try {
      // 1. Crear la degustación
      const degustacion = await service.crear(req.body);
      console.log("[CREAR] Degustación creada:", degustacion);

      // 2. Obtener usuario con degustaciones, cervezas y galardones asignados
      const usuario = await UsuarioRepository.findOne({
        where: { id: degustacion.usuario.id },
        relations: ["degustaciones", "degustaciones.cerveza", "galardonesAsignados"]
      });

      if (!usuario) {
        console.warn("[CREAR] Usuario no encontrado para galardón");
        return res.status(404).json({ mensaje: "Usuario no encontrado para galardón" });
      }

      // 3. Contar degustaciones únicas por cerveza
      const cervezasUnicas = new Set(usuario.degustaciones.map(d => d.cerveza.id));
      const cantidadCervezas = cervezasUnicas.size;

      // 4. Contar países únicos de degustación (para otro galardón)
      const paisesUnicos = new Set(usuario.degustaciones.map(d => d.pais_degustacion));
      const cantidadPaises = paisesUnicos.size;

      // 5. Asignar o actualizar galardón de primera degustación
      const galardonPrimera = galardonService.obtenerGalardonDef("primera_degustacion");
      if (galardonPrimera) {
        const nivel = galardonService.calcularNivel(usuario.degustaciones.length, galardonPrimera);
        await galardonService.asignarGalardon(usuario, "primera_degustacion", nivel);
      }

      // 6. Asignar o actualizar galardón "cervezas_distintas" según cervezas únicas
      const galardonCervezas = galardonService.obtenerGalardonDef("cervezas_distintas");
      if (galardonCervezas) {
        const nivel = galardonService.calcularNivel(cantidadCervezas, galardonCervezas);
        await galardonService.asignarGalardon(usuario, "cervezas_distintas", nivel);
      }

      // 7. Asignar o actualizar galardón "paises_distintos" según países únicos
      const galardonPaises = galardonService.obtenerGalardonDef("paises_distintos");
      if (galardonPaises) {
        const nivel = galardonService.calcularNivel(cantidadPaises, galardonPaises);
        await galardonService.asignarGalardon(usuario, "paises_distintos", nivel);
      }
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
  listarComentarios = async (req: Request, res: Response) => {
  const degustacionId = Number(req.params.idDegustacion);

  try {
    const comentarios = await comentarioService.listarPorDegustacion(degustacionId);
    res.json(comentarios);
  } catch (error: any) {
    console.error("[LISTAR_COMENTARIOS] Error:", error);
    res.status(400).json({ mensaje: error.message });
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
  crearComentario = async (req: Request, res: Response) => {
    const degustacionId = Number(req.params.idDegustacion);
    const { usuarioId, texto } = req.body;

    try {
      const comentario = await comentarioService.crear({
        degustacionId,
        usuarioId,
        texto
      });

      res.status(201).json(comentario);
    } catch (error: any) {
      console.error("[CREAR_COMENTARIO] Error:", error);
      res.status(400).json({ mensaje: error.message });
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
