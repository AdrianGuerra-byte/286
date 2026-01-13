# 📚 Cómo Funciona la Separación de Exámenes

## 🎯 Concepto General

Los exámenes se dividen en dos categorías según su **nivel de regulación**:

### 1. **Licenciaturas Reguladas** (`"regulado": true`)
- Programas con reconocimiento oficial completo
- Solo requieren experiencia laboral (3 años)
- Ejemplos: Pedagogía, Administración, Sistemas

### 2. **Licenciaturas No Reguladas** (`"regulado": false`)
- Programas que requieren al menos **50% de créditos cursados**
- Además de experiencia laboral, el aspirante debe haber cursado la mitad de la carrera
- Ejemplos: Contaduría, Derecho

---

## 📝 Estructura del JSON

### Archivo: `data/examenes.json`

Cada examen tiene una propiedad `"regulado"` que define su categoría:

```json
{
  "id": "pedagogia",
  "nombre": "Licenciatura en Pedagogía",
  "categoria": "Nivel Superior",
  "regulado": true,  // ← CAMPO CLAVE: define si es regulado
  "descripcion": "...",
  "costo": "$15,000 MXN",
  // ... más propiedades
}
```

**Valores posibles:**
- `"regulado": true` → Licenciatura regulada
- `"regulado": false` → Licenciatura no regulada

---

## ⚙️ Lógica en el Componente

### Archivo: `components/exam-catalog.tsx`

### Paso 1: Importar los datos
```typescript
import examenesData from "@/data/examenes.json";
```
Se importa todo el array de exámenes desde el JSON.

### Paso 2: Filtrar y separar
```typescript
// Filtra solo los exámenes donde regulado === true
const examenesRegulados = examenesData.filter((exam: any) => exam.regulado === true);

// Filtra solo los exámenes donde regulado === false
const examenesNoRegulados = examenesData.filter((exam: any) => exam.regulado === false);
```

**¿Cómo funciona `.filter()`?**
- Recorre cada elemento del array
- Evalúa la condición (exam.regulado === true/false)
- Si es `true`, incluye el elemento en el nuevo array
- Si es `false`, lo excluye
- Retorna un nuevo array con los elementos que cumplieron la condición

**Resultado:**
```javascript
// Antes (examenesData)
[
  { id: "pedagogia", regulado: true },
  { id: "derecho", regulado: false },
  { id: "sistemas", regulado: true },
  { id: "contaduria", regulado: false }
]

// Después del filtrado
examenesRegulados = [
  { id: "pedagogia", regulado: true },
  { id: "sistemas", regulado: true }
]

examenesNoRegulados = [
  { id: "derecho", regulado: false },
  { id: "contaduria", regulado: false }
]
```

### Paso 3: Renderizado condicional
```typescript
{examenesRegulados.length > 0 && (
  <div>
    <h3>Licenciaturas Reguladas</h3>
    {/* Renderiza tarjetas */}
  </div>
)}
```

**¿Qué hace el operador `&&`?**
- Evalúa `examenesRegulados.length > 0`
- Si hay al menos 1 examen: renderiza el bloque JSX
- Si el array está vacío (length === 0): no renderiza nada

### Paso 4: Renderizar cada examen
```typescript
{examenesRegulados.map((exam) => (
  <ExamCard key={exam.id} exam={exam} />
))}
```

**¿Qué hace `.map()`?**
- Recorre cada elemento del array
- Por cada examen, crea un componente `<ExamCard>`
- `key={exam.id}` es necesario para que React identifique cada elemento

---

## 🎨 Diferenciación Visual

### Licenciaturas Reguladas
```tsx
<div className="border-l-4 border-primary pl-4">
  {/* Borde azul (color primary del tema) */}
</div>
```

### Licenciaturas No Reguladas
```tsx
<div className="border-l-4 border-amber-500 pl-4">
  {/* Borde amarillo/ámbar para advertencia */}
</div>
```

---

## 🔄 Flujo Completo

```
1. Usuario carga la página
   ↓
2. Se importa examenes.json
   ↓
3. .filter() separa en dos arrays (regulados/no regulados)
   ↓
4. Se evalúa si cada array tiene elementos (length > 0)
   ↓
5a. Si hay regulados → Renderiza sección azul con sus tarjetas
5b. Si hay no regulados → Renderiza sección amarilla con sus tarjetas
   ↓
6. Usuario ve ambas secciones claramente diferenciadas
```

---

## 📊 Resumen Técnico

| Aspecto | Implementación |
|---------|----------------|
| **Almacenamiento** | Campo `"regulado"` en JSON (boolean) |
| **Filtrado** | Método `.filter()` con condición `exam.regulado === true/false` |
| **Separación** | Dos arrays independientes: `examenesRegulados` y `examenesNoRegulados` |
| **Renderizado** | Condicional con `&&` para mostrar solo si hay elementos |
| **Visualización** | Bordes de colores diferentes (azul/amarillo) |

---

## ✅ Ventajas de este Sistema

1. **Escalable**: Agregar más exámenes solo requiere definir `"regulado": true/false`
2. **Mantenible**: Toda la lógica está centralizada en un solo archivo
3. **Flexible**: Fácil agregar más categorías si fuera necesario
4. **Clear**: Separación visual clara para el usuario
5. **Performance**: Filtrado eficiente con métodos nativos de JavaScript
