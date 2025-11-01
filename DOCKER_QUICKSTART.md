# 🐳 Docker - Inicio Rápido

## ⚡ Comandos Esenciales

```bash
# 1. Verificar archivos (opcional)
.\docker-check.ps1              # Windows
./docker-check.sh               # Linux/Mac

# 2. Levantar todos los contenedores
npm run docker:up

# 3. Ver logs en tiempo real
npm run docker:logs

# 4. Detener contenedores
npm run docker:down

# 5. Reiniciar servicios
npm run docker:restart
```

## 📋 Checklist Pre-Inicio

- [ ] Copiar `.env.docker.example` a `.env.docker`
- [ ] Verificar que el backend tiene su `Dockerfile` y `.env.docker`
- [ ] Tener Docker Desktop instalado y corriendo
- [ ] Puerto 5173 (frontend) libre
- [ ] Puerto 3000 (backend) libre
- [ ] Puerto 1433 (SQL Server) libre

## 🎯 URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicación web |
| **Backend API** | http://localhost:3000/api | API REST |
| **Health Check** | http://localhost:3000/api/health | Estado del backend |
| **SQL Server** | localhost:1433 | Base de datos |

## 🔐 Credenciales por Defecto

### SQL Server
```
Server: localhost,1433
User: sa
Password: YourStrong@Passw0rd
Database: ExpedientesDB
```

### Usuario Admin (crear en el backend)
```
Username: admin
Password: admin123
Rol: coordinador
```

## 📸 Evidencias Requeridas

1. **Contenedores corriendo**
   ```bash
   docker ps
   ```

2. **Frontend funcionando**
   - Captura de http://localhost:5173

3. **Backend health check**
   - Captura de http://localhost:3000/api/health

4. **Crear expediente desde UI**
   - Login → Expedientes → Crear
   - Llenar formulario y guardar

5. **Verificar en Base de Datos**
   ```bash
   # Entrar al contenedor SQL Server
   docker exec -it expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -C
   
   # Ejecutar queries
   USE ExpedientesDB;
   GO
   
   SELECT * FROM Expedientes;
   GO
   
   SELECT * FROM Indicios WHERE expedienteId = 1;
   GO
   ```

## 🐛 Troubleshooting

### Error: "Puerto ya en uso"
```bash
# Ver qué proceso usa el puerto 5173
netstat -ano | findstr :5173    # Windows
lsof -i :5173                   # Linux/Mac

# Detener contenedores anteriores
docker compose down
```

### Error: "Cannot connect to SQL Server"
```bash
# Ver logs del contenedor
docker logs expedientes-sqlserver

# Reiniciar solo SQL Server
docker compose restart sqlserver
```

### Error: "Frontend no carga"
```bash
# Ver logs del frontend
docker logs expedientes-web -f

# Verificar variables de entorno
docker exec expedientes-web printenv | grep VITE
```

## 📚 Documentación Completa

Para instrucciones detalladas, consulta: **[DOCKER_SETUP.md](DOCKER_SETUP.md)**

## 🔄 Flujo de Trabajo Recomendado

```bash
# 1. Primera vez / Cambios importantes
npm run docker:up

# 2. Desarrollo activo (ver logs)
npm run docker:logs

# 3. Cambios en código (hot reload automático)
# No hace falta reiniciar, Vite recarga automáticamente

# 4. Cambios en dependencias (package.json)
npm run docker:down
npm run docker:up

# 5. Al terminar el día
npm run docker:down
```

## ✅ Verificación Rápida

```bash
# 1. Levantar
npm run docker:up

# 2. Esperar 30 segundos y verificar
curl http://localhost:3000/api/health
curl http://localhost:5173

# 3. Si ambos responden, ¡todo funciona! ✨
```
