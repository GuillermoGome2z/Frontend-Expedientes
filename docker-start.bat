@echo off
REM Script de inicio rápido para Docker Compose (Windows)
REM Sistema de Gestión de Expedientes

echo 🐳 Iniciando Sistema de Expedientes con Docker...
echo.

REM Verificar que Docker está corriendo
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Docker no está corriendo
    echo    Por favor inicia Docker Desktop
    pause
    exit /b 1
)

echo ✅ Docker está corriendo
echo.

REM Detener contenedores anteriores si existen
echo 🔄 Deteniendo contenedores anteriores...
docker compose down 2>nul

echo.
echo 🏗️  Construyendo e iniciando contenedores...
echo    Esto puede tardar 3-5 minutos la primera vez
echo.

REM Iniciar servicios
docker compose up --build

REM Nota: Ctrl+C para detener
