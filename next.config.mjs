import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Normalizar la URL pública de la API para usar solo el origen en la CSP (evita incluir rutas como /api o /registro286)
const _rawApi = process.env.NEXT_PUBLIC_API_URL || ''
const API_ORIGIN = (_rawApi || '').replace(/\/(api|registro286)\/?$/i, '') || ''
const DEV_ALLOWED_ORIGINS = process.env.NODE_ENV !== 'production' ? ['http://localhost:3000', 'http://localhost:4000'] : []

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // SE MOVIÓ AQUÍ: Ya no es parte de 'experimental'
  outputFileTracingRoot: path.join(__dirname, '../../'),

  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  async headers() {
    // Construir orígenes permitidos dinámicamente
    const connectOrigins = ["'self'"]
    if (API_ORIGIN) connectOrigins.push(API_ORIGIN)
    if (DEV_ALLOWED_ORIGINS.length) connectOrigins.push(...DEV_ALLOWED_ORIGINS)

    const scriptSrc = ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https://va.vercel-scripts.com']

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src ${scriptSrc.join(' ')}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              `connect-src ${connectOrigins.join(' ')}`,
              "frame-src 'self' https://www.google.com https://docs.google.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig