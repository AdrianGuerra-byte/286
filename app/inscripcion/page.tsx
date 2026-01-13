"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Check, Upload, CreditCard, CheckCircle2, AlertCircle, ExternalLink, FileCheck } from "lucide-react"
import { api, generarUrlGoogleForms, type Examen } from "@/lib/api"

export default function InscripcionPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    telefono: "",
    examen: "",
    aceptaTerminos: false,
  })
  const [folio, setFolio] = useState("")
  const [numeroReferencia, setNumeroReferencia] = useState("")
  const [examenes, setExamenes] = useState<Examen[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [googleFormsUrl, setGoogleFormsUrl] = useState("")

  // Cargar exámenes al montar el componente
  useEffect(() => {
    const cargarExamenes = async () => {
      try {
        const response = await api.getExamenes()
        if (response.success && response.data) {
          setExamenes(response.data)
        }
      } catch (err) {
        console.error('Error al cargar exámenes:', err)
        setError('Error al cargar los exámenes disponibles')
      }
    }
    cargarExamenes()
  }, [])

  const handleNext = async () => {
    if (step === 1 && formData.nombre && formData.apellido_paterno && formData.email && formData.examen) {
      // Registrar aspirante en la base de datos
      setLoading(true)
      setError(null)

      try {
        // Preparar datos para enviar a la API
        const datosAspirante = {
          nombre: formData.nombre,
          apellido_paterno: formData.apellido_paterno,
          apellido_materno: formData.apellido_materno || undefined,
          correo_electronico: formData.email,
          numero_telefonico: formData.telefono,
          examen_id: parseInt(formData.examen),
          metadata: {
            documentos: {
              ActaNacimiento: "Pendiente" as const,
              INE: "Pendiente" as const,
              CertificadoEstudios: "Pendiente" as const,
              ComprobanteDomicilio: "Pendiente" as const,
            }
          }
        }

        // Llamar a la API
        const response = await api.registrarAspirante(datosAspirante)

        if (response.success && response.data) {
          // Guardar el folio generado por la API
          const matricula = response.data.aspirante.pseudo_matricula
          setFolio(matricula)

          // Guardar el número de referencia si viene en la respuesta
          if (response.data.aspirante.numero_referencia) {
            setNumeroReferencia(response.data.aspirante.numero_referencia)
          }

          // Generar URL de Google Forms con datos pre-llenados
          const urlForms = generarUrlGoogleForms({
            nombre: formData.nombre,
            apellido_paterno: formData.apellido_paterno,
            apellido_materno: formData.apellido_materno,
            correo_electronico: formData.email,
            numero_telefonico: formData.telefono,
            matricula: matricula,
          })
          setGoogleFormsUrl(urlForms)

          // Avanzar al paso de confirmación
          setStep(2)
        }
      } catch (err: any) {
        console.error('Error al registrar:', err)
        setError(err.message || 'Error al procesar el registro')

        // Mostrar error específico al usuario
        if (err.message.includes('correo')) {
          alert('El correo electrónico ya está registrado. Por favor, usa otro correo.')
        } else if (err.message.includes('examen')) {
          alert('El examen seleccionado no está disponible. Por favor, selecciona otro.')
        } else {
          alert('Error al procesar el registro: ' + err.message)
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const progress = (step / 2) * 100

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
                <h1 className="font-serif font-bold text-3xl sm:text-4xl text-foreground">Proceso de Inscripción</h1>
                <p className="text-lg text-muted-foreground">Paso {step} de 2</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Botón prominente para validar estatus */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-serif font-bold text-xl text-foreground mb-1">
                      ¿Ya realizaste tu inscripción?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Consulta el estatus de tus documentos, pago y fecha de examen
                    </p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 whitespace-nowrap"
                  >
                    <Link href="/estatus">
                      <FileCheck className="w-4 h-4" />
                      Validar mi Estatus
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Registro */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    Datos Personales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre(s) *</Label>
                    <Input
                      id="nombre"
                      placeholder="Juan"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="apellido_paterno">Apellido Paterno *</Label>
                      <Input
                        id="apellido_paterno"
                        placeholder="García"
                        value={formData.apellido_paterno}
                        onChange={(e) => setFormData({ ...formData, apellido_paterno: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido_materno">Apellido Materno</Label>
                      <Input
                        id="apellido_materno"
                        placeholder="López"
                        value={formData.apellido_materno}
                        onChange={(e) => setFormData({ ...formData, apellido_materno: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan.garcia@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        placeholder="55 1234 5678"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examen">Examen a Presentar *</Label>
                    <Select
                      value={formData.examen}
                      onValueChange={(value) => setFormData({ ...formData, examen: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un examen" />
                      </SelectTrigger>
                      <SelectContent>
                        {examenes.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id.toString()}>
                            {exam.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <Button
                    onClick={handleNext}
                    disabled={!formData.nombre || !formData.apellido_paterno || !formData.email || !formData.examen || loading}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {loading ? 'Procesando...' : 'Continuar'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Confirmación */}
            {step === 2 && (
              <Card className="border-2 border-primary/20">
                <CardContent className="p-12 space-y-6 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-serif font-bold text-3xl text-foreground">¡Registro Completado!</h2>
                    <p className="text-lg text-muted-foreground">Tu inscripción ha sido procesada exitosamente</p>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Tu matrícula es:</div>
                        <div className="text-2xl font-bold font-mono text-primary">{folio}</div>
                      </div>

                      {numeroReferencia && (
                        <div className="space-y-2 pt-3 border-t border-border">
                          <div className="text-sm text-muted-foreground">Número de referencia para pago:</div>
                          <div className="text-3xl font-bold font-mono text-primary">{numeroReferencia}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-900 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2 text-left">
                        <h3 className="font-semibold text-foreground">Importante</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Hemos registrado tus datos correctamente. El próximo paso es <strong className="text-foreground">subir tus documentos</strong> usando el formulario de Google que encontrarás más abajo.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-xl p-6">
                    <h3 className="font-semibold text-lg text-foreground mb-4 text-left">Próximos Pasos</h3>
                    <ol className="text-sm text-muted-foreground space-y-4 list-decimal list-inside text-left">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Sube tus documentos ahora:</strong> Utiliza el formulario de Google que
                        encontrarás más abajo para subir:
                        <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                          <li>Acta de Nacimiento</li>
                          <li>Identificación Oficial (INE/Pasaporte)</li>
                          <li>Certificado de Estudios</li>
                          <li>Comprobante de Domicilio</li>
                        </ul>
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Validación de documentos:</strong> Nuestro equipo revisará la autenticidad de tus documentos.
                        Este proceso puede tomar de 2 a 3 días hábiles.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Recibe tu ficha de pago:</strong> Una vez validados tus documentos,
                        te enviaremos por correo tu <strong>ficha de pago</strong> con los datos bancarios e instrucciones.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Realiza el pago:</strong> Usa tu número de referencia{" "}
                        <span className="font-mono font-bold text-primary">{numeroReferencia || folio}</span> al realizar el pago.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Envía tu comprobante:</strong> Envía tu comprobante de pago a{" "}
                        <a
                          href="mailto:Tesoreria286@cuh.mx"
                          className="text-primary hover:underline font-semibold break-all"
                        >
                          Tesoreria286@cuh.mx
                        </a>
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Recibe tu pase de entrada:</strong> Una vez confirmado tu pago,
                        te enviaremos tu <strong>pase de entrada para el examen</strong>.
                      </li>
                    </ol>
                  </div>

                  {googleFormsUrl && (
                    <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Upload className="w-6 h-6 text-primary" />
                          <h3 className="font-semibold text-xl text-foreground">
                            Paso 1: Sube tus Documentos Ahora
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed text-left">
                          Es importante que subas tus documentos <strong className="text-foreground">lo antes posible</strong> para que podamos
                          validarlos y enviarte tu ficha de pago. Hemos pre-llenado tu información para hacer el proceso más rápido.
                        </p>
                        <Button
                          asChild
                          className="w-full gap-2"
                          size="lg"
                        >
                          <a href={googleFormsUrl} target="_blank" rel="noopener noreferrer">
                            Subir Documentos Ahora
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-6">
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <Link href="/">Volver al Inicio</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="/#contacto">Contactar Soporte</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
