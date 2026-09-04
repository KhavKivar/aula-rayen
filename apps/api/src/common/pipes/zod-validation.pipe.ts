import { Injectable, PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';
import { API_ERROR_CODES } from '@aula-rayen/contracts/api-error';

import { badRequestError } from '@/common/errors/http-error';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const messages = result.error.issues.map((issue) => {
        const field = issue.path.join('.');

        return field ? `Campo ${field} inválido` : issue.message;
      });

      throw badRequestError(API_ERROR_CODES.VALIDATION_ERROR, messages);
    }

    return result.data;
  }
}
