// src/services/AuthService.ts
import { AppDataSource } from "../config/db";
import { Usuario } from "../models/Usuario";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_super_secreta";

export class AuthService {
  private usuarioRepo = AppDataSource.getRepository(Usuario);

  async login(email: string, password: string) {
    console.log("[AuthService] Login solicitado para:", email);

    const usuario = await this.usuarioRepo.findOne({
      where: { correo: email }
    });

    if (!usuario) {
      console.warn("[AuthService] Usuario no encontrado:", email);
      throw new Error("Usuario no encontrado");
    }

    // Comprobar si la cuenta está validada
    if (!usuario.validada) {
      console.warn("[AuthService] Cuenta NO validada:", email);
      throw new Error("La cuenta no está verificada. Revisa tu correo electrónico.");
    }

    // Verificación de contraseña
    if (usuario.password !== password) {
      console.warn("[AuthService] Contraseña incorrecta para:", email);
      throw new Error("Contraseña incorrecta");
    }

    // Crear JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("[AuthService] Login correcto. Usuario ID:", usuario.id);

    return {
      mensaje: "Login exitoso",
      token,
      usuario
    };
  }
}
