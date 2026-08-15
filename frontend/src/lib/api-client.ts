import axios, { type AxiosError } from "axios";

export class SessionExpiredError extends Error {
  constructor() {
    super("Sesión expirada");
    this.name = "SessionExpiredError";
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      return Promise.reject(new SessionExpiredError());
    }

    return Promise.reject(error);
  },
);
