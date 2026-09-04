import { z } from 'zod';

export const apiErrorSchema = z
  .object({
    statusCode: z.number().int().min(400).max(599),
    message: z.union([z.string(), z.array(z.string())]),
    error: z.string().optional(),
  })
  .strict();

export type ApiError = z.infer<typeof apiErrorSchema>;

export const GENERIC_API_ERROR_MESSAGE =
  'Ocurrió un error inesperado. Inténtalo nuevamente.';

/**
 * Mensajes neutros por status HTTP para cuando el backend no envía
 * un mensaje utilizable. Español neutro, sin copy atado a una pantalla.
 */
export const API_ERROR_DEFAULT_MESSAGES: Record<number, string> = {
  400: 'La solicitud no es válida. Revisa los datos e inténtalo nuevamente.',
  401: 'Tu sesión expiró. Inicia sesión nuevamente.',
  403: 'No tienes permiso para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  409: 'Esta acción entró en conflicto con el estado actual.',
  422: 'Los datos enviados no se pudieron procesar.',
  429: 'Demasiadas solicitudes. Inténtalo nuevamente más tarde.',
  500: 'Ocurrió un error en el servidor. Inténtalo nuevamente.',
  502: 'Ocurrió un error en el servidor. Inténtalo nuevamente.',
  503: 'El servicio no está disponible. Inténtalo nuevamente más tarde.',
};

export function getDefaultApiErrorMessage(
  statusCode?: number,
  fallback: string = GENERIC_API_ERROR_MESSAGE,
): string {
  if (statusCode !== undefined) {
    const exact = API_ERROR_DEFAULT_MESSAGES[statusCode];
    if (exact) return exact;
    if (statusCode >= 500 && statusCode <= 599) {
      return API_ERROR_DEFAULT_MESSAGES[500];
    }
  }
  return fallback;
}
