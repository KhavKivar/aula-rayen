import axios, { type AxiosError } from "axios";
import { env } from "@/config/env";
import { UserFacingError } from "@/lib/user-facing-error";

export class SessionExpiredError extends UserFacingError {
  constructor() {
    super("Sesión expirada");
    this.name = "SessionExpiredError";
  }
}

type UnauthorizedHandler = () => void | Promise<void>;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let handlingUnauthorized = false;

/**
 * Registra la reacción global ante un 401 (limpiar sesión y llevar al
 * login). La registra la app en el raíz porque lib no puede depender del
 * router ni de la caché de consultas.
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

export const apiClient = axios.create({
  baseURL: env.VITE_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (unauthorizedHandler && !handlingUnauthorized) {
        handlingUnauthorized = true;
        void Promise.resolve(unauthorizedHandler())
          .catch(() => {})
          .finally(() => {
            handlingUnauthorized = false;
          });
      }
      return Promise.reject(new SessionExpiredError());
    }

    return Promise.reject(error);
  },
);
