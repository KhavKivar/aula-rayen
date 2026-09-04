import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

type CodedBody = {
  statusCode: number;
  message: string | string[];
  code: string;
  error: string;
};

function coded(
  ExceptionClass: new (response: CodedBody) => HttpException,
  statusCode: number,
  error: string,
  code: string,
  message: string | string[],
): HttpException {
  return new ExceptionClass({ statusCode, message, code, error });
}

export function notFoundError(code: string, message: string) {
  return coded(NotFoundException, 404, 'Not Found', code, message);
}

export function forbiddenError(code: string, message: string) {
  return coded(ForbiddenException, 403, 'Forbidden', code, message);
}

export function conflictError(code: string, message: string) {
  return coded(ConflictException, 409, 'Conflict', code, message);
}

export function badRequestError(code: string, message: string | string[]) {
  return coded(BadRequestException, 400, 'Bad Request', code, message);
}
