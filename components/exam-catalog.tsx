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

            {/* Exam Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examenesData.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onViewDetails={() => handleViewDetails(exam.id, exam.nombre)}
                />
              ))}
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
