import express from "express";
import cors from "cors";

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
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:8081"],
  credentials: true,
}));

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
app.listen(PORT, () => {
    console.log(` Servidor escuchando en http: ${PORT}`);
    connectDB().then(() => {
    }).catch(error => {
        console.error("Failed to start server due to DB connection error:", error);
    });
});