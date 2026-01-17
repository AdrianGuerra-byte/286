# Manual de Despliegue - Acuerdo 286 Landing Page

## Ubuntu Server + NGINX + PM2

---

### Descripción del Proyecto

Este documento detalla el proceso completo para desplegar la aplicación **Acuerdo 286 Landing Page** desarrollada con **Next.js** en un servidor **Ubuntu Server** utilizando **NGINX** como proxy inverso y **PM2** como gestor de procesos.

---

## Índice

1. [Requisitos Previos](#1-requisitos-previos)
2. [Preparación del Servidor](#2-preparación-del-servidor)
3. [Clonación del Repositorio](#3-clonación-del-repositorio)
4. [Configuración y Compilación del Proyecto](#4-configuración-y-compilación-del-proyecto)
5. [Configuración de PM2](#5-configuración-de-pm2)
6. [Configuración de NGINX](#6-configuración-de-nginx)
7. [Certificado SSL con Certbot](#7-certificado-ssl-con-certbot-opcional)
8. [Mantenimiento y Actualizaciones](#8-mantenimiento-y-actualizaciones)
9. [Solución de Problemas](#9-solución-de-problemas)

---

## 1. Requisitos Previos

### En el servidor Ubuntu debe estar instalado:

| Componente | Versión Mínima | Función |
|------------|----------------|---------|
| **Ubuntu Server** | 22.04 LTS | Sistema operativo |
| **Node.js** | 18.x o superior | Entorno de ejecución JavaScript |
| **pnpm** | 8.x o superior | Gestor de paquetes |
| **PM2** | 5.x o superior | Gestor de procesos Node.js |
| **NGINX** | 1.18+ | Proxy inverso y servidor web |
| **Git** | 2.x | Control de versiones |

> **Nota Importante:** A diferencia de proyectos estáticos (como Astro), Next.js requiere un servidor Node.js ejecutándose constantemente. NGINX actúa como proxy inverso redirigiendo las solicitudes al proceso de Next.js.

---

## 2. Preparación del Servidor

### 2.1 Actualizar el sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Instalar Git

```bash
sudo apt install git -y
```

### 2.3 Instalar Node.js (usando NodeSource)

```bash
# Agregar repositorio de NodeSource para Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt install nodejs -y

# Verificar instalación
node --version
npm --version
```

### 2.4 Instalar pnpm

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Verificar instalación
pnpm --version
```

### 2.5 Instalar PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Verificar instalación
pm2 --version
```

### 2.6 Instalar NGINX

```bash
# Instalar NGINX
sudo apt install nginx -y

# Habilitar NGINX para que inicie automáticamente
sudo systemctl enable nginx

# Iniciar el servicio
sudo systemctl start nginx

# Verificar estado
sudo systemctl status nginx
```

---

## 3. Clonación del Repositorio

### 3.1 Crear directorio de trabajo

```bash
# Crear directorio para proyectos web
sudo mkdir -p /var/www

# Navegar al directorio
cd /var/www
```

### 3.2 Clonar el repositorio

```bash
# Clonar desde la rama main (ajustar URL según corresponda)
sudo git clone -b main https://github.com/TU_ORGANIZACION/acuerdo286.git

# Entrar al directorio del proyecto
cd acuerdo286
```

### 3.3 Asignar permisos adecuados

```bash
# Asignar propiedad al usuario actual
sudo chown -R $USER:$USER /var/www/acuerdo286

# Asignar permisos de lectura
sudo chmod -R 755 /var/www/acuerdo286
```

---

## 4. Configuración y Compilación del Proyecto

### 4.1 Instalar dependencias

```bash
cd /var/www/acuerdo286

# Instalar todas las dependencias del proyecto
pnpm install
```

### 4.2 Configurar variables de entorno (si aplica)

Si el proyecto requiere variables de entorno, crear el archivo `.env.local` en la raíz del proyecto:

```bash
# Crear archivo de variables de entorno
nano .env.local
```

Ejemplo de contenido:
```env
# Variables de entorno para producción
NEXT_PUBLIC_SITE_URL=https://midominio.com
NEXT_PUBLIC_API_URL=https://api.midominio.com
```

> **Nota:** Las variables que deben estar disponibles en el cliente deben comenzar con `NEXT_PUBLIC_`.

### 4.3 Compilar el proyecto para producción

```bash
# Generar build de producción
pnpm run build
```

Este comando genera la carpeta `.next/` con los archivos optimizados:

```
.next/
├── cache/           # Caché de compilación
├── server/          # Archivos del servidor
├── static/          # Archivos estáticos optimizados
└── ...
```

### 4.4 Verificar el build generado

```bash
# Listar contenido de la carpeta .next
ls -la .next/

# Probar que el servidor inicia correctamente
pnpm run start
# Presionar Ctrl+C para detener
```

---

## 5. Configuración de PM2

PM2 es esencial para mantener la aplicación Next.js ejecutándose de forma persistente y reiniciarla automáticamente si falla.

### 5.1 Crear archivo de configuración de PM2

```bash
# Crear archivo de configuración
nano /var/www/acuerdo286/ecosystem.config.js
```

### 5.2 Contenido del archivo ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'acuerdo286',
      script: 'node_modules/next/dist/bin/next',
      args: 'start --port 3001',
      cwd: '/var/www/acuerdo286',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/pm2/acuerdo286-error.log',
      out_file: '/var/log/pm2/acuerdo286-out.log',
      log_file: '/var/log/pm2/acuerdo286-combined.log',
      time: true
    }
  ]
};
```

### 5.3 Crear directorio de logs

```bash
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

### 5.4 Iniciar la aplicación con PM2

```bash
cd /var/www/acuerdo286

# Iniciar la aplicación
pm2 start ecosystem.config.js

# Verificar que está corriendo
pm2 status

# Ver logs en tiempo real
pm2 logs acuerdo286
```

### 5.5 Configurar PM2 para iniciar con el sistema

```bash
# Generar script de inicio
pm2 startup systemd

# Este comando mostrará una línea que debes ejecutar con sudo
# Ejemplo: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u tu_usuario --hp /home/tu_usuario

# Guardar la configuración actual
pm2 save
```

### 5.6 Comandos útiles de PM2

| Comando | Descripción |
|---------|-------------|
| `pm2 status` | Ver estado de las aplicaciones |
| `pm2 logs acuerdo286` | Ver logs en tiempo real |
| `pm2 restart acuerdo286` | Reiniciar la aplicación |
| `pm2 stop acuerdo286` | Detener la aplicación |
| `pm2 delete acuerdo286` | Eliminar la aplicación de PM2 |
| `pm2 monit` | Monitor interactivo |

---

## 6. Configuración de NGINX

NGINX actuará como proxy inverso, redirigiendo las solicitudes HTTP/HTTPS al servidor Next.js en el puerto 3001.

### 6.1 Crear archivo de configuración del sitio

```bash
# Crear configuración del sitio
sudo nano /etc/nginx/sites-available/acuerdo286
```

### 6.2 Contenido del archivo de configuración

Copiar y pegar la siguiente configuración, **reemplazando `midominio.com` por tu dominio real**:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name midominio.com www.midominio.com;

    # Configuración de logs
    access_log /var/log/nginx/acuerdo286_access.log;
    error_log /var/log/nginx/acuerdo286_error.log;

    # Tamaño máximo de carga de archivos
    client_max_body_size 10M;

    # Proxy a Next.js
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Archivos estáticos de Next.js (optimización de caché)
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;

        # Caché agresivo para archivos estáticos
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Archivos públicos estáticos
    location /public/ {
        alias /var/www/acuerdo286/public/;
        expires 30d;
        add_header Cache-Control "public";
    }

    # Seguridad - Ocultar versión de NGINX
    server_tokens off;

    # Seguridad - Headers adicionales
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compresión Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json image/svg+xml;
    gzip_comp_level 6;
}
```

### 6.3 Habilitar el sitio

```bash
# Crear enlace simbólico para habilitar el sitio
sudo ln -s /etc/nginx/sites-available/acuerdo286 /etc/nginx/sites-enabled/

# Eliminar configuración por defecto (opcional)
sudo rm /etc/nginx/sites-enabled/default
```

### 6.4 Verificar configuración de NGINX

```bash
# Probar que la configuración sea válida
sudo nginx -t
```

Deberías ver:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 6.5 Reiniciar NGINX

```bash
# Recargar configuración de NGINX
sudo systemctl reload nginx

# O reiniciar completamente
sudo systemctl restart nginx
```

---

## 7. Certificado SSL con Certbot (Opcional)

### 7.1 Instalar Certbot

```bash
# Instalar Certbot y plugin de NGINX
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 Obtener certificado SSL

```bash
# Obtener certificado (reemplazar con tu dominio)
sudo certbot --nginx -d midominio.com -d www.midominio.com
```

### 7.3 Renovación automática

Certbot configura automáticamente la renovación. Verificar con:

```bash
# Probar renovación
sudo certbot renew --dry-run

# Ver timer de renovación
sudo systemctl status certbot.timer
```

---

## 8. Mantenimiento y Actualizaciones

### 8.1 Script de actualización automatizada

Crear un script para facilitar las actualizaciones:

```bash
# Crear script de actualización
nano /var/www/acuerdo286/update.sh
```

Contenido del script:

```bash
#!/bin/bash

# Script de actualización - Acuerdo 286
# Uso: ./update.sh

set -e

echo "🔄 Iniciando actualización de Acuerdo 286..."

cd /var/www/acuerdo286

echo "📥 Obteniendo últimos cambios..."
git pull origin main

echo "📦 Instalando dependencias..."
pnpm install

echo "🔨 Compilando proyecto..."
pnpm run build

echo "🔄 Reiniciando aplicación..."
pm2 restart acuerdo286

echo "✅ Actualización completada exitosamente!"
echo "📊 Estado de la aplicación:"
pm2 status acuerdo286
```

```bash
# Dar permisos de ejecución
chmod +x /var/www/acuerdo286/update.sh
```

### 8.2 Actualizar manualmente

```bash
# Navegar al directorio del proyecto
cd /var/www/acuerdo286

# Obtener últimos cambios
git pull origin main

# Instalar nuevas dependencias (si las hay)
pnpm install

# Recompilar el proyecto
pnpm run build

# Reiniciar la aplicación
pm2 restart acuerdo286
```

### 8.3 Archivos que NO deben modificarse en el servidor

Al actualizar el proyecto, **NO sobrescribir** los siguientes archivos si contienen configuraciones específicas del servidor:

| Archivo/Carpeta | Razón |
|-----------------|-------|
| `.env.local` | Contiene variables de entorno de producción |
| `ecosystem.config.js` | Configuración de PM2 específica del servidor |
| Archivos personalizados en `public/` | Pueden contener recursos específicos del servidor |

---

## 9. Solución de Problemas

### 9.1 La aplicación no inicia con PM2

```bash
# Ver logs de error
pm2 logs acuerdo286 --err

# Verificar estado detallado
pm2 describe acuerdo286

# Reiniciar con logs en tiempo real
pm2 restart acuerdo286 && pm2 logs acuerdo286
```

### 9.2 NGINX no inicia

```bash
# Ver logs de error
sudo journalctl -xeu nginx

# Verificar configuración
sudo nginx -t

# Ver logs específicos del sitio
sudo tail -f /var/log/nginx/acuerdo286_error.log
```

### 9.3 Error 502 Bad Gateway

Este error indica que NGINX no puede conectar con el servidor Next.js.

```bash
# Verificar que PM2 está corriendo la aplicación
pm2 status

# Si no está corriendo, iniciarla
pm2 start ecosystem.config.js

# Verificar que el puerto 3001 está en uso
sudo netstat -tlnp | grep 3001

# Verificar logs de la aplicación
pm2 logs acuerdo286
```

### 9.4 Error 403 Forbidden

```bash
# Verificar permisos del directorio
ls -la /var/www/acuerdo286

# Corregir permisos
sudo chmod -R 755 /var/www/acuerdo286
sudo chown -R $USER:$USER /var/www/acuerdo286
```

### 9.5 Cambios no se reflejan después del build

```bash
# Limpiar caché del navegador o usar modo incógnito

# Eliminar caché de Next.js y recompilar
rm -rf .next
pnpm run build

# Reiniciar la aplicación
pm2 restart acuerdo286

# Forzar recarga de NGINX
sudo systemctl restart nginx
```

### 9.6 Error en pnpm install

```bash
# Limpiar caché de pnpm
pnpm store prune

# Eliminar node_modules y reinstalar
rm -rf node_modules
pnpm install
```

### 9.7 Memoria insuficiente durante el build

```bash
# Aumentar memoria disponible para Node.js
export NODE_OPTIONS="--max-old-space-size=4096"

# Ejecutar build
pnpm run build
```

### 9.8 Ver uso de recursos

```bash
# Monitor de PM2
pm2 monit

# Ver uso de memoria y CPU
htop
```

---

## Resumen de Comandos Principales

| Acción | Comando |
|--------|---------|
| Instalar dependencias | `pnpm install` |
| Compilar para producción | `pnpm run build` |
| Iniciar con PM2 | `pm2 start ecosystem.config.js` |
| Reiniciar aplicación | `pm2 restart acuerdo286` |
| Ver estado de PM2 | `pm2 status` |
| Ver logs de PM2 | `pm2 logs acuerdo286` |
| Verificar NGINX | `sudo nginx -t` |
| Reiniciar NGINX | `sudo systemctl restart nginx` |
| Ver logs de NGINX | `sudo tail -f /var/log/nginx/acuerdo286_error.log` |
| Actualizar proyecto | `./update.sh` |

---

## Estructura Final en el Servidor

```
/var/www/acuerdo286/
├── .next/                   # ← Build de Next.js (generado)
│   ├── cache/
│   ├── server/
│   └── static/
├── app/                     # Código fuente de la aplicación
│   ├── layout.tsx
│   ├── page.tsx
│   └── ...
├── components/              # Componentes React
├── data/                    # Datos JSON
├── lib/                     # Utilidades
├── public/                  # Archivos públicos estáticos
│   ├── cuh_edificio.avif
│   └── logo-cuh.avif
├── Docs/                    # Documentación
├── node_modules/            # Dependencias (no versionado)
├── package.json
├── pnpm-lock.yaml
├── next.config.mjs
├── ecosystem.config.js      # ← Configuración de PM2
├── .env.local               # ← Variables de entorno (no versionado)
└── update.sh                # ← Script de actualización
```

---

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     INTERNET                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    UBUNTU SERVER                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                      NGINX                             │  │
│  │              (Puerto 80 / 443)                         │  │
│  │           Proxy Inverso + SSL                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                       PM2                              │  │
│  │              (Gestor de Procesos)                      │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              NEXT.JS SERVER                      │  │  │
│  │  │               (Puerto 3001)                      │  │  │
│  │  │         /var/www/acuerdo286                      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Verificación Final

Después de completar el despliegue, verificar:

- [ ] `pm2 status` muestra la aplicación como "online"
- [ ] `sudo nginx -t` no muestra errores
- [ ] El sitio es accesible en `http://midominio.com`
- [ ] El certificado SSL está activo (si se configuró)
- [ ] Los logs no muestran errores críticos

---

**Documento creado:** Enero 2026
**Última actualización:** Enero 2026
**Versión:** 1.0
**Framework:** Next.js 16.x
**Gestor de paquetes:** pnpm
