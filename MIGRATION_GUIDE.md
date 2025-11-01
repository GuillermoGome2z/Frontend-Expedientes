# 🔄 Guía de Migración y Cambios Implementados

## Fecha: 2025-11-01

Este documento detalla todas las mejoras y refactorizaciones implementadas para alinear el frontend con los contratos del backend.

---

## 📋 Resumen de Cambios

### ✅ Completados

1. **Variables de entorno validadas** (`src/shared/env.ts`)
2. **Fetcher robusto con manejo de errores tipados** (`src/shared/fetcher.ts`)
3. **Auth store actualizado con tipos correctos** (`src/auth/`)
4. **Guards de rutas mejorados** (`RequireAuth`, `RequireRole`)
5. **Tipos compartidos normalizados** (`.types.ts`)
6. **APIs con aliases de paginación** (`page` → `pagina`, `pageSize` → `tamanoPagina`)
7. **Exportaciones Excel con rate limiting** (429 handling)
8. **Hook useApiError para UX consistente**
9. **React Query con keepPreviousData**

---

## 🔧 Cambios Técnicos Detallados

### 1. Variables de Entorno (`src/shared/env.ts`)

**Antes:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
```

**Después:**
```typescript
export const API_URL = import.meta.env.VITE_API_URL ?? "";

if (!API_URL) {
  throw new Error("VITE_API_URL es requerido...");
}

// Validación de formato URL
try {
  new URL(API_URL);
} catch {
  throw new Error(`VITE_API_URL tiene un formato inválido...`);
}
```

**Beneficios:**
- ✅ Validación en tiempo de carga
- ✅ Error claro si falta la variable
- ✅ Validación de formato URL
- ✅ Single source of truth

---

### 2. Fetcher con Errores Tipados (`src/shared/fetcher.ts`)

#### 2.1 Nueva clase ApiError

```typescript
export class ApiError extends Error {
  name = "ApiError";
  status: number;
  details?: any;
  rateLimit?: RateLimitInfo;
}
```

#### 2.2 Interceptor de Respuestas Mejorado

**Características:**
- ✅ Normaliza respuestas: `{ success: true, data }` → extrae `data`
- ✅ Maneja errores: `{ success: false, error, details }` → lanza `ApiError`
- ✅ **401**: Logout automático + redirect a `/login`
- ✅ **403**: Toast de permisos + NO logout
- ✅ **429**: Extrae headers de rate limit + muestra countdown
- ✅ **5xx**: Toast de error del servidor

#### 2.3 Rate Limiting

Extrae headers del backend:
```typescript
ratelimit-limit: 100
ratelimit-remaining: 95
ratelimit-reset: 1730505600 (Unix timestamp)
```

Y los adjunta al error:
```typescript
error.rateLimit = {
  limit: 100,
  remaining: 95,
  reset: 1730505600
}
```

#### 2.4 Helper mapHttpError()

```typescript
export function mapHttpError(error: unknown): { title: string; description: string }
```

Convierte errores técnicos en mensajes amigables para la UI.

---

### 3. Auth Store (`src/auth/auth.store.ts`)

**Cambios:**

```typescript
// ANTES
hasRole: (role: string) => boolean

// DESPUÉS
hasRole: (...roles: Rol[]) => boolean
```

**Uso:**
```typescript
// Ahora soporta múltiples roles
hasRole("tecnico", "coordinador") // true si user.rol está en la lista
```

**Persistencia:**
- ✅ Validación al cargar desde localStorage
- ✅ Limpieza completa en logout
- ✅ Redirect automático a `/login` en logout

---

### 4. Guards de Rutas

#### 4.1 RequireAuth.tsx

**Mejoras:**
- ✅ Guarda ubicación original para redirect post-login
- ✅ State: `{ from: location }`

```typescript
<Navigate to="/login" state={{ from: location }} replace />
```

#### 4.2 RequireRole.tsx

**Mejoras:**
- ✅ Tipado con `Rol[]` en lugar de `string[]`
- ✅ Usa `hasRole(...allowed)` para múltiples roles
- ✅ Toast automático en acceso denegado

---

### 5. Tipos Compartidos

#### 5.1 Auth Types (`src/auth/auth.types.ts`)

```typescript
export type Rol = "tecnico" | "coordinador";
```

#### 5.2 Expedientes Types (`src/expedientes/expedientes.types.ts`)

```typescript
export type EstadoExpediente = "Abierto" | "Aprobado" | "Rechazado";

export interface ExpedienteListResponse {
  page: number;        // ← Cambio: antes era "pagina"
  pageSize: number;
  total: number;
  data: Expediente[];
}
```

#### 5.3 Indicios Types (`src/indicios/indicios.types.ts`)

```typescript
export interface IndicioListResponse {
  page: number;        // ← Cambio: antes era "pagina"
  pageSize: number;
  total: number;
  data: Indicio[];
}
```

---

### 6. APIs con Aliases de Paginación

#### 6.1 Expedientes API (`src/expedientes/expedientes.api.ts`)

**buildQueryParams():**
```typescript
function buildQueryParams(filters?: ExpedienteFilters): Record<string, string> {
  const params: Record<string, string> = {};
  
  // Mapeo de aliases
  if (filters.page !== undefined) params.pagina = String(filters.page);
  if (filters.pageSize !== undefined) params.tamanoPagina = String(filters.pageSize);
  
  // Otros filtros
  if (filters.q) params.q = filters.q;
  if (filters.estado) params.estado = filters.estado;
  // ...
  
  return params;
}
```

**Frontend envía:**
```typescript
{ page: 1, pageSize: 10, q: "EXP-001", estado: "Abierto" }
```

**Backend recibe:**
```
GET /expedientes?pagina=1&tamanoPagina=10&q=EXP-001&estado=Abierto
```

#### 6.2 Exportaciones con Rate Limiting

**exportExcel():**
```typescript
try {
  const response = await fetch(url, { headers: { Authorization: ... } });
  
  if (response.status === 429) {
    const rateLimitInfo = extractRateLimitInfo(response.headers);
    const secondsUntilReset = calculateSeconds(rateLimitInfo.reset);
    throw new ApiError(`Intenta de nuevo en ${secondsUntilReset} segundos`, 429, null, rateLimitInfo);
  }
  
  // Extraer filename de Content-Disposition
  const filename = getFilenameFromResponse(response) || fallback;
  
  downloadBlob(blob, filename);
  showToast("✅ Exportación exitosa", ...);
} catch (error) {
  if (error.status === 429) {
    showToast("Límite alcanzado", error.message);
  }
}
```

**Features:**
- ✅ Extrae filename de `Content-Disposition` header
- ✅ Fallback: `expedientes_2025-11-01.xlsx`
- ✅ Maneja 429 con countdown
- ✅ Toast con éxito/error

#### 6.3 updateEstado() con Validación

**Validación previa antes de llamar al backend:**
```typescript
updateEstado: (id: number, data: UpdateEstadoDTO) => {
  // Validación previa
  if (data.estado === "Rechazado" && !data.justificacion?.trim()) {
    throw new Error("La justificación es obligatoria para rechazar");
  }
  return fetcher.patch<Expediente>(`/expedientes/${id}/estado`, data);
}
```

---

### 7. Indicios API (`src/indicios/indicios.api.ts`)

**toggleActivo():**

**Antes:**
```typescript
toggleActivo: (id: number) =>
  fetcher.patch(`/indicios/${id}/activo`, {})
```

**Después:**
```typescript
toggleActivo: (id: number, activo: boolean) =>
  fetcher.patch<Indicio>(`/indicios/${id}/activo`, { activo })
```

**Uso en componente:**
```typescript
// IndiciosList.tsx
toggleActivoMutation.mutate({ 
  id: indicio.id, 
  activo: !indicio.activo 
});
```

---

### 8. React Query Optimizaciones

#### 8.1 keepPreviousData

**ExpedientesListPage.tsx:**
```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["expedientes", filters],
  queryFn: () => expedientesApi.list(filters),
  keepPreviousData: true, // ← Nuevo: transiciones suaves
});
```

**Beneficio:**
- ✅ Al cambiar de página, mantiene datos anteriores hasta que lleguen los nuevos
- ✅ Evita pantallas en blanco durante paginación
- ✅ UX más fluida

#### 8.2 Query Keys Normalizados

**Antes:**
```typescript
queryKey: ["expedientes", { page, pageSize, q, estado }]
```

**Después:**
```typescript
queryKey: ["expedientes", filters] // filters sin funciones, solo datos primitivos
```

---

### 9. Hook useApiError (`src/shared/hooks/useApiError.ts`)

```typescript
export function useApiError(error: unknown | null) {
  const errorInfo = useMemo(() => {
    if (!error) return null;
    return mapHttpError(error);
  }, [error]);

  return errorInfo;
}

export function useApiErrorWithRateLimit(error: unknown | null) {
  const errorInfo = useApiError(error);
  const rateLimitInfo = error instanceof ApiError ? error.rateLimit : null;
  
  return { ...errorInfo, rateLimit: rateLimitInfo };
}
```

**Uso:**
```typescript
const errorInfo = useApiError(error);

if (errorInfo) {
  toast({
    title: errorInfo.title,
    description: errorInfo.description,
    variant: "destructive",
  });
}
```

---

## 🧪 Testing Manual

### 1. Login
```bash
✅ POST /auth/login con credenciales correctas
✅ Token se guarda en localStorage
✅ Redirect a /dashboard
✅ Si ya está logueado, redirect desde /login
```

### 2. Paginación
```bash
✅ GET /expedientes?pagina=1&tamanoPagina=10
✅ Cambio de página mantiene filtros
✅ keepPreviousData evita flicker
✅ currentPage se actualiza correctamente
```

### 3. Filtros
```bash
✅ Búsqueda por "q" resetea a página 1
✅ Filtro por estado resetea a página 1
✅ Múltiples filtros combinados funcionan
```

### 4. Exportaciones
```bash
✅ Exportación masiva descarga expedientes_YYYY-MM-DD.xlsx
✅ Exportación individual descarga expediente_{id}_YYYY-MM-DD.xlsx
✅ Content-Disposition filename se respeta
✅ Fallback filename si no viene header
✅ 429 muestra toast con countdown
```

### 5. Rate Limiting (429)
```bash
✅ Headers extraídos: ratelimit-limit, ratelimit-remaining, ratelimit-reset
✅ Toast muestra "Intenta en X segundos"
✅ ApiError incluye rateLimit info
✅ retry-after header se muestra si existe
```

### 6. Errores
```bash
✅ 401: Logout + redirect + toast "Sesión expirada"
✅ 403: Toast "Acceso denegado" (NO logout)
✅ 404: Error manejado en componente
✅ 429: Toast con countdown
✅ 5xx: Toast "Error del servidor"
```

### 7. RBAC
```bash
✅ Técnico solo ve/edita sus expedientes
✅ Coordinador ve botones Aprobar/Rechazar
✅ RequireRole bloquea acceso a /usuarios para técnicos
✅ hasRole(...roles) permite múltiples roles
```

### 8. Indicios
```bash
✅ toggleActivo envía { activo: true/false }
✅ Lista usa page/pageSize (no pagina)
✅ Paginación funciona correctamente
```

### 9. Validaciones
```bash
✅ Estado "Rechazado" sin justificación → error antes de HTTP
✅ Formularios con Zod funcionan
✅ Mensajes de error claros
```

---

## 🔄 Contratos Backend Esperados

### 1. Responses Normalizadas

**Éxito:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Mensaje de error",
  "details": { ... }
}
```

### 2. Paginación

**Query params:**
```
pagina=1
tamanoPagina=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "data": [...]
  }
}
```

### 3. Rate Limiting (429)

**Headers:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1730505600
Retry-After: 60
```

**Response:**
```json
{
  "success": false,
  "error": "Too Many Requests"
}
```

### 4. Exportaciones

**Headers:**
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="expedientes_2025-11-01.xlsx"
```

**Body:** Binary (blob)

### 5. Estados de Expediente

```typescript
"Abierto" | "Aprobado" | "Rechazado"
```

### 6. PATCH /expedientes/:id/estado

**Body:**
```json
{
  "estado": "Rechazado",
  "justificacion": "No cumple requisitos..." // Obligatorio si estado=Rechazado
}
```

### 7. PATCH /indicios/:id/activo

**Body:**
```json
{
  "activo": true
}
```

---

## 📚 Documentación Adicional

### Estructura de Archivos Nuevos/Modificados

```
src/
├── shared/
│   ├── env.ts                    ← NUEVO: Validación de env vars
│   ├── fetcher.ts                ← REFACTORIZADO: ApiError, rate limiting
│   └── hooks/
│       └── useApiError.ts        ← NUEVO: Hook para errores
│
├── auth/
│   ├── auth.types.ts             ← ACTUALIZADO: Rol type
│   ├── auth.store.ts             ← ACTUALIZADO: hasRole con spread
│   ├── RequireAuth.tsx           ← MEJORADO: Guarda location
│   └── RequireRole.tsx           ← MEJORADO: Tipado Rol[]
│
├── expedientes/
│   ├── expedientes.types.ts      ← ACTUALIZADO: page en vez de pagina
│   ├── expedientes.api.ts        ← REFACTORIZADO: Aliases, exportaciones
│   └── ExpedientesListPage.tsx   ← ACTUALIZADO: keepPreviousData
│
├── indicios/
│   ├── indicios.types.ts         ← ACTUALIZADO: page en vez de pagina
│   ├── indicios.api.ts           ← REFACTORIZADO: toggleActivo con body
│   └── IndiciosList.tsx          ← ACTUALIZADO: Uso correcto de mutations
│
└── vite-env.d.ts                 ← NUEVO: Tipos para import.meta.env
```

---

## 🚀 Próximos Pasos

### Pendientes para Backend

1. ✅ Implementar `GET /expedientes/export`
2. ✅ Implementar `GET /expedientes/:id/export`
3. ✅ Agregar headers de rate limiting
4. ✅ Normalizar responses con `{ success, data/error }`
5. ✅ Soportar aliases `pagina`/`tamanoPagina`

### Mejoras Futuras

- [ ] Sincronizar filtros con URL (query params)
- [ ] Deep linking de páginas/filtros
- [ ] Cache de exportaciones con Service Worker
- [ ] Tests unitarios con Vitest
- [ ] Tests E2E con Playwright

---

## 📞 Soporte

Si encuentras errores de compilación:
```bash
npm install
```

Si encuentras errores de tipos:
```bash
# Verificar que .env esté configurado
cat .env

# Debe contener:
VITE_API_URL=http://localhost:3000/api
```

---

**Documento generado el:** 2025-11-01  
**Versión:** 1.0.0  
**Autor:** Sistema de Refactorización Automatizado
