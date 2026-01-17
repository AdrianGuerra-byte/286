# 🚀 Quick Start - Inicio Rápido

Guía rápida para poner en marcha el sistema de inscripciones en **5 minutos**.

## ✅ Checklist Pre-requisitos

Antes de empezar, asegúrate de tener:

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Backend API corriendo en `http://localhost:3000`
- [ ] PostgreSQL con tablas creadas y exámenes insertados
- [ ] Cuenta de Google para crear el formulario

## 📦 Paso 1: Instalar Dependencias (30 segundos)

```bash
cd /home/guerra/Work/286/acuerdo286
pnpm install
```

## ⚙️ Paso 2: Configurar Backend (30 segundos)

Copia y actualiza el archivo de configuración:

```bash
cp .env.example .env.local
nano .env.local  # o usa tu editor favorito
```

Actualiza **solo** esta línea (si tu backend está en otro puerto):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Guarda y cierra (Ctrl+X, Y, Enter en nano).

## 🧪 Paso 3: Probar que Funciona (30 segundos)

```bash
# Verifica que el backend responda
curl http://localhost:3000/api/examenes

# Deberías ver una lista de exámenes en formato JSON
```

Si ves exámenes, ¡el backend está listo! ✅

## 🚀 Paso 4: Iniciar Frontend (10 segundos)

```bash
pnpm dev
```

Abre tu navegador en: **http://localhost:3001/inscripcion**

## ✨ Paso 5: Probar el Registro (2 minutos)

1. Ve a http://localhost:3001/inscripcion
2. Llena el formulario con datos de prueba:
   ```
   Nombre: Juan
   Apellido Paterno: García
   Apellido Materno: López
   Email: test@ejemplo.com
   Teléfono: 5512345678
   CURP: GAGL850101HDFRRN09
   Examen: Selecciona uno
   ```
3. Haz clic en "Continuar"
4. En "Carga de Documentos", haz clic en "Subir" para cada documento
5. Haz clic en "Continuar"
6. Acepta términos y haz clic en "Confirmar Registro"
7. ¡Deberías ver tu folio generado! (ej: `CUH-2026-123456`)

## 🔍 Paso 6: Verificar en la Base de Datos (30 segundos)

```bash
# Conéctate a PostgreSQL
psql -U tu_usuario -d tu_base_datos

# Verifica el registro
SELECT pseudo_matricula, nombre, apellido_paterno, correo_electronico
FROM aspirantes
ORDER BY id DESC
LIMIT 1;
```

Deberías ver el aspirante que acabas de registrar. ✅

---

## 📋 Google Forms (Configurar Después)

Para habilitar la carga de documentos, necesitas configurar Google Forms:

1. **Crear el formulario** → Ver [CONFIGURACION_GOOGLE_FORMS.md](./CONFIGURACION_GOOGLE_FORMS.md)
2. **Obtener Entry IDs** → Sigue la guía en el archivo
3. **Actualizar configuración**:
   - `.env.local` → URL del formulario
   - `lib/api.ts` → Entry IDs

**Nota:** El sistema funciona sin Google Forms, pero no se podrán subir documentos.

---

## 🐛 Problemas Comunes

### "Cannot connect to API"

```bash
# Verifica que el backend esté corriendo
curl http://localhost:3000/api/health

# Si no responde, inicia el backend
cd ../API-286  # o donde tengas el backend
pnpm dev
```

### "Port 3001 already in use"

```bash
# Opción 1: Mata el proceso
lsof -ti:3001 | xargs kill -9

# Opción 2: Usa otro puerto
PORT=3002 pnpm dev
```

### "No exámenes disponibles"

```bash
# Inserta exámenes de prueba
psql -U tu_usuario -d tu_base_datos << EOF
INSERT INTO cat_examenes (nombre, nivel, codigo_interno) VALUES
('Bachillerato General (Acuerdo 286)', 'MEDIA_SUPERIOR', 'MESU'),
('Lic. en Derecho', 'SUPERIOR', 'LICU');
EOF
```

### "Email ya registrado"

```bash
# Elimina el registro de prueba
psql -U tu_usuario -d tu_base_datos -c \
  "DELETE FROM aspirantes WHERE correo_electronico = 'test@ejemplo.com';"
```

---

## 📚 Documentación Completa

- **[INTEGRACION_FRONTEND_BACKEND.md](./INTEGRACION_FRONTEND_BACKEND.md)** → Guía completa de integración
- **[CONFIGURACION_GOOGLE_FORMS.md](./CONFIGURACION_GOOGLE_FORMS.md)** → Configurar Google Forms
- **[.env.example](./.env.example)** → Ejemplo de configuración

---

## ✅ Todo Listo

Si llegaste hasta aquí sin errores, tu sistema está funcionando:

✅ Frontend corriendo en http://localhost:3001
✅ Backend corriendo en http://localhost:3000
✅ Base de datos conectada
✅ Registro de aspirantes funcionando
✅ Generación de folios automática

**Siguiente paso:** Configura Google Forms siguiendo [CONFIGURACION_GOOGLE_FORMS.md](./CONFIGURACION_GOOGLE_FORMS.md)

---

## 🎯 Comandos Útiles

```bash
# Iniciar frontend
pnpm dev

# Ver logs en tiempo real
pnpm dev | grep -i error

# Compilar para producción
pnpm build
pnpm start

# Verificar tipos de TypeScript
pnpm run type-check

# Limpiar caché
rm -rf .next node_modules
pnpm install
```

---

## 📞 Necesitas Ayuda?

1. Revisa los logs en la terminal
2. Abre la consola del navegador (F12)
3. Verifica que el backend responda: `curl http://localhost:3000/api/health`
4. Consulta [INTEGRACION_FRONTEND_BACKEND.md](./INTEGRACION_FRONTEND_BACKEND.md)

---

**¡Éxito! 🎉**
