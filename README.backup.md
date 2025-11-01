# 🗂️ Sistema de Gestión de Expedientes - Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.12-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Sistema moderno de gestión de expedientes criminales con arquitectura escalable y diseño profesional**

[📖 Documentación](#-tabla-de-contenidos) • [🚀 Inicio Rápido](#-inicio-rápido) • [🐳 Docker](#-docker) • [📸 Capturas](#-capturas-de-pantalla)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Arquitectura](#️-arquitectura)
- [Inicio Rápido](#-inicio-rápido)
- [Docker](#-docker)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roles y Permisos](#-roles-y-permisos)
- [Documentación API](#-documentación-api)
- [Componentes UI](#-componentes-ui)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contribución](#-contribución)
- [Autor](#-autor)

---

## 🎯 Descripción General

Sistema web de gestión de expedientes e indicios criminales diseñado para optimizar el flujo de trabajo de técnicos forenses y coordinadores. Implementa autenticación JWT, control de acceso basado en roles (RBAC), y una interfaz moderna con soporte para tema oscuro.

### 🎓 Contexto Académico

Este proyecto fue desarrollado como parte del curso de **Desarrollo de Software Empresarial** en la **Universidad [Tu Universidad]**, demostrando competencias en:

- 🏗️ Arquitectura de aplicaciones web escalables
- 🔐 Implementación de seguridad y autenticación
- 🎨 Diseño de interfaces de usuario modernas
- 🐳 Containerización con Docker
- 📊 Integración con bases de datos relacionales
- 🧪 Testing y aseguramiento de calidad

### ✨ Características Destacadas

- ✅ **Autenticación JWT** con refresh tokens y manejo de sesiones
- ✅ **Control de acceso basado en roles** (Técnico, Coordinador)
- ✅ **Tema oscuro por defecto** con toggle dinámico
- ✅ **Gestión completa de expedientes** (CRUD + estados)
- ✅ **Sistema de indicios** vinculados a expedientes
- ✅ **Exportación a Excel** masiva e individual
- ✅ **Paginación y filtros avanzados** en todas las listas
- ✅ **Rate limiting** con manejo de headers 429
- ✅ **Validación de formularios** con Zod + React Hook Form
- ✅ **Hot reload** en desarrollo con Vite HMR
- ✅ **Responsive design** mobile-first
- ✅ **Docker support** para desarrollo y producción

---

## 🌟 Características Principales

### 👤 Gestión de Usuarios (Coordinador)
- Crear usuarios técnicos y coordinadores
- Activar/desactivar cuentas
- Cambio de contraseñas
- Filtrado por rol y búsqueda

### 📂 Gestión de Expedientes
- Crear, editar y visualizar expedientes
- Asignación de técnicos responsables
- Control de estados (Abierto, Aprobado, Rechazado)
- Justificación obligatoria en rechazos
- Exportación individual y masiva a Excel
- Filtros: búsqueda, estado, técnico, rango de fechas

### 🧪 Gestión de Indicios
- Agregar indicios a expedientes
- Descripción, peso, color, tamaño
- Activar/desactivar indicios
- Edición por técnico asignado o coordinador

### 🔐 Seguridad
- Login con username y password
- Tokens JWT con expiración
- Guards de autenticación y roles
- Manejo de sesiones expiradas
- CORS configurado

### 🎨 Interfaz de Usuario
- Tema oscuro optimizado para largas jornadas
- Componentes reutilizables de shadcn/ui
- Notificaciones toast con feedback
- Estados de carga y errores
- Tablas con paginación
- Formularios validados

### 📊 Dashboard
- Métricas en tiempo real
- Total de expedientes por estado
- Mis expedientes (técnicos)
- Health check del backend
- Acciones rápidas

---

## 🛠️ Stack Tecnológico

### Frontend Core
```json
{
  "react": "^19.1.1",
  "typescript": "^5.9.3",
  "vite": "^7.1.12"
}
```

### Gestión de Estado y Datos
```json
{
  "@tanstack/react-query": "^5.90.5",  // Server state
  "zustand": "^5.0.8",                  // Client state (auth)
  "axios": "^1.13.1"                    // HTTP client
}
```

### UI y Estilos
```json
{
  "tailwindcss": "^3.4.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "lucide-react": "^0.552.0"            // Iconos
}
```

### Formularios y Validación
```json
{
  "react-hook-form": "^7.66.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^3.24.1"
}
```

### Routing
```json
{
  "react-router-dom": "^7.1.1"
}
```

### DevOps
- **Docker**: Containerización completa
- **SQL Server**: Base de datos
- **Vite**: Build tool optimizado
- **ESLint**: Linting con TypeScript

---

## 🏗️ Arquitectura

### Patrón de Diseño

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│  ┌─────────────────────────────────────────┐   │
│  │     UI Components (shadcn/ui)           │   │
│  └──────────────┬──────────────────────────┘   │
│                 │                               │
│  ┌──────────────▼──────────────────────────┐   │
│  │     Pages (Dashboard, Expedientes, etc) │   │
│  └──────────────┬──────────────────────────┘   │
│                 │                               │
│  ┌──────────────▼──────────────────────────┐   │
│  │  React Query (Server State Cache)       │   │
│  └──────────────┬──────────────────────────┘   │
│                 │                               │
│  ┌──────────────▼──────────────────────────┐   │
│  │      API Clients (expedientes.api.ts)   │   │
│  └──────────────┬──────────────────────────┘   │
│                 │                               │
│  ┌──────────────▼──────────────────────────┐   │
│  │       Fetcher (Axios + Interceptors)    │   │
│  └──────────────┬──────────────────────────┘   │
└─────────────────┼───────────────────────────────┘
                  │
                  │ HTTP Requests
                  │
┌─────────────────▼───────────────────────────────┐
│              BACKEND API (Express)              │
│  ┌─────────────────────────────────────────┐   │
│  │       /api/auth/login (JWT)             │   │
│  │       /api/expedientes                  │   │
│  │       /api/indicios                     │   │
│  │       /api/usuarios                     │   │
│  │       /api/health                       │   │
│  └──────────────┬──────────────────────────┘   │
└─────────────────┼───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│            SQL SERVER DATABASE                  │
│  ┌─────────────────────────────────────────┐   │
│  │  Usuarios                               │   │
│  │  Expedientes                            │   │
│  │  Indicios                               │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario interactúa** con componente UI
2. **Componente dispara** mutación/query de React Query
3. **API Client** construye petición con filtros/paginación
4. **Fetcher (Axios)** agrega headers de autenticación
5. **Backend procesa** y responde con formato normalizado
6. **Response interceptor** maneja éxito/error
7. **React Query actualiza** cache y UI re-renderiza

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js**: >= 20.x
- **npm**: >= 10.x
- **Backend API**: Debe estar corriendo en `http://localhost:3000`
- **SQL Server**: Para el backend

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/GuillermoGome2z/Frontend-Expedientes.git
cd Frontend-Expedientes-1

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# Editar .env y configurar:
# VITE_API_URL=http://localhost:3000/api

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir navegador
# http://localhost:5173
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia Vite dev server (puerto 5173)

# Producción
npm run build        # Compila TypeScript y genera build
npm run preview      # Preview del build de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint

# Docker
npm run docker:up    # Levanta contenedores (frontend + backend + DB)
npm run docker:down  # Detiene contenedores
npm run docker:logs  # Ver logs en tiempo real
npm run docker:restart # Reiniciar servicios
```

---

## 🐳 Docker

### ✨ Stack Completamente Dockerizado

El proyecto incluye configuración Docker completa para desarrollo y producción con **integración frontend-backend lista para usar**.

#### 🚀 Quick Start

```bash
# 1. Verificar que Docker Desktop está corriendo
docker --version

# 2. Levantar todo el stack (Frontend + Backend + SQL Server)
npm run docker:up

# 3. Abrir en el navegador
# Frontend:  http://localhost:5173
# Backend:   http://localhost:3000/api
# Docs:      http://localhost:3000/docs
```

#### 🔐 Credenciales de Prueba

```
Coordinador:
  username: coord1
  password: Coord123!

Técnico:
  username: tecnico1
  password: tecnico123
```

#### Servicios Incluidos

| Servicio | Puerto | Descripción | URL |
|----------|--------|-------------|-----|
| `web` | 5173 | Frontend React + Vite + Hot Reload | http://localhost:5173 |
| `api` | 3000 | Backend Express + TypeScript | http://localhost:3000/api |
| `sqlserver` | 1433 | SQL Server 2022 | localhost:1433 |

#### Archivos de Configuración

- `docker-compose.yml` - Orquestación de 3 servicios con healthchecks
- `Dockerfile` - Imagen del frontend optimizada para desarrollo
- `.env` - Variables de entorno (VITE_API_URL)
- `.dockerignore` - Optimización de builds

#### 📚 Documentación Docker Completa

- 📘 **[FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)** - ⭐ Guía de integración completa
- ⚡ **[QUICKSTART_INTEGRATION.md](QUICKSTART_INTEGRATION.md)** - TL;DR para empezar rápido
- � **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Configuración Docker detallada
- 📋 **[DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)** - Comandos Docker útiles

#### Comandos Útiles

```bash
# Levantar servicios
npm run docker:up

# Ver logs en tiempo real
npm run docker:logs

# Reiniciar servicios
npm run docker:restart

# Detener todo
npm run docker:down

# Limpiar todo (incluye volúmenes)
npm run compose:clean

# Logs solo del frontend
docker compose logs -f web

# Logs solo del backend
docker compose logs -f api
```

#### Verificar Base de Datos

```bash
# Conectarse a SQL Server desde el contenedor
docker exec -it expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -C

# Ejecutar queries
USE ExpedientesDB;
GO

SELECT * FROM Expedientes;
GO

SELECT * FROM Indicios WHERE expedienteId = 1;
GO
```

#### 🔧 Configuración Técnica

**Frontend (`web` service):**
- Hot reload habilitado con `usePolling: true`
- Volúmenes montados para desarrollo en tiempo real
- Variables de entorno: `VITE_API_URL=http://localhost:3000/api`
- Healthcheck cada 30 segundos

**Backend (`api` service):**
- Conectado a SQL Server mediante red interna Docker
- Variables de entorno para DB y JWT
- Modo desarrollo con nodemon
- Dependencia de `sqlserver` service con healthcheck

**Base de Datos (`sqlserver` service):**
- SQL Server 2022 Developer Edition
- Datos persistentes con Docker volumes
- Healthcheck con sqlcmd

#### 🎯 Arquitectura de Red

```
┌────────────────────────────────────────┐
│         TU NAVEGADOR (Host)            │
│                                        │
│  http://localhost:5173  (Frontend)    │
│  http://localhost:3000  (Backend)     │
└──────────┬─────────────┬───────────────┘
           │             │
┌──────────▼─────────────▼───────────────┐
│        DOCKER HOST (tu PC)             │
│  ┌────────────┐  ┌────────────┐       │
│  │ web:5173   │  │ api:3000   │       │
│  │ (Frontend) │◄─┤ (Backend)  │       │
│  └────────────┘  └──────┬─────┘       │
│                         │              │
│                  ┌──────▼─────┐        │
│                  │ sqlserver  │        │
│                  │ :1433      │        │
│                  └────────────┘        │
└────────────────────────────────────────┘
```

**Flujo de datos:**
1. Navegador → Frontend (localhost:5173)
2. Frontend → Backend (localhost:3000/api) mediante fetch/axios
3. Backend → SQL Server (sqlserver:1433) dentro de la red Docker

---

## 📁 Estructura del Proyecto

```
Frontend-Expedientes-1/
├── public/                      # Archivos estáticos
├── src/
│   ├── app/                     # Configuración de la aplicación
│   │   ├── MainLayout.tsx       # Layout principal con navbar
│   │   ├── providers.tsx        # React Query + Router providers
│   │   ├── queryClient.ts       # Configuración React Query
│   │   └── router.tsx           # Definición de rutas
│   │
│   ├── auth/                    # Autenticación
│   │   ├── auth.api.ts          # Login endpoint
│   │   ├── auth.store.ts        # Zustand store (token, user)
│   │   ├── auth.types.ts        # Tipos de auth
│   │   ├── LoginPage.tsx        # Página de login
│   │   ├── LogoutButton.tsx     # Componente de logout
│   │   ├── RequireAuth.tsx      # Guard de autenticación
│   │   └── RequireRole.tsx      # Guard de roles
│   │
│   ├── components/              # Componentes globales
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── ThemeToggle.tsx      # Toggle dark/light mode
│   │   └── HealthChip.tsx       # Estado del backend
│   │
│   ├── dashboard/               # Dashboard
│   │   └── DashboardPage.tsx    # Página principal con métricas
│   │
│   ├── expedientes/             # Módulo de expedientes
│   │   ├── expedientes.api.ts   # API client
│   │   ├── expedientes.types.ts # Tipos TypeScript
│   │   ├── ExpedientesListPage.tsx      # Lista con filtros
│   │   ├── ExpedienteDetailPage.tsx     # Detalle + indicios
│   │   ├── ExpedienteCreatePage.tsx     # Crear/editar
│   │   ├── ExpedienteForm.tsx           # Formulario reutilizable
│   │   └── EstadoBadge.tsx              # Badge de estado
│   │
│   ├── indicios/                # Módulo de indicios
│   │   ├── indicios.api.ts      # API client
│   │   ├── indicios.types.ts    # Tipos TypeScript
│   │   ├── IndiciosList.tsx     # Lista de indicios
│   │   └── IndicioForm.tsx      # Formulario de indicio
│   │
│   ├── usuarios/                # Módulo de usuarios (coordinador)
│   │   ├── usuarios.api.ts      # API client
│   │   ├── usuarios.types.ts    # Tipos TypeScript
│   │   └── UsersPage.tsx        # CRUD de usuarios
│   │
│   ├── shared/                  # Utilidades compartidas
│   │   ├── env.ts               # Validación de env vars
│   │   ├── fetcher.ts           # Axios + interceptors
│   │   ├── hooks/
│   │   │   └── useApiError.ts   # Hook de manejo de errores
│   │   └── ui/
│   │       ├── DataTable.tsx    # Tabla reutilizable
│   │       ├── EmptyState.tsx   # Estado vacío
│   │       ├── ErrorState.tsx   # Estado de error
│   │       └── Page.tsx         # Layout de página
│   │
│   ├── lib/
│   │   └── utils.ts             # Utilidades (cn, clsx)
│   │
│   ├── App.tsx                  # Componente raíz
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Estilos globales + Tailwind
│   └── vite-env.d.ts            # Types de Vite
│
├── .devcontainer/               # VS Code Dev Containers
├── docker-compose.yml           # Orquestación Docker
├── Dockerfile                   # Imagen del frontend
├── .env.docker                  # Variables Docker (no en Git)
├── .env.docker.example          # Template de env vars
├── .dockerignore                # Exclusiones de build
├── docker-check.ps1             # Script de verificación
├── docker-start.bat             # Inicio rápido Windows
├── tailwind.config.js           # Configuración Tailwind
├── tsconfig.json                # Configuración TypeScript
├── vite.config.ts               # Configuración Vite
├── eslint.config.js             # Configuración ESLint
├── package.json                 # Dependencias y scripts
├── DOCKER_SETUP.md              # Documentación Docker completa
├── DOCKER_QUICKSTART.md         # Comandos Docker rápidos
├── MIGRATION_GUIDE.md           # Guía de migración técnica
├── BACKEND_CHECKLIST.md         # Checklist para backend
├── REFACTOR_SUMMARY.md          # Resumen de refactorización
└── README.md                    # Este archivo
```

---

## 🔐 Roles y Permisos

### Técnico Forense

**Permisos:**
- ✅ Ver sus expedientes asignados
- ✅ Editar sus expedientes (solo si estado = "Abierto")
- ✅ Agregar/editar indicios a sus expedientes
- ✅ Exportar sus expedientes
- ❌ No puede crear expedientes
- ❌ No puede aprobar/rechazar expedientes
- ❌ No puede ver otros expedientes
- ❌ No tiene acceso al módulo de usuarios

### Coordinador

**Permisos:**
- ✅ Ver TODOS los expedientes
- ✅ Crear nuevos expedientes
- ✅ Editar cualquier expediente (solo si estado = "Abierto")
- ✅ Aprobar/Rechazar expedientes
- ✅ Agregar/editar indicios a cualquier expediente
- ✅ Exportar expedientes (masivo e individual)
- ✅ Gestionar usuarios (CRUD completo)
- ✅ Cambiar contraseñas de usuarios
- ✅ Activar/desactivar usuarios

### Matriz de Permisos

| Acción | Técnico | Coordinador |
|--------|---------|-------------|
| Login | ✅ | ✅ |
| Ver Dashboard | ✅ | ✅ |
| Ver Expedientes | 🔒 Solo suyos | ✅ Todos |
| Crear Expediente | ❌ | ✅ |
| Editar Expediente | 🔒 Suyos + Abiertos | 🔒 Abiertos |
| Aprobar/Rechazar | ❌ | ✅ |
| Ver Indicios | 🔒 De sus expedientes | ✅ Todos |
| Crear Indicios | 🔒 En sus expedientes | ✅ En cualquiera |
| Exportar | 🔒 Solo suyos | ✅ Todos |
| Gestionar Usuarios | ❌ | ✅ |

---

## 📡 Documentación API

### Base URL

```
http://localhost:3000/api
```

### Autenticación

Todas las peticiones (excepto login) requieren header:
```http
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints Principales

#### Auth
```http
POST   /auth/login
```

#### Expedientes
```http
GET    /expedientes?pagina=1&tamanoPagina=10&q=EXP-001&estado=Abierto
POST   /expedientes
GET    /expedientes/:id
PUT    /expedientes/:id
PATCH  /expedientes/:id/estado
GET    /expedientes/export/excel
GET    /expedientes/:id/export
```

#### Indicios
```http
GET    /indicios?expedienteId=1&pagina=1&tamanoPagina=10
POST   /indicios
PUT    /indicios/:id
PATCH  /indicios/:id/activo
```

#### Usuarios (Coordinador)
```http
GET    /usuarios?pagina=1&tamanoPagina=10&rol=tecnico
POST   /usuarios
PATCH  /usuarios/:id/password
PATCH  /usuarios/:id/activo
```

#### Health Check
```http
GET    /health
```

### Formato de Respuesta

#### Éxito
```json
{
  "success": true,
  "data": {...}
}
```

#### Error
```json
{
  "success": false,
  "error": "Mensaje descriptivo",
  "details": {...}
}
```

#### Paginación
```json
{
  "success": true,
  "data": [...],
  "total": 50,
  "pagina": 1,
  "tamanoPagina": 10,
  "totalPaginas": 5
}
```

---

## 🎨 Componentes UI

### shadcn/ui Components

El proyecto usa componentes de [shadcn/ui](https://ui.shadcn.com/), personalizados con el tema del proyecto:

- `Button` - Variantes: default, destructive, outline, ghost
- `Card` - Contenedor con header y content
- `Input` - Campo de texto con validación
- `Label` - Etiqueta de formulario
- `Table` - Tabla responsive
- `Badge` - Etiqueta de estado
- `Toast` - Notificaciones

### Componentes Personalizados

#### DataTable
```tsx
<DataTable
  data={expedientes}
  columns={columns}
  pagination={{
    currentPage: 1,
    pageSize: 10,
    total: 50,
    onPageChange: (page) => setPage(page)
  }}
/>
```

#### EmptyState
```tsx
<EmptyState
  title="No hay expedientes"
  description="Crea tu primer expediente para comenzar"
  action={<Button>Crear Expediente</Button>}
/>
```

#### ErrorState
```tsx
<ErrorState
  onRetry={() => refetch()}
/>
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Aún no implementado - Pendiente
npm test
```

### Testing Manual

1. **Autenticación**
   - Login con credenciales válidas
   - Login con credenciales inválidas
   - Logout
   - Token expirado

2. **Expedientes**
   - Crear expediente
   - Editar expediente
   - Aprobar/rechazar (coordinador)
   - Exportar a Excel

3. **Indicios**
   - Agregar indicio
   - Editar indicio
   - Activar/desactivar

4. **Usuarios** (coordinador)
   - Crear usuario
   - Cambiar contraseña
   - Activar/desactivar

---

## 🚢 Deployment

### Build de Producción

```bash
# 1. Compilar TypeScript y generar build
npm run build

# 2. Preview del build
npm run preview

# 3. La carpeta dist/ contiene los archivos estáticos
```

### Variables de Entorno

```env
# .env.production
VITE_API_URL=https://api.tudominio.com/api
NODE_ENV=production
```

### Deployment con Docker

```bash
# 1. Levantar stack completo
docker compose up --build -d

# 2. Verificar contenedores
docker ps

# 3. Ver logs
docker compose logs -f
```

### Servidores Recomendados

- **Vercel** - Para el frontend
- **Railway/Render** - Para backend + SQL Server
- **Azure/AWS** - Para soluciones completas

---

## 🤝 Contribución

### Guía de Estilo

- ✅ Usar TypeScript para nuevos archivos
- ✅ Seguir convenciones de nombres (camelCase para variables, PascalCase para componentes)
- ✅ Documentar funciones complejas con JSDoc
- ✅ Usar React Query para estado del servidor
- ✅ Usar Zustand solo para estado global del cliente
- ✅ Validar formularios con Zod + React Hook Form
- ✅ Componentes reutilizables en `shared/ui/`
- ✅ Tipos en archivos `.types.ts`

### Workflow

```bash
# 1. Fork del repositorio
# 2. Crear branch
git checkout -b feature/nueva-funcionalidad

# 3. Commits semánticos
git commit -m "feat: agregar filtro por fecha en expedientes"
git commit -m "fix: corregir paginación en usuarios"

# 4. Push y Pull Request
git push origin feature/nueva-funcionalidad
```

### Commits Semánticos

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan lógica)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

---

## 👨‍💻 Autor

**Guillermo Gómez**  
Estudiante de Ingeniería de Sistemas  
Universidad [Tu Universidad]

- 📧 Email: [tu-email@ejemplo.com]
- 🐙 GitHub: [@GuillermoGome2z](https://github.com/GuillermoGome2z)
- 💼 LinkedIn: [Tu perfil]

### Supervisor Académico

**[Nombre del Profesor]**  
Profesor de Desarrollo de Software Empresarial

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para el curso de **Desarrollo de Software Empresarial**.

```
MIT License

Copyright (c) 2025 Guillermo Gómez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Agradecimientos

- **shadcn/ui** - Por los componentes base
- **Vite** - Por el tooling ultrarrápido
- **TanStack Query** - Por el manejo del estado del servidor
- **Tailwind CSS** - Por el sistema de diseño
- **Lucide Icons** - Por los iconos

---

## 📚 Recursos Adicionales

### Documentación del Proyecto

- 📘 [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Guía técnica de migración
- 📋 [BACKEND_CHECKLIST.md](BACKEND_CHECKLIST.md) - Checklist para desarrolladores backend
- 📊 [REFACTOR_SUMMARY.md](REFACTOR_SUMMARY.md) - Resumen de refactorización
- 🐳 [DOCKER_SETUP.md](DOCKER_SETUP.md) - Configuración Docker completa

### Enlaces Útiles

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

Hecho con ❤️ por [Guillermo Gómez](https://github.com/GuillermoGome2z)

</div>
