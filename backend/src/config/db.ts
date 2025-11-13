// src/config/db.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "../models/Usuario";
import { SolicitudAmistad } from "../models/SolicitudAmistad";
import { Cerveza } from "../models/Cerveza";
import { Degustacion } from "../models/Degustacion";
import { Local } from "../models/Local";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "beersp",
  synchronize: true, // cambiar a false en producción
  logging: false,
  entities: [Usuario, SolicitudAmistad, Cerveza, Degustacion, Local],
});
