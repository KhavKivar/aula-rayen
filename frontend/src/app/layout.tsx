import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { env } from "@/config/env";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Aula Rayen | Talleres para profesionales de la psicología",
    template: "%s | Aula Rayen",
  },
  description:
    "Cursos para psicólogos y psicólogas con formación, dinámicas paso a paso y materiales editables para facilitar talleres.",
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Aula Rayen",
    title: "Aula Rayen | Talleres listos para llevar a la práctica",
    description:
      "Formación, dinámicas y materiales editables para profesionales de la psicología.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aula Rayen | Talleres para profesionales de la psicología",
    description:
      "Formación, dinámicas y materiales editables para facilitar talleres.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
