"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  MessageCircle,
  Loader2,
  ArrowLeft
} from "lucide-react"
import { api, type AspiranteEstatusCompleto } from "@/lib/api"

export default function EstatusPage() {
  const [matricula, setMatricula] = useState("")
  const [aspirante, setAspirante] = useState<AspiranteEstatusCompleto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // SEGURIDAD: Rate limiting para prevenir abuso de consultas
  const [lastQueryTime, setLastQueryTime] = useState<number>(0)
  const [queryCount, setQueryCount] = useState<number>(0)

  const validarEstatus = async () => {
    // SEGURIDAD: Validación básica de entrada
    if (!matricula.trim()) {
      setError("Por favor, ingresa tu folio")
      return
    }

    // SEGURIDAD: Rate limiting - máximo 5 consultas por minuto
    const now = Date.now()
    const oneMinute = 60000

    if (now - lastQueryTime < 2000) {
      setError("Por favor espera unos segundos antes de consultar nuevamente")
      return
    }

    if (queryCount >= 5 && now - lastQueryTime < oneMinute) {
      setError("Has excedido el límite de consultas. Por favor espera un minuto.")
      return
    }

    // SEGURIDAD: Validar formato de matrícula (debe empezar con A y tener números)
    const matriculaPattern = /^A\d{11}$/
    const matriculaLimpia = matricula.trim().toUpperCase()

    if (!matriculaPattern.test(matriculaLimpia)) {
      setError("Formato de folio inválido. Debe ser: A + 11 dígitos (ej: A28691261000)")
      return
    }

    setLoading(true)
    setError(null)
    setAspirante(null)

    // Actualizar contadores de rate limiting
    if (now - lastQueryTime < oneMinute) {
      setQueryCount(prev => prev + 1)
    } else {
      setQueryCount(1)
    }
    setLastQueryTime(now)

    try {
      const response = await api.validarEstatus(matriculaLimpia)

      if (response.success && response.data) {
        setAspirante(response.data)
      } else {
        setError(response.message || "No se pudo obtener la información")
      }
    } catch (err: any) {
      // SEGURIDAD: No exponer detalles del error en producción
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al validar estatus:', err)
      }

      // Mensaje genérico para proteger información del sistema
      if (err.message.includes('encontró')) {
        setError("No se encontró ningún registro con ese folio")
      } else {
        setError("No pudimos consultar tu información. Por favor, intenta nuevamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  const getIconoEstatus = (estatus: string) => {
    const estatusNormalizado = estatus.toLowerCase()

    if (estatusNormalizado.includes("validado")) {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />
    } else if (estatusNormalizado.includes("rechazado")) {
      return <XCircle className="w-5 h-5 text-red-600" />
    } else if (estatusNormalizado.includes("pendiente")) {
      return <Clock className="w-5 h-5 text-yellow-600" />
    } else {
      return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getColorEstatus = (estatus: string) => {
    const estatusNormalizado = estatus.toLowerCase()

    if (estatusNormalizado.includes("validado")) {
      return "text-green-700 bg-green-50 border-green-200"
    } else if (estatusNormalizado.includes("rechazado")) {
      return "text-red-700 bg-red-50 border-red-200"
    } else if (estatusNormalizado.includes("pendiente")) {
      return "text-yellow-700 bg-yellow-50 border-yellow-200"
    } else {
      return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      return fecha
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <Button asChild variant="ghost" size="sm" className="-ml-2">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Link>
              </Button>

              <div className="space-y-2">
                <h1 className="font-serif font-bold text-3xl sm:text-4xl text-foreground flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  Validar Estatus de Inscripción
                </h1>
                <p className="text-lg text-muted-foreground">
                  Consulta el estado de tu inscripción, documentos y proceso de pago
                </p>
              </div>
            </div>

            {/* Formulario de consulta o resultados */}
            {!aspirante ? (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Consultar Estatus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                      Ingresa tu folio completo para consultar el estatus de tu inscripción,
                      documentos y proceso de pago.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="matricula" className="text-base">
                      Matrícula <span className="text-muted-foreground text-sm">(ej: A28691261000)</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="matricula"
                        placeholder="A28691261000"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && validarEstatus()}
                        disabled={loading}
                        className="flex-1 font-mono text-lg"
                      />
                      <Button
                        onClick={validarEstatus}
                        disabled={loading || !matricula.trim()}
                        size="lg"
                        className="gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Consultando...
                          </>
                        ) : (
                          "Consultar"
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Información del aspirante */
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Encabezado con nombre */}
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <h2 className="font-serif font-bold text-2xl text-foreground mb-3">
                      {aspirante.nombre_completo}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {aspirante.correo_electronico}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {aspirante.numero_telefonico}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Grid de información */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6 space-y-1">
                      <p className="text-sm text-muted-foreground">Folio</p>
                      <p className="font-mono font-bold text-2xl text-primary">
                        {aspirante.matricula}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 space-y-1">
                      <p className="text-sm text-muted-foreground">Número de Referencia</p>
                      <p className="font-mono font-bold text-2xl text-primary">
                        {aspirante.numero_referencia}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Examen */}
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Examen a Presentar</p>
                      <p className="font-semibold text-lg text-foreground">{aspirante.examen.nombre}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Fechas */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6 flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha de Inscripción</p>
                        <p className="font-medium text-foreground">
                          {formatearFecha(aspirante.fecha_solicitud)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha del Examen</p>
                        <p className="font-medium text-foreground">
                          {formatearFecha(aspirante.fecha_aplicacion_examen)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Estatus de documentos */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      Estatus de Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`rounded-lg p-4 border ${getColorEstatus(aspirante.estatus_general)}`}>
                      <p className="font-semibold">{aspirante.estatus_general}</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: "acta_nacimiento", label: "Acta de Nacimiento" },
                        { key: "ine", label: "INE / Identificación Oficial" },
                        { key: "certificado_estudios", label: "Certificado de Estudios" },
                        { key: "comprobante_domicilio", label: "Comprobante de Domicilio" },
                      ].map((doc) => (
                        <div
                          key={doc.key}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium text-foreground">{doc.label}</span>
                          <div className="flex items-center gap-2">
                            {getIconoEstatus(
                              aspirante.estatus_documentos[doc.key as keyof typeof aspirante.estatus_documentos]
                            )}
                            <span className="text-sm font-medium">
                              {aspirante.estatus_documentos[doc.key as keyof typeof aspirante.estatus_documentos]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Estatus de pago */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-primary" />
                      Estatus de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {aspirante.estatus_pago ? (
                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-900 dark:text-green-100">
                            Pago Confirmado
                          </p>
                          {aspirante.fecha_pago && (
                            <p className="text-sm text-green-700 dark:text-green-200 mt-1">
                              Fecha de pago: {formatearFecha(aspirante.fecha_pago)}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-amber-900 dark:text-amber-100">
                              Pago Pendiente
                            </p>
                            <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                              Una vez que tus documentos sean validados, recibirás tu ficha de pago.
                            </p>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded p-3 border border-amber-200 dark:border-amber-800">
                          <p className="text-xs text-muted-foreground mb-1">Tu número de referencia para pago:</p>
                          <p className="font-mono font-bold text-lg text-primary">
                            {aspirante.numero_referencia}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Botón de acción */}
                <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
                  <CardContent className="p-6">
                    <Button
                      asChild
                      size="lg"
                      className="w-full gap-2"
                    >
                      <Link href="/#contacto">
                        <MessageCircle className="w-5 h-5" />
                        ¿Alguna duda? Contacta a nuestro asesor
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
