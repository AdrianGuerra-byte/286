// URL base del backend (se normaliza para evitar duplicar rutas como /api o /registro286)
const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
const BASE_URL = rawBase.replace(/\/(api|registro286)\/?$/i, '')
const API_URL = `${BASE_URL}/registro286`

// Interfaz para los exámenes
// regulado: true = Licenciaturas con reconocimiento oficial completo
// regulado: false = Licenciaturas no reguladas (requieren al menos 50% de créditos cursados)
export interface Examen {
  id: number
  nombre: string
  nivel: 'MEDIA_SUPERIOR' | 'SUPERIOR'
  codigo_interno: string
  costo?: string
  activo: boolean
  regulado?: boolean
}

export interface AspiranteData {
  nombre: string
  apellido_paterno: string
  apellido_materno?: string
  correo_electronico: string
  numero_telefonico: string
  examen_id: number
  curp?: string
  metadata?: {
    documentos?: {
      ActaNacimiento?: 'Pendiente' | 'Validado' | 'Rechazado'
      INE?: 'Pendiente' | 'Validado' | 'Rechazado'
      CertificadoEstudios?: 'Pendiente' | 'Validado' | 'Rechazado'
      ComprobanteDomicilio?: 'Pendiente' | 'Validado' | 'Rechazado'
    }
    [key: string]: any
  }
}

export interface AspiranteResponse {
  id: number
  nombre: string
  apellido_paterno: string
  apellido_materno: string | null
  correo_electronico: string
  numero_telefonico: string
  folio: string
  numero_referencia?: string
  fecha_aplicacion_examen: string
  estatus_pago: boolean
  examen: Examen
}

export interface EstatusDocumento {
  acta_nacimiento: string
  ine: string
  certificado_estudios: string
  comprobante_domicilio: string
}

export interface AspiranteEstatusCompleto {
  nombre_completo: string
  correo_electronico: string
  numero_telefonico: string
  examen: {
    id: number
    nombre: string
  }
  matricula: string
  numero_referencia: string
  estatus_pago: boolean
  fecha_pago: string | null
  fecha_solicitud: string
  fecha_aplicacion_examen: string
  estatus_documentos: EstatusDocumento
  estatus_general: string
  metadata?: {
    documentos?: {
      ActaNacimiento?: string
      INE?: string
      CertificadoEstudios?: string
      ComprobanteDomicilio?: string
    }
  }
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Array<{ campo: string; mensaje: string }>
}

export const api = {
  /**
   * Obtener todos los exámenes disponibles
   */
  async getExamenes(): Promise<ApiResponse<Examen[]>> {
    try {
      const response = await fetch(`${API_URL}/examenes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener exámenes')
      }

      return data
    } catch (error) {
      // SEGURIDAD: Solo logear en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al obtener exámenes:', error)
      }
      throw error
    }
  },

  /**
   * Obtener un examen por ID
   */
  async getExamenById(id: number): Promise<ApiResponse<Examen>> {
    try {
      const response = await fetch(`${API_URL}/examenes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener examen')
      }

      return data
    } catch (error) {
      // SEGURIDAD: Solo logear en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al obtener examen:', error)
      }
      throw error
    }
  },

  /**
   * Registrar un nuevo aspirante
   */
  async registrarAspirante(datos: AspiranteData): Promise<ApiResponse<{ aspirante: AspiranteResponse }>> {
    try {
      const response = await fetch(`${API_URL}/aspirantes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(datos),
      })

      const data = await response.json()

      if (!response.ok) {
        // DESARROLLO: Mostrar respuesta completa del servidor para diagnóstico
        if (process.env.NODE_ENV === 'development') {
          console.log('Respuesta del servidor:', JSON.stringify(data, null, 2))
          console.log('Status code:', response.status)
        }

        // Manejar errores específicos
        if (response.status === 409) {
          throw new Error('El correo electrónico ya está registrado')
        } else if (response.status === 400) {
          const errorMsg = data.errors
            ? data.errors.map((e: any) => e.mensaje).join(', ')
            : data.message
          throw new Error(errorMsg || 'Datos inválidos')
        } else {
          throw new Error(data.message || 'Error al registrar aspirante')
        }
      }

      // Normalizar posibles nombres de matrícula devueltos por el backend
      if (data && data.data && data.data.aspirante) {
        const aspirante = data.data.aspirante as any
        aspirante.folio = aspirante.folio || aspirante.pseudo_matricula || aspirante.matricula || aspirante.pseudo_matricula || aspirante.pseudoMatricula
      }

      return data
    } catch (error) {
      // SEGURIDAD: Solo logear en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al registrar aspirante:', error)
      }
      throw error
    }
  },

  /**
   * Obtener aspirante por matrícula (versión simple)
   */
  async getAspirantePorMatricula(matricula: string): Promise<ApiResponse<AspiranteResponse>> {
    try {
      const response = await fetch(`${API_URL}/aspirantes/matricula/${matricula}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Aspirante no encontrado')
      }

      return data
    } catch (error) {
      // SEGURIDAD: Solo logear en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al obtener aspirante por matrícula:', error)
      }
      throw error
    }
  },
  async validarEstatus(matricula: string): Promise<ApiResponse<AspiranteEstatusCompleto>> {
    try {
      const response = await fetch(`${API_URL}/aspirantes/matricula/${matricula}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No se encontró ningún registro con esa matrícula')
        }
        throw new Error(data.message || 'Error al validar estatus')
      }

      return data
    } catch (error) {
      // SEGURIDAD: Solo logear en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al validar estatus:', error)
      }
      throw error
    }
  },

  /**
   * Obtener aspirante por ID
   */
  async getAspiranteById(id: number): Promise<ApiResponse<AspiranteResponse>> {
    try {
      const response = await fetch(`${API_URL}/aspirantes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Aspirante no encontrado')
      }

      return data
    } catch (error) {
      // SEGURIDAD: Solo logear en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al obtener aspirante por ID:', error)
      }
      throw error
    }
  },
}

/**
 * Generar URL de Google Forms con parámetros pre-llenados
 *
 * Para obtener los entry IDs de tu formulario de Google:
 * 1. Abre tu Google Form en modo edición
 * 2. Haz clic en "Obtener enlace rellenado previamente"
 * 3. Llena el formulario con valores de prueba
 * 4. Copia el enlace que se genera
 * 5. Los entry.XXXXXX son los IDs que necesitas
 *
 * Ejemplo de URL:
 * https://docs.google.com/forms/d/e/FORM_ID/viewform?entry.123456=Nombre&entry.789012=Correo
 */
export function generarUrlGoogleForms(datos: {
  nombre?: string
  apellido_paterno?: string
  apellido_materno?: string
  correo_electronico?: string
  numero_telefonico?: string
  matricula?: string
  curp?: string
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_GOOGLE_FORMS_URL || ''

  // Si no hay URL configurada, devolver vacío
  if (!baseUrl) {
    console.warn('No se ha configurado NEXT_PUBLIC_GOOGLE_FORMS_URL en .env.local')
    return ''
  }

  // Mapeo de campos a entry IDs de Google Forms
  // IMPORTANTE: Reemplaza estos valores con los entry IDs reales de tu formulario
  const entryMap = {
    nombre: 'entry.2005620554',           // Reemplazar con tu entry ID
    apellido_paterno: 'entry.1045781291', // Reemplazar con tu entry ID
    apellido_materno: 'entry.1065046570', // Reemplazar con tu entry ID
    correo: 'entry.1166974658',           // Reemplazar con tu entry ID
    telefono: 'entry.839337160',          // Reemplazar con tu entry ID
    matricula: 'entry.1877115667',        // Reemplazar con tu entry ID
    curp: 'entry.2006368554',             // Reemplazar con tu entry ID
  }

  // Construir parámetros
  const params = new URLSearchParams()

  if (datos.nombre) {
    params.append(entryMap.nombre, datos.nombre)
  }
  if (datos.apellido_paterno) {
    params.append(entryMap.apellido_paterno, datos.apellido_paterno)
  }
  if (datos.apellido_materno) {
    params.append(entryMap.apellido_materno, datos.apellido_materno)
  }
  if (datos.correo_electronico) {
    params.append(entryMap.correo, datos.correo_electronico)
  }
  if (datos.numero_telefonico) {
    params.append(entryMap.telefono, datos.numero_telefonico)
  }
  if (datos.matricula) {
    params.append(entryMap.matricula, datos.matricula)
  }
  if (datos.curp) {
    params.append(entryMap.curp, datos.curp)
  }

  // Si no hay parámetros, devolver solo la URL base
  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
