import 'dotenv/config';
import { envSchema } from './env.schema';

export const env = envSchema.parse(process.env);

// Orígenes permitidos para CORS y Better Auth. En producción solo el frontend
// real; en desarrollo se acepta el puerto local del frontend.
export const allowedOrigins =
  env.NODE_ENV === 'production'
    ? [env.FRONTEND_URL]
    : [env.FRONTEND_URL, 'http://localhost:3001'];
