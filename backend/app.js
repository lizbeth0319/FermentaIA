import express from "express";
import cors from "cors";
import path from "path";
import { spawn } from "child_process";
// Importa todas tus rutas
import productoresRoutes from "./routers/Productor.js";
import fincasRoutes from "./routers/Finca.js";
import tanquesRoutes from "./routers/Tanque.js";
import lotesRoutes from "./routers/Lote.js";
import medicionesRoutes from "./routers/Medicion.js";
import recomendacionesRoutes from "./routers/Recomendacion.js";
import sincronizacionesRoutes from "./routers/Sincronizacion.js";
import perfilesRoutes from "./routers/PerfilIdeal.js";
import authetication from "./routers/Autenticacion.js";
import aiRoutes from "./routers/AI.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

app.use(express.json());

// Configuración de CORS
// 💡 MODIFICACIÓN: En producción, el frontend y backend tendrán el mismo dominio (Render lo maneja).
// Se deja una configuración simple para desarrollo local y se eliminan los orígenes localhost en producción.
app.use(
  cors({
    origin: true, // Permitirá cualquier origen en producción si se configura correctamente.
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-token"],
  })
);

// Middleware de logging para debug
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📦 Body:", req.body);
  }
  next();
});

app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use("/api/auth", authetication);
app.use("/api/productores", productoresRoutes);
app.use("/api/fincas", fincasRoutes);
app.use("/api/tanques", tanquesRoutes);
app.use("/api/lotes", lotesRoutes);
app.use("/api/mediciones", medicionesRoutes);
app.use("/api/recomendaciones", recomendacionesRoutes);
app.use("/api/sincronizaciones", sincronizacionesRoutes);
app.use("/api/perfiles", perfilesRoutes);
app.use("/api/ai", aiRoutes);


// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor API escuchando en el puerto ${PORT}`);
  
  try {
    await connectDB();
  } catch (error) {
    console.error("Fallo al iniciar el servidor por error en la BD:", error);
  }
});