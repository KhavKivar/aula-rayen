import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { createWebPay } from "@/features/course-dashboard/api/create-webpay";
import { toApiErrorMessage } from "@/lib/api-error";

const CHECKOUT_ERROR = "No fue posible iniciar el pago. Inténtalo nuevamente.";

/**
 * Checkout de Webpay mediante formulario oculto. Encapsula la mutación,
 * el envío del formulario con el token y el error visible en UI.
 */
export function useWebpayCheckout() {
  const checkoutFormRef = useRef<HTMLFormElement>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createWebPay,

    onSuccess: (data) => {
      const form = checkoutFormRef.current;
      if (!form) {
        setCheckoutError(CHECKOUT_ERROR);
        return;
      }
      form.action = data.url;

      const input = form.elements.namedItem("token_ws") as HTMLInputElement;

      if (!(input instanceof HTMLInputElement)) {
        setCheckoutError(CHECKOUT_ERROR);
        return;
      }
      input.value = data.token;
      setCheckoutError(null);
      form.submit();
    },

    onError: (error) => {
      setCheckoutError(toApiErrorMessage(error, CHECKOUT_ERROR));
    },
  });

  const startCheckout = (courseId: number) => {
    setCheckoutError(null);
    mutation.mutate({ course_id: courseId });
  };

  return {
    checkoutFormRef,
    checkoutError,
    startCheckout,
    isCheckoutPending: mutation.isPending,
  };
}
