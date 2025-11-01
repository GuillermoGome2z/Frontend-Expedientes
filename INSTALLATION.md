# 🚀 Instrucciones de Instalación y Ejecución

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Backend corriendo en `http://localhost:3000` (o la URL configurada en `.env`)

---

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

Si encuentras errores de tipos, instala los tipos faltantes:

```bash
npm install --save-dev @types/react @types/react-dom @types/node
```

### 2. Configurar variables de entorno

Asegúrate de que existe el archivo `.env` en la raíz del proyecto:

```bash
# .env
VITE_API_URL=http://localhost:3000/api
```

**⚠️ IMPORTANTE:** La URL debe incluir el `BASE_PATH` (ej: `/api`)

---

## 🏃‍♂️ Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### Modo Producción

```bash
# Build
npm run build

# Preview
npm run preview
```

---

## 🧪 Verificación de Funcionamiento

### 1. Compilación sin errores

Si al ejecutar `npm run dev` ves errores de TypeScript relacionados con módulos no encontrados:

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### 2. Login funciona

1. Navega a `http://localhost:5173/login`
2. Ingresa credenciales válidas (según tu backend)
3. Debe redirigir a `/dashboard`

### 3. Backend respondiendo correctamente

El frontend espera que el backend responda con este formato:

```json
{
  "success": true,
  "data": {
    ...
  }
}
```

Si ves errores en consola como `Cannot read property 'data' of undefined`, verifica que tu backend esté usando el formato normalizado.

---

## 🐛 Troubleshooting

### Error: "VITE_API_URL es requerido"

**Solución:**
1. Verifica que el archivo `.env` existe en la raíz del proyecto
2. Verifica que contiene: `VITE_API_URL=http://localhost:3000/api`
3. Reinicia el servidor de desarrollo (`Ctrl+C` y luego `npm run dev`)

### Error: "Cannot find module 'axios'"

**Solución:**
```bash
npm install axios
```

### Error: "Cannot find module 'react'"

**Solución:**
```bash
npm install react react-dom
npm install --save-dev @types/react @types/react-dom
```

### Error: 401 Unauthorized en todas las peticiones

**Causas posibles:**
1. Token expirado → El frontend automáticamente te deslogueará
2. Backend no está corriendo
3. URL de API incorrecta en `.env`

**Solución:**
1. Verifica que el backend está corriendo: `curl http://localhost:3000/api/health`
2. Verifica `.env` tiene la URL correcta
3. Intenta hacer login nuevamente

### Error: Exportaciones no funcionan

**Causas posibles:**
1. Backend no implementó los endpoints de exportación
2. Backend no retorna el `Content-Type` correcto
3. Backend no incluye header `Content-Disposition`

**Solución:**
- Revisa `BACKEND_CHECKLIST.md` para implementar los endpoints en el backend
- Verifica headers con: `curl -I http://localhost:3000/api/expedientes/export`

---

## 📚 Documentación Adicional

- **MIGRATION_GUIDE.md** - Guía técnica detallada de todos los cambios
- **BACKEND_CHECKLIST.md** - Checklist completo para el backend
- **REFACTOR_SUMMARY.md** - Resumen ejecutivo de la refactorización
- **BACKEND_IMPLEMENTATION.md** - Especificación original de endpoints

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 🌐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API (incluye BASE_PATH) | `http://localhost:3000/api` |

---

## 📦 Dependencias Principales

| Dependencia | Versión | Uso |
|-------------|---------|-----|
| react | ^19.1.1 | Framework UI |
| react-router-dom | ^7.9.5 | Routing |
| @tanstack/react-query | ^5.90.5 | State management (server) |
| zustand | ^5.0.8 | State management (auth) |
| axios | ^1.13.1 | HTTP client |
| react-hook-form | ^7.66.0 | Formularios |
| zod | ^4.1.12 | Validaciones |
| tailwindcss | ^3.4.17 | Estilos |
| lucide-react | ^0.552.0 | Iconos |

---

## 🎯 Estado de Integración

### ✅ Frontend
- [x] Manejo de errores robusto (401, 403, 429, 5xx)
- [x] Paginación con aliases (page → pagina)
- [x] Exportaciones Excel listas
- [x] RBAC implementado
- [x] Validaciones completas
- [x] Tipos normalizados

### ⏳ Backend (Pendiente)
- [ ] Respuestas normalizadas `{ success, data/error }`
- [ ] Paginación con `pagina`/`tamanoPagina`
- [ ] Rate limiting con headers
- [ ] Endpoint `GET /expedientes/export`
- [ ] Endpoint `GET /expedientes/:id/export`
- [ ] Validación de justificación en rechazos

Ver `BACKEND_CHECKLIST.md` para detalles de implementación.

---

## 🆘 Soporte

Si encuentras problemas no cubiertos en esta guía:

1. Revisa los logs de la consola del navegador (F12)
2. Revisa los logs del servidor de desarrollo de Vite
3. Verifica que el backend esté respondiendo correctamente
4. Consulta los archivos de documentación en la raíz del proyecto

---

**Última actualización:** 2025-11-01
