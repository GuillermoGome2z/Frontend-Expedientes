# Script para detener el Frontend en Docker

Write-Host "🛑 Deteniendo Frontend en Docker..." -ForegroundColor Yellow
Write-Host ""

docker compose -f docker-compose-frontend.yml down

Write-Host ""
Write-Host "✅ Frontend detenido!" -ForegroundColor Green
Write-Host ""
