# Script de verificacion pre-Docker para Windows
# Verifica que todos los archivos necesarios existen antes de levantar los contenedores

Write-Host ""
Write-Host "Verificando archivos necesarios para Docker..." -ForegroundColor Cyan
Write-Host ""

$script:errors = 0
$script:warnings = 0

# Funcion para verificar archivo
function Check-File {
    param([string]$path)
    if (Test-Path $path -PathType Leaf) {
        Write-Host "[OK] $path" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "[FALTA] $path" -ForegroundColor Red
        $script:errors++
        return $false
    }
}

# Funcion para verificar directorio
function Check-Dir {
    param([string]$path)
    if (Test-Path $path -PathType Container) {
        Write-Host "[OK] $path/" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "[WARN] $path/" -ForegroundColor Yellow
        $script:warnings++
        return $false
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
Write-Host "================================================" -ForegroundColor Cyan

if ($script:errors -eq 0) {
    Write-Host ""
    Write-Host "[SUCCESS] Todos los archivos criticos estan presentes" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para levantar los contenedores, ejecuta:" -ForegroundColor Cyan
    Write-Host "  npm run docker:up" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "O directamente:" -ForegroundColor Cyan
    Write-Host "  docker compose up --build" -ForegroundColor Yellow
    Write-Host ""
    exit 0
}
else {
    Write-Host ""
    Write-Host "[ERROR] Faltan $($script:errors) archivo(s) critico(s)" -ForegroundColor Red
    if ($script:warnings -gt 0) {
        Write-Host "[WARN] Hay $($script:warnings) advertencia(s)" -ForegroundColor Yellow
    }
    Write-Host ""
    exit 1
}
