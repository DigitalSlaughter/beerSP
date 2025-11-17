import { DegustacionRepository } from "../repositories/DegustacionRepository";
import { Degustacion } from "../models/Degustacion";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { CervezaRepository } from "../repositories/CervezaRepository";
import { LocalRepository } from "../repositories/LocalRepository";

export class DegustacionService {
  // Crear una nueva degustación
  async crear(data: any): Promise<Degustacion> {
    // Buscar entidades relacionadas
    const usuario = await UsuarioRepository.findOne({ where: { id: data.usuarioId } });
    const cerveza = await CervezaRepository.findOne({ where: { id: data.cervezaId } });
    const local = await LocalRepository.findOne({ where: { id: data.localId } });

    if (!usuario || !cerveza || !local) {
      throw new Error("Usuario, cerveza o local no encontrados");
    }

    // Crear la degustación con las relaciones correctas
    const nueva = DegustacionRepository.create({
      usuario,
      cerveza,
      local,
      puntuacion: data.puntuacion,
      comentario: data.comentario,
      pais_degustacion: data.pais_degustacion,
      me_gusta: data.me_gusta
    });

    return await DegustacionRepository.save(nueva);
  }

  // Listar todas las degustaciones con relaciones
  async listar(): Promise<Degustacion[]> {
    return await DegustacionRepository.find({
      relations: ["usuario", "cerveza", "local"]
    });
  }

  // Obtener una degustación por ID con relaciones
  async obtener(id: number): Promise<Degustacion | null> {
    return await DegustacionRepository.findOne({
      where: { id },
      relations: ["usuario", "cerveza", "local"]
    });
  }

  // Actualizar una degustación existente
  async actualizar(id: number, datos: Partial<Degustacion>): Promise<Degustacion | null> {
    const degustacion = await this.obtener(id);
    if (!degustacion) return null;

    // Si se proporcionan nuevos IDs de relaciones, cargar las entidades correspondientes
    if ((datos as any).usuarioId) {
      const usuario = await UsuarioRepository.findOne({ where: { id: (datos as any).usuarioId } });
      if (!usuario) throw new Error("Usuario no encontrado");
      degustacion.usuario = usuario;
    }
    if ((datos as any).cervezaId) {
      const cerveza = await CervezaRepository.findOne({ where: { id: (datos as any).cervezaId } });
      if (!cerveza) throw new Error("Cerveza no encontrada");
      degustacion.cerveza = cerveza;
    }
    if ((datos as any).localId) {
      const local = await LocalRepository.findOne({ where: { id: (datos as any).localId } });
      if (!local) throw new Error("Local no encontrado");
      degustacion.local = local;
    }

    DegustacionRepository.merge(degustacion, datos);
    return await DegustacionRepository.save(degustacion);
  }

  // Eliminar una degustación
  async eliminar(id: number): Promise<boolean> {
    const result = await DegustacionRepository.delete(id);
    return result.affected !== 0;
  }
}
