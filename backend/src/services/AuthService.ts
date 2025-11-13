// src/services/AuthService.ts
import { AppDataSource } from "../config/db";
import { Usuario } from "../models/Usuario";
import jwt from "jsonwebtoken";

const JWT_SECRET = "tu_clave_secreta"; // Mejor en variables de entorno

export class AuthService {
  private usuarioRepo = AppDataSource.getRepository(Usuario);

  async login(email: string, password: string) {
    const usuario = await this.usuarioRepo.findOneBy({ correo: email });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // Comparación directa de contraseña en texto plano
    if (usuario.contraseña !== password) {
      throw new Error("Contraseña incorrecta");
    }

    // Crear JWT
    const token = jwt.sign(
      { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return { token, usuario };
  }
}
