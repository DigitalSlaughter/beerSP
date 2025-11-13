// src/server.ts
import express from "express";
import { AppDataSource } from "../config/db";

const app = express();
app.use(express.json());

const PORT = 4000;

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Conexión establecida con PostgreSQL");
    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
  })
  .catch((error) => console.error("❌ Error al conectar a la base de datos:", error));
