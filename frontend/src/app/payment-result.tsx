import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { z } from "zod";

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
    iconClassName: "text-emerald-600",
    actionLabel: "Ir a mi panel",
    to: "/dashboard",
  },
  rejected: {
    title: "No se pudo completar el pago",
    description:
      "El pago fue rechazado o cancelado. Puedes intentarlo nuevamente cuando quieras.",
    icon: XCircle,
    iconClassName: "text-[#c66f51]",
    actionLabel: "Volver a mis cursos",
    to: "/dashboard",
  },
  timeout: {
    title: "El tiempo para pagar expiró",
    description:
      "No se completó el pago. Puedes iniciar una nueva compra desde tu panel.",
    icon: Clock3,
    iconClassName: "text-[#b58234]",
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
    <main className="flex min-h-svh items-center justify-center bg-[#f7f4ec] px-4 py-10">
      <Card className="w-full max-w-md gap-8 rounded-[28px] px-1 py-7 text-center shadow-[0_2px_3px_rgba(0,0,0,0.12),0_12px_28px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
        <CardHeader className="items-center gap-3 px-6">
          <Icon aria-hidden="true" className={message.iconClassName} size={52} />
          <CardTitle className="text-xl font-semibold tracking-tight">
            {message.title}
          </CardTitle>
          <CardDescription className="text-[15px] leading-relaxed">
            {message.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <Link className={buttonVariants({ className: "w-full" })} to={message.to}>
            {message.actionLabel}
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
