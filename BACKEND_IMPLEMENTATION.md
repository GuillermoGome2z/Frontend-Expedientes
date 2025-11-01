# Implementación Backend - Funcionalidades de Exportación

## Resumen
Se necesitan implementar dos endpoints en el backend para exportar expedientes a Excel:
1. Exportación masiva con filtros (ya existe pero verificar)
2. Exportación individual de un expediente específico (nuevo)

---

## Endpoint 1: Exportar Todos los Expedientes con Filtros

### Ruta
```
GET /api/expedientes/export
```

### Query Parameters
- `q` (opcional): String para buscar en código o título
- `estado` (opcional): Filtrar por estado (Abierto, Aprobado, Rechazado)

### Headers Requeridos
```
Authorization: Bearer <token>
```

### Respuesta
- Tipo: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Body: Archivo Excel binario con todos los expedientes filtrados

### Ejemplo de Request
```bash
GET http://localhost:3000/api/expedientes/export?q=EXP-001&estado=Abierto
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Columnas del Excel (sugeridas)
| Código | Título | Estado | Técnico | Fecha Creación | Descripción | Ubicación |
|--------|--------|--------|---------|----------------|-------------|-----------|
| EXP-001 | ... | ... | ... | ... | ... | ... |

### Lógica de Negocio
1. Autenticar usuario con JWT
2. Aplicar filtros de búsqueda si existen
3. Obtener expedientes de la base de datos
4. Generar archivo Excel con librería (ej: `exceljs` o `xlsx`)
5. Devolver archivo con nombre `expedientes_YYYY-MM-DD.xlsx`

---

## Endpoint 2: Exportar Un Solo Expediente (NUEVO)

### Ruta
```
GET /api/expedientes/:id/export
```

### Path Parameters
- `id`: ID numérico del expediente a exportar

### Headers Requeridos
```
Authorization: Bearer <token>
```

### Respuesta
- Tipo: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Body: Archivo Excel binario con el expediente y sus indicios

### Ejemplo de Request
```bash
GET http://localhost:3000/api/expedientes/123/export
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Estructura del Excel

#### Hoja 1: Información del Expediente
| Campo | Valor |
|-------|-------|
| Código | EXP-001 |
| Título | Título del expediente |
| Estado | Abierto |
| Técnico Responsable | usuario123 |
| Fecha de Creación | 2025-11-01 |
| Descripción | Descripción completa... |
| Ubicación | Ubicación física |

#### Hoja 2: Indicios Relacionados
| ID | Descripción | Peso (kg) | Color | Tamaño | Estado | Fecha |
|----|-------------|-----------|-------|--------|--------|-------|
| 1 | Indicio A | 2.5 | Rojo | Grande | Activo | 2025-11-01 |
| 2 | Indicio B | 1.2 | Azul | Pequeño | Activo | 2025-11-01 |

### Lógica de Negocio
1. Autenticar usuario con JWT
2. Buscar expediente por ID con sus relaciones (técnico, indicios)
3. Verificar que el expediente existe (404 si no)
4. Generar Excel con dos hojas:
   - Hoja 1: Datos del expediente (formato vertical/formulario)
   - Hoja 2: Lista de indicios (formato tabla)
5. Devolver archivo con nombre `expediente_{id}_YYYY-MM-DD.xlsx`

---

## Implementación Técnica Sugerida (Node.js/Express)

### Dependencias Requeridas
```bash
npm install exceljs
```

### Ejemplo de Código para Exportación Individual

```javascript
// expedientes.controller.js
const ExcelJS = require('exceljs');

async function exportSingleExpediente(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Del middleware de autenticación
    
    // Obtener expediente con indicios
    const expediente = await prisma.expediente.findUnique({
      where: { id: parseInt(id) },
      include: {
        tecnico: true,
        indicios: true,
      },
    });
    
    if (!expediente) {
      return res.status(404).json({ message: 'Expediente no encontrado' });
    }
    
    // Crear workbook
    const workbook = new ExcelJS.Workbook();
    
    // Hoja 1: Información del Expediente
    const sheet1 = workbook.addWorksheet('Expediente');
    sheet1.columns = [
      { header: 'Campo', key: 'campo', width: 25 },
      { header: 'Valor', key: 'valor', width: 50 },
    ];
    
    sheet1.addRow({ campo: 'Código', valor: expediente.codigo });
    sheet1.addRow({ campo: 'Título', valor: expediente.titulo });
    sheet1.addRow({ campo: 'Estado', valor: expediente.estado });
    sheet1.addRow({ campo: 'Técnico', valor: expediente.tecnico.username });
    sheet1.addRow({ campo: 'Fecha de Creación', valor: expediente.createdAt.toLocaleDateString() });
    sheet1.addRow({ campo: 'Descripción', valor: expediente.descripcion });
    sheet1.addRow({ campo: 'Ubicación', valor: expediente.ubicacion });
    
    // Aplicar estilos a encabezados
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
      { header: 'Estado', key: 'activo', width: 12 },
    ];
    
    expediente.indicios.forEach(indicio => {
      sheet2.addRow({
        id: indicio.id,
        descripcion: indicio.descripcion,
        peso: indicio.peso || 'N/A',
        color: indicio.color || 'N/A',
        tamano: indicio.tamano || 'N/A',
        activo: indicio.activo ? 'Activo' : 'Inactivo',
      });
    });
    
    // Aplicar estilos a encabezados
    sheet2.getRow(1).font = { bold: true };
    
    // Configurar respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=expediente_${id}_${new Date().toISOString().split('T')[0]}.xlsx`
    );
    
    // Enviar archivo
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error al exportar expediente:', error);
    res.status(500).json({ message: 'Error al exportar expediente' });
  }
}

async function exportMultipleExpedientes(req, res) {
  try {
    const { q, estado } = req.query;
    
    // Construir filtros
    const where = {};
    if (q) {
      where.OR = [
        { codigo: { contains: q } },
        { titulo: { contains: q } },
      ];
    }
    if (estado) {
      where.estado = estado;
    }
    
    // Obtener expedientes
    const expedientes = await prisma.expediente.findMany({
      where,
      include: {
        tecnico: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Crear workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Expedientes');
    
    // Definir columnas
    sheet.columns = [
      { header: 'Código', key: 'codigo', width: 15 },
      { header: 'Título', key: 'titulo', width: 30 },
      { header: 'Estado', key: 'estado', width: 12 },
      { header: 'Técnico', key: 'tecnico', width: 20 },
      { header: 'Fecha de Creación', key: 'createdAt', width: 18 },
      { header: 'Descripción', key: 'descripcion', width: 50 },
      { header: 'Ubicación', key: 'ubicacion', width: 30 },
    ];
    
    // Agregar filas
    expedientes.forEach(exp => {
      sheet.addRow({
        codigo: exp.codigo,
        titulo: exp.titulo,
        estado: exp.estado,
        tecnico: exp.tecnico.username,
        createdAt: exp.createdAt.toLocaleDateString(),
        descripcion: exp.descripcion,
        ubicacion: exp.ubicacion,
      });
    });
    
    // Aplicar estilos a encabezados
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    };
    
    // Configurar respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=expedientes_${new Date().toISOString().split('T')[0]}.xlsx`
    );
    
    // Enviar archivo
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error al exportar expedientes:', error);
    res.status(500).json({ message: 'Error al exportar expedientes' });
  }
}

module.exports = {
  exportSingleExpediente,
  exportMultipleExpedientes,
};
```

### Rutas a Agregar

```javascript
// expedientes.routes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { 
  exportSingleExpediente, 
  exportMultipleExpedientes 
} = require('../controllers/expedientes.controller');

// Exportar múltiples expedientes con filtros
router.get('/export', authMiddleware, exportMultipleExpedientes);

// Exportar un solo expediente
router.get('/:id/export', authMiddleware, exportSingleExpediente);

module.exports = router;
```

---

## Seguridad y Validaciones

### Validaciones Necesarias
1. ✅ Autenticación JWT obligatoria
2. ✅ Validar que el ID del expediente sea un número válido
3. ✅ Verificar que el expediente existe (404 si no)
4. ⚠️ (Opcional) Verificar permisos del usuario:
   - Técnicos solo pueden exportar sus propios expedientes
   - Coordinadores pueden exportar cualquier expediente

### Manejo de Errores
```javascript
- 400: Bad Request (ID inválido)
- 401: Unauthorized (sin token o token inválido)
- 403: Forbidden (sin permisos)
- 404: Not Found (expediente no existe)
- 500: Internal Server Error (error al generar Excel)
```

---

## Testing

### Casos de Prueba

1. **Exportación masiva sin filtros**
   ```bash
   GET /api/expedientes/export
   Debe retornar todos los expedientes del sistema
   ```

2. **Exportación masiva con filtro de búsqueda**
   ```bash
   GET /api/expedientes/export?q=EXP-001
   Debe retornar solo expedientes que coincidan
   ```

3. **Exportación masiva con filtro de estado**
   ```bash
   GET /api/expedientes/export?estado=Aprobado
   Debe retornar solo expedientes aprobados
   ```

4. **Exportación individual exitosa**
   ```bash
   GET /api/expedientes/123/export
   Debe retornar Excel con el expediente y sus indicios
   ```

5. **Exportación individual - Expediente no existe**
   ```bash
   GET /api/expedientes/99999/export
   Debe retornar 404
   ```

6. **Sin autenticación**
   ```bash
   GET /api/expedientes/export (sin header Authorization)
   Debe retornar 401
   ```

---

## Notas Adicionales

- El frontend ya está preparado para consumir estos endpoints
- Los archivos se descargan automáticamente en el navegador
- El nombre del archivo incluye la fecha actual para mejor organización
- Se recomienda usar `exceljs` por su flexibilidad y buen soporte
- Considerar agregar límite de registros para exportaciones masivas (ej: máximo 10,000)
- Posibilidad de agregar exportación en formato CSV como alternativa

---

## Documentación API (Swagger/OpenAPI)

```yaml
/api/expedientes/export:
  get:
    summary: Exportar múltiples expedientes a Excel
    tags:
      - Expedientes
    security:
      - bearerAuth: []
    parameters:
      - name: q
        in: query
        schema:
          type: string
        description: Buscar por código o título
      - name: estado
        in: query
        schema:
          type: string
          enum: [Abierto, Aprobado, Rechazado]
        description: Filtrar por estado
    responses:
      200:
        description: Archivo Excel generado exitosamente
        content:
          application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
            schema:
              type: string
              format: binary
      401:
        description: No autenticado
      500:
        description: Error interno

/api/expedientes/{id}/export:
  get:
    summary: Exportar un expediente específico con sus indicios
    tags:
      - Expedientes
    security:
      - bearerAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: integer
        description: ID del expediente
    responses:
      200:
        description: Archivo Excel generado exitosamente
        content:
          application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
            schema:
              type: string
              format: binary
      404:
        description: Expediente no encontrado
      401:
        description: No autenticado
      500:
        description: Error interno
```
