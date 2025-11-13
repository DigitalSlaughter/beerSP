import { LocalRepository } from "../repositories/LocalRepository";
import { Local } from "../models/Local";

export class LocalService {
  async crear(local: Partial<Local>): Promise<Local> {
    const nuevo = LocalRepository.create(local);
    return await LocalRepository.save(nuevo);
  }

  async listar(): Promise<Local[]> {
    return await LocalRepository.find();
  }

  async obtener(id: number): Promise<Local | null> {
    return await LocalRepository.findOne({ where: { id } });
  }

  async actualizar(id: number, datos: Partial<Local>): Promise<Local | null> {
    const local = await this.obtener(id);
    if (!local) return null;
    LocalRepository.merge(local, datos);
    return await LocalRepository.save(local);
  }

  async eliminar(id: number): Promise<boolean> {
    const result = await LocalRepository.delete(id);
    return result.affected !== 0;
  }
}
