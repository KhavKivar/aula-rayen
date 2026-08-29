import deploymentContent from "@/config/site-content.json";

type DeploymentContent = {
  version: number;
  isDemo: boolean;
  brand: { name: string };
  professional: {
    name: string;
    shortName: string;
    title: string;
    biography: string[];
    credentials: string[];
  };
  social: {
    instagramUrl: string | null;
    instagramHandle: string | null;
  };
  assets: {
    profileImageUrl: string;
    profileImageAlt: string;
  };
};

const deployment: DeploymentContent = deploymentContent;

export const siteContent = {
  ...deployment,
  brandName: deployment.brand.name,
  eyebrow: "Formación para profesionales de la psicología",
  title: "Talleres con propósito, listos para llevar a la práctica.",
  description:
    "Aprende a facilitar experiencias terapéuticas y psicoeducativas con una metodología clara, dinámicas paso a paso y materiales que puedes adaptar a tu identidad profesional.",
} as const;

export type AvailableCourse = {
  id: string;
  status: "available";
  title: string;
  category: string;
  audience: string;
  summary: string;
  includes: readonly string[];
  priceLabel: string;
  href: string;
};

export type ComingSoonCourse = Omit<AvailableCourse, "status" | "href"> & {
  status: "coming-soon";
  href?: never;
};

export type Course = AvailableCourse | ComingSoonCourse;

export const courses = [
  {
    id: "arteterapia-infancias",
    status: "coming-soon",
    title: "Arteterapia para niños y niñas",
    category: "Curso + kit de taller",
    audience: "Psicólogos/as que trabajan con infancias",
    summary:
      "Un recorrido práctico para diseñar y facilitar un taller de expresión emocional a través del arte, respetando el ritmo y la etapa de desarrollo de cada participante.",
    includes: [
      "Formación para quien facilita",
      "Guion y dinámica paso a paso",
      "Presentación editable con tu identidad",
      "Fichas y recursos imprimibles",
    ],
    priceLabel: "Precio por anunciar",
  },
] as const satisfies readonly Course[];

export function assertCourseCatalog(catalog: readonly Course[]) {
  for (const course of catalog) {
    if (course.status === "available" && !course.href) {
      throw new Error(`El curso disponible ${course.id} necesita un destino.`);
    }

    if (course.status === "coming-soon" && "href" in course) {
      throw new Error(
        `El curso próximo ${course.id} no debe tener un destino.`,
      );
    }
  }
}

assertCourseCatalog(courses);

export const benefits = [
  {
    number: "01",
    title: "Menos horas frente a una hoja en blanco",
    description:
      "Parte desde una estructura profesional y concentra tu energía en acompañar al grupo.",
  },
  {
    number: "02",
    title: "Una ruta clara para facilitar",
    description:
      "Comprende el propósito de cada momento, sus tiempos y cómo sostener la experiencia.",
  },
  {
    number: "03",
    title: "Materiales que se sienten tuyos",
    description:
      "Adapta los recursos a tu identidad visual y al contexto de las personas con quienes trabajas.",
  },
] as const;

export const methodSteps = [
  {
    label: "Aprende",
    title: "Comprende el fundamento",
    description:
      "Revisa el enfoque psicológico y los criterios que orientan cada decisión del taller.",
  },
  {
    label: "Prepara",
    title: "Haz tuya la propuesta",
    description:
      "Ajusta el guion, la presentación y los recursos a tu estilo profesional y a tu grupo.",
  },
  {
    label: "Facilita",
    title: "Llévalo a la práctica",
    description:
      "Apóyate en una secuencia clara para abrir, acompañar y cerrar la experiencia con cuidado.",
  },
] as const;

export const faqs = [
  {
    question: "¿A quiénes están dirigidos los cursos?",
    answer:
      "En esta primera etapa están pensados especialmente para psicólogos y psicólogas que facilitan, o quieren comenzar a facilitar, talleres con grupos.",
  },
  {
    question: "¿Puedo editar los materiales?",
    answer:
      "Sí. Podrás adaptar los archivos editables e incorporar tu identidad visual para utilizarlos en tu propia práctica profesional.",
  },
  {
    question: "¿Puedo usar el taller más de una vez?",
    answer:
      "Sí. La licencia contempla uso profesional repetido por parte de quien compra el curso.",
  },
  {
    question: "¿Puedo compartir o revender los archivos?",
    answer:
      "No. Puedes utilizarlos y adaptarlos en tu práctica, pero no revender, regalar ni redistribuir los archivos originales o editables.",
  },
] as const;
