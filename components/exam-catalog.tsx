"use client";

import { useState } from "react";
import { ExamCard } from "./exam-card";
import { ExamModal } from "./exam-modal";
import examenesData from "@/data/examenes.json";
import examenesDetalleData from "@/data/examenes-detalle.json";

export function ExamCatalog() {
  const [selectedExam, setSelectedExam] = useState<{
    id: string;
    nombre: string;
  } | null>(null);

  const handleViewDetails = (examId: string, examNombre: string) => {
    setSelectedExam({ id: examId, nombre: examNombre });
  };

  const handleCloseModal = () => {
    setSelectedExam(null);
  };

  const examDetail = selectedExam
    ? examenesDetalleData.find((detail) => detail.id === selectedExam.id)
    : null;

  /**
   * SEPARACIÓN DE EXÁMENES POR TIPO DE REGULACIÓN
   *
   * Los exámenes se dividen en dos categorías según el campo "regulado" del JSON:
   *
   * 1. REGULADOS (regulado: true):
   *    - Licenciaturas con reconocimiento oficial completo
   *    - Ejemplos: Pedagogía, Administración, Sistemas
   *    - No requieren créditos previos, solo experiencia laboral
   *
   * 2. NO REGULADOS (regulado: false):
   *    - Licenciaturas que requieren al menos 50% de créditos cursados
   *    - Ejemplos: Contaduría, Derecho
   *    - Además de experiencia, necesitan haber cursado la mitad de la carrera
   *
   * El método .filter() recorre el array de exámenes del JSON y crea dos arrays separados
   * basándose en el valor del campo "regulado"
   */
  const examenesRegulados = examenesData.filter((exam: any) => exam.regulado === true);
  const examenesNoRegulados = examenesData.filter((exam: any) => exam.regulado === false);

  return (
    <>
      <section id="oferta" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
                Licenciaturas.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Elige la licenciatura que deseas acreditar.
              </p>
            </div>

            {/*
              SECCIÓN 1: LICENCIATURAS REGULADAS

              Renderizado condicional: Solo se muestra si existen exámenes regulados (length > 0)
              El operador && evalúa la condición y solo ejecuta el JSX si es verdadera

              Características visuales:
              - Borde izquierdo azul (border-primary) para identificación visual
              - Grid responsive: 1 columna (móvil), 2 (tablet), 3 (desktop)
              - Cada tarjeta se renderiza con <ExamCard> usando .map()
            */}
            {examenesRegulados.length > 0 && (
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-serif font-bold text-2xl text-foreground">
                    Licenciaturas Reguladas
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Programas con reconocimiento oficial y validez completa
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {examenesRegulados.map((exam) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      onViewDetails={() => handleViewDetails(exam.id, exam.nombre)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/*
              SECCIÓN 2: LICENCIATURAS NO REGULADAS

              Funcionamiento idéntico a la sección de reguladas, pero con:
              - Borde izquierdo amarillo (border-amber-500) para diferenciar visualmente
              - Renderiza solo los exámenes con regulado: false
              - Mensaje diferente indicando requisito del 50% de créditos
            */}
            {examenesNoRegulados.length > 0 && (
              <div className="space-y-6">
                <div className="border-l-4 border-amber-500 pl-4">
                  <h3 className="font-serif font-bold text-2xl text-foreground">
                    Licenciaturas No Reguladas
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Programas que requieren al menos 50% de créditos cursados
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {examenesNoRegulados.map((exam) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      onViewDetails={() => handleViewDetails(exam.id, exam.nombre)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <ExamModal
        isOpen={!!selectedExam}
        onClose={handleCloseModal}
        examName={selectedExam?.nombre || ""}
        examDetail={examDetail || null}
      />
    </>
  );
}
