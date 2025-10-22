// Datos mock para desarrollo y pruebas

export const mockFincas = [
  { id: 1, nombre: "Finca El Paraíso", ubicacion: "Pitalito, Huila", area: 5 },
  { id: 2, nombre: "Finca La Esperanza", ubicacion: "Garzón, Huila", area: 3 },
];

export const mockTanques = [
  { id: 1, nombre: "Tanque 1", finca: "Finca El Paraíso", capacidad: 500 },
  { id: 2, nombre: "Tanque 2", finca: "Finca El Paraíso", capacidad: 300 },
  { id: 3, nombre: "Tanque 3", finca: "Finca La Esperanza", capacidad: 400 },
];

export const mockLotes = [
  {
    id: 1,
    tanque: "Tanque 1",
    variedad: "Castillo",
    proceso: "Lavado",
    fecha: "2024-01-15",
    cantidad: 450,
    estado: "En fermentación",
  },
  {
    id: 2,
    tanque: "Tanque 2",
    variedad: "Caturra",
    proceso: "Honey",
    fecha: "2024-01-16",
    cantidad: 280,
    estado: "Listo para lavado",
  },
];

export const mockMediciones = [
  {
    id: 1,
    lote: "Castillo - Tanque 1",
    fecha: "2024-01-20 10:30",
    fase: "Inicio",
    ph: 5.2,
    temperatura: 26,
    estado: "Óptimo",
  },
  {
    id: 2,
    lote: "Castillo - Tanque 1",
    fecha: "2024-01-21 14:15",
    fase: "Media",
    ph: 4.5,
    temperatura: 28,
    estado: "Óptimo",
  },
  {
    id: 3,
    lote: "Caturra - Tanque 2",
    fecha: "2024-01-21 16:00",
    fase: "Inicio",
    ph: 4.8,
    temperatura: 24,
    estado: "Bueno",
  },
  {
    id: 4,
    lote: "Bourbon - Tanque 3",
    fecha: "2024-01-22 09:00",
    fase: "Media",
    ph: 3.9,
    temperatura: 30,
    estado: "Atención",
  },
];

export const mockVariedades = [
  {
    nombre: "Castillo",
    ph: 4.2,
    temperatura: 28,
    descripcion: "Variedad resistente a enfermedades, muy productiva",
  },
  {
    nombre: "Caturra",
    ph: 4.5,
    temperatura: 25,
    descripcion: "Alta calidad en taza, tamaño compacto",
  },
  {
    nombre: "Bourbon",
    ph: 4.3,
    temperatura: 27,
    descripcion: "Excelente calidad, sabor dulce y complejo",
  },
  {
    nombre: "Típica",
    ph: 4.4,
    temperatura: 26,
    descripcion: "Variedad clásica, calidad excepcional",
  },
  {
    nombre: "Colombia",
    ph: 4.2,
    temperatura: 28,
    descripcion: "Resistente a roya, buena productividad",
  },
];

export const mockUsuario = {
  nombre: "Juan Pérez",
  email: "juan.perez@email.com",
  celular: "300 123 4567",
  telefono: "8 123 456",
  regimen: "simplificado",
};
