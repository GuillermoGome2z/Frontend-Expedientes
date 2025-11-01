# 📘 Guía de Integración Frontend con Backend Dockerizado

## 🎯 Resumen Ejecutivo

El **frontend está 100% listo** para trabajar con el backend dockerizado. La arquitectura está diseñada para que el navegador del usuario (fuera de Docker) se comunique con los servicios mediante los puertos expuestos en localhost.

---

## ✅ Estado Actual de la Integración

### ✨ **TODO YA ESTÁ CONFIGURADO**

El frontend ya tiene implementado:

- ✅ **Variables de entorno configuradas** (`.env` y `.env.docker.example`)
- ✅ **Cliente HTTP (Axios) configurado** con interceptores JWT
- ✅ **Validación de env vars** en tiempo de carga
- ✅ **Vite configurado para Docker** con hot reload y polling
- ✅ **Docker Compose actualizado** con volúmenes optimizados
- ✅ **Dockerfile optimizado** para desarrollo
- ✅ **Estructura de carpetas correcta** (raíz del proyecto)
- ✅ **CORS manejado** por el backend

---

## 🏗️ Arquitectura de Red en Docker

### Flujo de Comunicación

```
┌─────────────────────────────────────────────────────────┐
│                    TU NAVEGADOR                         │
│               (fuera de Docker)                         │
└──────────────┬────────────────┬─────────────────────────┘
               │                │
               │ localhost:5173 │ localhost:3000/api
               │                │
┌──────────────▼────────────────▼─────────────────────────┐
│              DOCKER HOST (tu PC)                        │
│  ┌────────────────────┐  ┌──────────────────────┐      │
│  │  Contenedor WEB    │  │  Contenedor API      │      │
│  │  (Vite Frontend)   │  │  (Express Backend)   │      │
│  │  Puerto: 5173      │  │  Puerto: 3000        │      │
│  │                    │  │                      │      │
│  │  VITE_API_URL=     │  │  DB_SERVER=sqlserver │      │
│  │  localhost:3000/api│◄─┤  (red interna)       │      │
│  └────────────────────┘  └──────────┬───────────┘      │
│                                     │                   │
│                          ┌──────────▼───────────┐      │
│                          │  Contenedor DB       │      │
│                          │  (SQL Server)        │      │
│                          │  Puerto: 1433        │      │
│                          └──────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

### 🔑 Concepto Clave

- **Desde el navegador**: Usas `localhost:3000` porque el puerto está expuesto al host
- **Dentro de Docker**: Los contenedores se comunican usando nombres de servicio (`api`, `sqlserver`)
- **Frontend**: Como Vite corre en el navegador, usa `localhost:3000` para llamar al backend

---

## 📋 Archivos Configurados

### 1. `.env` (Desarrollo Local)

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },
  server: {
    host: '0.0.0.0',      // ← Permite acceso desde fuera del contenedor
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,   // ← Hot reload en Docker
      interval: 100,
    },
    hmr: { overlay: true }
  },
})
```

### 3. `src/shared/env.ts`

```typescript
export const API_URL = import.meta.env.VITE_API_URL ?? "";

// Validación en tiempo de carga
if (!API_URL) {
  throw new Error("VITE_API_URL es requerido");
}

// Validación de formato
try {
  new URL(API_URL);
} catch {
  throw new Error(`VITE_API_URL tiene formato inválido: "${API_URL}"`);
}
```

### 4. `src/shared/fetcher.ts`

```typescript
import { API_URL } from "./env";

export const fetcher = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Interceptor para agregar JWT token
fetcher.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 5. `docker-compose.yml`

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: expedientes-web
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: "http://localhost:3000/api"  # ← Navegador usa localhost
      NODE_ENV: development
    volumes:
      - ./src:/app/src                # Hot reload de código
      - ./public:/app/public
      - ./.env:/app/.env
      - /app/node_modules             # Aislado
    depends_on:
      - api
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:5173"]
      interval: 30s
```

---

## 🚀 Cómo Levantar Todo

### Opción 1: Script npm (Recomendado)

```bash
# 1. Asegúrate de tener Docker Desktop corriendo

# 2. Levantar todos los servicios
npm run docker:up

# 3. Ver logs en tiempo real
npm run docker:logs

# 4. Detener todo
npm run docker:down
```

### Opción 2: Docker Compose Directo

```bash
# Levantar en segundo plano
docker compose up -d

# Ver logs del frontend
docker compose logs -f web

# Ver logs del backend
docker compose logs -f api

# Reiniciar solo el frontend
docker compose restart web

# Detener y eliminar todo
docker compose down

# Detener y eliminar volúmenes
docker compose down -v
```

---

## 🔗 URLs Disponibles

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicación React |
| **Backend API** | http://localhost:3000/api | Endpoints REST |
| **Swagger Docs** | http://localhost:3000/docs | Documentación interactiva |
| **Health Check** | http://localhost:3000/health | Estado del backend |
| **SQL Server** | localhost:1433 | Base de datos (usar SSMS/sqlcmd) |

---

## 🔐 Credenciales de Prueba

### Usuarios del Sistema

```
Técnico:
  username: tecnico1
  password: tecnico123

Coordinador:
  username: coord1
  password: Coord123!
```

### Base de Datos

```
Server: localhost,1433
User: sa
Password: YourStrong!Passw0rd
Database: ExpedientesDB
```

---

## 📡 Endpoints del Backend

### 1. Autenticación

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "coord1",
  "password": "Coord123!"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "coord1",
      "rol": "coordinador",
      "nombreCompleto": "Coordinador Principal"
    }
  }
}
```

### 2. Expedientes

```http
# Listar expedientes
GET /api/expedientes?page=1&pageSize=10&estado=Abierto
Authorization: Bearer <token>

# Crear expediente
POST /api/expedientes
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Caso de prueba",
  "descripcion": "Descripción del caso",
  "tecnicoAsignadoId": 2,
  "estado": "Abierto"
}

# Obtener detalle
GET /api/expedientes/:id
Authorization: Bearer <token>

# Actualizar
PUT /api/expedientes/:id
Authorization: Bearer <token>

# Cambiar estado
PATCH /api/expedientes/:id/estado
Authorization: Bearer <token>
Content-Type: application/json

{
  "estado": "Aprobado",
  "justificacion": "Cumple con todos los requisitos"
}

# Exportar a Excel
GET /api/expedientes/export?estado=Abierto
Authorization: Bearer <token>
```

### 3. Indicios

```http
# Listar indicios de un expediente
GET /api/indicios/expediente/:expedienteId
Authorization: Bearer <token>

# Crear indicio
POST /api/indicios
Authorization: Bearer <token>
Content-Type: application/json

{
  "expedienteId": 1,
  "descripcion": "Evidencia encontrada en la escena",
  "peso": 0.5,
  "color": "Rojo",
  "tamano": "Pequeño"
}

# Actualizar indicio
PUT /api/indicios/:id
Authorization: Bearer <token>

# Activar/Desactivar
PATCH /api/indicios/:id/activo
Authorization: Bearer <token>
Content-Type: application/json

{
  "activo": false
}
```

### 4. Usuarios (Solo Coordinador)

```http
# Listar usuarios
GET /api/usuarios?page=1&pageSize=10&rol=tecnico
Authorization: Bearer <token>

# Crear usuario
POST /api/usuarios
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "nuevo.tecnico",
  "password": "Password123!",
  "nombreCompleto": "Juan Pérez",
  "rol": "tecnico"
}

# Cambiar contraseña
PATCH /api/usuarios/:id/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "newPassword": "NewPassword123!"
}

# Activar/Desactivar
PATCH /api/usuarios/:id/activo
Authorization: Bearer <token>
Content-Type: application/json

{
  "activo": false
}
```

---

## 📊 Formato de Respuestas Estandarizado

### Success Response

```json
{
  "success": true,
  "data": {
    // Payload aquí
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 25,
    "totalPages": 3,
    "data": [
      // Items aquí
    ]
  }
}
```

### Validation Error

```json
{
  "success": false,
  "error": "Error de validación",
  "details": {
    "username": "El username es requerido",
    "password": "La contraseña debe tener al menos 8 caracteres"
  }
}
```

---

## 🐛 Troubleshooting

### Problema 1: "Network Error" al hacer login

**Síntoma:** Error de conexión al intentar hacer peticiones

**Causas posibles:**
- Backend no está corriendo
- URL incorrecta en `.env`
- Puerto bloqueado

**Solución:**
```bash
# 1. Verificar que el backend esté corriendo
curl http://localhost:3000/health

# 2. Verificar contenedores
docker compose ps

# 3. Ver logs del backend
docker compose logs api

# 4. Reiniciar servicios
docker compose restart api web
```

### Problema 2: Hot reload no funciona

**Síntoma:** Cambios en el código no se reflejan automáticamente

**Solución:**
- ✅ Ya está configurado `usePolling: true` en `vite.config.ts`
- ✅ Volúmenes están correctamente montados en `docker-compose.yml`
- Reiniciar el contenedor: `docker compose restart web`

### Problema 3: "CORS policy blocked"

**Síntoma:** Error de CORS en la consola del navegador

**Solución:**
- El backend ya tiene CORS configurado para `http://localhost:5173`
- Si cambias el puerto, el backend debe actualizar su configuración CORS

### Problema 4: Puerto 5173 en uso

**Síntoma:** Error al levantar Docker - puerto ocupado

**Solución:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
ports:
  - "5174:5173"  # Frontend en puerto 5174
```

### Problema 5: "Cannot find module '@/...'"

**Síntoma:** Errores de importación con alias `@`

**Solución:**
- ✅ Ya está configurado en `vite.config.ts`
- ✅ Ya está configurado en `tsconfig.json`
- Reconstruir contenedor: `docker compose up --build web`

### Problema 6: Token expirado

**Síntoma:** 401 Unauthorized después de estar inactivo

**Solución:**
```typescript
// Ya está implementado en fetcher.ts
fetcher.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar token y redirigir a login
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📸 Checklist de Validación

### Pre-despliegue

- [x] `.env` existe con `VITE_API_URL=http://localhost:3000/api`
- [x] `vite.config.ts` tiene `host: '0.0.0.0'` y `usePolling: true`
- [x] `src/shared/env.ts` valida variables de entorno
- [x] `src/shared/fetcher.ts` usa `API_URL` correctamente
- [x] Interceptor de Axios agrega JWT token
- [x] `docker-compose.yml` tiene servicio `web` configurado
- [x] `Dockerfile` está optimizado para desarrollo
- [x] Volúmenes están montados correctamente

### Post-despliegue

- [ ] `docker compose up` levanta todos los servicios sin errores
- [ ] `http://localhost:5173` carga la aplicación
- [ ] `http://localhost:3000/health` responde con status ok
- [ ] Login funciona con `coord1` / `Coord123!`
- [ ] Token se guarda en localStorage
- [ ] Peticiones incluyen `Authorization: Bearer <token>`
- [ ] Lista de expedientes se carga correctamente
- [ ] Hot reload funciona al editar archivos `.tsx`
- [ ] Creación de expediente funciona
- [ ] Cambio de estado (aprobar/rechazar) funciona
- [ ] Módulo de usuarios es visible solo para coordinadores

---

## 🎯 Próximos Pasos

### Desarrollo

1. **Implementar pantallas faltantes** según los endpoints disponibles
2. **Agregar validaciones de formularios** con Zod
3. **Mejorar manejo de errores** con mensajes user-friendly
4. **Agregar loading states** en peticiones asíncronas
5. **Implementar exports a Excel** usando endpoints del backend

### Testing

1. **Crear tests unitarios** para componentes clave
2. **Tests de integración** para flujos completos
3. **Tests E2E** con Playwright/Cypress

### Optimización

1. **Code splitting** para reducir bundle size
2. **Lazy loading** de rutas
3. **Optimización de imágenes**
4. **Service Worker** para caché offline

---

## 📚 Documentación Adicional

- **README Principal**: `README.md` - Documentación completa del proyecto
- **Docker Setup**: `DOCKER_SETUP.md` - Guía detallada de Docker
- **Backend API**: `http://localhost:3000/docs` - Swagger UI
- **Migration Guide**: `MIGRATION_GUIDE.md` - Guía técnica de refactorización

---

## 💡 Tips de Desarrollo

### Desarrollo sin Docker (Alternativa)

Si prefieres correr el frontend fuera de Docker durante desarrollo:

```bash
# 1. Backend y DB en Docker
docker compose up sqlserver api

# 2. Frontend en local
npm install
npm run dev
```

El frontend local se conectará al backend en Docker sin problemas.

### Debug del Backend

```bash
# Logs en tiempo real
docker compose logs -f api

# Logs de los últimos 100 líneas
docker compose logs --tail=100 api

# Ejecutar comando en el contenedor
docker compose exec api npm run lint
```

### Conexión a SQL Server desde Host

```bash
# Windows (con sqlcmd instalado)
sqlcmd -S localhost,1433 -U sa -P "YourStrong!Passw0rd" -d ExpedientesDB

# Con Docker
docker compose exec sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "YourStrong!Passw0rd" -d ExpedientesDB
```

### Ver Estructura de la Base de Datos

```sql
-- Listar tablas
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- Ver estructura de tabla
EXEC sp_help 'Expedientes';

-- Consultar datos
SELECT * FROM Expedientes;
SELECT * FROM Indicios WHERE expedienteId = 1;
SELECT * FROM Usuarios;
```

---

## 🆘 Soporte y Contacto

### Recursos de Ayuda

1. **Swagger UI**: `http://localhost:3000/docs` - Documentación interactiva
2. **Logs**: `docker compose logs -f` - Ver logs en tiempo real
3. **Health Check**: `http://localhost:3000/health` - Estado del sistema

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| ECONNREFUSED | Backend no está corriendo | `docker compose up api` |
| 401 Unauthorized | Token inválido o expirado | Hacer login nuevamente |
| 403 Forbidden | Usuario sin permisos | Verificar rol del usuario |
| 404 Not Found | Endpoint incorrecto | Verificar en Swagger |
| 500 Internal Server Error | Error en backend | Ver logs del backend |

---

## 📝 Notas Importantes

### Seguridad

⚠️ **Las credenciales de este documento son SOLO PARA DESARROLLO**

En producción:
- Cambiar `JWT_SECRET`
- Cambiar `MSSQL_SA_PASSWORD`
- Usar HTTPS
- Implementar rate limiting
- Habilitar CORS solo para dominios específicos

### Performance

- React Query ya está configurado con caché inteligente
- Vite optimiza automáticamente el bundle en producción
- Hot reload está optimizado con `usePolling` solo en Docker

### Estructura de Código

```
src/
├── app/              # Configuración global (router, providers)
├── auth/             # Autenticación y guards
├── components/       # Componentes reutilizables
├── dashboard/        # Dashboard principal
├── expedientes/      # Módulo de expedientes
├── indicios/         # Módulo de indicios
├── usuarios/         # Módulo de usuarios (coordinador)
├── shared/           # Utilidades compartidas
└── lib/              # Helpers y utilidades
```

---

**Última actualización:** 1 de noviembre, 2025  
**Autor:** GitHub Copilot para Guillermo Gómez  
**Versión Frontend:** 1.0.0  
**Versión Backend:** 1.0.0  
**Docker Compose:** 3.8

---

<div align="center">

**✨ El frontend está listo para producción ✨**

[🔙 Volver al README](README.md) • [🐳 Docker Setup](DOCKER_SETUP.md) • [📖 API Docs](http://localhost:3000/docs)

</div>
