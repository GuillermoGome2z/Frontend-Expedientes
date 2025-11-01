# Script para detener TODO el stack

Write-Host "🛑 Deteniendo Stack Completo de Expedientes..." -ForegroundColor Yellow
Write-Host ""

# Detener frontend
Write-Host "Deteniendo frontend..." -ForegroundColor Yellow
docker compose -f docker-compose-frontend.yml down

# Detener backend y BD
Write-Host "Deteniendo backend y base de datos..." -ForegroundColor Yellow
docker stop expedientes-api expedientes-sqlserver 2>$null

Write-Host ""
Write-Host "✅ Stack completo detenido!" -ForegroundColor Green
Write-Host ""
