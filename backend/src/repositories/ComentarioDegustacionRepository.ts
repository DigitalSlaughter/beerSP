import { AppDataSource } from "../config/db";
import { ComentarioDegustacion } from "../models/ComentarioDegustacion";

export const ComentarioDegustacionRepository = AppDataSource.getRepository(ComentarioDegustacion);