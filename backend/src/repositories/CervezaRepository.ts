import { AppDataSource } from "../config/db";
import { Cerveza } from "../models/Cerveza";

export const CervezaRepository = AppDataSource.getRepository(Cerveza);
