// Script para iniciar n8n en entorno de producción
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración para entorno de producción
const isProduction = process.env.NODE_ENV === 'production';
const n8nCommand = isProduction ? 'n8n' : 'npx n8n';

// Opciones para iniciar n8n
const options = [
  'start',
  '--tunnel', // Habilitar túnel para acceso externo
];

// En producción, no usamos el túnel y configuramos para usar HTTPS
if (isProduction) {
  options.pop(); // Quitar la opción de túnel
}

console.log(`Iniciando n8n con opciones: ${options.join(' ')}`);

// Iniciar n8n como proceso hijo
const n8nProcess = spawn(n8nCommand, options, {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    // Asegurar que n8n use la configuración correcta
    N8N_DIAGNOSTICS_ENABLED: 'false',
    N8N_USER_MANAGEMENT_DISABLED: 'false',
  }
});

n8nProcess.on('close', (code) => {
  console.log(`n8n se ha cerrado con código: ${code}`);
});

// Manejar señales para cerrar correctamente
process.on('SIGINT', () => {
  console.log('Cerrando n8n...');
  n8nProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Cerrando n8n...');
  n8nProcess.kill('SIGTERM');
});