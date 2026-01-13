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
import { ArrowLeft, ArrowRight, Check, Upload, CreditCard, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react"
import { api, generarUrlGoogleForms, type Examen } from "@/lib/api"

export default function InscripcionPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    telefono: "",
    curp: "",
    examen: "",
    aceptaTerminos: false,
  })
  const [folio, setFolio] = useState("")
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
      setStep(2)
    } else if (step === 2 && formData.aceptaTerminos) {
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
          curp: formData.curp || undefined,
        }

        // Llamar a la API
        const response = await api.registrarAspirante(datosAspirante)

        if (response.success && response.data) {
          // Guardar el folio generado por la API
          const matricula = response.data.aspirante.pseudo_matricula
          setFolio(matricula)

          // Generar URL de Google Forms con datos pre-llenados
          const urlForms = generarUrlGoogleForms({
            nombre: formData.nombre,
            apellido_paterno: formData.apellido_paterno,
            apellido_materno: formData.apellido_materno,
            correo_electronico: formData.email,
            numero_telefonico: formData.telefono,
            matricula: matricula,
            curp: formData.curp,
          })
          setGoogleFormsUrl(urlForms)

          // Avanzar al paso de confirmación
          setStep(3)
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

  const progress = (step / 3) * 100

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
                <p className="text-lg text-muted-foreground">Paso {step} de 3</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

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
                    <div className="space-y-2">
                      <Label htmlFor="curp">CURP *</Label>
                      <Input
                        id="curp"
                        placeholder="GAGL850101HDFRRN09"
                        value={formData.curp}
                        onChange={(e) => setFormData({ ...formData, curp: e.target.value })}
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

            {/* Step 2: Documentos */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    Carga de Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Sube los documentos requeridos en formato PDF o imagen (JPG, PNG). Tamaño máximo: 5 MB por archivo.
                  </p>

                  <div className="space-y-4">
                    {["Identificación Oficial", "CURP", "Certificado de Estudios", "Comprobante de Domicilio"].map(
                      (doc) => (
                        <div
                          key={doc}
                          className="border-2 border-dashed border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <Upload className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium text-foreground">{doc}</div>
                                {formData.documentos.includes(doc) && (
                                  <div className="text-sm text-primary flex items-center gap-1 mt-1">
                                    <Check className="w-4 h-4" />
                                    Cargado correctamente
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant={formData.documentos.includes(doc) ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleFileUpload(doc)}
                            >
                              {formData.documentos.includes(doc) ? "Cambiar" : "Subir"}
                            </Button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Atrás
                    </Button>
                    <Button onClick={handleNext} disabled={formData.documentos.length === 0} className="flex-1 gap-2">
                      Continuar
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Pago */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    Información de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <h3 className="font-semibold text-lg text-foreground">Datos Bancarios</h3>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Banco:</span>
                        <span className="font-medium text-foreground">BBVA México</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cuenta:</span>
                        <span className="font-medium text-foreground">0123 4567 8901 2345</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CLABE:</span>
                        <span className="font-medium text-foreground">012 345 678 901 234 567</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Beneficiario:</span>
                        <span className="font-medium text-foreground">Centro Universitario Hidalguense A.C.</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-border">
                        <span className="text-muted-foreground">Monto a pagar:</span>
                        <span className="font-bold text-lg text-primary">
                          {examenes.find((e) => e.id.toString() === formData.examen)?.costo || "Por definir"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terminos"
                        checked={formData.aceptaTerminos}
                        onCheckedChange={(checked) => setFormData({ ...formData, aceptaTerminos: checked as boolean })}
                      />
                      <label
                        htmlFor="terminos"
                        className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                      >
                        Acepto los términos y condiciones, políticas de privacidad y confirmo que la información
                        proporcionada es correcta. Entiendo que el pago no es reembolsable.
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} disabled={loading} className="flex-1">
                      Atrás
                    </Button>
                    <Button onClick={handleNext} disabled={!formData.aceptaTerminos || loading} className="flex-1 gap-2">
                      {loading ? 'Procesando...' : 'Confirmar Registro'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirmación */}
            {step === 3 && (
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
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Tu folio de registro es:</div>
                      <div className="text-3xl font-bold font-mono text-primary">{folio}</div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Hemos enviado tu ficha de examen a <strong className="text-foreground">{formData.email}</strong>.
                      Por favor, revisa tu bandeja de entrada y spam.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h3 className="font-semibold text-foreground">Indicaciones Importantes:</h3>
                    <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Imprime tu ficha y preséntala el día del examen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Llega 30 minutos antes del inicio</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Lleva identificación oficial vigente</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>No se permite el uso de dispositivos electrónicos</span>
                      </li>
                    </ul>
                  </div>

                  {googleFormsUrl && (
                    <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                          <Upload className="w-5 h-5 text-primary" />
                          Siguiente Paso: Subir Documentos
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Ahora debes subir tus documentos requeridos a través de nuestro formulario de Google.
                          Hemos pre-llenado tus datos para facilitar el proceso.
                        </p>
                        <Button
                          asChild
                          className="w-full gap-2"
                          size="lg"
                        >
                          <a href={googleFormsUrl} target="_blank" rel="noopener noreferrer">
                            Ir a Subir Documentos
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
