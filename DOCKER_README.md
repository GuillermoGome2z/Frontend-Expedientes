# 🐳 Guía de Despliegue con Docker

Esta guía te permitirá levantar el sistema completo (Frontend + Backend + SQL Server) usando Docker y Docker Compose, además de generar evidencias de funcionamiento para entrega.

---

## 📋 Pre-requisitos

- **Docker Desktop** instalado (Windows/Mac/Linux)
- **Docker Compose** v2.x o superior
- **Git** (para clonar el repositorio)
- Puertos disponibles: `1433` (SQL Server), `3000` (Backend), `5173` (Frontend)

---

## 🚀 Paso 1: Levantar el Sistema Completo

### 1.1 Clonar el repositorio (si no lo has hecho)

```bash
git clone https://github.com/GuillermoGome2z/Frontend-Expedientes.git
cd Frontend-Expedientes-1
```

### 1.2 Construir e iniciar los contenedores

```bash
# Método 1: Docker Compose v2
docker compose up --build

# Método 2: Docker Compose v1 (legacy)
docker-compose up --build

# Modo detached (en segundo plano)
docker compose up -d --build
```

**⏱️ Tiempo estimado:** 3-5 minutos la primera vez (descarga imágenes, instala dependencias)

**✅ Servicios levantados:**
1. **SQL Server** → `localhost:1433`
2. **Backend API** → `http://localhost:3000/api`
3. **Frontend Web** → `http://localhost:5173`

---

## 🔍 Paso 2: Verificar que todo está funcionando

### 2.1 Verificar salud del backend

Abre tu navegador en:
```
http://localhost:3000/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2025-11-01T...",
  "database": {
    "connected": true
  }
}
```

### 2.2 Acceder al Frontend

Abre tu navegador en:
```
http://localhost:5173
```

Deberías ver la página de login del sistema.

**Credenciales por defecto:**
- Usuario: `admin` (o el coordinador que crees)
- Contraseña: `123456`

---

## 📸 Paso 3: Generar Evidencias (Capturas Requeridas)

### Evidencia 1: Sistema funcionando

**📷 Captura 1:** Página de login
- URL: `http://localhost:5173`

**📷 Captura 2:** Dashboard después de iniciar sesión
- Muestra las métricas de expedientes

**📷 Captura 3:** Health check del backend
- URL: `http://localhost:3000/api/health`
- Debe mostrar `"connected": true`

---

### Evidencia 2: Crear un Expediente desde la UI

1. **Inicia sesión** como coordinador
2. **Ve a "Expedientes"** → **"Nuevo Expediente"**
3. **Completa el formulario:**
   - Código: `EXP-DOCKER-001`
   - Título: `Prueba de Docker Compose`
   - Descripción: `Expediente creado para evidencia de contenedores`
4. **Clic en "Guardar"**

**📷 Captura 4:** Formulario completo antes de guardar
**📷 Captura 5:** Lista de expedientes mostrando el nuevo registro

---

### Evidencia 3: Cambiar Estado de un Expediente

1. **Selecciona el expediente** `EXP-DOCKER-001`
2. **Clic en "Ver"** para abrir el detalle
3. **Clic en "Aprobar Expediente"** (solo coordinadores)
4. **Confirma la acción**

**📷 Captura 6:** Botón "Aprobar Expediente" visible
**📷 Captura 7:** Badge del estado cambiado a "Aprobado" (verde)

---

### Evidencia 4: Verificar en la Base de Datos (SQL Server)

#### Opción A: Usando Docker Exec + sqlcmd

```bash
# 1. Entrar al contenedor de SQL Server
docker exec -it expedientes-sqlserver /bin/bash

# 2. Conectarse con sqlcmd
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd'

# 3. Seleccionar la base de datos
USE ExpedientesDB;
GO

# 4. Consultar expedientes
SELECT 
    id,
    codigo,
    titulo,
    estado,
    createdAt,
    updatedAt
FROM Expedientes
WHERE codigo LIKE 'EXP-DOCKER%'
ORDER BY id DESC;
GO

# 5. Verificar usuarios
SELECT 
    id,
    username,
    rol,
    activo,
    createdAt
FROM Usuarios;
GO

# 6. Verificar indicios (si agregaste alguno)
SELECT 
    i.id,
    i.descripcion,
    i.peso,
    i.color,
    e.codigo AS expediente_codigo
FROM Indicios i
INNER JOIN Expedientes e ON i.expedienteId = e.id
WHERE e.codigo = 'EXP-DOCKER-001';
GO

# 7. Salir de sqlcmd
EXIT

# 8. Salir del contenedor
exit
```

**📷 Captura 8:** Terminal mostrando el comando `docker exec -it expedientes-sqlserver`

**📷 Captura 9:** Resultado de la consulta SELECT mostrando:
- El expediente `EXP-DOCKER-001`
- Estado: `Aprobado`
- Fechas de creación y actualización

---

#### Opción B: Usando Azure Data Studio / SQL Server Management Studio

1. **Instalar Azure Data Studio** (recomendado) o SSMS
2. **Conectar a la base de datos:**
   - Server: `localhost,1433`
   - Authentication: SQL Login
   - User: `sa`
   - Password: `YourStrong!Passw0rd`
   - Database: `ExpedientesDB`

3. **Ejecutar las mismas queries:**

```sql
-- Ver todos los expedientes
SELECT * FROM Expedientes ORDER BY id DESC;

-- Ver el expediente específico
SELECT * FROM Expedientes WHERE codigo = 'EXP-DOCKER-001';

-- Ver cambios de estado (si tienes tabla de auditoría)
SELECT * FROM ExpedienteLogs WHERE expedienteId = (
    SELECT id FROM Expedientes WHERE codigo = 'EXP-DOCKER-001'
);
```

**📷 Captura 10:** Azure Data Studio mostrando conexión exitosa y resultados

---

## 🛠️ Comandos Útiles de Docker

### Ver logs de los servicios

```bash
# Ver logs de todos los servicios
docker compose logs

# Ver logs solo del backend
docker compose logs api

# Ver logs solo del frontend
docker compose logs web

# Ver logs de SQL Server
docker compose logs sqlserver

# Ver logs en tiempo real (follow)
docker compose logs -f api
```

### Reiniciar un servicio específico

```bash
# Reiniciar backend
docker compose restart api

# Reiniciar frontend
docker compose restart web
```

### Detener todo

```bash
# Detener sin eliminar contenedores
docker compose stop

# Detener y eliminar contenedores
docker compose down

# Detener, eliminar contenedores y volúmenes (⚠️ borra la BD)
docker compose down -v
```

### Ver estado de contenedores

```bash
docker compose ps
```

### Reconstruir sin cache

```bash
docker compose build --no-cache
docker compose up
```

---

## 🔧 Troubleshooting

### Problema: Puerto 1433 ya está en uso

```bash
# Windows: Ver qué proceso usa el puerto
netstat -ano | findstr :1433

# Matar el proceso (reemplaza PID)
taskkill /PID <PID> /F

# O cambia el puerto en docker-compose.yml:
ports:
  - "1434:1433"  # Usa 1434 en tu host
```

### Problema: SQL Server no arranca (healthcheck failed)

```bash
# Ver logs detallados
docker compose logs sqlserver

# Verificar que tienes al menos 2GB de RAM disponible
# SQL Server requiere mínimo 2GB
```

### Problema: Backend no conecta a la BD

```bash
# Verificar que SQL Server está healthy
docker compose ps

# Ver logs del backend
docker compose logs api

# Verificar variables de entorno
docker exec expedientes-api env | grep DB_
```

### Problema: Frontend no carga o muestra pantalla en blanco

```bash
# Ver logs del frontend
docker compose logs web

# Verificar que el archivo .env.docker existe
cat .env.docker

# Reconstruir el frontend
docker compose up -d --build web
```

---

## 📊 Evidencias Finales a Entregar

### Lista de Capturas Requeridas:

1. ✅ **Captura 1:** Login page del frontend (http://localhost:5173)
2. ✅ **Captura 2:** Dashboard con métricas después de login
3. ✅ **Captura 3:** Health check del backend mostrando BD conectada
4. ✅ **Captura 4:** Formulario de crear expediente completo
5. ✅ **Captura 5:** Lista de expedientes con el nuevo registro
6. ✅ **Captura 6:** Detalle del expediente con botón "Aprobar"
7. ✅ **Captura 7:** Badge de estado "Aprobado" (verde)
8. ✅ **Captura 8:** Terminal con comando docker exec
9. ✅ **Captura 9:** Resultado de SELECT en sqlcmd mostrando el expediente
10. ✅ **Captura 10:** (Opcional) Azure Data Studio con conexión y query

### Documento de Evidencias Sugerido:

```markdown
# Evidencias de Despliegue con Docker

## 1. Sistema Levantado
- [Captura 1] Login
- [Captura 2] Dashboard
- [Captura 3] Health Check

## 2. Operaciones CRUD
- [Captura 4] Crear expediente
- [Captura 5] Lista actualizada
- [Captura 6] Detalle del expediente
- [Captura 7] Cambio de estado

## 3. Verificación en Base de Datos
- [Captura 8] Acceso a contenedor SQL Server
- [Captura 9] Query SELECT con resultados
- [Captura 10] (Opcional) Cliente gráfico

## 4. Comandos Ejecutados

\`\`\`bash
docker compose up --build
docker exec -it expedientes-sqlserver /bin/bash
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd'
SELECT * FROM Expedientes WHERE codigo = 'EXP-DOCKER-001';
\`\`\`

## 5. Conclusiones
- Sistema desplegado correctamente con 3 contenedores
- Frontend y Backend comunicándose via red Docker
- Base de datos persistente con volumen Docker
- Operaciones CRUD verificadas en la BD
```

---

## 🎯 Resumen de URLs

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:5173 | Interfaz de usuario (Vite) |
| Backend | http://localhost:3000/api | API REST (Express) |
| Health Check | http://localhost:3000/api/health | Estado del backend y BD |
| SQL Server | localhost:1433 | Base de datos (acceso con sa) |

---

## 📦 Estructura de Archivos Docker

```
Frontend-Expedientes-1/
├── docker-compose.yml          # Orquestación de servicios
├── Dockerfile                  # Imagen del frontend
├── .env.docker                 # Variables del frontend
├── backend/
│   ├── Dockerfile             # Imagen del backend
│   └── .env.docker            # Variables del backend
├── logs/                      # Logs del backend (montado)
└── sql-init/                  # Scripts iniciales de BD (opcional)
```

---

## 🎓 Notas Importantes

1. **Contraseña de SA:** En producción, usa contraseñas más fuertes y almacénalas en secretos
2. **Volúmenes:** Los datos de SQL Server persisten en el volumen `sqlserver-data`
3. **Hot Reload:** Los cambios en el código se reflejan automáticamente (nodemon + Vite HMR)
4. **Logs:** Se guardan en `./logs` para el backend
5. **Red Docker:** Los servicios se comunican por nombres (api, sqlserver, web)

---

## 🆘 Soporte

Si tienes problemas:
1. Verifica los logs: `docker compose logs`
2. Asegúrate de tener Docker Desktop corriendo
3. Verifica que los puertos estén libres
4. Revisa las variables de entorno en `.env.docker`

---

**¡Listo para presentar! 🚀**
