// src/repositories/UsuarioRepository.ts
import { AppDataSource } from "../config/db";
import { Usuario } from "../models/Usuario";

export const UsuarioRepository = AppDataSource.getRepository(Usuario);
