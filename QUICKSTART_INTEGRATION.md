# 🚀 Quick Start - Integración Frontend con Backend Docker

## TL;DR - Pasos Mínimos

### 1. Verifica que tienes todo listo

```bash
# Confirmar que Docker Desktop está corriendo
docker --version

# Confirmar que tienes el .env configurado
cat .env
# Debe mostrar: VITE_API_URL=http://localhost:3000/api
```

### 2. Levantar todo

```bash
# Desde la raíz del proyecto
npm run docker:up
```

### 3. Esperar ~1 minuto para que todo inicie

```bash
# Ver progreso en otra terminal
npm run docker:logs
```

### 4. Verificar que todo funciona

Abrir en tu navegador:

- ✅ **Frontend**: http://localhost:5173
- ✅ **Backend API**: http://localhost:3000/health
- ✅ **Swagger Docs**: http://localhost:3000/docs

---

## 🔗 URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| 🎨 **Frontend** | http://localhost:5173 | App React |
| 🔌 **Backend** | http://localhost:3000/api | API REST |
| 📚 **Docs** | http://localhost:3000/docs | Swagger UI |
| 💚 **Health** | http://localhost:3000/health | Status check |

---

## 🔐 Credenciales de Prueba

```
Coordinador:
  username: coord1
  password: Coord123!

Técnico:
  username: tecnico1
  password: tecnico123
```

---

## 📡 Ejemplo de Login (Axios)

```typescript
import { fetcher } from '@/shared/fetcher';

const login = async (username: string, password: string) => {
  const response = await fetcher.post('/auth/login', { 
    username, 
    password 
  });
  
  const { token, user } = response.data.data;
  localStorage.setItem('token', token);
  return user;
};
```

---

## 📊 Formato de Respuestas

### Success
```json
{
  "success": true,
  "data": { /* tu payload aquí */ }
}
```

### Error
```json
{
  "success": false,
  "error": "Mensaje descriptivo"
}
```

### Paginación
```json
{
  "success": true,
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 50,
    "data": [ /* items */ ]
  }
}
```

---

## 🐛 Troubleshooting Rápido

### Error: "Network Error"

```bash
# 1. Verificar que el backend esté corriendo
curl http://localhost:3000/health

# 2. Ver logs del backend
docker compose logs api

# 3. Reiniciar servicios
docker compose restart api web
```

### Error: Hot reload no funciona

```bash
# Reiniciar el contenedor del frontend
docker compose restart web
```

### Error: Puerto 5173 ocupado

```bash
# Windows - encontrar y matar proceso
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
ports:
  - "5174:5173"
```

---

## 🎯 Endpoints Principales

### Autenticación
```http
POST /api/auth/login
Body: { "username": "coord1", "password": "Coord123!" }
```

### Expedientes
```http
GET    /api/expedientes?page=1&pageSize=10
POST   /api/expedientes
GET    /api/expedientes/:id
PUT    /api/expedientes/:id
PATCH  /api/expedientes/:id/estado
GET    /api/expedientes/export
```

### Indicios
```http
GET    /api/indicios/expediente/:expedienteId
POST   /api/indicios
PUT    /api/indicios/:id
PATCH  /api/indicios/:id/activo
```

### Usuarios (Solo Coordinador)
```http
GET    /api/usuarios?page=1&pageSize=10
POST   /api/usuarios
PATCH  /api/usuarios/:id/password
PATCH  /api/usuarios/:id/activo
```

**Nota:** Todos requieren header `Authorization: Bearer <token>` excepto `/auth/login`

---

## 📚 Documentación Completa

Para más detalles, consulta:

- 📖 **[FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)** - Guía completa de integración
- 📘 **[README.md](README.md)** - Documentación general del proyecto
- 🐳 **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Configuración Docker detallada
- 🌐 **Swagger UI**: http://localhost:3000/docs - API interactiva

---

## 💻 Comandos Docker Útiles

```bash
# Levantar todo
npm run docker:up

# Ver logs
npm run docker:logs

# Reiniciar servicios
npm run docker:restart

# Detener todo
npm run docker:down

# Limpiar todo (incluye volúmenes)
npm run compose:clean

# Ver estado de contenedores
docker compose ps

# Logs solo del frontend
docker compose logs -f web

# Logs solo del backend
docker compose logs -f api

# Reconstruir un servicio
docker compose up --build web
```

---

## ✅ Checklist de Integración

- [x] `.env` configurado con `VITE_API_URL=http://localhost:3000/api`
- [x] `vite.config.ts` con `host: '0.0.0.0'` y `usePolling: true`
- [x] `fetcher.ts` usa variable de entorno correcta
- [x] `docker-compose.yml` configurado con volúmenes optimizados
- [x] Dockerfile optimizado para desarrollo
- [ ] `docker compose up` sin errores
- [ ] Frontend accesible en http://localhost:5173
- [ ] Backend responde en http://localhost:3000/health
- [ ] Login funciona con credenciales de prueba
- [ ] Hot reload funciona al editar código

---

## 🎯 Próximo Paso

```bash
npm run docker:up
```

Luego abre http://localhost:5173 y haz login con **coord1** / **Coord123!**

---

<div align="center">

**¡Todo está listo para empezar a desarrollar! 🚀**

[📖 Guía Completa](FRONTEND_INTEGRATION_GUIDE.md) • [🏠 README](README.md) • [🐳 Docker](DOCKER_SETUP.md)

</div>
