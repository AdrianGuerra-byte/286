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
import { ArrowLeft, ArrowRight, Upload, CheckCircle2, AlertCircle, ExternalLink, FileCheck } from "lucide-react"
import { api, generarUrlGoogleForms, type Examen } from "@/lib/api"

export default function InscripcionPage() {
  const [step, setStep] = useState(1)

  // 1. ESTADO: Incluimos los booleanos de consentimiento
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    telefono: "",
    examen: "",
    curp: "",
    aceptaTerminos: false,   // Obligatorio
    aceptaPrivacidad: false, // Obligatorio
    aceptaPublicidad: false, // Opcional
  })

  const [folio, setFolio] = useState("")
  const [numeroReferencia, setNumeroReferencia] = useState("")
  const [examenes, setExamenes] = useState<Examen[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [googleFormsUrl, setGoogleFormsUrl] = useState("")
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0)

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
    if (step === 1) {
      // Validaciones básicas de campos vacíos
      if (!formData.nombre || !formData.apellido_paterno || !formData.email || !formData.examen) {
         setError('Por favor completa todos los campos obligatorios (*)')
         return
      }

      // 2. VALIDACIÓN DE CHECKBOXES OBLIGATORIOS
      if (!formData.aceptaTerminos) {
        setError('Debes aceptar los Términos y Condiciones para continuar')
        return
      }
      if (!formData.aceptaPrivacidad) {
        setError('Debes aceptar el Aviso de Privacidad para continuar')
        return
      }

      // Validaciones de seguridad (Debounce y Regex)
      const now = Date.now()
      if (now - lastSubmitTime < 3000) {
        setError('Por favor espera unos segundos antes de enviar nuevamente')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('Por favor ingresa un correo electrónico válido')
        return
      }

      const nombreRegex = /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s-]+$/
      if (!nombreRegex.test(formData.nombre) || !nombreRegex.test(formData.apellido_paterno)) {
        setError('Los nombres solo pueden contener letras, espacios y guiones')
        return
      }

      // Validación Teléfono
      const telefonoLimpio = formData.telefono.replace(/[^0-9]/g, '')
      if (telefonoLimpio.length < 10 || telefonoLimpio.length > 15) {
        setError('El teléfono debe tener entre 10 y 15 dígitos')
        return
      }

      // Validación CURP
      const curpClean = formData.curp.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
      if (formData.curp && formData.curp.trim().length > 0) {
         if (curpClean.length !== 18) {
           setError('La CURP debe contener 18 caracteres alfanuméricos')
           return
         }
      }

      // Sanitización
      const sanitizeCurp = (input: string) => input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
      const sanitizeName = (input: string) => input.trim().replace(/[<>"'`]/g, '').replace(/[0-9]/g, '').replace(/\s+/g, ' ')
      const sanitizePhone = (input: string) => input.trim().replace(/[^0-9+\-\s()]/g, '')
      const sanitizeEmail = (input: string) => input.trim().toLowerCase().replace(/[<>"'`\s]/g, '')

      setLoading(true)
      setError(null)
      setLastSubmitTime(now)

      try {
        // 3. PREPARACIÓN DEL PAYLOAD CON CONSENTIMIENTOS
        const datosAspirante = {
          nombre: sanitizeName(formData.nombre),
          apellido_paterno: sanitizeName(formData.apellido_paterno),
          apellido_materno: formData.apellido_materno ? sanitizeName(formData.apellido_materno) : undefined,
          correo_electronico: sanitizeEmail(formData.email),
          numero_telefonico: sanitizePhone(formData.telefono),
          curp: sanitizeCurp(formData.curp),
          examen_id: parseInt(formData.examen),
          // Checkboxes mapeados al DTO
          acepto_terminos: formData.aceptaTerminos,     // true
          acepto_privacidad: formData.aceptaPrivacidad, // true
          acepto_publicidad: formData.aceptaPublicidad, // true/false

          // --- CORRECCIÓN CRÍTICA: ---
          // Eliminamos el envío explícito de 'metadata'.
          // Dejamos que el Backend use su valor por defecto (crearMetadataInicial)
          // para generar la estructura correcta { estatus: "No subido", comentario: "" }
        }

        const response = await api.registrarAspirante(datosAspirante)

        if (response.success && response.data) {
          const aspir = response.data.aspirante as any
          const matricula = aspir.folio || aspir.matricula || ''
          setFolio(matricula)

          if (aspir.numero_referencia) {
            setNumeroReferencia(aspir.numero_referencia)
          }

          try {
            localStorage.setItem('registro:folio', matricula)
            localStorage.setItem('registro:correo', datosAspirante.correo_electronico)
          } catch (e) {
            if (process.env.NODE_ENV === 'development') console.warn(e)
          }

          const urlForms = generarUrlGoogleForms({
            nombre: formData.nombre,
            apellido_paterno: formData.apellido_paterno,
            apellido_materno: formData.apellido_materno,
            correo_electronico: formData.email,
            numero_telefonico: formData.telefono,
            matricula: matricula,
          })
          setGoogleFormsUrl(urlForms)
          setStep(2)
        }
      } catch (err: any) {
        if (process.env.NODE_ENV === 'development') console.error('Error al registrar:', err)

        const mensajeGenerico = 'No pudimos procesar tu inscripción. Por favor, intenta nuevamente.'
        if (err.message?.includes('correo')) {
          setError('El correo electrónico ya está registrado')
        } else if (err.message?.includes('examen')) {
          setError('El examen seleccionado no está disponible')
        } else if (err.message?.includes('CURP')) {
          setError('La CURP ingresada ya se encuentra registrada')
        } else {
          setError(mensajeGenerico)
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

              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Tarjeta de Estatus (Visible siempre) */}
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
                  <Button asChild size="lg" className="gap-2 whitespace-nowrap">
                    <Link href="/estatus">
                      <FileCheck className="w-4 h-4" />
                      Validar mi Estatus
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Formulario de Registro */}
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
                  {/* Inputs Nombre y Apellidos */}
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

                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="space-y-2 sm:col-span-1">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="5512345678"
                        maxLength={10}
                        value={formData.telefono}
                        onChange={(e) => {
                          const soloNumeros = e.target.value.replace(/[^0-9]/g, '')
                          setFormData({ ...formData, telefono: soloNumeros })
                        }}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="curp">CURP</Label>
                      <Input
                        id="curp"
                        placeholder="AAAA000000HDFXXX00"
                        value={formData.curp}
                        maxLength={18}
                        onChange={(e) => setFormData({ ...formData, curp: e.target.value.toUpperCase().replace(/[^A-Z0-9]/gi, '') })}
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

                  {/* 4. SECCIÓN DE CHECKBOXES */}
                  <div className="space-y-4 pt-4 border-t">

                    {/* Aviso de Privacidad */}
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="privacidad"
                        checked={formData.aceptaPrivacidad}
                        onCheckedChange={(checked) => setFormData({...formData, aceptaPrivacidad: checked as boolean})}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="privacidad"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          He leído y acepto el <Link href="/privacidad" target="_blank" className="text-primary hover:underline font-semibold">Aviso de Privacidad</Link> *
                        </Label>
                      </div>
                    </div>

                    {/* Términos y Condiciones */}
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terminos"
                        checked={formData.aceptaTerminos}
                        onCheckedChange={(checked) => setFormData({...formData, aceptaTerminos: checked as boolean})}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="terminos"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Acepto los <Link href="/terminos" target="_blank" className="text-primary hover:underline font-semibold">Términos y Condiciones</Link> del servicio *
                        </Label>
                      </div>
                    </div>

                    {/* Publicidad */}
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="publicidad"
                        checked={formData.aceptaPublicidad}
                        onCheckedChange={(checked) => setFormData({...formData, aceptaPublicidad: checked as boolean})}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="publicidad"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Deseo recibir información sobre futuras convocatorias y noticias.
                        </Label>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive font-medium">{error}</p>
                    </div>
                  )}

                  <Button
                    onClick={handleNext}
                    disabled={
                      !formData.nombre ||
                      !formData.apellido_paterno ||
                      !formData.email ||
                      !formData.examen ||
                      !formData.aceptaTerminos ||
                      !formData.aceptaPrivacidad ||
                      loading
                    }
                    className="w-full gap-2"
                    size="lg"
                  >
                    {loading ? 'Procesando...' : 'Continuar'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Confirmación - COMPLETO */}
            {step === 2 && (
              <Card className="border-2 border-primary/20 animate-in fade-in zoom-in-95 duration-300">
                <CardContent className="p-8 sm:p-12 space-y-6 text-center">

                  {/* Icono de Éxito */}
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>

                  {/* Título */}
                  <div className="space-y-3">
                    <h2 className="font-serif font-bold text-3xl text-foreground">¡Registro Completado!</h2>
                    <p className="text-lg text-muted-foreground">Tu inscripción ha sido procesada exitosamente</p>
                  </div>

                  {/* Tarjeta de Datos Clave (Matrícula y Referencia) */}
                  <div className="bg-muted/50 rounded-xl p-6 space-y-4 max-w-md mx-auto border border-border">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground uppercase tracking-wide">Tu folio de aspirante es:</div>
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-primary tracking-tight">{folio}</div>
                      <p className="text-xs text-muted-foreground">Guarda este número para consultar tu estatus</p>
                    </div>

                    {numeroReferencia && (
                      <div className="space-y-2 pt-4 border-t border-border mt-4">
                        <div className="text-sm text-muted-foreground uppercase tracking-wide">Referencia Bancaria:</div>
                        <div className="text-xl sm:text-2xl font-bold font-mono text-primary break-all">{numeroReferencia}</div>
                      </div>
                    )}
                  </div>

                  {/* Lista de Próximos Pasos */}
                  <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-xl p-6 text-left">
                    <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                      Próximos Pasos (Importante)
                    </h3>
                    <ol className="text-sm text-muted-foreground space-y-4 list-decimal list-inside">
                      <li className="leading-relaxed pl-2">
                        <strong className="text-foreground">Sube tus documentos:</strong> Utiliza el formulario de Google que encontrarás abajo para enviar tu Acta, INE y Certificado.
                      </li>
                      <li className="leading-relaxed pl-2">
                        <strong className="text-foreground">Validación:</strong> Revisaremos tus documentos en 2-3 días hábiles.
                      </li>
                      <li className="leading-relaxed pl-2">
                        <strong className="text-foreground">Ficha de Pago:</strong> Si todo está correcto, recibirás tu ficha de pago por correo.
                      </li>
                      <li className="leading-relaxed pl-2">
                        <strong className="text-foreground">Pago:</strong> Realiza el pago en el banco y envía el comprobante a <a href="mailto:Tesoreria286@cuh.mx" className="text-primary font-medium hover:underline">Tesoreria286@cuh.mx</a>.
                      </li>
                    </ol>
                  </div>

                  {/* Botón de Google Forms */}
                  {googleFormsUrl && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <Upload className="w-6 h-6 text-primary" />
                          <h3 className="font-semibold text-xl text-primary">Sube tus Documentos</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Es indispensable subir tus documentos ahora para continuar con el trámite.
                        </p>
                        <Button
                          asChild
                          className="w-full sm:w-auto min-w-[250px] gap-2 bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
                          size="lg"
                        >
                          <a href={googleFormsUrl} target="_blank" rel="noopener noreferrer">
                            Ir al Formulario de Carga
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Botones de Navegación Final */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-center">
                    <Button asChild variant="outline" className="flex-1 max-w-xs">
                      <Link href="/">Volver al Inicio</Link>
                    </Button>

                    {folio && (
                      <Button asChild className="flex-1 max-w-xs">
                        <Link href={`/estatus?matricula=${folio}`}>Ver Estatus del Trámite</Link>
                      </Button>
                    )}
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