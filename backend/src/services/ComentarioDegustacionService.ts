import { ComentarioDegustacionRepository } from "../repositories/ComentarioDegustacionRepository";
import { DegustacionRepository } from "../repositories/DegustacionRepository";
import { UsuarioRepository } from "../repositories/UsuarioRepository";

export class ComentarioDegustacionService {

  async crear(data: { degustacionId: number; usuarioId: number; texto: string }) {
    const degustacion = await DegustacionRepository.findOne({
      where: { id: data.degustacionId },
      relations: ["comentarios"]
    });

    if (!degustacion) throw new Error("Degustación no encontrada");

    const usuario = await UsuarioRepository.findOne({
      where: { id: data.usuarioId }
    });

    if (!usuario) throw new Error("Usuario no encontrado");

    const comentario = ComentarioDegustacionRepository.create({
      texto: data.texto,
      usuario,
      degustacion
    });

    return await ComentarioDegustacionRepository.save(comentario);
  }

  async listarPorDegustacion(degustacionId: number) {
    return await ComentarioDegustacionRepository.find({
      where: { degustacion: { id: degustacionId } },
      relations: ["usuario"],
      order: { fecha: "ASC" }
    });
  }
}
