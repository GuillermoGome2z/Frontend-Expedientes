#!/bin/bash

# Script de verificación pre-Docker
# Verifica que todos los archivos necesarios existen antes de levantar los contenedores

echo "🔍 Verificando archivos necesarios para Docker..."
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1 ${RED}(FALTA)${NC}"
        ((errors++))
    fi
}

# Función para verificar directorio
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
    else
        echo -e "${YELLOW}⚠${NC} $1/ ${YELLOW}(FALTA)${NC}"
        ((warnings++))
    fi
}

echo "📦 Frontend:"
check_file "Dockerfile"
check_file ".env.docker"
check_file "package.json"
check_file "vite.config.ts"

echo ""
echo "🗄️ Base de datos:"
check_file "docker-compose.yml"

echo ""
echo "📚 Documentación:"
check_file "DOCKER_SETUP.md"

echo ""
echo "🔧 Configuración:"
check_file ".dockerignore"
check_dir ".devcontainer"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✓ Todos los archivos críticos están presentes${NC}"
    echo ""
    echo "Para levantar los contenedores, ejecuta:"
    echo "  npm run docker:up"
    echo ""
    echo "O directamente:"
    echo "  docker compose up --build"
    exit 0
else
    echo -e "${RED}✗ Faltan $errors archivo(s) crítico(s)${NC}"
    if [ $warnings -gt 0 ]; then
        echo -e "${YELLOW}⚠ Hay $warnings advertencia(s)${NC}"
    fi
    exit 1
fi
