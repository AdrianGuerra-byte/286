/**
 * CONFIGURACIÓN DE SEGURIDAD
 *
 * Este archivo contiene las configuraciones y constantes relacionadas
 * con la seguridad de la aplicación.
 */

// Rate Limiting - Límites de peticiones para prevenir abuso
export const SECURITY_CONFIG = {
  // Tiempo mínimo entre envíos de formulario (milisegundos)
  FORM_SUBMIT_DEBOUNCE: 3000, // 3 segundos

  // Tiempo mínimo entre consultas de estatus (milisegundos)
  STATUS_QUERY_DEBOUNCE: 2000, // 2 segundos

  // Máximo número de consultas por minuto
  MAX_QUERIES_PER_MINUTE: 5,

  // Ventana de tiempo para rate limiting (milisegundos)
  RATE_LIMIT_WINDOW: 60000, // 1 minuto
}

// Validaciones de campos
export const VALIDATION = {
  // Longitud máxima de nombres para prevenir ataques
  MAX_NAME_LENGTH: 100,

  // Longitud máxima de email
  MAX_EMAIL_LENGTH: 255,

  // Longitud máxima de teléfono
  MAX_PHONE_LENGTH: 10,

  // Patrón de email válido
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Patrón de matrícula válida (A + 11 dígitos)
  MATRICULA_PATTERN: /^A\d{11}$/,

  // Patrón de nombre válido (letras, espacios, acentos, guiones)
  NAME_PATTERN: /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s-]+$/,
}

/**
 * Sanitiza un string removiendo caracteres peligrosos
 * Previene XSS y SQL injection básicos
 * También remueve números de nombres para cumplir con validaciones del backend
 *
 * @param input - String a sanitizar
 * @param removeNumbers - Si debe remover números (por defecto true para nombres)
 * @returns String sanitizado
 */
export function sanitizeInput(input: string, removeNumbers: boolean = false): string {
  let sanitized = input
    .trim()
    .replace(/[<>"'`]/g, '') // Remover caracteres HTML/JS peligrosos
    .replace(/\\/g, '') // Remover backslashes
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples

  // Remover números si se especifica (útil para nombres)
  if (removeNumbers) {
    sanitized = sanitized.replace(/[0-9]/g, '')
  }

  return sanitized
}

/**
 * Valida que un nombre solo contenga letras, espacios, acentos y guiones
 * Compatible con nombres en español
 *
 * @param name - Nombre a validar
 * @returns true si es válido, false si no
 */
export function isValidName(name: string): boolean {
  return VALIDATION.NAME_PATTERN.test(name) &&
         name.length > 0 &&
         name.length <= VALIDATION.MAX_NAME_LENGTH
}

/**
 * Valida que una matrícula tenga formato correcto
 * Formato esperado: A + 11 dígitos (ej: A28691261000)
 *
 * @param matricula - Matrícula a validar
 * @returns true si es válida, false si no
 */
export function isValidMatricula(matricula: string): boolean {
  return VALIDATION.MATRICULA_PATTERN.test(matricula.toUpperCase())
}

/**
 * Logging seguro - solo en desarrollo
 * Previene exposición de información sensible en producción
 *
 * @param message - Mensaje a logear
 * @param data - Datos opcionales a logear
 */
export function secureLog(message: string, data?: any): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${message}`, data || '')
  }
}

/**
 * Error logging seguro - solo en desarrollo
 *
 * @param message - Mensaje de error
 * @param error - Error object opcional
 */
export function secureErrorLog(message: string, error?: any): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${new Date().toISOString()}] ${message}`, error || '')
  }
}

// Mensajes de error genéricos para no exponer detalles del sistema
export const ERROR_MESSAGES = {
  GENERIC: 'Ocurrió un error. Por favor, intenta nuevamente.',
  NETWORK: 'Error de conexión. Verifica tu internet e intenta de nuevo.',
  VALIDATION: 'Por favor verifica que todos los campos estén correctos.',
  RATE_LIMIT: 'Has excedido el límite de peticiones. Por favor espera un momento.',
  DEBOUNCE: 'Por favor espera unos segundos antes de intentar nuevamente.',
  UNAUTHORIZED: 'No tienes permiso para realizar esta acción.',
  NOT_FOUND: 'No se encontró la información solicitada.',
}
