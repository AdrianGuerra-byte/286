#!/bin/bash

# 🧪 Script de Prueba - Sistema de Inscripciones
# Este script verifica que todo esté correctamente configurado

echo "🔍 Verificando configuración del sistema..."
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de errores
ERRORS=0

# ==============================================================================
# 1. Verificar Node.js
# ==============================================================================
echo "📦 1. Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js instalado: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js no está instalado"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ==============================================================================
# 2. Verificar pnpm
# ==============================================================================
echo "📦 2. Verificando pnpm..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✓${NC} pnpm instalado: $PNPM_VERSION"
else
    echo -e "${YELLOW}⚠${NC} pnpm no está instalado (puedes usar npm o yarn)"
fi
echo ""

# ==============================================================================
# 3. Verificar archivo .env.local
# ==============================================================================
echo "⚙️  3. Verificando configuración (.env.local)..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} Archivo .env.local existe"

    # Verificar que tenga las variables necesarias
    if grep -q "NEXT_PUBLIC_API_URL" .env.local; then
        API_URL=$(grep "NEXT_PUBLIC_API_URL" .env.local | cut -d '=' -f2)
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_API_URL configurada: $API_URL"
    else
        echo -e "${RED}✗${NC} NEXT_PUBLIC_API_URL no está configurada"
        ERRORS=$((ERRORS + 1))
    fi

    if grep -q "NEXT_PUBLIC_GOOGLE_FORMS_URL" .env.local; then
        FORMS_URL=$(grep "NEXT_PUBLIC_GOOGLE_FORMS_URL" .env.local | cut -d '=' -f2)
        if [[ $FORMS_URL == *"TU_FORM_ID"* ]]; then
            echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_GOOGLE_FORMS_URL no está actualizada (aún tiene TU_FORM_ID)"
        else
            echo -e "${GREEN}✓${NC} NEXT_PUBLIC_GOOGLE_FORMS_URL configurada"
        fi
    else
        echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_GOOGLE_FORMS_URL no está configurada (opcional)"
    fi
else
    echo -e "${RED}✗${NC} Archivo .env.local no existe"
    echo "   Ejecuta: cp .env.example .env.local"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ==============================================================================
# 4. Verificar Backend API
# ==============================================================================
echo "🔌 4. Verificando conexión con el Backend..."
if [ -f ".env.local" ]; then
    API_URL=$(grep "NEXT_PUBLIC_API_URL" .env.local | cut -d '=' -f2)
    HEALTH_URL="${API_URL%/api}/api/health"

    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null)

    if [ "$HTTP_STATUS" == "200" ]; then
        echo -e "${GREEN}✓${NC} Backend respondiendo en $HEALTH_URL"

        # Verificar exámenes
        EXAMENES_URL="${API_URL}/examenes"
        EXAMENES_RESPONSE=$(curl -s "$EXAMENES_URL" 2>/dev/null)

        if echo "$EXAMENES_RESPONSE" | grep -q "success"; then
            EXAMENES_COUNT=$(echo "$EXAMENES_RESPONSE" | grep -o '"id"' | wc -l)
            echo -e "${GREEN}✓${NC} Exámenes disponibles: $EXAMENES_COUNT"
        else
            echo -e "${YELLOW}⚠${NC} No se pudieron cargar los exámenes"
        fi
    else
        echo -e "${RED}✗${NC} Backend no responde en $HEALTH_URL (HTTP $HTTP_STATUS)"
        echo "   Asegúrate de que el backend esté corriendo en puerto 3000"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} No se puede verificar (falta .env.local)"
fi
echo ""

# ==============================================================================
# 5. Verificar PostgreSQL (si está en local)
# ==============================================================================
echo "🗄️  5. Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓${NC} PostgreSQL CLI instalado"
else
    echo -e "${YELLOW}⚠${NC} psql no está en el PATH (puede que esté en Docker)"
fi
echo ""

# ==============================================================================
# 6. Verificar archivos importantes
# ==============================================================================
echo "📁 6. Verificando archivos del proyecto..."

FILES=(
    "app/inscripcion/page.tsx"
    "lib/api.ts"
    "package.json"
    "next.config.mjs"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file existe"
    else
        echo -e "${RED}✗${NC} $file no existe"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# ==============================================================================
# 7. Verificar node_modules
# ==============================================================================
echo "📦 7. Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules existe"
else
    echo -e "${YELLOW}⚠${NC} node_modules no existe"
    echo "   Ejecuta: pnpm install"
fi
echo ""

# ==============================================================================
# 8. Verificar puerto 3001
# ==============================================================================
echo "🔌 8. Verificando disponibilidad del puerto 3001..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC} Puerto 3001 ya está en uso"
    echo "   Puede que el frontend ya esté corriendo"
    echo "   O ejecuta: lsof -ti:3001 | xargs kill -9"
else
    echo -e "${GREEN}✓${NC} Puerto 3001 disponible"
fi
echo ""

# ==============================================================================
# RESUMEN
# ==============================================================================
echo "=============================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ ¡Todo está configurado correctamente!${NC}"
    echo ""
    echo "Ejecuta para iniciar el frontend:"
    echo "  pnpm dev"
    echo ""
    echo "Luego abre: http://localhost:3001/inscripcion"
else
    echo -e "${RED}❌ Se encontraron $ERRORS errores${NC}"
    echo ""
    echo "Por favor, revisa los errores arriba y corrígelos."
    echo ""
    echo "Para más ayuda, consulta:"
    echo "  - QUICK_START.md"
    echo "  - INTEGRACION_FRONTEND_BACKEND.md"
fi
echo "=============================================="
