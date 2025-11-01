# Script de verificación pre-Docker para Windows
# Verifica que todos los archivos necesarios existen antes de levantar los contenedores

Write-Host ""
Write-Host "🔍 Verificando archivos necesarios para Docker..." -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# Función para verificar archivo
function Check-File {
    param($path)
    if (Test-Path $path) {
        Write-Host "✓ $path" -ForegroundColor Green
    } else {
        Write-Host "✗ $path (FALTA)" -ForegroundColor Red
        $script:errors++
    }
}

# Función para verificar directorio
function Check-Dir {
    param($path)
    if (Test-Path $path) {
        Write-Host "✓ $path/" -ForegroundColor Green
    } else {
        Write-Host "⚠ $path/ (FALTA)" -ForegroundColor Yellow
        $script:warnings++
    }
}

Write-Host "📦 Frontend:"
Check-File "Dockerfile"
Check-File ".env.docker"
Check-File "package.json"
Check-File "vite.config.ts"

Write-Host ""
Write-Host "🗄️ Base de datos:"
Check-File "docker-compose.yml"

Write-Host ""
Write-Host "📚 Documentación:"
Check-File "DOCKER_SETUP.md"

Write-Host ""
Write-Host "🔧 Configuración:"
Check-File ".dockerignore"
Check-Dir ".devcontainer"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ($errors -eq 0) {
    Write-Host "✓ Todos los archivos críticos están presentes" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para levantar los contenedores, ejecuta:" -ForegroundColor Cyan
    Write-Host "  npm run docker:up" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "O directamente:" -ForegroundColor Cyan
    Write-Host "  docker compose up --build" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "✗ Faltan $errors archivo(s) crítico(s)" -ForegroundColor Red
    if ($warnings -gt 0) {
        Write-Host "⚠ Hay $warnings advertencia(s)" -ForegroundColor Yellow
    }
    exit 1
}
