/**
 * Validación y exportación de variables de entorno
 * Asegura que todas las variables críticas estén definidas al arrancar la app
 */

export const API_URL = import.meta.env.VITE_API_URL ?? "";

// Validación en tiempo de carga
if (!API_URL) {
  throw new Error(
    "VITE_API_URL es requerido. Asegúrate de tener un archivo .env con VITE_API_URL definido."
  );
}

// Validación de formato
try {
  new URL(API_URL);
} catch {
  throw new Error(
    `VITE_API_URL tiene un formato inválido: "${API_URL}". Debe ser una URL completa (ej: http://localhost:3000/api)`
  );
}

// Exportar configuración normalizada
export const config = {
  apiUrl: API_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
