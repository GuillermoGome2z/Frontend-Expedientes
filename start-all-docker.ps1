# Script para levantar TODO el stack (Frontend + Backend + BD)

Write-Host "🚀 Levantando Stack Completo de Expedientes..." -ForegroundColor Cyan
Write-Host ""

# Detener procesos locales de Node
Write-Host "📛 Deteniendo procesos locales..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Verificar si los contenedores de backend existen
$apiExists = docker ps -a --filter "name=expedientes-api" --format "{{.Names}}"
$sqlExists = docker ps -a --filter "name=expedientes-sqlserver" --format "{{.Names}}"

if ($apiExists -and $sqlExists) {
    Write-Host "🐳 Iniciando contenedores existentes del backend..." -ForegroundColor Green
    docker start expedientes-sqlserver
    docker start expedientes-api
} else {
    Write-Host "⚠️  Contenedores del backend no encontrados." -ForegroundColor Yellow
    Write-Host "   Asegúrate de tener el proyecto backend configurado." -ForegroundColor Yellow
}

# Levantar el frontend
Write-Host "🐳 Levantando contenedor del frontend..." -ForegroundColor Green
docker compose -f docker-compose-frontend.yml up -d

Write-Host ""
Write-Host "✅ Stack completo levantado!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Servicios disponibles:" -ForegroundColor Cyan
Write-Host "   - Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   - Backend:   http://localhost:3000" -ForegroundColor White
Write-Host "   - Database:  localhost:1433" -ForegroundColor White
Write-Host ""
Write-Host "📋 Ver estado:" -ForegroundColor Yellow
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
Write-Host ""
Write-Host "📋 Comandos útiles:" -ForegroundColor Yellow
Write-Host "   - Ver logs frontend:  docker logs expedientes-web -f"
Write-Host "   - Ver logs backend:   docker logs expedientes-api -f"
Write-Host "   - Ver logs BD:        docker logs expedientes-sqlserver -f"
Write-Host "   - Detener todo:       .\stop-all-docker.ps1"
Write-Host ""
