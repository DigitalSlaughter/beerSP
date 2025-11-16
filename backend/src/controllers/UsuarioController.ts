// src/controllers/UsuarioController.ts
import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

const usuarioService = new UsuarioService();

export class UsuarioController {
  async crearUsuario(req: Request, res: Response) {
    console.log("[UsuarioController] Petición para crear usuario:", req.body);

    try {
      const usuario = await usuarioService.crearUsuario(req.body);

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
    console.log("[UsuarioController] Obteniendo usuario ID:", req.params.id);

    const { id } = req.params;
    const usuario = await usuarioService.obtenerUsuarioPorId(Number(id));

    if (!usuario) {
      console.warn("[UsuarioController] Usuario no encontrado:", id);

      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(usuario);
  }

  async actualizarUsuario(req: Request, res: Response) {
    console.log("[UsuarioController] Actualizando usuario ID:", req.params.id);

    const { id } = req.params;
    const usuario = await usuarioService.actualizarUsuario(Number(id), req.body);

    if (!usuario) {
      console.warn("[UsuarioController] Usuario no encontrado:", id);

      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(usuario);
  }

  async eliminarUsuario(req: Request, res: Response) {
    console.log("[UsuarioController] Eliminando usuario ID:", req.params.id);

    const { id } = req.params;
    const eliminado = await usuarioService.eliminarUsuario(Number(id));

    if (!eliminado) {
      console.warn("[UsuarioController] Usuario no encontrado:", id);

      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado" });
  }

  async listarUsuarios(req: Request, res: Response) {
    console.log("[UsuarioController] Listando usuarios...");

    const usuarios = await usuarioService.listarUsuarios();
    res.json(usuarios);
  }

  // -----------------------------
  // VERIFICACIÓN DE CUENTA
  // -----------------------------
  async verificarUsuario(req: Request, res: Response) {
    const { token } = req.params;

    console.log("[UsuarioController] Verificando usuario con token:", token);

    try {
      const usuario = await usuarioService.verificarUsuario(token);

      console.log("[UsuarioController] Usuario verificado:", usuario.id);

      res.json({
        mensaje: "Cuenta verificada correctamente",
        usuario
      });
    } catch (error: any) {
      console.error("[UsuarioController] Error verificando token:", error.message);

      res.status(400).json({
        mensaje: "Error al verificar la cuenta",
        error: error.message
      });
    }
  }

  async reenviarVerificacion(req: Request, res: Response) {
    const { correo } = req.body;

    console.log("[UsuarioController] Reenviar verificación a:", correo);

    try {
      await usuarioService.reenviarEmailVerificacion(correo);

      console.log("[UsuarioController] Email reenviado correctamente a:", correo);

      res.json({ mensaje: "Correo de verificación enviado correctamente" });
    } catch (error: any) {
      console.error("[UsuarioController] Error reenviando verificación:", error.message);

      res.status(400).json({
        mensaje: "No se pudo enviar el correo de verificación",
        error: error.message
      });
    }
  }
}
