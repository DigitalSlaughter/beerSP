import { AppDataSource } from "../config/db";
import { Degustacion } from "../models/Degustacion";

export const DegustacionRepository = AppDataSource.getRepository(Degustacion);
