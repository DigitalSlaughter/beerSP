import { SolicitudAmistadRepository } from "../repositories/SolicitudAmistadRepository";
import { SolicitudAmistad } from "../models/SolicitudAmistad";

export class SolicitudAmistadService {
  async crear(solicitud: Partial<SolicitudAmistad>): Promise<SolicitudAmistad> {
    const nueva = SolicitudAmistadRepository.create(solicitud);
    return await SolicitudAmistadRepository.save(nueva);
  }

  async listar(): Promise<SolicitudAmistad[]> {
    return await SolicitudAmistadRepository.find({ relations: ["usuario1", "usuario2"] });
  }

  async obtener(id: number): Promise<SolicitudAmistad | null> {
    return await SolicitudAmistadRepository.findOne({ where: { id }, relations: ["usuario1", "usuario2"] });
  }

  async actualizar(id: number, datos: Partial<SolicitudAmistad>): Promise<SolicitudAmistad | null> {
    const solicitud = await this.obtener(id);
    if (!solicitud) return null;
    SolicitudAmistadRepository.merge(solicitud, datos);
    return await SolicitudAmistadRepository.save(solicitud);
  }

  async eliminar(id: number): Promise<boolean> {
    const result = await SolicitudAmistadRepository.delete(id);
    return result.affected !== 0;
  }
}
