# ✅ Checklist de Integración Backend-Frontend

## Estado Actual: ✅ Frontend Listo | ⏳ Backend Pendiente

---

## 🎯 Resumen Ejecutivo

El frontend ha sido **completamente refactorizado** para cumplir con los contratos del backend:

✅ **Manejo de errores robusto** (401, 403, 429, 5xx)  
✅ **Paginación con aliases** (page → pagina, pageSize → tamanoPagina)  
✅ **Exportaciones Excel** con rate limiting  
✅ **RBAC** implementado en UI  
✅ **Tipos normalizados** con respuestas `{ success, data/error }`  
✅ **Validaciones previas** (justificación en rechazo)  
✅ **React Query optimizado** con keepPreviousData  

---

## 📋 Checklist para Desarrollador Backend

### 1. Respuestas Normalizadas
```typescript
// ✅ Frontend ESPERA este formato

// Éxito
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Mensaje descriptivo",
  "details": { ... } // opcional
}
```

**Archivos backend a modificar:**
- [ ] `src/middlewares/responseHandler.ts` (crear si no existe)
- [ ] Todos los controllers deben usar el formato

---

### 2. Paginación con Aliases
```typescript
// ✅ Frontend ENVÍA
GET /expedientes?pagina=1&tamanoPagina=10&q=EXP-001&estado=Abierto

// ✅ Backend DEBE RESPONDER
{
  "success": true,
  "data": {
    "page": 1,        // ← campo "page" en la respuesta
    "pageSize": 10,
    "total": 156,
    "data": [...]
  }
}
```

**Archivos backend a modificar:**
- [ ] `src/controllers/expedientes.controller.ts`
  - [ ] Método `list()` debe leer `req.query.pagina` y `req.query.tamanoPagina`
  - [ ] Respuesta debe incluir `page, pageSize, total, data`
- [ ] `src/controllers/indicios.controller.ts`
  - [ ] Método `list()` igual que expedientes

---

### 3. Rate Limiting (429)
```typescript
// ✅ Frontend LEE estos headers

HTTP/1.1 429 Too Many Requests
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1730505600
Retry-After: 60

{
  "success": false,
  "error": "Límite de solicitudes excedido. Intenta en 60 segundos."
}
```

**Archivos backend a modificar:**
- [ ] `src/middlewares/rateLimiter.ts`
  - [ ] Instalar: `npm install express-rate-limit`
  - [ ] Configurar headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`
  - [ ] Aplicar a rutas críticas (export, create, update)

**Ejemplo:**
```typescript
import rateLimit from 'express-rate-limit';

export const exportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 requests por ventana
  standardHeaders: true, // Incluye headers RateLimit-*
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Límite de exportaciones excedido. Intenta en 15 minutos.'
    });
  }
});

// Uso
router.get('/expedientes/export', exportLimiter, exportExpedientes);
```

---

### 4. Exportación Excel - Masiva
```typescript
// ✅ Frontend LLAMA
GET /expedientes/export?pagina=1&tamanoPagina=100&estado=Aprobado

// ✅ Backend DEBE RETORNAR
HTTP/1.1 200 OK
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="expedientes_2025-11-01.xlsx"

[Binary Excel file]
```

**Archivos backend a crear/modificar:**
- [ ] `src/controllers/expedientes.controller.ts`
  - [ ] Método `exportExcel(req, res)`
  - [ ] Instalar: `npm install exceljs`
  - [ ] Leer filtros: `pagina`, `tamanoPagina`, `q`, `estado`
  - [ ] Generar Excel con columnas: Código, Título, Estado, Técnico, Fecha, Descripción
  - [ ] Header `Content-Disposition` con filename
- [ ] `src/routes/expedientes.routes.ts`
  - [ ] `GET /expedientes/export`

**Ejemplo:**
```typescript
import ExcelJS from 'exceljs';

export async function exportExcel(req, res) {
  const { pagina = 1, tamanoPagina = 100, q, estado } = req.query;
  
  const expedientes = await Expediente.findAll({
    where: buildFilters({ q, estado }),
    limit: tamanoPagina,
    offset: (pagina - 1) * tamanoPagina,
    include: [{ model: User, as: 'tecnico' }]
  });
  
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Expedientes');
  
  sheet.columns = [
    { header: 'Código', key: 'codigo', width: 15 },
    { header: 'Título', key: 'titulo', width: 30 },
    { header: 'Estado', key: 'estado', width: 12 },
    { header: 'Técnico', key: 'tecnico', width: 20 },
    { header: 'Fecha', key: 'fecha', width: 15 },
  ];
  
  expedientes.forEach(exp => {
    sheet.addRow({
      codigo: exp.codigo,
      titulo: exp.titulo,
      estado: exp.estado,
      tecnico: exp.tecnico.username,
      fecha: exp.createdAt.toLocaleDateString(),
    });
  });
  
  sheet.getRow(1).font = { bold: true };
  
  const filename = `expedientes_${new Date().toISOString().split('T')[0]}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  await workbook.xlsx.write(res);
  res.end();
}
```

---

### 5. Exportación Excel - Individual
```typescript
// ✅ Frontend LLAMA
GET /expedientes/123/export

// ✅ Backend DEBE RETORNAR
HTTP/1.1 200 OK
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="expediente_123_2025-11-01.xlsx"

[Binary Excel con 2 hojas: Expediente + Indicios]
```

**Archivos backend a crear/modificar:**
- [ ] `src/controllers/expedientes.controller.ts`
  - [ ] Método `exportSingle(req, res)`
  - [ ] Crear 2 hojas:
    - Hoja 1: Información del expediente (formato vertical)
    - Hoja 2: Lista de indicios (tabla)
- [ ] `src/routes/expedientes.routes.ts`
  - [ ] `GET /expedientes/:id/export`

**Ejemplo:**
```typescript
export async function exportSingle(req, res) {
  const { id } = req.params;
  
  const expediente = await Expediente.findByPk(id, {
    include: [
      { model: User, as: 'tecnico' },
      { model: Indicio, as: 'indicios' }
    ]
  });
  
  if (!expediente) {
    return res.status(404).json({
      success: false,
      error: 'Expediente no encontrado'
    });
  }
  
  const workbook = new ExcelJS.Workbook();
  
  // Hoja 1: Expediente
  const sheet1 = workbook.addWorksheet('Expediente');
  sheet1.columns = [
    { header: 'Campo', key: 'campo', width: 25 },
    { header: 'Valor', key: 'valor', width: 50 }
  ];
  
  sheet1.addRow({ campo: 'Código', valor: expediente.codigo });
  sheet1.addRow({ campo: 'Título', valor: expediente.titulo });
  sheet1.addRow({ campo: 'Estado', valor: expediente.estado });
  sheet1.addRow({ campo: 'Técnico', valor: expediente.tecnico.username });
  sheet1.addRow({ campo: 'Fecha', valor: expediente.createdAt.toLocaleDateString() });
  sheet1.addRow({ campo: 'Descripción', valor: expediente.descripcion });
  
  sheet1.getRow(1).font = { bold: true };
  sheet1.getColumn('campo').font = { bold: true };
  
  // Hoja 2: Indicios
  const sheet2 = workbook.addWorksheet('Indicios');
  sheet2.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Descripción', key: 'descripcion', width: 40 },
    { header: 'Peso (kg)', key: 'peso', width: 12 },
    { header: 'Color', key: 'color', width: 15 },
    { header: 'Tamaño', key: 'tamano', width: 15 },
    { header: 'Estado', key: 'activo', width: 12 }
  ];
  
  expediente.indicios.forEach(indicio => {
    sheet2.addRow({
      id: indicio.id,
      descripcion: indicio.descripcion,
      peso: indicio.peso || 'N/A',
      color: indicio.color || 'N/A',
      tamano: indicio.tamano || 'N/A',
      activo: indicio.activo ? 'Activo' : 'Inactivo'
    });
  });
  
  sheet2.getRow(1).font = { bold: true };
  
  const filename = `expediente_${id}_${new Date().toISOString().split('T')[0]}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  await workbook.xlsx.write(res);
  res.end();
}
```

---

### 6. PATCH /expedientes/:id/estado
```typescript
// ✅ Frontend ENVÍA
PATCH /expedientes/123/estado
{
  "estado": "Rechazado",
  "justificacion": "No cumple con los requisitos..." // OBLIGATORIO si Rechazado
}

// ✅ Backend VALIDA y RESPONDE
{
  "success": true,
  "data": {
    "id": 123,
    "estado": "Rechazado",
    "justificacionEstado": "No cumple con los requisitos...",
    ...
  }
}
```

**Archivos backend a modificar:**
- [ ] `src/controllers/expedientes.controller.ts`
  - [ ] Método `updateEstado(req, res)`
  - [ ] Validación: Si `estado === "Rechazado"` y no hay `justificacion` → 400
  - [ ] Solo coordinadores pueden cambiar estado → middleware RBAC

**Ejemplo:**
```typescript
export async function updateEstado(req, res) {
  const { id } = req.params;
  const { estado, justificacion } = req.body;
  
  // Validación
  if (estado === 'Rechazado' && !justificacion?.trim()) {
    return res.status(400).json({
      success: false,
      error: 'La justificación es obligatoria para rechazar un expediente'
    });
  }
  
  const expediente = await Expediente.findByPk(id);
  
  if (!expediente) {
    return res.status(404).json({
      success: false,
      error: 'Expediente no encontrado'
    });
  }
  
  expediente.estado = estado;
  expediente.justificacionEstado = justificacion || null;
  await expediente.save();
  
  res.json({
    success: true,
    data: expediente
  });
}
```

---

### 7. PATCH /indicios/:id/activo
```typescript
// ✅ Frontend ENVÍA
PATCH /indicios/456/activo
{
  "activo": true
}

// ✅ Backend RESPONDE
{
  "success": true,
  "data": {
    "id": 456,
    "activo": true,
    ...
  }
}
```

**Archivos backend a modificar:**
- [ ] `src/controllers/indicios.controller.ts`
  - [ ] Método `toggleActivo(req, res)`
  - [ ] Leer `req.body.activo` (boolean)

**Ejemplo:**
```typescript
export async function toggleActivo(req, res) {
  const { id } = req.params;
  const { activo } = req.body;
  
  const indicio = await Indicio.findByPk(id);
  
  if (!indicio) {
    return res.status(404).json({
      success: false,
      error: 'Indicio no encontrado'
    });
  }
  
  indicio.activo = activo;
  await indicio.save();
  
  res.json({
    success: true,
    data: indicio
  });
}
```

---

### 8. Middleware RBAC
```typescript
// ✅ Frontend USA hasRole('coordinador') para mostrar/ocultar UI
// ✅ Backend DEBE VALIDAR en cada endpoint

// Ejemplo middleware
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado'
      });
    }
    
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para esta acción'
      });
    }
    
    next();
  };
}

// Uso
router.patch('/expedientes/:id/estado', requireRole('coordinador'), updateEstado);
```

---

## 🧪 Testing Endpoints

### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Debe retornar
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "username": "admin",
      "rol": "coordinador"
    }
  }
}
```

### 2. Listar Expedientes
```bash
curl http://localhost:3000/api/expedientes?pagina=1&tamanoPagina=10 \
  -H "Authorization: Bearer <token>"

# Debe retornar
{
  "success": true,
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 156,
    "data": [...]
  }
}
```

### 3. Exportar Expedientes
```bash
curl http://localhost:3000/api/expedientes/export?estado=Aprobado \
  -H "Authorization: Bearer <token>" \
  --output expedientes.xlsx

# Debe descargar archivo .xlsx
# Headers esperados:
# Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
# Content-Disposition: attachment; filename="expedientes_2025-11-01.xlsx"
```

### 4. Cambiar Estado
```bash
curl -X PATCH http://localhost:3000/api/expedientes/123/estado \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"estado":"Rechazado","justificacion":"No cumple requisitos"}'

# Debe retornar
{
  "success": true,
  "data": {
    "id": 123,
    "estado": "Rechazado",
    "justificacionEstado": "No cumple requisitos",
    ...
  }
}
```

### 5. Toggle Activo Indicio
```bash
curl -X PATCH http://localhost:3000/api/indicios/456/activo \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"activo":false}'

# Debe retornar
{
  "success": true,
  "data": {
    "id": 456,
    "activo": false,
    ...
  }
}
```

---

## ✅ Validación Final

Una vez implementado todo en el backend, validar:

- [ ] `npm install` en backend (instalar exceljs, express-rate-limit)
- [ ] Todas las respuestas usan `{ success, data/error }`
- [ ] Paginación lee `pagina`/`tamanoPagina` y responde con `page`/`pageSize`
- [ ] Rate limiting configurado con headers correctos
- [ ] Exportaciones generan Excel válido con nombres de archivo
- [ ] Validaciones de justificación en rechazo
- [ ] RBAC middleware aplicado a rutas sensibles
- [ ] Tests con Postman/curl funcionan

---

## 📚 Archivos de Referencia

- **Frontend:** Ver `MIGRATION_GUIDE.md` para detalles técnicos
- **Contratos:** Ver `BACKEND_IMPLEMENTATION.md` para specs originales
- **Ejemplos:** Ver este archivo (BACKEND_CHECKLIST.md)

---

**Última actualización:** 2025-11-01  
**Estado:** ✅ Frontend Completo | ⏳ Backend Pendiente
