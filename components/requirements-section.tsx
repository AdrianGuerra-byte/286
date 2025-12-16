import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, AlertCircle, Users, Baby } from "lucide-react";

export function RequirementsSection() {
  return (
    <section
      id="requisitos"
      className="py-20 lg:py-28 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16 lg:space-y-20">
          {/* Header */}
          <div className="text-center space-y-5">
            <h2 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground text-balance tracking-tight leading-[1.1]">
              <span className="block text-primary">Requisitos</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full" />
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty max-w-3xl mx-auto pt-2">
              Conoce los documentos y condiciones necesarias.
            </p>
          </div>

          {/* Main Documentation Card */}
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors hover:shadow-xl duration-300 group">
            <CardContent className="p-8 lg:p-10 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileCheck className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-2xl lg:text-3xl text-foreground tracking-tight">
                  Documentación Necesaria
                </h3>
              </div>
              <ul className="space-y-4 pl-2">
                {[
                  "Acta de Nacimiento (Actualizada)",
                  "Clave Única de Registro de Población (CURP - Certificada: Verificada con el Registro Civil)",
                  "Identificación Oficial Vigente (INE)",
                  "Certificado de Nivel Medio Superior (Validado)",
                  "Currículum Vítae",
                  "Constancia de estudios con al menos 50% de créditos concluidos (Lic. en Derecho y Lic. en Contaduría)",
                ].map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-primary text-xl mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                      {doc}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Grid with Experience and Additional Info */}
          {/* <div className="grid md:grid-cols-2 gap-6 lg:gap-8">

            <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors hover:shadow-xl duration-300 group">
              <CardContent className="p-8 lg:p-10 space-y-5">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-serif font-bold text-2xl lg:text-3xl text-foreground tracking-tight">
                  Experiencia Laboral Comprobable
                </h3>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
                  Es indispensable demostrar{" "}
                  <strong className="text-foreground font-semibold">
                    experiencia laboral relevante de al menos 3 años
                  </strong>{" "}
                  en el área de la licenciatura que deseas acreditar. Esta
                  experiencia se valida a través de tu CV y el portafolio de
                  evidencias.
                </p>
              </CardContent>
            </Card>


            <Card className="border-2 border-muted/40 hover:border-muted/60 transition-colors hover:shadow-xl duration-300 group">
              <CardContent className="p-8 lg:p-10 space-y-5">
                <div className="w-14 h-14 bg-gradient-to-br from-muted/40 to-muted/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Baby className="w-7 h-7 text-foreground/70" />
                </div>
                <h3 className="font-serif font-bold text-2xl lg:text-3xl text-foreground tracking-tight">
                  Consideraciones Adicionales
                </h3>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
                  Si requieres alguna consideración especial por discapacidad o
                  condición médica, notifícalo al iniciar tu proceso.
                </p>
              </CardContent>
            </Card>
          </div> */}

          {/* Políticas del Proceso - Alert Card */}
          <Card className="border-2 border-primary/30 bg-primary/5 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 lg:p-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-xl lg:text-2xl text-foreground">
                    Políticas del Proceso
                  </h3>
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
                    El CUH se reserva el derecho de admisión. La documentación
                    apócrifa es causa de baja inmediata y definitiva del
                    proceso. Los pagos realizados no son reembolsables.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
