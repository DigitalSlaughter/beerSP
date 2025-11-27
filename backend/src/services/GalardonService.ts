import fs from "fs";
import path from "path";
import { Usuario } from "../models/Usuario";
import { UsuarioGalardon } from "../models/UsuarioGalardon";
import { AppDataSource } from "../config/db";

interface Nivel {
  nivel: number;
  requisito: number;
}

export const UsuarioGalardonRepository = AppDataSource.getRepository(UsuarioGalardon);

export class GalardonService {
  private catalogo: any[];

  constructor() {
    this.catalogo = this.cargarCatalogo();
  }
  public getCatalogo(): any[] {
    return this.catalogo;
  }

  // Cargar catálogo desde JSON
  private cargarCatalogo(): any[] {
    const filePath = path.resolve(__dirname, "../data/galardones.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw).galardones;
  }

  // Obtener definición de galardón por ID
  public obtenerGalardonDef(galardonId: string) {
    return this.catalogo.find((g) => g.id === galardonId);
  }

  // Calcular nivel alcanzado según cantidad
  public calcularNivel(obtenidos: number, galardonDef: any): number {
    let nivel = 0;
    for (const n of galardonDef.niveles) {
      if (obtenidos >= n.requisito) nivel = n.nivel;
    }
    return nivel;
  }
  public async obtenerProgresoActual(usuario: Usuario): Promise<Record<string, number>> {

    const degustaciones = usuario.degustaciones ?? [];
    const comentarios = usuario.comentariosDegustacion ?? [];

    return {
      // Galardones de primer evento
      "primer_inicio": 1, // siempre 1 porque registrarse ya lo cumple
      "primer_comentario": comentarios.length > 0 ? 1 : 0,
      "primera_degustacion": degustaciones.length > 0 ? 1 : 0,

      // Acumulativos
      "comentarios": comentarios.length,

      // Cervezas distintas probadas
      "cervezas_distintas": new Set(
        degustaciones.map(d => d.cerveza?.id)
      ).size,

      // Países distintos
      "paises_distintos": new Set(
        degustaciones.map(d => d.pais_degustacion)
      ).size,

      // Locales distintos visitados
      "locales_visitados": new Set(
        degustaciones.map(d => d.local?.id)
      ).size
    };
  }




  public calcularProgreso(obtenidos: number, galardonDef: { niveles: Nivel[] }) {
  const niveles = galardonDef.niveles;

  // Nivel calculado a partir de la cantidad real (ej.: número de comentarios, cervezas ...)
  const nivelActual = this.calcularNivel(obtenidos, galardonDef);

  // Buscamos el siguiente nivel tras el actual (si existe)
  const siguiente = niveles.find((n: Nivel) => n.nivel === nivelActual + 1);

  // Si no existe siguiente nivel -> estamos en el máximo
  if (!siguiente) {
    return {
      nivelActual,
      // si el usuario tiene nivel >= 1 consideramos que "ha completado" ese nivel
      completado: nivelActual >= 1,
      faltante: 0,
      siguienteRequisito: null
    };
  }

  // Si existe siguiente nivel devolvemos cuánto falta para alcanzarlo.
  // Además, completado será true si el usuario ya tiene al menos nivel 1 (es decir, ha logrado el galardón en su forma básica)
  return {
    nivelActual,
    completado: nivelActual >= 1,
    faltante: Math.max(0, siguiente.requisito - obtenidos),
    siguienteRequisito: siguiente.requisito
  };
}


  // Obtener nivel almacenado del usuario
  public obtenerNivelAlmacenado(usuario: Usuario, galardonId: string): number {
    const registro = usuario.galardonesAsignados?.find(
      (g) => g.galardonId === galardonId
    );
    return registro ? registro.nivel : 0;
  }

  // Asignar o actualizar galardón
  public async asignarGalardon(usuario: Usuario, galardonId: string, nivel: number) {
    const def = this.obtenerGalardonDef(galardonId);

    let existente = await UsuarioGalardonRepository.findOne({
      where: { galardonId, usuario: { id: usuario.id } },
      relations: ["usuario"]
    });

    if (!existente) {
      existente = UsuarioGalardonRepository.create({
        usuario,
        galardonId,
        nivel,
        fecha_obtencion: new Date(),
        descripcion: def.descripcion // NUEVO
      });
    } else if (nivel > existente.nivel) {
      existente.nivel = nivel;
      existente.fecha_obtencion = new Date();
      existente.descripcion = def.descripcion; // actualizar por si cambia
    } else {
      return;
    }

    await UsuarioGalardonRepository.save(existente);
  }

  // -----------------------------------------------------
  // MÉTODO PARA OBTENER LA INFO COMPLETA DE UN GALARDÓN
  // -----------------------------------------------------
  public obtenerGalardonConProgreso(obtenidos: number, galardonId: string) {
    const def = this.obtenerGalardonDef(galardonId);

    if (!def) return null;

    const progreso = this.calcularProgreso(obtenidos, def);

    return {
      id: def.id,
      nombre: def.nombre,
      descripcion: def.descripcion,
      niveles: def.niveles,
      ...progreso
    };
  }

  // -------------------------
  // GALARDONES INICIALES
  // -------------------------

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
