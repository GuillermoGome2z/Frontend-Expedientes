# 🗂️ Sistema de Gestión de Expedientes - Frontend# React + TypeScript + Vite



[English](#english) | [Español](#español)This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



---Currently, two official plugins are available:



## 📋 Español- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Descripción

## React Compiler

Sistema moderno de gestión de expedientes e indicios desarrollado con React 18, TypeScript, TailwindCSS y shadcn/ui. Diseñado con un enfoque premium: interfaz limpia, dark mode por defecto, y experiencia de usuario fluida.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### 🚀 Stack Tecnológico

## Expanding the ESLint configuration

- **React 18** con TypeScript

- **Vite** - Build tool ultrarrápidoIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- **TailwindCSS** - Estilos utility-first

- **shadcn/ui** - Componentes UI premium```js

- **React Router v6** - Enrutamientoexport default defineConfig([

- **TanStack React Query** - Gestión de estado del servidor  globalIgnores(['dist']),

- **Axios** - Cliente HTTP  {

- **Zod** - Validación de schemas    files: ['**/*.{ts,tsx}'],

- **React Hook Form** - Gestión de formularios    extends: [

- **Zustand** - Estado global (autenticación)      // Other configs...



### ✨ Características      // Remove tseslint.configs.recommended and replace with this

      tseslint.configs.recommendedTypeChecked,

- 🌙 **Dark mode** por defecto con diseño premium      // Alternatively, use this for stricter rules

- 🔐 **Autenticación JWT** con persistencia en localStorage      tseslint.configs.strictTypeChecked,

- 👥 **Roles**: Técnico y Coordinador      // Optionally, add this for stylistic rules

- 📊 **Dashboard** con métricas en tiempo real      tseslint.configs.stylisticTypeChecked,

- 📝 **CRUD completo** de expedientes e indicios

- 🔍 **Búsqueda y filtros** avanzados con paginación      // Other configs...

- 📤 **Exportación a Excel** de expedientes    ],

- ✅ **Validaciones** con Zod en formularios    languageOptions: {

- 🚦 **Gestión de estados**: Abierto, Aprobado, Rechazado      parserOptions: {

- 🎯 **Permisos granulares** por rol        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- 📱 **Responsive design** para todos los dispositivos        tsconfigRootDir: import.meta.dirname,

      },

### 📦 Instalación      // other options...

    },

```bash  },

# Instalar dependencias])

npm install```



# Configurar variables de entornoYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

# Ya existe el archivo .env con:

VITE_API_URL=http://localhost:3000/api```js

```// eslint.config.js

import reactX from 'eslint-plugin-react-x'

### 🎮 Comandosimport reactDom from 'eslint-plugin-react-dom'



```bashexport default defineConfig([

# Desarrollo  globalIgnores(['dist']),

npm run dev  {

    files: ['**/*.{ts,tsx}'],

# Build de producción    extends: [

npm run build      // Other configs...

      // Enable lint rules for React

# Preview de build      reactX.configs['recommended-typescript'],

npm run preview      // Enable lint rules for React DOM

      reactDom.configs.recommended,

# Linting    ],

npm run lint    languageOptions: {

```      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

### 🔧 Configuración        tsconfigRootDir: import.meta.dirname,

      },

#### Conexión con el Backend      // other options...

    },

El frontend espera que el backend esté corriendo en `http://localhost:3000` por defecto.  },

])

**Endpoints principales:**```


- `POST /api/auth/login` - Autenticación
- `GET /api/expedientes` - Listar expedientes
- `POST /api/expedientes` - Crear expediente
- `GET /api/expedientes/:id` - Detalle de expediente
- `PUT /api/expedientes/:id` - Actualizar expediente
- `PATCH /api/expedientes/:id/estado` - Cambiar estado (coordinador)
- `GET /api/expedientes/export` - Exportar a Excel
- `GET /api/expedientes/:id/indicios` - Listar indicios
- `POST /api/expedientes/:id/indicios` - Crear indicio
- `PUT /api/indicios/:id` - Actualizar indicio
- `PATCH /api/indicios/:id/activo` - Toggle activo/inactivo

### 📁 Estructura del Proyecto

```
src/
├── app/                    # Core application
│   ├── providers.tsx       # Global providers
│   ├── queryClient.ts      # React Query config
│   ├── router.tsx          # Routes definition
│   └── MainLayout.tsx      # Main layout with navbar
├── auth/                   # Authentication module
│   ├── LoginPage.tsx
│   ├── auth.store.ts       # Zustand store
│   ├── RequireAuth.tsx
│   └── RequireRole.tsx
├── dashboard/              # Dashboard module
├── expedientes/            # Cases module
├── indicios/               # Evidence module
├── shared/                 # Shared utilities
│   ├── fetcher.ts          # HTTP client
│   └── ui/                 # Reusable UI components
└── components/ui/          # shadcn/ui components
```

### 👤 Roles y Permisos

#### Técnico
- ✅ Ver dashboard y estadísticas personales
- ✅ Crear nuevos expedientes
- ✅ Editar solo sus expedientes
- ✅ Gestionar indicios en sus expedientes
- ❌ No puede cambiar estado de expedientes

#### Coordinador
- ✅ Ver dashboard con estadísticas globales
- ✅ Ver todos los expedientes
- ✅ Aprobar/Rechazar expedientes
- ✅ Acceso módulo usuarios
- ❌ No puede editar expedientes directamente

### 🎨 Diseño Premium

- **Dark mode** por defecto
- **Tipografía**: Inter con fallback a system fonts
- **Bordes redondeados**: 2xl (1rem)
- **Sombras suaves**: shadow-lg
- **Animaciones** en hover/focus
- **Accesibilidad completa** con ARIA

### 🧪 Mensajes Personalizados

- 🎉 Expediente creado con éxito
- ✅ Cambios guardados
- 🟢 Expediente aprobado. ¡Buen trabajo!
- 🟠 Expediente rechazado
- 🧪 Indicio agregado
- 📄 Exportando... → ✅ Archivo listo
- 🔐 Tu sesión expiró
- 🚫 No tienes permisos

### 🐛 Troubleshooting

**El frontend no se conecta:**
- Verifica backend en `http://localhost:3000`
- Revisa `.env` → `VITE_API_URL`
- Comprueba CORS en backend

**Problemas con autenticación:**
- Limpia localStorage: `localStorage.clear()`
- Verifica token JWT del backend

---

## 📋 English

### Description

Modern case and evidence management system built with React 18, TypeScript, TailwindCSS, and shadcn/ui.

### 🚀 Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- React Router v6
- TanStack React Query
- Axios + Zod
- React Hook Form
- Zustand

### ✨ Features

- 🌙 Dark mode by default
- 🔐 JWT authentication
- 👥 Role-based access (Technician/Coordinator)
- 📊 Real-time dashboard
- 📝 Full CRUD operations
- 🔍 Advanced search & filters
- 📤 Excel export
- ✅ Form validation with Zod
- 📱 Fully responsive

### 📦 Installation

```bash
npm install
# .env already configured with:
# VITE_API_URL=http://localhost:3000/api
```

### 🎮 Commands

```bash
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Linting
```

### 👤 Roles

**Technician:**
- Create/edit own cases
- Manage evidence
- View personal stats

**Coordinator:**
- View all cases
- Approve/Reject cases
- Global statistics
- User management

---

**Developed with ❤️ using React + TypeScript + TailwindCSS**
