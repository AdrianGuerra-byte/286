"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  DollarSign,
  Users,
  Calendar,
  Calculator,
  Briefcase,
  Code,
  Scale,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

interface ExamCardProps {
  exam: {
    id: string;
    nombre: string;
    categoria: string;
    descripcion: string;
    modalidad: string;
    duracion: string;
    costo: string;
    cupo: number;
    fechaExamen: string;
  };
  onViewDetails: () => void;
}

// Mapeo de iconos por ID de examen
const examIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  contaduria: Calculator,
  administracion: Briefcase,
  sistemas: Code,
  derecho: Scale,
  pedagogia: GraduationCap,
  mercadotecnia: TrendingUp,
};

export function ExamCard({ exam, onViewDetails }: ExamCardProps) {
  const IconComponent = examIcons[exam.id] || GraduationCap;

  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border hover:border-primary/40 group overflow-hidden">
      {/* Header con icono prominente */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
            <IconComponent className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 pt-1">
            <CardTitle className="font-serif text-xl lg:text-2xl leading-tight text-balance text-foreground">
              {exam.nombre}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="font-medium text-xs">
                {exam.categoria}
              </Badge>
              <Badge
                className="font-semibold text-xs bg-foreground text-background border border-foreground/20 hover:bg-foreground/90 shadow-sm"
              >
                EXUNAL
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="flex-1 p-6 space-y-5">
        <p className="text-sm lg:text-base text-muted-foreground leading-relaxed text-pretty line-clamp-5">
          {exam.descripcion}
        </p>

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-muted/30">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary/70 flex-shrink-0" />
            <span className="text-muted-foreground font-medium">
              {exam.duracion}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary/70 flex-shrink-0" />
            <span className="text-muted-foreground font-medium text-xs">
              {exam.fechaExamen}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col gap-2">
        <Button
          onClick={onViewDetails}
          variant="outline"
          size="lg"
          className="w-full border-primary/30 hover:bg-primary/5"
        >
          Ver Detalles
        </Button>
        <Button asChild size="lg" className="w-full shadow-md">
          <Link href="/inscripcion">Inscribirme Ahora</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
