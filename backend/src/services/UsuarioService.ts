// src/services/UsuarioService.ts
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { Usuario } from "../models/Usuario";
import nodemailer from "nodemailer";
import crypto from "crypto";

export class UsuarioService {
  async crearUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
    // Crear token de verificación
    const token = crypto.randomBytes(32).toString("hex");
    usuario.tokenVerificacion = token;
    usuario.validada = false;

    const nuevoUsuario = UsuarioRepository.create(usuario);
    const guardado = await UsuarioRepository.save(nuevoUsuario);

    // Enviar email de verificación
    await this.enviarEmailVerificacion(guardado.correo!, token);

    return guardado;
  }

  async obtenerUsuarioPorId(id: number): Promise<Usuario | null> {
    return await UsuarioRepository.findOne({ where: { id }, relations: ["degustaciones"] });
  }

  async actualizarUsuario(id: number, datos: Partial<Usuario>): Promise<Usuario | null> {
    const usuario = await this.obtenerUsuarioPorId(id);
    if (!usuario) return null;

    UsuarioRepository.merge(usuario, datos);
    return await UsuarioRepository.save(usuario);
  }

  async eliminarUsuario(id: number): Promise<boolean> {
    const result = await UsuarioRepository.delete(id);
    return result.affected !== 0;
  }

  async listarUsuarios(): Promise<Usuario[]> {
    return await UsuarioRepository.find({ relations: ["galardones", "degustaciones"] });
  }

  // -----------------------------
  // VERIFICACIÓN
  // -----------------------------

  private async enviarEmailVerificacion(correo: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail", // puedes usar otro
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const url = `http://localhost:5173/verify/${token}`; // URL de frontend

    await transporter.sendMail({
      from: `"BeerSP" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Verifica tu cuenta",
      html: `<p>Haz clic en el enlace para verificar tu cuenta:</p><a href="${url}">${url}</a>`
    });
  }

  async verificarUsuario(token: string): Promise<Usuario> {
    const usuario = await UsuarioRepository.findOne({ where: { tokenVerificacion: token } });
    if (!usuario) throw new Error("Token inválido");

    usuario.validada = true;
    usuario.tokenVerificacion = ""; // eliminar token
    return await UsuarioRepository.save(usuario);
  }

  async reenviarEmailVerificacion(correo: string) {
    const usuario = await UsuarioRepository.findOne({ where: { correo } });
    if (!usuario) throw new Error("Usuario no encontrado");
    if (usuario.validada) throw new Error("Usuario ya verificado");

    const token = crypto.randomBytes(32).toString("hex");
    usuario.tokenVerificacion = token;
    await UsuarioRepository.save(usuario);

    await this.enviarEmailVerificacion(usuario.correo!, token);
  }
}
