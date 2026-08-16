import type { DemoCourse } from "@/features/course-dashboard/types/demo-course";

export const demoCourses = [
  {
    id: "arteterapia-infancias",
    title: "Arteterapia para niños y niñas",
    description:
      "Diseña experiencias de expresión emocional a través del arte con una ruta clara y materiales listos para adaptar.",
    category: "Arteterapia",
    duration: "6 módulos",
    priceClp: 49990,
    accent: "terracotta",
  },
  {
    id: "regulacion-emocional",
    title: "Herramientas de regulación emocional",
    description:
      "Integra recursos corporales, creativos y psicoeducativos en sesiones individuales o grupales.",
    category: "Práctica clínica",
    duration: "4 módulos",
    priceClp: 39990,
    accent: "forest",
  },
  {
    id: "talleres-con-proposito",
    title: "Talleres con propósito",
    description:
      "Convierte una idea en un taller coherente: objetivos, secuencia, actividades y cierre con sentido terapéutico.",
    category: "Facilitación",
    duration: "5 módulos",
    priceClp: 44990,
    accent: "ochre",
  },
] as const satisfies readonly DemoCourse[];
