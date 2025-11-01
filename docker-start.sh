#!/bin/bash

# Script de inicio rápido para Docker Compose
# Sistema de Gestión de Expedientes

echo "🐳 Iniciando Sistema de Expedientes con Docker..."
echo ""

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    echo "   Por favor inicia Docker Desktop"
    exit 1
fi

echo "✅ Docker está corriendo"
echo ""

# Detener contenedores anteriores si existen
echo "🔄 Deteniendo contenedores anteriores..."
docker compose down 2>/dev/null

echo ""
echo "🏗️  Construyendo e iniciando contenedores..."
echo "   Esto puede tardar 3-5 minutos la primera vez"
echo ""

# Iniciar servicios
docker compose up --build

# Nota: Ctrl+C para detener
