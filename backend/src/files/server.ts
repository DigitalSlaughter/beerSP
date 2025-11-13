import express from "express";
import { AppDataSource } from "../config/db";
import usuarioRoutes from "../routes/usuarioRoutes";
import cervezaRoutes from "../routes/cervezaRoutes";
import degustacionRoutes from "../routes/degustacionRoutes";
import solicitudRoutes from "../routes/solicitudAmistadRoutes";
import localRoutes from "../routes/localRoutes";
import authRoutes from "../routes/authRoutes";

const app = express();
app.use(express.json());

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/cervezas", cervezaRoutes);
app.use("/api/degustaciones", degustacionRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/locales", localRoutes);
app.use("/api/auth", authRoutes);

const PORT = 4000;

AppDataSource.initialize()
  .then(() => {
    console.log("Conexión establecida con PostgreSQL");
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch((error) => console.error("Error al conectar a la base de datos:", error));
