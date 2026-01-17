# 📋 Configuración de Google Forms para Carga de Documentos

Esta guía te explica cómo configurar tu formulario de Google Forms para recibir los documentos de los aspirantes y pre-llenar sus datos automáticamente.

## 🎯 Paso 1: Crear el Formulario de Google

1. Ve a [Google Forms](https://forms.google.com)
2. Crea un nuevo formulario
3. Dale un título como: **"Carga de Documentos - Acuerdo 286"**

## 📝 Paso 2: Agregar los Campos del Formulario

Agrega los siguientes campos en este orden:

### Campos de Identificación (Pre-llenados automáticamente)

1. **Matrícula/Folio** (Respuesta corta)
   - Tipo: Respuesta corta
   - Obligatorio: ✅

2. **Nombre(s)** (Respuesta corta)
   - Tipo: Respuesta corta
   - Obligatorio: ✅

3. **Apellido Paterno** (Respuesta corta)
   - Tipo: Respuesta corta
   - Obligatorio: ✅

4. **Apellido Materno** (Respuesta corta)
   - Tipo: Respuesta corta
   - Obligatorio: ❌

5. **Correo Electrónico** (Respuesta corta)
   - Tipo: Respuesta corta
   - Validación: Dirección de correo electrónico
   - Obligatorio: ✅

6. **Teléfono** (Respuesta corta)
   - Tipo: Respuesta corta
   - Obligatorio: ✅

7. **CURP** (Respuesta corta)
   - Tipo: Respuesta corta
   - Obligatorio: ❌

### Campos de Documentos

8. **Identificación Oficial (INE/Pasaporte)** (Subida de archivo)
   - Tipo: Subida de archivo
   - Permitir tipos: PDF, JPG, PNG
   - Tamaño máximo: 10 MB
   - Número máximo de archivos: 1
   - Obligatorio: ✅

9. **CURP (Documento)** (Subida de archivo)
   - Tipo: Subida de archivo
   - Permitir tipos: PDF, JPG, PNG
   - Tamaño máximo: 10 MB
   - Número máximo de archivos: 1
   - Obligatorio: ✅

10. **Certificado de Estudios** (Subida de archivo)
    - Tipo: Subida de archivo
    - Permitir tipos: PDF, JPG, PNG
    - Tamaño máximo: 10 MB
    - Número máximo de archivos: 1
    - Obligatorio: ✅

11. **Comprobante de Domicilio** (Subida de archivo)
    - Tipo: Subida de archivo
    - Permitir tipos: PDF, JPG, PNG
    - Tamaño máximo: 10 MB
    - Número máximo de archivos: 1
    - Obligatorio: ✅

### Campo de Confirmación

12. **Acepto términos y condiciones** (Casillas de verificación)
    - Tipo: Casillas de verificación
    - Opciones:
      - ☑️ "Confirmo que todos los documentos son legibles y auténticos"
    - Obligatorio: ✅

## 🔗 Paso 3: Obtener los Entry IDs

Para que el sistema pueda pre-llenar los datos del formulario, necesitas los **Entry IDs**:

1. En tu formulario, haz clic en los tres puntos (⋮) en la esquina superior derecha
2. Selecciona **"Obtener enlace rellenado previamente"**
3. Llena el formulario con datos de prueba:
   ```
   Matrícula: TEST-123
   Nombre: Juan
   Apellido Paterno: García
   Apellido Materno: López
   Correo: test@ejemplo.com
   Teléfono: 5512345678
   CURP: GAGL850101HDFRRN09
   ```
4. Haz clic en **"Obtener enlace"**
5. Copia la URL completa que se genera

La URL se verá algo así:
```
https://docs.google.com/forms/d/e/1FAIpQLSfXXXXXXXXXXXXXXXXXXXXXXXX/viewform?
entry.1877115667=TEST-123&
entry.2005620554=Juan&
entry.1045781291=García&
entry.1065046570=López&
entry.1166974658=test@ejemplo.com&
entry.839337160=5512345678&
entry.2006368554=GAGL850101HDFRRN09
```

## ⚙️ Paso 4: Configurar el Frontend

1. Abre el archivo `/home/guerra/Work/286/acuerdo286/.env.local`

2. Actualiza `NEXT_PUBLIC_GOOGLE_FORMS_URL` con la URL base de tu formulario:
   ```env
   NEXT_PUBLIC_GOOGLE_FORMS_URL=https://docs.google.com/forms/d/e/1FAIpQLSfXXXXXXXXXXXXXXXXXXXXXXXX/viewform
   ```

3. Abre el archivo `/home/guerra/Work/286/acuerdo286/lib/api.ts`

4. Busca la función `generarUrlGoogleForms` (línea ~175)

5. Reemplaza los valores de `entryMap` con tus **Entry IDs reales**:

   ```typescript
   const entryMap = {
     nombre: 'entry.2005620554',           // ← Reemplaza con tu entry ID
     apellido_paterno: 'entry.1045781291', // ← Reemplaza con tu entry ID
     apellido_materno: 'entry.1065046570', // ← Reemplaza con tu entry ID
     correo: 'entry.1166974658',           // ← Reemplaza con tu entry ID
     telefono: 'entry.839337160',          // ← Reemplaza con tu entry ID
     matricula: 'entry.1877115667',        // ← Reemplaza con tu entry ID
     curp: 'entry.2006368554',             // ← Reemplaza con tu entry ID
   }
   ```

## 🧪 Paso 5: Probar la Integración

1. Inicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a la página de inscripción: http://localhost:3001/inscripcion

3. Llena el formulario completo y regístrate

4. En el paso final (Confirmación), verás un botón **"Ir a Subir Documentos"**

5. Haz clic en el botón y verifica que:
   - Se abre el formulario de Google Forms en una nueva pestaña
   - Los campos de datos personales ya están pre-llenados
   - Solo necesitas subir los archivos

## 📊 Paso 6: Configurar Respuestas del Formulario

Para recibir notificaciones y organizar las respuestas:

### Opción A: Enviar notificaciones por correo

1. En tu formulario, ve a la pestaña **"Respuestas"**
2. Haz clic en los tres puntos (⋮)
3. Selecciona **"Recibir notificaciones por correo electrónico para las respuestas nuevas"**

### Opción B: Conectar con Google Sheets

1. En la pestaña **"Respuestas"**, haz clic en el ícono de Google Sheets (📊)
2. Crea una nueva hoja de cálculo o selecciona una existente
3. Todas las respuestas se guardarán automáticamente en la hoja

### Opción C: Configurar Google Drive

Los archivos subidos se guardarán automáticamente en:
```
Google Drive → [Nombre del Formulario] → Carpeta de respuestas
```

Para organizarlos mejor:
1. Ve a Google Drive
2. Busca la carpeta del formulario
3. Organiza por subcarpetas si lo deseas

## 🔐 Paso 7: Configurar Permisos

Para que los aspirantes puedan subir archivos:

1. En tu formulario, haz clic en **"Configuración"** (⚙️)
2. Ve a la sección **"General"**
3. Asegúrate de que esté **DESACTIVADA** la opción:
   - ❌ "Limitar a 1 respuesta"
4. En la sección **"Presentación"**:
   - ✅ "Mostrar barra de progreso"
   - ✅ "Reproducir orden de las preguntas"
5. En **"Valores predeterminados"**:
   - Decide si quieres permitir editar después de enviar

## 📧 Paso 8: Mensaje de Confirmación Personalizado

1. En **"Configuración"** → **"Presentación"**
2. Personaliza el **"Mensaje de confirmación"**:
   ```
   ¡Gracias por enviar tus documentos!

   Tu solicitud ha sido recibida correctamente.
   Folio: [Incluido en tu respuesta]

   Nos pondremos en contacto contigo en un plazo de 3-5 días hábiles.

   Para cualquier duda, contacta a: inscripciones@cuh.edu.mx
   ```

## 🎨 Personalización Visual

1. Haz clic en el ícono de paleta de colores (🎨)
2. Selecciona un tema acorde a tu institución
3. Puedes agregar un encabezado con el logo de CUH

## 🔍 Validaciones Adicionales Recomendadas

Para el campo de **Correo Electrónico**:
- Tipo: Respuesta corta
- Validación de respuesta → Texto → Dirección de correo electrónico

Para el campo de **Teléfono**:
- Tipo: Respuesta corta
- Validación de respuesta → Texto → Número

Para el campo de **CURP**:
- Tipo: Respuesta corta
- Validación de respuesta → Expresión regular
- Patrón: `[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d`

## 🚨 Solución de Problemas

### Problema: Los campos no se pre-llenan

**Solución:**
1. Verifica que hayas copiado los Entry IDs correctos
2. Asegúrate de que la URL base del formulario sea correcta
3. Revisa la consola del navegador para ver errores
4. Prueba manualmente la URL generada

### Problema: Error al subir archivos

**Solución:**
1. Verifica que el usuario esté conectado a una cuenta de Google
2. Aumenta el tamaño máximo de archivo permitido
3. Verifica que los tipos de archivo sean correctos (PDF, JPG, PNG)

### Problema: No recibo notificaciones

**Solución:**
1. Verifica que las notificaciones por correo estén activadas
2. Revisa la carpeta de spam
3. Confirma que la hoja de cálculo esté correctamente vinculada

## 📋 Checklist Final

- [ ] Formulario creado con todos los campos
- [ ] Entry IDs obtenidos del enlace pre-llenado
- [ ] `.env.local` actualizado con la URL del formulario
- [ ] `lib/api.ts` actualizado con los Entry IDs
- [ ] Notificaciones por correo configuradas
- [ ] Google Sheets vinculado (opcional)
- [ ] Mensaje de confirmación personalizado
- [ ] Prueba realizada con un registro de prueba
- [ ] Los campos se pre-llenan correctamente
- [ ] Los archivos se suben correctamente

## 📞 Soporte

Si tienes problemas con la configuración, verifica:
1. La URL del formulario en `.env.local`
2. Los Entry IDs en `lib/api.ts`
3. Los permisos del formulario de Google
4. La consola del navegador para errores de JavaScript

---

## 🎯 Ejemplo Completo de URL Pre-llenada

Si todo está configurado correctamente, la URL generada se verá así:

```
https://docs.google.com/forms/d/e/1FAIpQLSfXXXXXXXXXXX/viewform?
entry.1877115667=CUH-2026-123456&
entry.2005620554=Juan&
entry.1045781291=García&
entry.1065046570=López&
entry.1166974658=juan.garcia@ejemplo.com&
entry.839337160=5512345678&
entry.2006368554=GAGL850101HDFRRN09
```

Y el formulario se abrirá con todos estos campos ya completados, permitiendo al usuario solo subir los documentos.
