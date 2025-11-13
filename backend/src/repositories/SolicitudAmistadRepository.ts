import { AppDataSource } from "../config/db";
import { SolicitudAmistad } from "../models/SolicitudAmistad";

export const SolicitudAmistadRepository = AppDataSource.getRepository(SolicitudAmistad);
