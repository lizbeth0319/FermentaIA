import mongoose from "mongoose";
import PerfilIdeal from "./models/PerfilIdeal.js";
import dotenv from "dotenv";

dotenv.config();

const perfilesIdeales = [
  // ========== CASTILLO ==========
  // Castillo - Lavado
  {
    variedad: "Castillo",
    proceso: "Lavado",
    fase: "inicio",
    ph_min: 4.0,
    ph_max: 5.5,
    temp_min_c: 18,
    temp_max_c: 22
  },
  {
    variedad: "Castillo",
    proceso: "Lavado",
    fase: "media",
    ph_min: 3.7,
    ph_max: 4.7,
    temp_min_c: 20,
    temp_max_c: 25
  },
  {
    variedad: "Castillo",
    proceso: "Lavado",
    fase: "fin",
    ph_min: 3.4,
    ph_max: 4.1,
    temp_min_c: 22,
    temp_max_c: 27
  },

  // Castillo - Honey
  {
    variedad: "Castillo",
    proceso: "Honey",
    fase: "inicio",
    ph_min: 4.1,
    ph_max: 5.7,
    temp_min_c: 19,
    temp_max_c: 24
  },
  {
    variedad: "Castillo",
    proceso: "Honey",
    fase: "media",
    ph_min: 3.9,
    ph_max: 5.1,
    temp_min_c: 21,
    temp_max_c: 26
  },
  {
    variedad: "Castillo",
    proceso: "Honey",
    fase: "fin",
    ph_min: 3.7,
    ph_max: 4.4,
    temp_min_c: 23,
    temp_max_c: 28
  },

  // Castillo - Natural
  {
    variedad: "Castillo",
    proceso: "Natural",
    fase: "inicio",
    ph_min: 4.4,
    ph_max: 6.1,
    temp_min_c: 20,
    temp_max_c: 26
  },
  {
    variedad: "Castillo",
    proceso: "Natural",
    fase: "media",
    ph_min: 4.1,
    ph_max: 5.4,
    temp_min_c: 22,
    temp_max_c: 28
  },
  {
    variedad: "Castillo",
    proceso: "Natural",
    fase: "fin",
    ph_min: 3.9,
    ph_max: 4.7,
    temp_min_c: 24,
    temp_max_c: 30
  },

  // ========== CATURRA ==========
  // Caturra - Lavado
  {
    variedad: "Caturra",
    proceso: "Lavado",
    fase: "inicio",
    ph_min: 4.1,
    ph_max: 5.6,
    temp_min_c: 19,
    temp_max_c: 23
  },
  {
    variedad: "Caturra",
    proceso: "Lavado",
    fase: "media",
    ph_min: 3.8,
    ph_max: 4.8,
    temp_min_c: 21,
    temp_max_c: 26
  },
  {
    variedad: "Caturra",
    proceso: "Lavado",
    fase: "fin",
    ph_min: 3.5,
    ph_max: 4.2,
    temp_min_c: 23,
    temp_max_c: 28
  },

  // Caturra - Honey
  {
    variedad: "Caturra",
    proceso: "Honey",
    fase: "inicio",
    ph_min: 4.2,
    ph_max: 5.8,
    temp_min_c: 20,
    temp_max_c: 25
  },
  {
    variedad: "Caturra",
    proceso: "Honey",
    fase: "media",
    ph_min: 4.0,
    ph_max: 5.2,
    temp_min_c: 22,
    temp_max_c: 27
  },
  {
    variedad: "Caturra",
    proceso: "Honey",
    fase: "fin",
    ph_min: 3.8,
    ph_max: 4.5,
    temp_min_c: 24,
    temp_max_c: 29
  },

  // Caturra - Natural
  {
    variedad: "Caturra",
    proceso: "Natural",
    fase: "inicio",
    ph_min: 4.5,
    ph_max: 6.2,
    temp_min_c: 21,
    temp_max_c: 27
  },
  {
    variedad: "Caturra",
    proceso: "Natural",
    fase: "media",
    ph_min: 4.2,
    ph_max: 5.5,
    temp_min_c: 23,
    temp_max_c: 29
  },
  {
    variedad: "Caturra",
    proceso: "Natural",
    fase: "fin",
    ph_min: 4.0,
    ph_max: 4.8,
    temp_min_c: 25,
    temp_max_c: 31
  },

  // ========== BOURBON ==========
  // Bourbon - Lavado
  {
    variedad: "Bourbon",
    proceso: "Lavado",
    fase: "inicio",
    ph_min: 3.9,
    ph_max: 5.4,
    temp_min_c: 18,
    temp_max_c: 22
  },
  {
    variedad: "Bourbon",
    proceso: "Lavado",
    fase: "media",
    ph_min: 3.6,
    ph_max: 4.6,
    temp_min_c: 20,
    temp_max_c: 25
  },
  {
    variedad: "Bourbon",
    proceso: "Lavado",
    fase: "fin",
    ph_min: 3.3,
    ph_max: 4.0,
    temp_min_c: 22,
    temp_max_c: 27
  },

  // Bourbon - Honey
  {
    variedad: "Bourbon",
    proceso: "Honey",
    fase: "inicio",
    ph_min: 4.0,
    ph_max: 5.6,
    temp_min_c: 19,
    temp_max_c: 24
  },
  {
    variedad: "Bourbon",
    proceso: "Honey",
    fase: "media",
    ph_min: 3.8,
    ph_max: 5.0,
    temp_min_c: 21,
    temp_max_c: 26
  },
  {
    variedad: "Bourbon",
    proceso: "Honey",
    fase: "fin",
    ph_min: 3.6,
    ph_max: 4.3,
    temp_min_c: 23,
    temp_max_c: 28
  },

  // Bourbon - Natural
  {
    variedad: "Bourbon",
    proceso: "Natural",
    fase: "inicio",
    ph_min: 4.3,
    ph_max: 6.0,
    temp_min_c: 20,
    temp_max_c: 26
  },
  {
    variedad: "Bourbon",
    proceso: "Natural",
    fase: "media",
    ph_min: 4.0,
    ph_max: 5.3,
    temp_min_c: 22,
    temp_max_c: 28
  },
  {
    variedad: "Bourbon",
    proceso: "Natural",
    fase: "fin",
    ph_min: 3.8,
    ph_max: 4.6,
    temp_min_c: 24,
    temp_max_c: 30
  },

  // ========== TÍPICA ==========
  // Típica - Lavado
  {
    variedad: "Típica",
    proceso: "Lavado",
    fase: "inicio",
    ph_min: 4.0,
    ph_max: 5.5,
    temp_min_c: 18,
    temp_max_c: 22
  },
  {
    variedad: "Típica",
    proceso: "Lavado",
    fase: "media",
    ph_min: 3.8,
    ph_max: 4.8,
    temp_min_c: 20,
    temp_max_c: 25
  },
  {
    variedad: "Típica",
    proceso: "Lavado",
    fase: "fin",
    ph_min: 3.5,
    ph_max: 4.2,
    temp_min_c: 22,
    temp_max_c: 27
  },

  // Típica - Honey
  {
    variedad: "Típica",
    proceso: "Honey",
    fase: "inicio",
    ph_min: 4.2,
    ph_max: 5.8,
    temp_min_c: 19,
    temp_max_c: 24
  },
  {
    variedad: "Típica",
    proceso: "Honey",
    fase: "media",
    ph_min: 4.0,
    ph_max: 5.2,
    temp_min_c: 21,
    temp_max_c: 26
  },
  {
    variedad: "Típica",
    proceso: "Honey",
    fase: "fin",
    ph_min: 3.8,
    ph_max: 4.5,
    temp_min_c: 23,
    temp_max_c: 28
  },

  // Típica - Natural
  {
    variedad: "Típica",
    proceso: "Natural",
    fase: "inicio",
    ph_min: 4.5,
    ph_max: 6.2,
    temp_min_c: 20,
    temp_max_c: 26
  },
  {
    variedad: "Típica",
    proceso: "Natural",
    fase: "media",
    ph_min: 4.2,
    ph_max: 5.5,
    temp_min_c: 22,
    temp_max_c: 28
  },
  {
    variedad: "Típica",
    proceso: "Natural",
    fase: "fin",
    ph_min: 4.0,
    ph_max: 4.8,
    temp_min_c: 24,
    temp_max_c: 30
  },

  // ========== COLOMBIA ==========
  // Colombia - Lavado
  {
    variedad: "Colombia",
    proceso: "Lavado",
    fase: "inicio",
    ph_min: 4.0,
    ph_max: 5.4,
    temp_min_c: 18,
    temp_max_c: 22
  },
  {
    variedad: "Colombia",
    proceso: "Lavado",
    fase: "media",
    ph_min: 3.7,
    ph_max: 4.7,
    temp_min_c: 20,
    temp_max_c: 25
  },
  {
    variedad: "Colombia",
    proceso: "Lavado",
    fase: "fin",
    ph_min: 3.4,
    ph_max: 4.1,
    temp_min_c: 22,
    temp_max_c: 27
  },

  // Colombia - Honey
  {
    variedad: "Colombia",
    proceso: "Honey",
    fase: "inicio",
    ph_min: 4.1,
    ph_max: 5.6,
    temp_min_c: 19,
    temp_max_c: 24
  },
  {
    variedad: "Colombia",
    proceso: "Honey",
    fase: "media",
    ph_min: 3.9,
    ph_max: 5.0,
    temp_min_c: 21,
    temp_max_c: 26
  },
  {
    variedad: "Colombia",
    proceso: "Honey",
    fase: "fin",
    ph_min: 3.7,
    ph_max: 4.4,
    temp_min_c: 23,
    temp_max_c: 28
  },

  // Colombia - Natural
  {
    variedad: "Colombia",
    proceso: "Natural",
    fase: "inicio",
    ph_min: 4.3,
    ph_max: 6.0,
    temp_min_c: 20,
    temp_max_c: 26
  },
  {
    variedad: "Colombia",
    proceso: "Natural",
    fase: "media",
    ph_min: 4.0,
    ph_max: 5.3,
    temp_min_c: 22,
    temp_max_c: 28
  },
  {
    variedad: "Colombia",
    proceso: "Natural",
    fase: "fin",
    ph_min: 3.8,
    ph_max: 4.6,
    temp_min_c: 24,
    temp_max_c: 30
  },

  // ========== GEISHA ==========
  // Geisha - Lavado
  {
    variedad: "Geisha",
    proceso: "Lavado",
    fase: "inicio",
    ph_min: 4.2,
    ph_max: 5.8,
    temp_min_c: 16,
    temp_max_c: 20
  },
  {
    variedad: "Geisha",
    proceso: "Lavado",
    fase: "media",
    ph_min: 4.0,
    ph_max: 5.2,
    temp_min_c: 18,
    temp_max_c: 23
  },
  {
    variedad: "Geisha",
    proceso: "Lavado",
    fase: "fin",
    ph_min: 3.8,
    ph_max: 4.5,
    temp_min_c: 20,
    temp_max_c: 25
  },

  // Geisha - Honey
  {
    variedad: "Geisha",
    proceso: "Honey",
    fase: "inicio",
    ph_min: 4.4,
    ph_max: 6.0,
    temp_min_c: 17,
    temp_max_c: 22
  },
  {
    variedad: "Geisha",
    proceso: "Honey",
    fase: "media",
    ph_min: 4.2,
    ph_max: 5.4,
    temp_min_c: 19,
    temp_max_c: 24
  },
  {
    variedad: "Geisha",
    proceso: "Honey",
    fase: "fin",
    ph_min: 4.0,
    ph_max: 4.8,
    temp_min_c: 21,
    temp_max_c: 26
  },

  // Geisha - Natural
  {
    variedad: "Geisha",
    proceso: "Natural",
    fase: "inicio",
    ph_min: 4.6,
    ph_max: 6.4,
    temp_min_c: 18,
    temp_max_c: 24
  },
  {
    variedad: "Geisha",
    proceso: "Natural",
    fase: "media",
    ph_min: 4.4,
    ph_max: 5.8,
    temp_min_c: 20,
    temp_max_c: 26
  },
  {
    variedad: "Geisha",
    proceso: "Natural",
    fase: "fin",
    ph_min: 4.2,
    ph_max: 5.2,
    temp_min_c: 22,
    temp_max_c: 28
  },

  // ========== TABI ==========
  // Tabi - Lavado
  {
    variedad: "Tabi",
    proceso: "Lavado",
    fase: "inicio",
    ph_min: 3.9,
    ph_max: 5.3,
    temp_min_c: 18,
    temp_max_c: 22
  },
  {
    variedad: "Tabi",
    proceso: "Lavado",
    fase: "media",
    ph_min: 3.6,
    ph_max: 4.6,
    temp_min_c: 20,
    temp_max_c: 25
  },
  {
    variedad: "Tabi",
    proceso: "Lavado",
    fase: "fin",
    ph_min: 3.3,
    ph_max: 4.0,
    temp_min_c: 22,
    temp_max_c: 27
  },

  // Tabi - Honey
  {
    variedad: "Tabi",
    proceso: "Honey",
    fase: "inicio",
    ph_min: 4.0,
    ph_max: 5.5,
    temp_min_c: 19,
    temp_max_c: 24
  },
  {
    variedad: "Tabi",
    proceso: "Honey",
    fase: "media",
    ph_min: 3.8,
    ph_max: 4.9,
    temp_min_c: 21,
    temp_max_c: 26
  },
  {
    variedad: "Tabi",
    proceso: "Honey",
    fase: "fin",
    ph_min: 3.6,
    ph_max: 4.3,
    temp_min_c: 23,
    temp_max_c: 28
  },

  // Tabi - Natural
  {
    variedad: "Tabi",
    proceso: "Natural",
    fase: "inicio",
    ph_min: 4.2,
    ph_max: 5.9,
    temp_min_c: 20,
    temp_max_c: 26
  },
  {
    variedad: "Tabi",
    proceso: "Natural",
    fase: "media",
    ph_min: 3.9,
    ph_max: 5.2,
    temp_min_c: 22,
    temp_max_c: 28
  },
  {
    variedad: "Tabi",
    proceso: "Natural",
    fase: "fin",
    ph_min: 3.7,
    ph_max: 4.5,
    temp_min_c: 24,
    temp_max_c: 30
  }
];

async function seedPerfiles() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Conectado a MongoDB');

    // Limpiar perfiles existentes
    await PerfilIdeal.deleteMany({});
    console.log('Perfiles existentes eliminados');

    // Insertar nuevos perfiles
    const perfilesInsertados = await PerfilIdeal.insertMany(perfilesIdeales);
    console.log(`${perfilesInsertados.length} perfiles ideales insertados`);

    console.log('Datos de perfiles ideales insertados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar perfiles:', error);
    process.exit(1);
  }
}

seedPerfiles();