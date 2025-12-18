"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Target, Lightbulb } from "lucide-react";

export function AboutSection() {
  return (
    <section
      id="quienes-somos"
      className="py-20 lg:py-28 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16 lg:space-y-20">
          {/* Header */}
          <div className="text-center space-y-5">
            <h2 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground text-balance tracking-tight leading-[1.1]">
              <span className="block">¿Quiénes</span>
              <span className="block text-primary">Somos?</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full" />
          </div>

          {/* Main Content - 4 Symmetric Blocks */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Text Content Block */}
            <Card className="border-2 border-muted/40 hover:border-muted/60 transition-colors hover:shadow-xl duration-300 group">
              <CardContent className="p-8 lg:p-10 space-y-5 flex flex-col justify-center h-full">
                <div className="relative space-y-6">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />
                  <p className="text-base lg:text-lg text-foreground/90 leading-relaxed text-pretty font-normal">
                    En el{" "}
                    <strong className="text-primary font-semibold">
                      Centro Universitario Hidalguense
                    </strong>{" "}
                    estamos comprometidos, como una Institución de Educación
                    Superior (IES), a impulsar la formación integral de nuestros
                    estudiantes a través de un modelo educativo centrado en su
                    desarrollo humano y profesional.
                  </p>
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
                    Proporcionamos un entorno de alto nivel académico y
                    excelencia que les permita alcanzar su máximo potencial.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Image Block */}
            <Card className="border-2 border-muted/40 hover:border-muted/60 transition-colors hover:shadow-xl duration-300 overflow-hidden group relative min-h-[300px] md:min-h-[400px]">
              <CardContent className="p-0 h-full">
                <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]">
                  <img
                    src="/cuh_edificio.avif"
                    alt="Centro Universitario Hidalguense"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/students-taking-examination-in-professional-univer.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-primary/5 to-transparent" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mission & Vision Full-Width Band */}
      <div className="bg-primary mt-16 lg:mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto py-16 lg:py-20">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {/* Misión */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-foreground/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Target className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif font-bold text-3xl lg:text-4xl text-primary-foreground tracking-tight">
                    Misión
                  </h3>
                </div>
                <p className="text-base lg:text-lg text-primary-foreground/90 leading-relaxed text-pretty">
                  Formar personas libres y humanistas con pensamiento crítico
                  mediante una sólida preparación científica, técnica y
                  cultural, promoviendo en ellos aptitudes alineadas al respeto,
                  la solidaridad, honestidad y resiliencia lo que les permitirá
                  alta competitividad profesional para una mejor convivencia y
                  eficaz transformación de la sociedad.
                </p>
              </div>

              {/* Visión */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-foreground/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Lightbulb className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif font-bold text-3xl lg:text-4xl text-primary-foreground tracking-tight">
                    Visión
                  </h3>
                </div>
                <p className="text-base lg:text-lg text-primary-foreground/90 leading-relaxed text-pretty">
                  Ser el centro de evaluación líder en el estado de Hidalgo,
                  reconocido por su excelencia, innovación y compromiso con la
                  validación de competencias profesionales bajo los más altos
                  estándares de calidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
