# 🔍 Script de Verificación de Integración Frontend-Backend
# Verifica que todo esté correctamente configurado para Docker

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICACION DE INTEGRACION DOCKER   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# 1. Verificar Docker
Write-Host "[1/10] Verificando Docker Desktop..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   OK - Docker instalado: $dockerVersion" -ForegroundColor Green
    } else {
        Write-Host "   ERROR - Docker no esta instalado o no esta corriendo" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "   ERROR - Docker no esta disponible" -ForegroundColor Red
    $allGood = $false
}

# 2. Verificar docker-compose.yml
Write-Host "[2/10] Verificando docker-compose.yml..." -ForegroundColor Yellow
if (Test-Path "docker-compose.yml") {
    Write-Host "   OK - Archivo docker-compose.yml encontrado" -ForegroundColor Green
    
    # Verificar que contiene el servicio web
    $composeContent = Get-Content "docker-compose.yml" -Raw
    if ($composeContent -match "web:") {
        Write-Host "   OK - Servicio 'web' configurado" -ForegroundColor Green
    } else {
        Write-Host "   ADVERTENCIA - Servicio 'web' no encontrado" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ERROR - docker-compose.yml no encontrado" -ForegroundColor Red
    $allGood = $false
}

# 3. Verificar Dockerfile
Write-Host "[3/10] Verificando Dockerfile..." -ForegroundColor Yellow
if (Test-Path "Dockerfile") {
    Write-Host "   OK - Dockerfile encontrado" -ForegroundColor Green
} else {
    Write-Host "   ERROR - Dockerfile no encontrado" -ForegroundColor Red
    $allGood = $false
}

# 4. Verificar .env
Write-Host "[4/10] Verificando archivo .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   OK - Archivo .env encontrado" -ForegroundColor Green
    
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "VITE_API_URL") {
        $apiUrl = ($envContent -split "`n" | Select-String "VITE_API_URL").ToString().Trim()
        Write-Host "   OK - $apiUrl" -ForegroundColor Green
        
        if ($apiUrl -match "http://localhost:3000/api") {
            Write-Host "   OK - URL del backend correcta" -ForegroundColor Green
        } else {
            Write-Host "   ADVERTENCIA - URL del backend puede ser incorrecta" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ERROR - VITE_API_URL no definida en .env" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "   ERROR - Archivo .env no encontrado" -ForegroundColor Red
    $allGood = $false
}

# 5. Verificar vite.config.ts
Write-Host "[5/10] Verificando vite.config.ts..." -ForegroundColor Yellow
if (Test-Path "vite.config.ts") {
    Write-Host "   OK - vite.config.ts encontrado" -ForegroundColor Green
    
    $viteContent = Get-Content "vite.config.ts" -Raw
    if ($viteContent -match "host.*0\.0\.0\.0") {
        Write-Host "   OK - host: 0.0.0.0 configurado (Docker ready)" -ForegroundColor Green
    } else {
        Write-Host "   ADVERTENCIA - host: 0.0.0.0 no encontrado" -ForegroundColor Yellow
    }
    
    if ($viteContent -match "usePolling.*true") {
        Write-Host "   OK - usePolling: true configurado (hot reload)" -ForegroundColor Green
    } else {
        Write-Host "   ADVERTENCIA - usePolling: true no encontrado" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ERROR - vite.config.ts no encontrado" -ForegroundColor Red
    $allGood = $false
}

# 6. Verificar src/shared/env.ts
Write-Host "[6/10] Verificando src/shared/env.ts..." -ForegroundColor Yellow
if (Test-Path "src/shared/env.ts") {
    Write-Host "   OK - env.ts encontrado" -ForegroundColor Green
    
    $envTsContent = Get-Content "src/shared/env.ts" -Raw
    if ($envTsContent -match "VITE_API_URL") {
        Write-Host "   OK - VITE_API_URL importada correctamente" -ForegroundColor Green
    }
} else {
    Write-Host "   ERROR - src/shared/env.ts no encontrado" -ForegroundColor Red
    $allGood = $false
}

# 7. Verificar src/shared/fetcher.ts
Write-Host "[7/10] Verificando src/shared/fetcher.ts..." -ForegroundColor Yellow
if (Test-Path "src/shared/fetcher.ts") {
    Write-Host "   OK - fetcher.ts encontrado" -ForegroundColor Green
    
    $fetcherContent = Get-Content "src/shared/fetcher.ts" -Raw
    if ($fetcherContent -match "API_URL") {
        Write-Host "   OK - API_URL importada en fetcher" -ForegroundColor Green
    }
} else {
    Write-Host "   ERROR - src/shared/fetcher.ts no encontrado" -ForegroundColor Red
    $allGood = $false
}

# 8. Verificar package.json
Write-Host "[8/10] Verificando scripts de Docker en package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    if ($packageJson.scripts."docker:up") {
        Write-Host "   OK - Script docker:up encontrado" -ForegroundColor Green
    } else {
        Write-Host "   ADVERTENCIA - Script docker:up no encontrado" -ForegroundColor Yellow
    }
    
    if ($packageJson.scripts."docker:down") {
        Write-Host "   OK - Script docker:down encontrado" -ForegroundColor Green
    } else {
        Write-Host "   ADVERTENCIA - Script docker:down no encontrado" -ForegroundColor Yellow
    }
    
    if ($packageJson.scripts."docker:logs") {
        Write-Host "   OK - Script docker:logs encontrado" -ForegroundColor Green
    } else {
        Write-Host "   ADVERTENCIA - Script docker:logs no encontrado" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ERROR - package.json no encontrado" -ForegroundColor Red
    $allGood = $false
}

# 9. Verificar node_modules
Write-Host "[9/10] Verificando dependencias instaladas..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   OK - node_modules encontrado" -ForegroundColor Green
} else {
    Write-Host "   ADVERTENCIA - node_modules no encontrado. Ejecuta: npm install" -ForegroundColor Yellow
}

# 10. Verificar documentacion
Write-Host "[10/10] Verificando documentacion de integracion..." -ForegroundColor Yellow
$docs = @(
    "FRONTEND_INTEGRATION_GUIDE.md",
    "QUICKSTART_INTEGRATION.md",
    "README.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "   OK - $doc encontrado" -ForegroundColor Green
    } else {
        Write-Host "   ADVERTENCIA - $doc no encontrado" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "  TODO LISTO PARA DOCKER!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Yellow
    Write-Host "  1. npm run docker:up" -ForegroundColor White
    Write-Host "  2. Esperar ~1 minuto" -ForegroundColor White
    Write-Host "  3. Abrir http://localhost:5173" -ForegroundColor White
    Write-Host "  4. Login: coord1 / Coord123!" -ForegroundColor White
    Write-Host ""
    Write-Host "Ver logs: npm run docker:logs" -ForegroundColor Cyan
    Write-Host "Detener: npm run docker:down" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Documentacion: FRONTEND_INTEGRATION_GUIDE.md" -ForegroundColor Cyan
} else {
    Write-Host "  ALGUNOS PROBLEMAS ENCONTRADOS" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Por favor revisa los errores marcados arriba." -ForegroundColor Yellow
    Write-Host "Consulta: FRONTEND_INTEGRATION_GUIDE.md" -ForegroundColor Cyan
}

Write-Host ""
