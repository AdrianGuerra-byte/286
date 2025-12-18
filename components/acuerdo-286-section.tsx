import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, BookOpen, Award } from "lucide-react";

export function Acuerdo286Section() {
  return (
    <section
      id="acuerdo-286"
      className="py-20 lg:py-28 bg-gradient-to-b from-muted/20 to-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16 lg:space-y-20">
          {/* Header */}
          <div className="text-center space-y-5">
            <h2 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground text-balance tracking-tight leading-[1.1]">
              <span className="block">¿Qué es el</span>
              <span className="block text-primary">Acuerdo 286?</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full" />
          </div>

          {/* Definition Card */}
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors hover:shadow-xl duration-300 group">
            <CardContent className="p-8 lg:p-10 space-y-6">
              <div className="relative">
                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />
                <div className="space-y-6">
                  <p className="text-base lg:text-lg text-foreground/90 leading-relaxed text-pretty font-normal">
                    <strong className="text-primary font-semibold text-lg lg:text-xl">
                      Acuerdo 286:
                    </strong>{" "}
                    El marco normativo que permite el reconocimiento oficial de
                    conocimientos y estudios adquiridos fuera del sistema
                    escolar formal.
                  </p>
                  <div className="space-y-4">
                    <p className="text-base lg:text-lg text-foreground/80 font-medium">
                      Establece los procedimientos para:
                    </p>
                    <ul className="space-y-3 pl-2">
                      <li className="flex items-start gap-3">
                        <span className="text-secondary text-xl mt-0.5">•</span>
                        <span className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                          Revalidar o homologar estudios.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-secondary text-xl mt-0.5">•</span>
                        <span className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                          Acreditar aprendizajes obtenidos mediante experiencia
                          laboral, formación autodidacta o capacitación para el
                          trabajo.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-base lg:text-lg text-foreground/90 leading-relaxed text-pretty font-normal">
                    <strong className="text-primary font-semibold text-lg lg:text-xl">
                      Su objetivo:
                    </strong>{" "}
                    Validar los saberes para facilitar la continuidad educativa
                    y la certificación formal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Titulación por Experiencia Laboral */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Award className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-serif font-bold text-xl text-foreground">
                  Titulación por Experiencia Laboral
                </h3>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  Valida tu experiencia profesional y conocimientos para obtener tu título de licenciatura. Reconoce el
                  aprendizaje autodidacta y la práctica laboral.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Validación de experiencia laboral</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Título profesional con validez oficial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Múltiples áreas de conocimiento disponibles</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Who Can Apply */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serif font-bold text-xl text-foreground">
                      ¿Quiénes pueden presentarlo?
                    </h3>
                    <div className="space-y-2 text-muted-foreground leading-relaxed">
                      <p className="text-pretty">
                        Personas que adquirieron conocimientos de forma autodidacta o por experiencia laboral en el área y buscan acreditar algún perfil autorizado de educación superior.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
