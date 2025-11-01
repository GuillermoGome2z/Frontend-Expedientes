# Script para verificar capturas de pantalla del README

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICACION DE CAPTURAS DE PANTALLA " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$screenshotsPath = "public/screenshots"
$requiredImages = @(
    "dashboard.png",
    "expedientes.png",
    "detalle.png",
    "usuarios.png"
)

# Verificar que existe la carpeta
if (Test-Path $screenshotsPath) {
    Write-Host "[OK] Carpeta screenshots encontrada" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[ERROR] Carpeta screenshots NO encontrada" -ForegroundColor Red
    Write-Host "   Creando carpeta..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $screenshotsPath -Force | Out-Null
    Write-Host "[OK] Carpeta creada" -ForegroundColor Green
    Write-Host ""
}

# Verificar cada imagen
$allPresent = $true
$missingImages = @()

Write-Host "Verificando capturas requeridas:" -ForegroundColor Yellow
Write-Host ""

foreach ($image in $requiredImages) {
    $imagePath = Join-Path $screenshotsPath $image
    if (Test-Path $imagePath) {
        $fileInfo = Get-Item $imagePath
        $sizeKB = [math]::Round($fileInfo.Length / 1KB, 2)
        Write-Host "   [OK] $image ($sizeKB KB)" -ForegroundColor Green
    } else {
        Write-Host "   [X]  $image - FALTA" -ForegroundColor Red
        $missingImages += $image
        $allPresent = $false
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allPresent) {
    Write-Host "  TODAS LAS CAPTURAS ESTAN LISTAS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Puedes hacer commit y push:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'docs: Agregar capturas del sistema'" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
} else {
    Write-Host "  FALTAN ALGUNAS CAPTURAS" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Capturas faltantes:" -ForegroundColor Yellow
    foreach ($missing in $missingImages) {
        Write-Host "  - $missing" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "INSTRUCCIONES PARA TOMAR CAPTURAS:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Levantar aplicacion: npm run docker:up" -ForegroundColor White
    Write-Host "2. Abrir: http://localhost:5173" -ForegroundColor White
    Write-Host "3. Login: coord1 / Coord123!" -ForegroundColor White
    Write-Host "4. Presiona Windows + Shift + S para cada captura" -ForegroundColor White
    Write-Host ""
    Write-Host "Capturas necesarias:" -ForegroundColor Cyan
    Write-Host "  - dashboard.png     (Pagina principal con metricas)" -ForegroundColor White
    Write-Host "  - expedientes.png   (Lista de expedientes con filtros)" -ForegroundColor White
    Write-Host "  - detalle.png       (Detalle de expediente + indicios)" -ForegroundColor White
    Write-Host "  - usuarios.png      (Modulo de usuarios - solo coordinador)" -ForegroundColor White
    Write-Host ""
    Write-Host "5. Guardar capturas en: $screenshotsPath" -ForegroundColor White
    Write-Host "6. Ejecutar este script nuevamente" -ForegroundColor White
}

Write-Host ""
