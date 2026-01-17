# 🚀 Guía de Integración Frontend + Backend

Esta guía te ayudará a configurar la integración completa entre el frontend de Next.js y la API backend para el sistema de registro de aspirantes.

## 📋 Requisitos Previos

1. **Backend API ejecutándose** en `http://localhost:3000`
   - Base de datos PostgreSQL configurada
   - Tablas creadas y datos de exámenes insertados
   - Servidor corriendo con `pnpm dev`

2. **Google Forms** configurado para carga de documentos
   - Formulario creado con los campos requeridos
   - Entry IDs obtenidos

## ⚙️ Configuración Paso a Paso

### 1. Configurar Variables de Entorno

Ya se ha creado el archivo `.env.local` en la raíz del proyecto. Ahora debes actualizarlo:

```bash
# Edita el archivo .env.local
nano .env.local
```

Actualiza estos valores:

```env
# API Backend URL (si tu backend está en otro puerto, cámbialo aquí)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Google Forms URL
# Obtén esta URL de tu formulario de Google Forms
NEXT_PUBLIC_GOOGLE_FORMS_URL=https://docs.google.com/forms/d/e/TU_FORM_ID/viewform
```

### 2. Configurar Entry IDs de Google Forms

1. Abre `lib/api.ts`
2. Busca la función `generarUrlGoogleForms` (alrededor de la línea 175)
3. Reemplaza los Entry IDs con los de tu formulario:

```typescript
const entryMap = {
  nombre: 'entry.XXXXXXXX',           // Reemplaza con tu entry ID
  apellido_paterno: 'entry.XXXXXXXX', // Reemplaza con tu entry ID
  apellido_materno: 'entry.XXXXXXXX', // Reemplaza con tu entry ID
  correo: 'entry.XXXXXXXX',           // Reemplaza con tu entry ID
  telefono: 'entry.XXXXXXXX',         // Reemplaza con tu entry ID
  matricula: 'entry.XXXXXXXX',        // Reemplaza con tu entry ID
  curp: 'entry.XXXXXXXX',             // Reemplaza con tu entry ID
}
```

**¿Cómo obtener los Entry IDs?** Ver [CONFIGURACION_GOOGLE_FORMS.md](./CONFIGURACION_GOOGLE_FORMS.md)

### 3. Instalar Dependencias (si es necesario)

```bash
npm install
# o
pnpm install
```

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
# o
pnpm dev
```

El frontend estará disponible en: http://localhost:3001

## 🧪 Probar la Integración

### Prueba Completa del Flujo

1. **Verifica que el backend esté corriendo:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Deberías ver: `{"status":"ok","message":"API funcionando correctamente"}`

2. **Abre el frontend:**
   http://localhost:3001/inscripcion

3. **Completa el formulario:**

   **Paso 1: Datos Personales**
   - Nombre: Juan
   - Apellido Paterno: García
   - Apellido Materno: López
   - Email: test@ejemplo.com
   - Teléfono: 5512345678
   - CURP: GAGL850101HDFRRN09
   - Examen: Selecciona uno de la lista

   **Paso 2: Documentos** (simulado)
   - Haz clic en "Subir" para cada documento

   **Paso 3: Pago**
   - Acepta términos y condiciones
   - Haz clic en "Confirmar Registro"

   **Paso 4: Confirmación**
   - Verás tu folio generado (ej: `CUH-2026-123456`)
   - Verás un botón "Ir a Subir Documentos"
   - Haz clic en el botón

4. **Verifica Google Forms:**
   - Se abrirá en una nueva pestaña
   - Los datos personales deberían estar pre-llenados
   - Solo tendrás que subir los documentos

### Verificar en la Base de Datos

Conéctate a PostgreSQL y verifica que el aspirante se haya registrado:

```sql
SELECT
  pseudo_matricula,
  nombre,
  apellido_paterno,
  correo_electronico,
  fecha_solicitud
FROM aspirantes
ORDER BY id DESC
LIMIT 1;
```

## 🔧 Cambios Realizados

### Nuevos Archivos

1. **`lib/api.ts`**
   - Servicio para consumir la API backend
   - Funciones: `getExamenes()`, `registrarAspirante()`, etc.
   - Función `generarUrlGoogleForms()` para pre-llenar formularios

2. **`.env.local`**
   - Variables de entorno para URLs
   - No versionar este archivo (ya está en `.gitignore`)

3. **`CONFIGURACION_GOOGLE_FORMS.md`**
   - Guía completa para configurar Google Forms

4. **`INTEGRACION_FRONTEND_BACKEND.md`** (este archivo)
   - Guía de integración completa

### Archivos Modificados

1. **`app/inscripcion/page.tsx`**
   - Cambios principales:
     - ✅ Separación de apellidos (paterno/materno)
     - ✅ Carga dinámica de exámenes desde la API
     - ✅ Registro de aspirantes en la base de datos
     - ✅ Generación de folio por la API
     - ✅ Redirección a Google Forms con datos pre-llenados
     - ✅ Manejo de errores (correo duplicado, examen inválido)
     - ✅ Estados de carga durante las peticiones
     - ✅ Validaciones de formulario

## 📊 Flujo de Datos

```
┌─────────────────┐
│   Usuario       │
│  (Navegador)    │
└────────┬────────┘
         │
         │ 1. Llena formulario
         │
         ▼
┌─────────────────────────┐
│  Next.js Frontend       │
│  (app/inscripcion)      │
│                         │
│  - Valida datos         │
│  - Formatea request     │
└────────┬────────────────┘
         │
         │ 2. POST /api/aspirantes
         │
         ▼
┌─────────────────────────┐
│  Express Backend        │
│  (Puerto 3000)          │
│                         │
│  - Valida campos        │
│  - Verifica examen      │
│  - Verifica email       │
│  - Genera matrícula     │
└────────┬────────────────┘
         │
         │ 3. INSERT INTO aspirantes
         │
         ▼
┌─────────────────────────┐
│  PostgreSQL             │
│                         │
│  - aspirantes           │
│  - cat_examenes         │
└────────┬────────────────┘
         │
         │ 4. Retorna aspirante
         │
         ▼
┌─────────────────────────┐
│  Next.js Frontend       │
│                         │
│  - Muestra folio        │
│  - Genera URL Forms     │
│  - Pre-llena datos      │
└────────┬────────────────┘
         │
         │ 5. Redirección
         │
         ▼
┌─────────────────────────┐
│  Google Forms           │
│                         │
│  - Datos pre-llenados   │
│  - Subida de archivos   │
└─────────────────────────┘
```

## 🐛 Solución de Problemas

### Error: "Network Error" o "Failed to fetch"

**Causa:** El backend no está corriendo o está en un puerto diferente

**Solución:**
1. Verifica que el backend esté corriendo:
   ```bash
   curl http://localhost:3000/api/health
   ```
2. Si está en otro puerto, actualiza `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:OTRO_PUERTO/api
   ```

### Error: "CORS Policy Error"

**Causa:** El backend no permite peticiones desde el frontend

**Solución:**
En el backend (API-286), verifica `src/app.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));
```

Y en el `.env` del backend:
```env
FRONTEND_URL=http://localhost:3001
```

### Error: "El correo electrónico ya está registrado"

**Causa:** Ya existe un aspirante con ese correo

**Solución:**
- Usa otro correo electrónico
- O elimina el registro anterior de la base de datos:
  ```sql
  DELETE FROM aspirantes WHERE correo_electronico = 'test@ejemplo.com';
  ```

### Los exámenes no se cargan

**Causa:** No hay exámenes en la base de datos o el backend no responde

**Solución:**
1. Verifica la base de datos:
   ```sql
   SELECT * FROM cat_examenes WHERE activo = true;
   ```
2. Si no hay datos, insértalos:
   ```sql
   INSERT INTO cat_examenes (nombre, nivel, codigo_interno) VALUES
   ('Bachillerato General (Acuerdo 286)', 'MEDIA_SUPERIOR', 'MESU'),
   ('Lic. en Derecho', 'SUPERIOR', 'LICU');
   ```

### Los campos de Google Forms no se pre-llenan

**Causa:** Los Entry IDs son incorrectos o la URL está mal configurada

**Solución:**
1. Verifica que `NEXT_PUBLIC_GOOGLE_FORMS_URL` en `.env.local` sea correcta
2. Obtén nuevamente los Entry IDs siguiendo [CONFIGURACION_GOOGLE_FORMS.md](./CONFIGURACION_GOOGLE_FORMS.md)
3. Actualiza `lib/api.ts` con los Entry IDs correctos

### Error: "Cannot read property 'id' of undefined"

**Causa:** El campo `examen` no está seleccionado o los datos no se cargaron

**Solución:**
1. Asegúrate de seleccionar un examen antes de continuar
2. Verifica en la consola del navegador si hay errores al cargar exámenes

## 📝 Notas Importantes

### Datos de Formulario

Los campos del formulario ahora están separados:
- ❌ Antes: `apellidos` (un solo campo)
- ✅ Ahora: `apellido_paterno` y `apellido_materno` (dos campos)

### Validaciones del Backend

El backend valida automáticamente:
- ✅ Email único (no permite duplicados)
- ✅ Examen válido (debe existir en `cat_examenes`)
- ✅ Formato de email
- ✅ Longitud de campos
- ✅ Tipos de datos correctos

### Generación de Matrícula

La matrícula se genera automáticamente por el backend con el formato:
```
CUH-[AÑO]-[NÚMERO ALEATORIO DE 6 DÍGITOS]
```

Ejemplo: `CUH-2026-847392`

### Archivos JSON Locales

El archivo `data/examenes.json` ya no se usa porque los exámenes se cargan desde la API. Puedes mantenerlo como respaldo o eliminarlo.

## 🔐 Seguridad

### Variables de Entorno

- ✅ `.env.local` está en `.gitignore` (no se versiona)
- ✅ Las URLs de la API están en variables de entorno
- ✅ No hay credenciales hardcodeadas en el código

### Validación de Datos

- ✅ Validación en el frontend (UX)
- ✅ Validación en el backend (seguridad)
- ✅ Validación en la base de datos (constraints)

## 🚀 Próximos Pasos

1. **Configurar Google Forms** siguiendo [CONFIGURACION_GOOGLE_FORMS.md](./CONFIGURACION_GOOGLE_FORMS.md)

2. **Personalizar el formulario:**
   - Ajustar colores según el branding de CUH
   - Modificar textos y mensajes
   - Agregar más campos si es necesario

3. **Configurar correos de confirmación:**
   - Implementar envío de emails desde el backend
   - Incluir la ficha de examen en PDF

4. **Agregar análisis y seguimiento:**
   - Google Analytics
   - Reportes de conversión

## 📞 Soporte

Si tienes problemas:

1. Verifica los logs del backend (terminal donde corre)
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que la base de datos tenga datos
4. Revisa que las URLs en `.env.local` sean correctas

## ✅ Checklist de Configuración

- [ ] Backend corriendo en `http://localhost:3000`
- [ ] Base de datos PostgreSQL con tablas creadas
- [ ] Exámenes insertados en `cat_examenes`
- [ ] `.env.local` configurado con URL de la API
- [ ] Google Forms creado y configurado
- [ ] Entry IDs de Google Forms obtenidos
- [ ] `lib/api.ts` actualizado con Entry IDs
- [ ] Frontend corriendo en `http://localhost:3001`
- [ ] Prueba completa del flujo realizada
- [ ] Verificación en la base de datos exitosa
- [ ] Redirección a Google Forms funcionando
- [ ] Datos pre-llenados correctamente

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu sistema de registro de aspirantes está completamente funcional con:

✅ Formulario web profesional
✅ Registro en base de datos
✅ Generación automática de folios
✅ Integración con Google Forms
✅ Pre-llenado de datos
✅ Carga de documentos centralizada

**¡Felicidades! Tu sistema está listo para producción.**
