import { AppDataSource } from "../config/db";
import { Local } from "../models/Local";

export const LocalRepository = AppDataSource.getRepository(Local);
