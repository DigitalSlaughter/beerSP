import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

const usuarioService = new UsuarioService();

export class UsuarioController {
  async crearUsuario(req: Request, res: Response) {
    try {
      // Tomamos los campos del body
      const usuarioData = { ...req.body };

      // Si hay foto subida por multer
      if (req.file) {
        usuarioData.foto = req.file.path; // o tu uploader a Firebase/S3
      }

      console.log("[UsuarioController] Petición para crear usuario:", usuarioData);

      const usuario = await usuarioService.crearUsuario(usuarioData);

      console.log("[UsuarioController] Usuario creado correctamente:", usuario.id);

      res.status(201).json(usuario);
    } catch (error: any) {
      console.error("[UsuarioController] Error creando usuario:", error.message);

      res.status(400).json({
        mensaje: "Error al crear usuario",
        error: error.message
      });
    }
  }

  async obtenerUsuario(req: Request, res: Response) {
    const { id } = req.params;
    const usuario = await usuarioService.obtenerUsuarioPorId(Number(id));

    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json(usuario);
  }

  async actualizarUsuario(req: Request, res: Response) {
    const { id } = req.params;
    const usuario = await usuarioService.actualizarUsuario(Number(id), req.body);

    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

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
}
