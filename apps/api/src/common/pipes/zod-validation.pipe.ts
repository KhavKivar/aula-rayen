import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';

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

      throw new BadRequestException(messages);
    }

    return result.data;
  }
}
