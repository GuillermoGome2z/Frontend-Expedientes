# ⚠️ IMPORTANTE: Dockerfile del Backend

## 📝 Pendiente

El **backend** necesita su propio `Dockerfile` y `.env.docker` para que el setup de Docker funcione completamente.

## 📍 Ubicación

Estos archivos deben estar en el repositorio del backend:
```
backend/
├── Dockerfile          ← CREAR ESTE
├── .env.docker         ← CREAR ESTE
├── .env.docker.example ← CREAR ESTE
├── package.json
├── tsconfig.json
└── src/
```

## 📦 Ejemplo de Dockerfile para el Backend

```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
```

## 🔧 Ejemplo de .env.docker para el Backend

```env
# backend/.env.docker
NODE_ENV=production
PORT=3000
BASE_PATH=/api

# SQL Server (nombre del servicio en docker-compose.yml)
DB_SERVER=sqlserver
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourStrong@Passw0rd
DB_DATABASE=ExpedientesDB

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production

# CORS
CORS_ORIGIN=http://localhost:5173
```

## ✅ Checklist para el Backend

- [ ] Crear `Dockerfile` en la raíz del backend
- [ ] Crear `.env.docker` (no subir a Git)
- [ ] Crear `.env.docker.example` (sí subir a Git)
- [ ] Actualizar la conexión a SQL Server para usar `process.env.DB_SERVER`
- [ ] Verificar que el backend lee `BASE_PATH` para las rutas
- [ ] Probar con `docker compose up --build`

## 🔗 Referencia

El `docker-compose.yml` del frontend ya está configurado y espera que el backend:
- Esté en el puerto **3000**
- Use el servicio `sqlserver` para la base de datos
- Tenga el endpoint `/api/health` funcionando

## 📞 Contacto

Una vez que el backend esté listo con su Dockerfile, podremos levantar todo el stack completo:
```bash
npm run docker:up
```

Y verificar en:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000/api/health
- Base de Datos: localhost:1433
