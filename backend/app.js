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

// ----------------------------------------------------------------------
// 💡 CÓDIGO AÑADIDO: Lógica para servir el Frontend de React
// Solo se ejecuta en producción (cuando el frontend está compilado)
// ----------------------------------------------------------------------
if (process.env.NODE_ENV === "production") {
  // 1. Definir la ruta donde Express buscará los archivos estáticos.
  // Usamos 'dist' porque es el nombre que le daremos a la carpeta compilada
  // del frontend dentro del directorio 'backend'.
  const __dirname = path.resolve(); // Obtiene el directorio raíz actual
  const frontendBuildPath = path.join(__dirname, "dist");

  // 2. Servir los archivos estáticos (JS, CSS, imágenes)
  app.use(express.static(frontendBuildPath));

  // 3. Servir el 'index.html' para todas las demás peticiones (las rutas de React Router)
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendBuildPath, "index.html"));
  });
}
// ----------------------------------------------------------------------

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor escuchando en http: ${PORT}`);

  // 💡 LÓGICA AGREGADA PARA INICIAR N8N
  try {
    // Ejecuta el script de inicio de n8n.
    // El path es relativo a la raíz del repositorio, o desde el directorio 'backend'.
    // Aquí asumimos que Render está en 'backend', así que vamos un nivel arriba y luego a 'n8n'.
    const n8nProcess = spawn("npm", ["start", "--prefix", "../n8n"], {
      // Esto permite que el proceso hijo se ejecute en segundo plano
      detached: true,
      stdio: "inherit", // Muestra los logs de n8n en el log principal de Render
    });

    n8nProcess.unref(); // Permite que el proceso padre (Express) termine sin esperar al hijo (n8n)
    console.log(`N8N iniciado como proceso hijo con PID: ${n8nProcess.pid}`);

    // Manejo básico de errores del proceso hijo
    n8nProcess.on("error", (err) => {
      console.error("Error al iniciar N8N:", err);
    });
  } catch (e) {
    console.error("Fallo al intentar spawnear N8N:", e);
  }

  // Conexión a DB
  connectDB()
    .then(() => {})
    .catch((error) => {
      console.error(
        "Failed to start server due to DB connection error:",
        error
      );
    });
});
