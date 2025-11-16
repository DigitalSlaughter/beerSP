// src/services/UsuarioService.ts
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { Usuario } from "../models/Usuario";
import nodemailer from "nodemailer";
import crypto from "crypto";

export class UsuarioService {
  async crearUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
    console.log("[UsuarioService] Creando usuario:", usuario.correo);

    // Generar token de verificación
    const token = crypto.randomBytes(32).toString("hex");
    usuario.tokenVerificacion = token;
    usuario.validada = false;

    try {
      const nuevoUsuario = UsuarioRepository.create(usuario);
      const guardado = await UsuarioRepository.save(nuevoUsuario);

      console.log("[UsuarioService] Usuario creado en BD:", guardado.id);

      await this.enviarEmailVerificacion(guardado.correo!, token);

      console.log("[UsuarioService] Email de verificación enviado a:", guardado.correo);

      return guardado;
    } catch (error: any) {
      console.error("[UsuarioService] Error al crear usuario:", error.message);
      throw new Error("No se pudo crear el usuario: " + error.message);
    }
  }

  async obtenerUsuarioPorId(id: number): Promise<Usuario | null> {
    console.log("[UsuarioService] Obteniendo usuario ID:", id);

    return await UsuarioRepository.findOne({
      where: { id },
      relations: ["degustaciones"]
    });
  }

  async actualizarUsuario(id: number, datos: Partial<Usuario>): Promise<Usuario | null> {
    console.log("[UsuarioService] Actualizando usuario ID:", id);

    const usuario = await this.obtenerUsuarioPorId(id);
    if (!usuario) return null;

    UsuarioRepository.merge(usuario, datos);

    return await UsuarioRepository.save(usuario);
  }

  async eliminarUsuario(id: number): Promise<boolean> {
    console.log("[UsuarioService] Eliminando usuario ID:", id);

    const result = await UsuarioRepository.delete(id);
    return result.affected !== 0;
  }

  async listarUsuarios(): Promise<Usuario[]> {
    console.log("[UsuarioService] Listando usuarios...");

    return await UsuarioRepository.find({
      relations: ["galardones", "degustaciones"]
    });
  }

  // -----------------------------
  // VERIFICACIÓN DE CUENTA
  // -----------------------------
  private async enviarEmailVerificacion(correo: string, token: string) {
    console.log("[UsuarioService] Preparando envío de correo...");
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("[UsuarioService] ERROR: EMAIL_USER o EMAIL_PASS no están definidos.");
      throw new Error("El servidor no tiene configuradas las credenciales de correo.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const url = `http://localhost:5173/verify/${token}`;

    try {
      const info = await transporter.sendMail({
        from: `"BeerSP" <${process.env.EMAIL_USER}>`,
        to: correo,
        subject: "Verifica tu cuenta",
        html: `
        <h2>Verificación de cuenta</h2>
        <p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
        <a href="${url}">${url}</a>
      `
      });

      console.log("[UsuarioService] Correo enviado. ID:", info.messageId);

    } catch (error: any) {
      console.error("[UsuarioService] Error enviando correo:", error);
      throw new Error("No se pudo enviar el correo de verificación: " + error.message);
    }
  }


  async verificarUsuario(token: string): Promise<Usuario> {
    console.log("[UsuarioService] Verificando token:", token);

    const usuario = await UsuarioRepository.findOne({
      where: { tokenVerificacion: token }
    });

    if (!usuario) {

      // Buscar si el token ya fue usado (usuario ya verificado)
      const yaVerificado = await UsuarioRepository.findOne({
        where: { validada: true }
      });

      if (yaVerificado) {
        console.warn("[UsuarioService] Token ya usado, usuario ya verificado");
        return yaVerificado; // NO LANZA ERROR
      }

      // Si no existe un usuario verificado → token realmente inválido
      console.warn("[UsuarioService] Token inválido o expirado:", token);
      throw new Error("Token inválido o expirado");
    }

    usuario.validada = true;
    usuario.tokenVerificacion = "";

    await UsuarioRepository.save(usuario);

    console.log("[UsuarioService] Usuario verificado:", usuario.id);

    return usuario;
  }

  async reenviarEmailVerificacion(correo: string) {
    console.log("[UsuarioService] Reenviando verificación a:", correo);

    const usuario = await UsuarioRepository.findOne({ where: { correo } });

    if (!usuario) {
      console.warn("[UsuarioService] Usuario no encontrado:", correo);
      throw new Error("Usuario no encontrado");
    }

    if (usuario.validada) {
      console.warn("[UsuarioService] Usuario ya verificado:", correo);
      throw new Error("El usuario ya está verificado");
    }

    const token = crypto.randomBytes(32).toString("hex");

    usuario.tokenVerificacion = token;
    await UsuarioRepository.save(usuario);

    await this.enviarEmailVerificacion(usuario.correo!, token);

    console.log("[UsuarioService] Nuevo token generado y correo reenviado.");
  }
}
