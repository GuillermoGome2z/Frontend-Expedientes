# Script para levantar el Frontend en Docker

Write-Host "🚀 Levantando Frontend en Docker..." -ForegroundColor Cyan
Write-Host ""

# Detener cualquier proceso local de Node/Vite
Write-Host "📛 Deteniendo procesos locales de Node..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Levantar el contenedor
Write-Host "🐳 Construyendo y levantando contenedor del frontend..." -ForegroundColor Green
docker compose -f docker-compose-frontend.yml up --build -d

Write-Host ""
Write-Host "✅ Frontend levantado en Docker!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Accede a la aplicación en: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Comandos útiles:" -ForegroundColor Yellow
Write-Host "   - Ver logs:      docker logs expedientes-web -f"
Write-Host "   - Ver estado:    docker ps"
Write-Host "   - Detener:       docker compose -f docker-compose-frontend.yml down"
Write-Host "   - Reiniciar:     docker compose -f docker-compose-frontend.yml restart"
Write-Host ""
