// src/config/db.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "../models/Usuario";
import { SolicitudAmistad } from "../models/SolicitudAmistad";
import { Cerveza } from "../models/Cerveza";
import { Degustacion } from "../models/Degustacion";
import { Local } from "../models/Local";
import { UsuarioGalardon } from "../models/UsuarioGalardon";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false,     // <--- requerido por Neon
  },
  synchronize: true, // esto borra/cambia tablas si los modelos cambian
  logging: false,
  entities: [Usuario, SolicitudAmistad, Cerveza, Degustacion, Local, UsuarioGalardon],
});
