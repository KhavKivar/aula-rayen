import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";
export const Route = createFileRoute("/_auth")({ component: AuthLayout });
function AuthLayout() {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-2">
      <aside className="relative flex flex-col bg-secondary px-6 py-7 sm:px-12 lg:m-4 lg:rounded-[2rem] lg:px-14 lg:py-10">
        <Link to="/" aria-label="Psicóloga Rayen, inicio" className="w-fit">
          <Brand />
        </Link>
        <div className="mx-auto hidden w-full max-w-md flex-1 flex-col justify-center py-10 lg:flex">
          <p className="section-kicker">Bienvenida a tu espacio</p>
          <h2 className="mt-5 font-heading text-5xl leading-[1.12] tracking-tight">
            El aprendizaje también nos hace{" "}
            <em className="text-terracotta">florecer.</em>
          </h2>
          <img
            src="/images/florecer.png"
            alt="Flor escultórica de pétalos verdes y terracota"
            width={1000}
            height={1100}
            className="mt-8 max-h-80 w-full rounded-[10rem_10rem_2rem_2rem] object-cover object-center"
          />
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
            Herramientas, ideas y nuevos caminos para acompañar desde el
            cuidado.
          </p>
        </div>
        <p className="hidden text-xs text-muted-foreground lg:block">
          Aula Rayen · Un paso a la vez
        </p>
      </aside>
      <div className="flex min-w-0 flex-col px-6 py-7 sm:px-12 lg:px-16 lg:py-12">
        <Link to="/" className="text-link w-fit text-xs">
          <ArrowLeft size={15} /> Volver al inicio
        </Link>
        <div className="flex flex-1 items-center justify-center py-10 sm:py-14">
          <Outlet />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Un espacio de formación creado por Psicóloga Rayen.
        </p>
      </div>
    </main>
  );
}
