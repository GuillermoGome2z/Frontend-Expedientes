# Sistema de Gestión de Expedientes - Frontend# 🗂️ Sistema de Gestión de Expedientes - Frontend# React + TypeScript + Vite



## Tabla de Contenidos



- [Descripción del Proyecto](#descripción-del-proyecto)[English](#english) | [Español](#español)This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

- [Características Principales](#características-principales)

- [Tecnologías Utilizadas](#tecnologías-utilizadas)

- [Requisitos Previos](#requisitos-previos)

- [Instalación](#instalación)---Currently, two official plugins are available:

- [Configuración](#configuración)

- [Ejecución del Proyecto](#ejecución-del-proyecto)

- [Estructura del Proyecto](#estructura-del-proyecto)

- [Arquitectura del Sistema](#arquitectura-del-sistema)## 📋 Español- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [Roles y Permisos](#roles-y-permisos)

- [API Endpoints](#api-endpoints)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- [Componentes Principales](#componentes-principales)

- [Guía de Desarrollo](#guía-de-desarrollo)### Descripción

- [Solución de Problemas](#solución-de-problemas)

- [Autor](#autor)## React Compiler

- [Licencia](#licencia)

Sistema moderno de gestión de expedientes e indicios desarrollado con React 18, TypeScript, TailwindCSS y shadcn/ui. Diseñado con un enfoque premium: interfaz limpia, dark mode por defecto, y experiencia de usuario fluida.

---

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Descripción del Proyecto

### 🚀 Stack Tecnológico

Sistema web moderno de gestión de expedientes e indicios desarrollado como proyecto universitario. La aplicación permite a técnicos y coordinadores gestionar expedientes de manera eficiente, con funcionalidades de creación, edición, aprobación y generación de reportes.

## Expanding the ESLint configuration

El sistema implementa un control de acceso basado en roles, donde los técnicos pueden crear y gestionar sus propios expedientes e indicios, mientras que los coordinadores tienen la capacidad de aprobar o rechazar expedientes, así como visualizar métricas globales del sistema.

- **React 18** con TypeScript

### Objetivo del Sistema

- **Vite** - Build tool ultrarrápidoIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

Proporcionar una plataforma centralizada para la gestión de expedientes que permita:

- **TailwindCSS** - Estilos utility-first

- Registro y seguimiento de expedientes

- Gestión de indicios asociados a cada expediente- **shadcn/ui** - Componentes UI premium```js

- Control de flujo de trabajo mediante estados

- Generación de reportes y exportación de datos- **React Router v6** - Enrutamientoexport default defineConfig([

- Auditoría y trazabilidad de cambios

- **TanStack React Query** - Gestión de estado del servidor  globalIgnores(['dist']),

---

- **Axios** - Cliente HTTP  {

## Características Principales

- **Zod** - Validación de schemas    files: ['**/*.{ts,tsx}'],

### Funcionalidades Implementadas

- **React Hook Form** - Gestión de formularios    extends: [

- **Autenticación y Autorización**

  - Sistema de login con JWT (JSON Web Tokens)- **Zustand** - Estado global (autenticación)      // Other configs...

  - Persistencia de sesión en localStorage

  - Interceptores HTTP para manejo automático de tokens

  - Redirección automática en caso de sesión expirada

### ✨ Características      // Remove tseslint.configs.recommended and replace with this

- **Dashboard Interactivo**

  - Visualización de métricas en tiempo real      tseslint.configs.recommendedTypeChecked,

  - Estadísticas personalizadas por rol de usuario

  - Accesos rápidos a funcionalidades principales- 🌙 **Dark mode** por defecto con diseño premium      // Alternatively, use this for stricter rules

  - Listado de expedientes recientemente modificados

- 🔐 **Autenticación JWT** con persistencia en localStorage      tseslint.configs.strictTypeChecked,

- **Gestión de Expedientes**

  - CRUD completo (Crear, Leer, Actualizar, Eliminar)- 👥 **Roles**: Técnico y Coordinador      // Optionally, add this for stylistic rules

  - Sistema de filtros avanzados (búsqueda, estado, fechas)

  - Paginación eficiente de resultados- 📊 **Dashboard** con métricas en tiempo real      tseslint.configs.stylisticTypeChecked,

  - Validación de formularios con Zod

  - Estados de expediente: Abierto, Aprobado, Rechazado- 📝 **CRUD completo** de expedientes e indicios

  - Proceso de aprobación/rechazo con justificación

- 🔍 **Búsqueda y filtros** avanzados con paginación      // Other configs...

- **Gestión de Indicios**

  - Creación y edición de indicios por expediente- 📤 **Exportación a Excel** de expedientes    ],

  - Campos personalizables (descripción, peso, color, tamaño)

  - Activación/desactivación de indicios- ✅ **Validaciones** con Zod en formularios    languageOptions: {

  - Visualización tabular con paginación

- 🚦 **Gestión de estados**: Abierto, Aprobado, Rechazado      parserOptions: {

- **Exportación de Datos**

  - Generación de reportes en formato Excel- 🎯 **Permisos granulares** por rol        project: ['./tsconfig.node.json', './tsconfig.app.json'],

  - Exportación con filtros aplicados

  - Descarga automática de archivos- 📱 **Responsive design** para todos los dispositivos        tsconfigRootDir: import.meta.dirname,



- **Interfaz de Usuario**      },

  - Diseño responsive adaptable a dispositivos móviles

  - Tema oscuro (dark mode) por defecto### 📦 Instalación      // other options...

  - Componentes reutilizables con shadcn/ui

  - Notificaciones toast para feedback al usuario    },

  - Manejo de estados de carga y errores

```bash  },

---

# Instalar dependencias])

## Tecnologías Utilizadas

npm install```

### Frontend Framework y Lenguajes



| Tecnología | Versión | Propósito |

|------------|---------|-----------|# Configurar variables de entornoYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

| **React** | 19.1.1 | Biblioteca de interfaces de usuario |

| **TypeScript** | 5.9.3 | Tipado estático y desarrollo robusto |# Ya existe el archivo .env con:

| **Vite** | 7.1.7 | Herramienta de build y desarrollo rápido |

VITE_API_URL=http://localhost:3000/api```js

### Librerías Principales

```// eslint.config.js

| Librería | Versión | Uso |

|----------|---------|-----|import reactX from 'eslint-plugin-react-x'

| **React Router DOM** | 7.0.2 | Enrutamiento y navegación |

| **TanStack React Query** | 5.62.7 | Gestión de estado del servidor y cache |### 🎮 Comandosimport reactDom from 'eslint-plugin-react-dom'

| **Axios** | 1.7.8 | Cliente HTTP para peticiones API |

| **Zustand** | 5.0.2 | Estado global (autenticación) |

| **Zod** | 3.24.1 | Validación de esquemas |

| **React Hook Form** | 7.54.1 | Gestión de formularios |```bashexport default defineConfig([



### Estilado y UI# Desarrollo  globalIgnores(['dist']),



| Herramienta | Versión | Descripción |npm run dev  {

|-------------|---------|-------------|

| **TailwindCSS** | 3.4.17 | Framework CSS utility-first |    files: ['**/*.{ts,tsx}'],

| **shadcn/ui** | Custom | Componentes UI accesibles |

| **Lucide React** | 0.468.0 | Biblioteca de iconos |# Build de producción    extends: [



### Herramientas de Desarrollonpm run build      // Other configs...



- **ESLint** - Linting y análisis estático de código      // Enable lint rules for React

- **PostCSS** - Transformación de CSS

- **Autoprefixer** - Prefijos CSS automáticos# Preview de build      reactX.configs['recommended-typescript'],



---npm run preview      // Enable lint rules for React DOM



## Requisitos Previos      reactDom.configs.recommended,



Antes de comenzar, asegúrate de tener instalado:# Linting    ],



- **Node.js** >= 18.0.0npm run lint    languageOptions: {

- **npm** >= 9.0.0 (viene con Node.js)

- **Git** para control de versiones```      parserOptions: {

- **Backend del sistema** corriendo en `http://localhost:3000`

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

### Verificar Instalaciones

### 🔧 Configuración        tsconfigRootDir: import.meta.dirname,

```bash

node --version      },

npm --version

git --version#### Conexión con el Backend      // other options...

```

    },

---

El frontend espera que el backend esté corriendo en `http://localhost:3000` por defecto.  },

## Instalación

])

### 1. Clonar el Repositorio

**Endpoints principales:**```

```bash

git clone https://github.com/GuillermoGome2z/Frontend-Expedientes.git

cd Frontend-Expedientes- `POST /api/auth/login` - Autenticación

```- `GET /api/expedientes` - Listar expedientes

- `POST /api/expedientes` - Crear expediente

### 2. Instalar Dependencias- `GET /api/expedientes/:id` - Detalle de expediente

- `PUT /api/expedientes/:id` - Actualizar expediente

```bash- `PATCH /api/expedientes/:id/estado` - Cambiar estado (coordinador)

npm install- `GET /api/expedientes/export` - Exportar a Excel

```- `GET /api/expedientes/:id/indicios` - Listar indicios

- `POST /api/expedientes/:id/indicios` - Crear indicio

Este comando instalará todas las dependencias necesarias listadas en `package.json`.- `PUT /api/indicios/:id` - Actualizar indicio

- `PATCH /api/indicios/:id/activo` - Toggle activo/inactivo

---

### 📁 Estructura del Proyecto

## Configuración

```

### Variables de Entornosrc/

├── app/                    # Core application

El proyecto utiliza variables de entorno para configuración. Ya existe un archivo `.env` en el proyecto con la siguiente configuración:│   ├── providers.tsx       # Global providers

│   ├── queryClient.ts      # React Query config

```env│   ├── router.tsx          # Routes definition

VITE_API_URL=http://localhost:3000/api│   └── MainLayout.tsx      # Main layout with navbar

```├── auth/                   # Authentication module

│   ├── LoginPage.tsx

Si necesitas modificar la URL del backend, edita este archivo.│   ├── auth.store.ts       # Zustand store

│   ├── RequireAuth.tsx

### Archivo `.env.example`│   └── RequireRole.tsx

├── dashboard/              # Dashboard module

Un archivo de ejemplo está incluido para referencia:├── expedientes/            # Cases module

├── indicios/               # Evidence module

```env├── shared/                 # Shared utilities

VITE_API_URL=http://localhost:3000/api│   ├── fetcher.ts          # HTTP client

```│   └── ui/                 # Reusable UI components

└── components/ui/          # shadcn/ui components

---```



## Ejecución del Proyecto### 👤 Roles y Permisos



### Modo Desarrollo#### Técnico

- ✅ Ver dashboard y estadísticas personales

Para iniciar el servidor de desarrollo:- ✅ Crear nuevos expedientes

- ✅ Editar solo sus expedientes

```bash- ✅ Gestionar indicios en sus expedientes

npm run dev- ❌ No puede cambiar estado de expedientes

```

#### Coordinador

La aplicación estará disponible en: `http://localhost:5173/`- ✅ Ver dashboard con estadísticas globales

- ✅ Ver todos los expedientes

El servidor de desarrollo incluye:- ✅ Aprobar/Rechazar expedientes

- Hot Module Replacement (HMR)- ✅ Acceso módulo usuarios

- Recarga automática en cambios- ❌ No puede editar expedientes directamente

- Mensajes de error detallados

### 🎨 Diseño Premium

### Build de Producción

- **Dark mode** por defecto

Para crear una versión optimizada para producción:- **Tipografía**: Inter con fallback a system fonts

- **Bordes redondeados**: 2xl (1rem)

```bash- **Sombras suaves**: shadow-lg

npm run build- **Animaciones** en hover/focus

```- **Accesibilidad completa** con ARIA



Los archivos compilados se generarán en la carpeta `dist/`.### 🧪 Mensajes Personalizados



### Preview de Build- 🎉 Expediente creado con éxito

- ✅ Cambios guardados

Para previsualizar el build de producción:- 🟢 Expediente aprobado. ¡Buen trabajo!

- 🟠 Expediente rechazado

```bash- 🧪 Indicio agregado

npm run preview- 📄 Exportando... → ✅ Archivo listo

```- 🔐 Tu sesión expiró

- 🚫 No tienes permisos

### Linting

### 🐛 Troubleshooting

Para ejecutar el análisis estático de código:

**El frontend no se conecta:**

```bash- Verifica backend en `http://localhost:3000`

npm run lint- Revisa `.env` → `VITE_API_URL`

```- Comprueba CORS en backend



---**Problemas con autenticación:**

- Limpia localStorage: `localStorage.clear()`

## Estructura del Proyecto- Verifica token JWT del backend



```---

Frontend-Expedientes/

├── public/                      # Archivos estáticos públicos## 📋 English

│   └── vite.svg

├── src/### Description

│   ├── app/                     # Configuración central de la aplicación

│   │   ├── MainLayout.tsx       # Layout principal con navbarModern case and evidence management system built with React 18, TypeScript, TailwindCSS, and shadcn/ui.

│   │   ├── providers.tsx        # Providers globales (React Query, Toast)

│   │   ├── queryClient.ts       # Configuración de React Query### 🚀 Tech Stack

│   │   └── router.tsx           # Definición de rutas

│   │- React 18 + TypeScript

│   ├── auth/                    # Módulo de autenticación- Vite

│   │   ├── LoginPage.tsx        # Página de inicio de sesión- TailwindCSS + shadcn/ui

│   │   ├── LogoutButton.tsx     # Botón de cierre de sesión- React Router v6

│   │   ├── RequireAuth.tsx      # Guard de autenticación- TanStack React Query

│   │   ├── RequireRole.tsx      # Guard de roles- Axios + Zod

│   │   ├── auth.api.ts          # API calls de autenticación- React Hook Form

│   │   ├── auth.store.ts        # Store de Zustand para auth- Zustand

│   │   └── auth.types.ts        # Tipos TypeScript de auth

│   │### ✨ Features

│   ├── dashboard/               # Módulo de dashboard

│   │   └── DashboardPage.tsx    # Página principal con métricas- 🌙 Dark mode by default

│   │- 🔐 JWT authentication

│   ├── expedientes/             # Módulo de expedientes- 👥 Role-based access (Technician/Coordinator)

│   │   ├── ExpedientesListPage.tsx      # Lista con filtros y paginación- 📊 Real-time dashboard

│   │   ├── ExpedienteCreatePage.tsx     # Página de creación- 📝 Full CRUD operations

│   │   ├── ExpedienteDetailPage.tsx     # Detalle y gestión de estado- 🔍 Advanced search & filters

│   │   ├── ExpedienteForm.tsx           # Formulario reutilizable- 📤 Excel export

│   │   ├── EstadoBadge.tsx              # Componente de badge de estado- ✅ Form validation with Zod

│   │   ├── expedientes.api.ts           # API calls- 📱 Fully responsive

│   │   └── expedientes.types.ts         # Tipos TypeScript

│   │### 📦 Installation

│   ├── indicios/                # Módulo de indicios

│   │   ├── IndiciosList.tsx     # Lista de indicios```bash

│   │   ├── IndicioForm.tsx      # Formulario de indiciosnpm install

│   │   ├── indicios.api.ts      # API calls# .env already configured with:

│   │   └── indicios.types.ts    # Tipos TypeScript# VITE_API_URL=http://localhost:3000/api

│   │```

│   ├── shared/                  # Recursos compartidos

│   │   ├── fetcher.ts           # Cliente HTTP con interceptors### 🎮 Commands

│   │   └── ui/                  # Componentes UI reutilizables

│   │       ├── Page.tsx         # Layout de página```bash

│   │       ├── DataTable.tsx    # Tabla con paginaciónnpm run dev      # Development

│   │       ├── EmptyState.tsx   # Estado vacíonpm run build    # Production build

│   │       └── ErrorState.tsx   # Estado de errornpm run preview  # Preview build

│   │npm run lint     # Linting

│   ├── components/              # Componentes de shadcn/ui```

│   │   └── ui/

│   │       ├── badge.tsx### 👤 Roles

│   │       ├── button.tsx

│   │       ├── card.tsx**Technician:**

│   │       ├── input.tsx- Create/edit own cases

│   │       ├── label.tsx- Manage evidence

│   │       ├── table.tsx- View personal stats

│   │       └── toast.tsx

│   │**Coordinator:**

│   ├── lib/                     # Utilidades- View all cases

│   │   └── utils.ts             # Funciones helper (cn, etc.)- Approve/Reject cases

│   │- Global statistics

│   ├── App.tsx                  # Componente raíz- User management

│   ├── main.tsx                 # Entry point

│   └── index.css                # Estilos globales---

│

├── .env                         # Variables de entorno**Developed with ❤️ using React + TypeScript + TailwindCSS**

├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── eslint.config.js             # Configuración de ESLint
├── index.html                   # HTML principal
├── package.json                 # Dependencias y scripts
├── postcss.config.js            # Configuración de PostCSS
├── tailwind.config.js           # Configuración de Tailwind
├── tsconfig.json                # Configuración de TypeScript
├── tsconfig.app.json            # Config TS para la app
├── tsconfig.node.json           # Config TS para Node
└── vite.config.ts               # Configuración de Vite
```

---

## Arquitectura del Sistema

### Patrón de Arquitectura

El proyecto sigue una arquitectura modular basada en características (feature-based):

- **Separación por módulos**: Cada funcionalidad principal está en su propia carpeta
- **Reutilización de componentes**: Componentes UI compartidos en `shared/ui`
- **Tipado fuerte**: TypeScript en todos los archivos
- **Estado global mínimo**: Solo autenticación usa estado global (Zustand)
- **Server state management**: React Query para datos del servidor

### Flujo de Datos

```
Usuario → Componente → React Query → Fetcher → Axios → Backend API
                           ↓
                    Cache/Revalidación
                           ↓
                      Actualización UI
```

### Gestión de Estado

1. **Estado Local**: `useState`, `useReducer` para estado de componentes
2. **Estado del Servidor**: React Query para cache y sincronización
3. **Estado Global**: Zustand solo para autenticación
4. **Formularios**: React Hook Form para gestión de forms

### Autenticación y Seguridad

- **JWT Token**: Almacenado en localStorage
- **Interceptores Axios**: Auto-inyección de token en headers
- **Guards de Ruta**: `RequireAuth` y `RequireRole`
- **Manejo de Errores**: Interceptor para 401/403 con redirección

---

## Roles y Permisos

### Técnico

**Permisos:**

- Ver dashboard con estadísticas personales
- Crear nuevos expedientes
- Editar únicamente sus propios expedientes
- Agregar indicios a sus expedientes
- Editar y activar/desactivar indicios en sus expedientes
- Ver todos los expedientes (solo lectura para expedientes de otros)

**Restricciones:**

- No puede cambiar el estado de expedientes (aprobar/rechazar)
- No puede editar expedientes de otros técnicos
- No tiene acceso al módulo de usuarios

### Coordinador

**Permisos:**

- Ver dashboard con estadísticas globales del sistema
- Ver todos los expedientes sin restricción
- Aprobar expedientes con estado "Abierto"
- Rechazar expedientes con justificación obligatoria
- Acceso al módulo de usuarios (futuro)
- Exportar reportes de todos los expedientes

**Restricciones:**

- No puede editar expedientes directamente
- No puede modificar indicios
- Debe proporcionar justificación al rechazar expedientes

---

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | `{ username, password }` |

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "usuario",
    "rol": "tecnico"
  }
}
```

### Expedientes

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/expedientes` | Listar expedientes con filtros | Todos |
| GET | `/api/expedientes/:id` | Obtener detalle de expediente | Todos |
| POST | `/api/expedientes` | Crear expediente | Técnico |
| PUT | `/api/expedientes/:id` | Actualizar expediente | Técnico (propietario) |
| PATCH | `/api/expedientes/:id/estado` | Cambiar estado | Coordinador |
| GET | `/api/expedientes/export` | Exportar a Excel | Todos |

**Parámetros de filtrado (GET):**
- `pagina` / `page`: Número de página
- `pageSize`: Tamaño de página
- `q`: Búsqueda por código o título
- `estado`: Filtro por estado (Abierto, Aprobado, Rechazado)
- `fechaInicio`: Fecha inicial
- `fechaFin`: Fecha final

### Indicios

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/expedientes/:id/indicios` | Listar indicios de un expediente | Todos |
| POST | `/api/expedientes/:id/indicios` | Crear indicio | Técnico (propietario) |
| PUT | `/api/indicios/:id` | Actualizar indicio | Técnico (propietario) |
| PATCH | `/api/indicios/:id/activo` | Toggle activo/inactivo | Técnico (propietario) |

---

## Componentes Principales

### Componentes de UI Reutilizables

#### Page Component
Layout estándar para páginas con título, descripción y toolbar.

```tsx
<Page 
  title="Título de la página"
  description="Descripción opcional"
  toolbar={<Button>Acción</Button>}
>
  {children}
</Page>
```

#### DataTable Component
Tabla con paginación integrada.

```tsx
<DataTable
  data={expedientes}
  columns={columns}
  isLoading={isLoading}
  pagination={{
    currentPage: 1,
    pageSize: 10,
    total: 100,
    onPageChange: handlePageChange
  }}
/>
```

#### EmptyState Component
Estado vacío con mensaje y acción opcional.

```tsx
<EmptyState
  icon="📭"
  title="No hay datos"
  description="Descripción del estado vacío"
  action={<Button>Crear Nuevo</Button>}
/>
```

#### ErrorState Component
Estado de error con opción de reintento.

```tsx
<ErrorState
  title="Error al cargar datos"
  message="Mensaje detallado del error"
  onRetry={refetch}
/>
```

### Guards de Ruta

#### RequireAuth
Protege rutas que requieren autenticación.

```tsx
<RequireAuth>
  <ProtectedComponent />
</RequireAuth>
```

#### RequireRole
Protege rutas que requieren roles específicos.

```tsx
<RequireRole allowed={["coordinador"]}>
  <AdminComponent />
</RequireRole>
```

---

## Guía de Desarrollo

### Agregar una Nueva Página

1. Crear el componente en la carpeta del módulo correspondiente
2. Definir la ruta en `src/app/router.tsx`
3. Agregar guards de autenticación si es necesario
4. Implementar la lógica con React Query para datos del servidor

### Crear un Nuevo Módulo

1. Crear carpeta en `src/` con el nombre del módulo
2. Crear archivos necesarios:
   - `[modulo].types.ts` - Tipos TypeScript
   - `[modulo].api.ts` - Funciones de API
   - `[Modulo]Page.tsx` - Componente principal
   - `[Modulo]Form.tsx` - Formulario si aplica

### Validación de Formularios

Usar Zod para definir esquemas:

```typescript
const schema = z.object({
  campo: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
});

type FormData = z.infer<typeof schema>;
```

### Hacer Peticiones HTTP

Usar el fetcher centralizado:

```typescript
import { fetcher } from "@/shared/fetcher";

// GET
const data = await fetcher.get<ResponseType>("/endpoint");

// POST
const result = await fetcher.post<ResponseType>("/endpoint", body);
```

### Usar React Query

```typescript
// Query
const { data, isLoading, error } = useQuery({
  queryKey: ["key", params],
  queryFn: () => api.getData(params),
});

// Mutation
const mutation = useMutation({
  mutationFn: api.createData,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["key"] });
  },
});
```

---

## Solución de Problemas

### El frontend no se conecta al backend

**Problema**: Errores de conexión o CORS

**Solución**:
1. Verificar que el backend esté corriendo en `http://localhost:3000`
2. Revisar la variable `VITE_API_URL` en el archivo `.env`
3. Verificar configuración de CORS en el backend
4. Revisar la consola del navegador para errores específicos

### Error de autenticación persistente

**Problema**: No se puede iniciar sesión o la sesión expira inmediatamente

**Solución**:
1. Limpiar localStorage: Abrir consola del navegador y ejecutar:
   ```javascript
   localStorage.clear()
   ```
2. Verificar que el backend esté devolviendo el token correctamente
3. Revisar la configuración del interceptor en `src/shared/fetcher.ts`

### Errores de TypeScript

**Problema**: Errores de tipos o imports no encontrados

**Solución**:
1. Ejecutar `npm install` para asegurar todas las dependencias
2. Reiniciar el servidor de desarrollo
3. Verificar que los paths estén correctos en `tsconfig.json`
4. Limpiar cache: eliminar carpeta `node_modules` y ejecutar `npm install`

### Estilos de Tailwind no se aplican

**Problema**: Clases de Tailwind no funcionan

**Solución**:
1. Verificar que `tailwind.config.js` incluya todos los paths
2. Revisar `postcss.config.js`
3. Reiniciar el servidor de desarrollo
4. Verificar que `index.css` tenga las directivas de Tailwind

### Build falla en producción

**Problema**: El comando `npm run build` falla

**Solución**:
1. Revisar errores de TypeScript: `npx tsc --noEmit`
2. Ejecutar linting: `npm run lint`
3. Verificar que todas las dependencias estén instaladas
4. Revisar logs de error específicos

---

## Contribución

### Flujo de Trabajo Git

1. Crear una rama para la nueva funcionalidad:
   ```bash
   git checkout -b feature/nombre-funcionalidad
   ```

2. Hacer commits descriptivos:
   ```bash
   git add .
   git commit -m "Descripción clara del cambio"
   ```

3. Subir cambios:
   ```bash
   git push origin feature/nombre-funcionalidad
   ```

4. Crear Pull Request en GitHub

### Convenciones de Código

- **Nombres de archivos**: PascalCase para componentes, camelCase para utilidades
- **Componentes**: Usar TypeScript y tipos explícitos
- **Imports**: Usar alias `@/` para imports absolutos
- **Estilos**: Usar Tailwind CSS, evitar CSS en línea
- **Comentarios**: Documentar lógica compleja

### Estándares de Commits

Usar mensajes descriptivos y profesionales:

- `feat: Agregar funcionalidad de exportación de reportes`
- `fix: Corregir validación de formulario de expedientes`
- `refactor: Mejorar estructura de componentes de UI`
- `docs: Actualizar README con nuevas instrucciones`
- `style: Aplicar formato consistente en módulo de auth`
- `test: Agregar pruebas unitarias para indicios`

---

## Autor

**Guillermo Gómez**

- GitHub: [@GuillermoGome2z](https://github.com/GuillermoGome2z)
- Repositorio: [Frontend-Expedientes](https://github.com/GuillermoGome2z/Frontend-Expedientes)

Proyecto desarrollado como parte del curso universitario de Desarrollo Web.

---

## Licencia

Este proyecto es de uso académico y está disponible bajo la licencia MIT.

```
MIT License

Copyright (c) 2025 Guillermo Gómez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

**Desarrollado con React, TypeScript y TailwindCSS**

*Última actualización: Noviembre 2025*
