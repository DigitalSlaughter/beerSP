import { deleteFromR2 } from "../files/r2Delete";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { DegustacionRepository } from "../repositories/DegustacionRepository";
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

      return guardado;
    } catch (error: any) {
      console.error("[UsuarioService] Error al crear usuario:", error.message);
      throw new Error("No se pudo crear el usuario: " + error.message);
    }
  }
  async listarDegustacionesUsuario(usuarioId: number) {
    const usuario = await UsuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) return null;

    const degustaciones = await DegustacionRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ["cerveza", "local"]
    });

    return degustaciones;
  }

  async obtenerUsuarioPorId(id: number): Promise<Usuario | null> {
    return await UsuarioRepository.findOne({
      where: { id },
      relations: ["degustaciones", "galardonesAsignados"]
    });
  }

  async actualizarUsuario(id: number, datos: Partial<Usuario>): Promise<Usuario | null> {
    const usuario = await this.obtenerUsuarioPorId(id);
    if (!usuario) return null;

    // Campos que nunca deben ser borrados
    const camposObligatorios = ["nombre_usuario", "correo"];

    // Si viene una nueva foto: borrar la anterior (si existía)
    if (datos.foto) {
      if (usuario.foto) {
        await deleteFromR2(usuario.foto);
      }
      usuario.foto = datos.foto; // asignar nueva key
    }

    // Recorrer todos los campos recibidos (excepto foto que ya tratamos)
    for (const key in datos) {
      if (
        Object.prototype.hasOwnProperty.call(datos, key) &&
        key !== "foto" // evitar procesar foto dos veces
      ) {
        if (!camposObligatorios.includes(key)) {
          (usuario as any)[key] = (datos as any)[key];
        }
      }
    }

    return await UsuarioRepository.save(usuario);
  }


  async eliminarUsuario(id: number): Promise<boolean> {
    const result = await UsuarioRepository.delete(id);
    return result.affected !== 0;
  }

  async listarUsuarios(): Promise<Usuario[]> {
    return await UsuarioRepository.find({
      relations: ["galardonesAsignados", "degustaciones"]
    });
  }


  // -----------------------------
  // VERIFICACIÓN DE CUENTA
  // -----------------------------
  private async enviarEmailVerificacion(correo: string, token: string) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Credenciales de correo no definidas.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const url = `http://localhost:5173/verify/${token}`;

    await transporter.sendMail({
      from: `"BeerSP" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Verifica tu cuenta",
      html: `
        <h2>Verificación de cuenta</h2>
        <p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
        <a href="${url}">${url}</a>
      `
    });
  }

  async verificarUsuario(token: string): Promise<Usuario> {
    const usuario = await UsuarioRepository.findOne({ where: { tokenVerificacion: token } });

    if (!usuario) {
      const yaVerificado = await UsuarioRepository.findOne({ where: { validada: true } });
      if (yaVerificado) return yaVerificado;
      throw new Error("Token inválido o expirado");
    }

    usuario.validada = true;
    usuario.tokenVerificacion = "";

    await UsuarioRepository.save(usuario);
    return usuario;
  }

  async reenviarEmailVerificacion(correo: string) {
    const usuario = await UsuarioRepository.findOne({ where: { correo } });

    if (!usuario) throw new Error("Usuario no encontrado");
    if (usuario.validada) throw new Error("El usuario ya está verificado");

    const token = crypto.randomBytes(32).toString("hex");

    usuario.tokenVerificacion = token;
    await UsuarioRepository.save(usuario);

    await this.enviarEmailVerificacion(usuario.correo!, token);
  }
  // Recuperar contraseña y enviarla por correo
async enviarContrasenaPorCorreo(correo: string): Promise<void> {
  const usuario = await UsuarioRepository.findOne({ where: { correo } });
  if (!usuario) throw new Error("Usuario no encontrado");
  if (!usuario.password) throw new Error("Usuario no tiene contraseña registrada");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Credenciales de correo no definidas.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"BeerSP" <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: "Recuperación de contraseña",
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Tu contraseña es: <strong>${usuario.password}</strong></p>
    `
  });
}

  
}
