"use client"

import { useState } from "react"
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
  X
} from "lucide-react"
import { api, type AspiranteEstatusCompleto } from "@/lib/api"

interface ValidarEstatusProps {
  onClose: () => void
}

export function ValidarEstatus({ onClose }: ValidarEstatusProps) {
  const [matricula, setMatricula] = useState("")
  const [aspirante, setAspirante] = useState<AspiranteEstatusCompleto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validarEstatus = async () => {
    if (!matricula.trim()) {
      setError("Por favor, ingresa tu matrícula")
      return
    }

    setLoading(true)
    setError(null)
    setAspirante(null)

    try {
      const response = await api.validarEstatus(matricula.trim().toUpperCase())

      if (response.success && response.data) {
        setAspirante(response.data)
      } else {
        setError(response.message || "No se pudo obtener la información")
      }
    } catch (err: any) {
      setError(err.message || "Error al consultar la matrícula")
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8 shadow-2xl border-2">
        <CardHeader className="space-y-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-2xl flex items-center gap-3">
              <FileText className="w-7 h-7 text-primary" />
              Validar Estatus de Inscripción
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Formulario de consulta */}
          {!aspirante && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                  Ingresa tu matrícula completa para consultar el estatus de tu inscripción,
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
            </div>
          )}

          {/* Información del aspirante */}
          {aspirante && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Encabezado con nombre */}
              <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6">
                <h3 className="font-serif font-bold text-2xl text-foreground mb-2">
                  {aspirante.nombre_completo}
                </h3>
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
              </div>

              {/* Grid de información */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                  <p className="text-sm text-muted-foreground">Matrícula</p>
                  <p className="font-mono font-bold text-xl text-primary">
                    {aspirante.matricula}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                  <p className="text-sm text-muted-foreground">Número de Referencia</p>
                  <p className="font-mono font-bold text-xl text-primary">
                    {aspirante.numero_referencia}
                  </p>
                </div>
              </div>

              {/* Examen */}
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Examen a Presentar</p>
                    <p className="font-semibold text-foreground">{aspirante.examen.nombre}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fechas */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-start gap-3">
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
                  <CardContent className="p-4 flex items-start gap-3">
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
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Estatus de Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`rounded-lg p-3 border ${getColorEstatus(aspirante.estatus_general)}`}>
                    <p className="font-semibold text-sm">{aspirante.estatus_general}</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: "acta_nacimiento", label: "Acta de Nacimiento" },
                      { key: "ine", label: "INE / Identificación Oficial" },
                      { key: "certificado_estudios", label: "Certificado de Estudios" },
                      { key: "comprobante_domicilio", label: "Comprobante de Domicilio" },
                    ].map((doc) => (
                      <div
                        key={doc.key}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-sm text-foreground">{doc.label}</span>
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
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
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

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => {
                    setAspirante(null)
                    setMatricula("")
                    setError(null)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Consultar Otra Matrícula
                </Button>
                <Button
                  asChild
                  className="flex-1 gap-2"
                >
                  <a href="/#contacto">
                    <MessageCircle className="w-4 h-4" />
                    ¿Alguna duda? Contacta a nuestro asesor
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
