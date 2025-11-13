// src/controllers/UsuarioController.ts
import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

const usuarioService = new UsuarioService();

export class UsuarioController {
  async crearUsuario(req: Request, res: Response) {
    try {
      const usuario = await usuarioService.crearUsuario(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ mensaje: "Error al crear usuario", error });
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
}
