import { CervezaRepository } from "../repositories/CervezaRepository";
import { Cerveza } from "../models/Cerveza";

export class CervezaService {
  async crear(cerveza: Partial<Cerveza>): Promise<Cerveza> {
    const nueva = CervezaRepository.create(cerveza);
    return await CervezaRepository.save(nueva);
  }

  async listar(): Promise<Cerveza[]> {
    return await CervezaRepository.find({ relations: ["degustaciones"] });
  }

  async obtener(id: number): Promise<Cerveza | null> {
    return await CervezaRepository.findOne({ where: { id }, relations: ["degustaciones"] });
  }

  async actualizar(id: number, datos: Partial<Cerveza>): Promise<Cerveza | null> {
    const cerveza = await this.obtener(id);
    if (!cerveza) return null;
    CervezaRepository.merge(cerveza, datos);
    return await CervezaRepository.save(cerveza);
  }

  async eliminar(id: number): Promise<boolean> {
    const result = await CervezaRepository.delete(id);
    return result.affected !== 0;
  }
}
