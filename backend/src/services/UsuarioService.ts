// src/services/UsuarioService.ts
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { Usuario } from "../models/Usuario";

export class UsuarioService {
  async crearUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
    const nuevoUsuario = UsuarioRepository.create(usuario);
    return await UsuarioRepository.save(nuevoUsuario);
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
}
