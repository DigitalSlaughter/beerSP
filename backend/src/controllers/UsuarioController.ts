import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";
import { generateSignedUrl } from "../files/r2SignedUrl";
import { GalardonService } from "../services/GalardonService";
import { UsuarioRepository } from "../repositories/UsuarioRepository";

const galardonService = new GalardonService();
const usuarioService = new UsuarioService();

export class UsuarioController {
  async crearUsuario(req: Request, res: Response) {
    try {
      // 1. Tomamos los campos del body
      const usuarioData = { ...req.body };

      // 2. Si hay foto subida por multer
      if (req.file) {
        usuarioData.foto = (req.file as any).key; // Guardamos el key, no la URL
      }

      console.log("[UsuarioController] Petición para crear usuario:", usuarioData);

      // 3. Crear usuario
      const usuario = await usuarioService.crearUsuario(usuarioData);

      // 4. Asignar galardón de creación de cuenta
      await galardonService.asignarGalardonEvento(usuario, "crear_cuenta");

      // 5. Recargar usuario con galardones para devolverlo completo
      const usuarioConGalardones = await UsuarioRepository.findOne({
        where: { id: usuario.id },
        relations: ["galardonesAsignados"]
      });

      console.log("[UsuarioController] Usuario creado correctamente:", usuario.id);

      res.status(201).json(usuarioConGalardones);
    } catch (error: any) {
      console.error("[UsuarioController] Error creando usuario:", error.message);

      res.status(400).json({
        mensaje: "Error al crear usuario",
        error: error.message
      });
    }
  }

  async listarDegustaciones(req: Request, res: Response) {
    console.log("[listarDegustaciones] req.params:", req.params);
    console.log("[listarDegustaciones] req.url:", req.url);
    console.log("[listarDegustaciones] req.method:", req.method);

    const usuarioId = Number(req.params.id); // Debe coincidir con :id en la ruta
    console.log("[listarDegustaciones] usuarioId convertido a Number:", usuarioId);

    if (isNaN(usuarioId)) {
      console.warn("[listarDegustaciones] ID de usuario inválido");
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }

    try {
      const degustaciones = await usuarioService.listarDegustacionesUsuario(usuarioId);

      if (!degustaciones) {
        console.warn("[listarDegustaciones] Usuario no encontrado con ID:", usuarioId);
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      console.log("[listarDegustaciones] Degustaciones obtenidas:", degustaciones.length);
      res.json(degustaciones);
    } catch (error: any) {
      console.error("[listarDegustaciones] Error al listar degustaciones:", error);
      res.status(500).json({ mensaje: "Error al listar degustaciones", error: error.message });
    }
  }

  async obtenerUsuario(req: Request, res: Response) {
    const { id } = req.params;
    const usuario = await usuarioService.obtenerUsuarioPorId(Number(id));

    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    // Si tiene foto almacenada, generamos URL firmada
    if (usuario.foto) {
      usuario.foto = await generateSignedUrl(usuario.foto);
    }

    res.json(usuario);
  }

  async actualizarUsuario(req: Request, res: Response) {
    const { id } = req.params;
    const datos: any = { ...req.body };

    // Nueva imagen subida → guardar la nueva key
    if (req.file) {
      datos.foto = (req.file as any).key;
    }

    const usuario = await usuarioService.actualizarUsuario(Number(id), datos);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Generar signed URL si tiene foto
    if (usuario.foto) {
      usuario.foto = await generateSignedUrl(usuario.foto);
    }

    res.json(usuario);
  }


  async eliminarUsuario(req: Request, res: Response) {
    const { id } = req.params;
    const eliminado = await usuarioService.eliminarUsuario(Number(id));

    if (!eliminado) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json({ mensaje: "Usuario eliminado" });
  }

  async listarUsuarios(req: Request, res: Response) {
    const usuarios = await usuarioService.listarUsuarios();
    res.json(usuarios);
  }

  // -----------------------------
  // VERIFICACIÓN DE CUENTA
  // -----------------------------
  async verificarUsuario(req: Request, res: Response) {
    const { token } = req.params;

    try {
      const usuario = await usuarioService.verificarUsuario(token);

      res.json({
        mensaje: "Cuenta verificada correctamente",
        usuario
      });
    } catch (error: any) {
      res.status(400).json({
        mensaje: "Error al verificar la cuenta",
        error: error.message
      });
    }
  }

  async reenviarVerificacion(req: Request, res: Response) {
    const { correo } = req.body;

    try {
      await usuarioService.reenviarEmailVerificacion(correo);

      res.json({ mensaje: "Correo de verificación enviado correctamente" });
    } catch (error: any) {
      res.status(400).json({
        mensaje: "No se pudo enviar el correo de verificación",
        error: error.message
      });
    }
  }
  async obtenerGalardones(req: Request, res: Response) {
    const usuarioId = Number(req.params.id);

    if (isNaN(usuarioId)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }

    try {
      const usuario = await UsuarioRepository.findOne({
        where: { id: usuarioId },
        relations: {
          degustaciones: {
            local: true,
            cerveza: true
          },
          comentariosDegustacion: true,
          galardonesAsignados: true
        }
      });

      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      // ← NUEVO: evitar undefined
      const asignados = usuario.galardonesAsignados ?? [];

      // ← progreso real basado en relaciones cargadas
      const progresoReal = await galardonService.obtenerProgresoActual(usuario);

      const catalogo = galardonService.getCatalogo();

      const respuesta = catalogo.map((g) => {
        const asignado = asignados.find((ag) => ag.galardonId === g.id);

        const cantidadReal = progresoReal[g.id] ?? 0;

        // progreso hacia siguiente nivel
        const progreso = galardonService.calcularProgreso(cantidadReal, g);

        return {
          id: g.id,
          nombre: g.nombre,
          descripcion: g.descripcion,
          niveles: g.niveles,

          // Nivel guardado en BD
          nivelAlmacenado: asignado ? asignado.nivel : 0,

          // Nivel calculado con su progreso real
          nivelCalculado: progreso.nivelActual,

          // Fecha de obtención del nivel guardado
          fecha_obtencion: asignado ? asignado.fecha_obtencion : null,

          // Datos del progreso
          ...progreso
        };
      });

      res.json(respuesta);

    } catch (error: any) {
      console.error("[obtenerGalardones] Error:", error);
      res.status(500).json({
        mensaje: "Error al obtener galardones",
        error: error.message
      });
    }
  }



}
