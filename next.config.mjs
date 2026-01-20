/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  /**
   * CONFIGURACIÓN DE SEGURIDAD
   * Headers de seguridad para proteger la aplicación
   */
  async headers() {
    return [
      {
        // Aplicar headers de seguridad a todas las rutas
        source: '/:path*',
        headers: [
          {
            // Prevenir clickjacking - la página no puede ser embebida en iframes
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Prevenir MIME type sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Habilitar protección XSS del navegador
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            // Política de referrer - no enviar información de origen
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Content Security Policy - prevenir XSS e inyección de código
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' http://localhost:4000 http://localhost:3000 https://hoyt-uncautious-jonnie.ngrok-free.dev https://*.vercel-insights.com https://*.vercel-analytics.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            // Permissions Policy - deshabilitar APIs no necesarias
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig