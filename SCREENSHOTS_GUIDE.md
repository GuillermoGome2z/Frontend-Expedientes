# 📸 Guía para Capturas de Pantalla del README

## 🎯 Objetivo

Agregar capturas reales de tu sistema al README para que se vea profesional y muestre las funcionalidades.

---

## 📋 Checklist de Capturas

- [ ] **dashboard.png** - Dashboard Principal con métricas
- [ ] **expedientes.png** - Lista de expedientes con filtros
- [ ] **detalle.png** - Detalle de expediente con indicios
- [ ] **usuarios.png** - Módulo de gestión de usuarios

---

## 🚀 Paso a Paso

### 1️⃣ Levantar la Aplicación

```bash
# Opción A: Stack completo con Docker
npm run docker:up

# Esperar ~60 segundos

# Opción B: Solo frontend (si backend ya corre)
npm run dev
```

Abrir navegador: **http://localhost:5173**

---

### 2️⃣ Hacer Login

```
Usuario: coord1
Password: Coord123!
```

---

### 3️⃣ Tomar las Capturas

#### 📊 Captura 1: Dashboard (`dashboard.png`)

**Qué mostrar:**
- Panel de métricas
- Estadísticas de expedientes
- Acciones rápidas
- Health check del backend

**Cómo:**
1. Estás en el dashboard después del login
2. Presiona **Windows + Shift + S**
3. Selecciona toda el área del dashboard
4. Pega en Paint o tu editor
5. Guarda como: `dashboard.png`

---

#### 📂 Captura 2: Expedientes (`expedientes.png`)

**Qué mostrar:**
- Lista de expedientes en tabla
- Barra de búsqueda
- Filtros (estado, técnico, fechas)
- Paginación
- Botones de acción

**Cómo:**
1. Click en "Expedientes" en el navbar
2. Si hay pocos expedientes, crea algunos más
3. Presiona **Windows + Shift + S**
4. Captura la tabla completa con filtros
5. Guarda como: `expedientes.png`

---

#### 🔍 Captura 3: Detalle (`detalle.png`)

**Qué mostrar:**
- Información del expediente
- Lista de indicios asociados
- Botones de edición
- Estado del expediente

**Cómo:**
1. Desde la lista de expedientes, click en "Ver" en uno
2. Scroll para mostrar tanto info del expediente como indicios
3. Si no hay indicios, agrega uno primero
4. Presiona **Windows + Shift + S**
5. Captura el detalle completo
6. Guarda como: `detalle.png`

---

#### 👥 Captura 4: Usuarios (`usuarios.png`)

**Qué mostrar:**
- Tabla de usuarios
- Filtros por rol
- Botones de acciones (crear, editar password, activar/desactivar)
- Paginación

**Cómo:**
1. Click en "Usuarios" en el navbar (solo visible para coordinadores)
2. Presiona **Windows + Shift + S**
3. Captura la tabla completa
4. Guarda como: `usuarios.png`

---

### 4️⃣ Mover las Capturas

1. Abre el Explorador de Archivos
2. Navega a donde guardaste las capturas
3. Mueve/copia los 4 archivos a:

```
Frontend-Expedientes-1/public/screenshots/
```

La estructura debe quedar:
```
public/
└── screenshots/
    ├── dashboard.png
    ├── expedientes.png
    ├── detalle.png
    └── usuarios.png
```

---

### 5️⃣ Verificar las Capturas

```bash
# Ejecutar script de verificación
.\verify-screenshots.ps1
```

Debe mostrar:
```
✅ dashboard.png (XXX KB)
✅ expedientes.png (XXX KB)
✅ detalle.png (XXX KB)
✅ usuarios.png (XXX KB)

TODAS LAS CAPTURAS ESTAN LISTAS!
```

---

### 6️⃣ Commit y Push

```bash
# Agregar capturas al repositorio
git add public/screenshots/

# Commit
git commit -m "docs: Agregar capturas del sistema al README"

# Push a GitHub
git push origin main
```

---

## 💡 Tips para Mejores Capturas

### ✅ Hazlo Bien

- **Maximiza la ventana** del navegador antes de capturar
- **Limpia la barra de búsqueda** si hay texto de prueba
- **Usa datos realistas** (no "test123", mejor "Caso de Robo 2024")
- **Muestra varios items** en las tablas (al menos 3-5)
- **Captura en hora del día** (no 3:00 AM en las métricas)

### ❌ Evita

- Capturas borrosas o pixeladas
- Contenido de prueba obvio ("asdfjkl")
- Ventana muy pequeña
- Datos sensibles o reales si existen
- Capturas de error/pantalla en blanco

---

## 🖼️ Especificaciones Recomendadas

- **Formato**: PNG (mejor calidad que JPG)
- **Tamaño**: 1200-1600px de ancho (aprox)
- **Peso**: < 500KB por imagen (optimizar si es más)
- **Proporción**: 16:10 o 16:9 (panorámico)

---

## 🔧 Herramientas Útiles

### Windows
- **Snipping Tool** (Windows + Shift + S) - Incluido en Windows
- **Greenshot** - Gratis, más opciones
- **ShareX** - Avanzado, gratis

### Optimizar Imágenes
- **TinyPNG** - https://tinypng.com/ (online)
- **Squoosh** - https://squoosh.app/ (Google)

---

## 🎨 Después de Subir

1. Ve a tu repositorio en GitHub
2. Navega al README
3. Las imágenes deben verse correctamente
4. Si no se ven, verifica:
   - Que las rutas sean correctas: `./public/screenshots/nombre.png`
   - Que los archivos estén en el commit
   - Que GitHub haya procesado el push

---

## ✅ Checklist Final

- [ ] Aplicación levantada y funcionando
- [ ] Login exitoso como coordinador
- [ ] 4 capturas tomadas con buena calidad
- [ ] Capturas guardadas en `public/screenshots/`
- [ ] Script de verificación ejecutado (todo en verde)
- [ ] Commit realizado
- [ ] Push a GitHub exitoso
- [ ] README en GitHub muestra las capturas correctamente

---

## 🆘 Problemas Comunes

### Problema: "No puedo acceder a Usuarios"

**Solución**: Debes estar logueado como **coordinador** (`coord1`), no como técnico.

### Problema: "No tengo expedientes/indicios"

**Solución**: Crea algunos datos de prueba primero:
1. Como coordinador, crea 3-4 expedientes
2. Asígnalos a técnicos
3. Agrega 2-3 indicios a cada uno
4. Luego toma las capturas

### Problema: "Las imágenes son muy grandes"

**Solución**: Usa TinyPNG para optimizar:
1. Ve a https://tinypng.com/
2. Sube tus PNGs
3. Descarga las versiones optimizadas
4. Reemplaza en `public/screenshots/`

### Problema: "No se ven en GitHub"

**Solución**: 
```bash
# Verificar que las imágenes están en el commit
git ls-files public/screenshots/

# Debe mostrar:
# public/screenshots/dashboard.png
# public/screenshots/expedientes.png
# public/screenshots/detalle.png
# public/screenshots/usuarios.png
```

Si no aparecen, agrégalas:
```bash
git add public/screenshots/
git commit --amend --no-edit
git push origin main --force
```

---

**¡Listo! Tu README ahora tendrá capturas profesionales del sistema real! 🎉**
