import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { z } from "zod";

import { Brand } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const paymentResultSearchSchema = z.object({
  status: z.enum(["success", "rejected", "timeout"]).catch("rejected"),
});

const paymentMessages = {
  success: {
    title: "Pago realizado con éxito",
    description:
      "Gracias por tu compra. Ya puedes acceder a tu curso desde tu panel.",
    icon: CheckCircle2,
    iconClassName: "text-primary",
    actionLabel: "Ir a mi panel",
    to: "/dashboard",
  },
  rejected: {
    title: "No se pudo completar el pago",
    description:
      "El pago fue rechazado o cancelado. Puedes intentarlo nuevamente cuando quieras.",
    icon: XCircle,
    iconClassName: "text-terracotta",
    actionLabel: "Volver a mis cursos",
    to: "/dashboard",
  },
  timeout: {
    title: "El tiempo para pagar expiró",
    description:
      "No se completó el pago. Puedes iniciar una nueva compra desde tu panel.",
    icon: Clock3,
    iconClassName: "text-terracotta",
    actionLabel: "Volver a mis cursos",
    to: "/dashboard",
  },
} as const;

export const Route = createFileRoute("/payment-result")({
  validateSearch: paymentResultSearchSchema,
  component: PaymentResultPage,
});

function PaymentResultPage() {
  const { status } = Route.useSearch();
  const message = paymentMessages[status];
  const Icon = message.icon;

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-10 bg-background px-6 py-12">
      <Link to="/" aria-label="Psicóloga Rayen, inicio">
        <Brand classroom />
      </Link>
      <Card className="w-full max-w-lg gap-8 rounded-[2rem] px-3 py-10 text-center shadow-soft ring-border">
        <CardHeader className="items-center gap-3 px-6">
          <Icon
            aria-hidden="true"
            className={message.iconClassName}
            size={52}
          />
          <CardTitle
            role="heading"
            aria-level={1}
            className="mt-4 font-heading text-4xl font-normal tracking-tight"
          >
            {message.title}
          </CardTitle>
          <CardDescription className="text-[15px] leading-relaxed">
            {message.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <Link
            className={buttonVariants({ className: "w-full" })}
            to={message.to}
          >
            {message.actionLabel}
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
