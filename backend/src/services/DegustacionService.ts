import { DegustacionRepository } from "../repositories/DegustacionRepository";
import { Degustacion } from "../models/Degustacion";

export class DegustacionService {
  async crear(degustacion: Partial<Degustacion>): Promise<Degustacion> {
    const nueva = DegustacionRepository.create(degustacion);
    return await DegustacionRepository.save(nueva);
  }

  async listar(): Promise<Degustacion[]> {
    return await DegustacionRepository.find({ relations: ["usuario", "cerveza"] });
  }

  async obtener(id: number): Promise<Degustacion | null> {
    return await DegustacionRepository.findOne({ where: { id }, relations: ["usuario", "cerveza"] });
  }

  async actualizar(id: number, datos: Partial<Degustacion>): Promise<Degustacion | null> {
    const degustacion = await this.obtener(id);
    if (!degustacion) return null;
    DegustacionRepository.merge(degustacion, datos);
    return await DegustacionRepository.save(degustacion);
  }

  async eliminar(id: number): Promise<boolean> {
    const result = await DegustacionRepository.delete(id);
    return result.affected !== 0;
  }
}
