// src/services/SolicitudAmistadService.ts
import { SolicitudAmistadRepository } from "../repositories/SolicitudAmistadRepository";
import { SolicitudAmistad } from "../models/SolicitudAmistad";

export class SolicitudAmistadService {

  // -------------------------------
  // VALIDACIÓN ANTES DE CREAR
  // -------------------------------
  async existeRelacion(usuario1Id: number, usuario2Id: number): Promise<string | null> {
    const solicitudes = await SolicitudAmistadRepository.find({
      where: [
        { usuario1: { id: usuario1Id }, usuario2: { id: usuario2Id } },
        { usuario1: { id: usuario2Id }, usuario2: { id: usuario1Id } },
      ],
    });

    if (solicitudes.length === 0) return null;

    const solicitud = solicitudes[0];

    if (solicitud.estado_solicitud === "pendiente") {
      return "Ya existe una solicitud pendiente entre estos usuarios.";
    }

    if (solicitud.estado_solicitud === "aceptada") {
      return "Ya sois amigos.";
    }

    return "Ya existe una solicitud previa entre estos usuarios.";
  }

  // -------------------------------
  // CRUD
  // -------------------------------
  async crear(solicitud: Partial<SolicitudAmistad>): Promise<SolicitudAmistad> {
    const nueva = SolicitudAmistadRepository.create({
      ...solicitud,
      estado_solicitud: "pendiente",
    });
    return await SolicitudAmistadRepository.save(nueva);
  }

  async listarPorUsuario(idUsuario: number): Promise<SolicitudAmistad[]> {
    return await SolicitudAmistadRepository.find({
      where: [
        { usuario1: { id: idUsuario } as any },
        { usuario2: { id: idUsuario } as any }
      ],
      relations: ["usuario1", "usuario2"],
    });
  }

  async obtener(id: number): Promise<SolicitudAmistad | null> {
    return await SolicitudAmistadRepository.findOne({
      where: { id },
      relations: ["usuario1", "usuario2"],
    });
  }

  // -------------------------------
  // CAMBIAR ESTADO (aceptar/rechazar)
  // -------------------------------
  async cambiarEstado(
    idSolicitud: number,
    idUsuario: number,
    estadoNuevo: string
  ): Promise<{ ok: boolean; mensaje?: string; status?: number; solicitud?: SolicitudAmistad }> {

    const solicitud = await this.obtener(idSolicitud);
    if (!solicitud) {
      return { ok: false, mensaje: "Solicitud no encontrada", status: 404 };
    }

    // Solo el destinatario puede aceptar/rechazar
    if (solicitud.usuario2.id !== idUsuario) {
      return { ok: false, mensaje: "No puedes modificar esta solicitud", status: 403 };
    }

    solicitud.estado_solicitud = estadoNuevo;
    await SolicitudAmistadRepository.save(solicitud);

    return { ok: true, solicitud };
  }

  async eliminar(id: number): Promise<boolean> {
    const result = await SolicitudAmistadRepository.delete(id);
    return result.affected !== 0;
  }
}
