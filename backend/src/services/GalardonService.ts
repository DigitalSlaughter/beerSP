import fs from "fs";
import path from "path";
import { Usuario } from "../models/Usuario";
import { UsuarioGalardon } from "../models/UsuarioGalardon";
import { AppDataSource } from "../config/db";

export const UsuarioGalardonRepository = AppDataSource.getRepository(UsuarioGalardon);

export class GalardonService {
  private catalogo: any[];

  constructor() {
    this.catalogo = this.cargarCatalogo();
  }

  // Cargar catálogo desde JSON (EIF)
  private cargarCatalogo(): any[] {
    const filePath = path.resolve(__dirname, "../data/galardones.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw).galardones;
  }

  // Obtener definición de galardón por ID
  public obtenerGalardonDef(galardonId: string) {
    return this.catalogo.find(g => g.id === galardonId);
  }

  // Calcular el nivel alcanzado según cantidad
  public calcularNivel(obtenidos: number, galardonDef: any): number {
    let nivel = 0;
    for (const n of galardonDef.niveles) {
      if (obtenidos >= n.requisito) nivel = n.nivel;
    }
    return nivel;
  }

  // Obtener nivel almacenado del usuario
  public obtenerNivelAlmacenado(usuario: Usuario, galardonId: string): number {
    const registro = usuario.galardonesAsignados?.find(
      g => g.galardonId === galardonId
    );
    return registro ? registro.nivel : 0;
  }

  // Asignar o actualizar galardón de un usuario
  public async asignarGalardon(usuario: Usuario, galardonId: string, nivel: number) {
    let existente = await UsuarioGalardonRepository.findOne({
      where: { galardonId, usuario: { id: usuario.id } },
      relations: ["usuario"]
    });

    if (!existente) {
      existente = UsuarioGalardonRepository.create({
        usuario,
        galardonId,
        nivel,
        fecha_obtencion: new Date()
      });
    } else if (nivel > existente.nivel) {
      existente.nivel = nivel;
      existente.fecha_obtencion = new Date();
    } else {
      return; // No actualizar si el nivel no aumenta
    }

    await UsuarioGalardonRepository.save(existente);
  }

  // -----------------------------
  // GALARDONES INICIALES
  // -----------------------------

  public async asignarGalardonCreacionCuenta(usuario: Usuario) {
    const galardonId = "primer_inicio";
    await this.asignarGalardon(usuario, galardonId, 1);
  }

  public async asignarGalardonPrimerComentario(usuario: Usuario) {
    const galardonId = "primer_comentario";
    await this.asignarGalardon(usuario, galardonId, 1);
  }

  public async asignarGalardonPrimeraDegustacion(usuario: Usuario) {
    const galardonId = "primera_degustacion";
    await this.asignarGalardon(usuario, galardonId, 1);
  }

  // Método general para asignar galardón inicial según evento
  public async asignarGalardonEvento(
    usuario: Usuario,
    evento: "crear_cuenta" | "primer_comentario" | "primera_degustacion"
  ) {
    switch (evento) {
      case "crear_cuenta":
        await this.asignarGalardonCreacionCuenta(usuario);
        break;
      case "primer_comentario":
        await this.asignarGalardonPrimerComentario(usuario);
        break;
      case "primera_degustacion":
        await this.asignarGalardonPrimeraDegustacion(usuario);
        break;
    }
  }
}
