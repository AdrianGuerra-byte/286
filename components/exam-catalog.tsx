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
  const examenesRegulados = examenesData.filter ((exam:any) => exam.regulado === true);
  const examenesNoRegulados = examenesData.filter ((exam:any) => exam.regulado === false);

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
              {examenesNoRegulados.length > 0 && (
                <div className="space-y-6">
                  <span className="flex items-center">
                      <span className="h-px flex-1 bg-gray-300"></span>

                      <span className="shrink-0 px-12 text-xl text-muted-foreground">
                        Examenes no regulados
                      </span>

                      <span className="h-px flex-1 bg-gray-300"></span>
                    </span>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {examenesNoRegulados.map((exam) => (
                      <ExamCard
                        key={exam.id}
                        exam={exam}
                        onViewDetails={() => handleViewDetails(exam.id, exam.nombre)}
                      />
                    ))}
                  </div>
                </div>)}

                {examenesRegulados.length > 0 && (
                <div className="space-y-6">
                  
                    <span className="flex items-center">
                      <span className="h-px flex-1 bg-gray-300"></span>

                      <span className="shrink-0 px-12 text-xl text-muted-foreground">
                        Examenes regulados
                      </span>

                      <span className="h-px flex-1 bg-gray-300"></span>
                    </span>
                  

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {examenesRegulados.map((exam) => (
                      <ExamCard
                        key={exam.id}
                        exam={exam}
                        onViewDetails={() => handleViewDetails(exam.id, exam.nombre)}
                      />
                    ))}
                  </div>
                </div>)}
             </div>
              
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
