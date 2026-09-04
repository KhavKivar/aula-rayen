import { describe, expect, it } from 'vitest';

import {
  API_ERROR_DEFAULT_MESSAGES,
  GENERIC_API_ERROR_MESSAGE,
  getDefaultApiErrorMessage,
} from './api-error.js';

describe('getDefaultApiErrorMessage', () => {
  it('returns the mapped message for known statuses', () => {
    expect(getDefaultApiErrorMessage(409)).toBe(
      API_ERROR_DEFAULT_MESSAGES[409],
    );
    expect(getDefaultApiErrorMessage(404)).toBe(
      'El recurso solicitado no existe.',
    );
    expect(getDefaultApiErrorMessage(429)).toBe(
      'Demasiadas solicitudes. Inténtalo nuevamente más tarde.',
    );
  });

  it('falls back to the 500 message for unmapped 5xx statuses', () => {
    expect(getDefaultApiErrorMessage(501)).toBe(
      API_ERROR_DEFAULT_MESSAGES[500],
    );
  });

  it('returns the fallback for unknown statuses', () => {
    expect(getDefaultApiErrorMessage(418)).toBe(GENERIC_API_ERROR_MESSAGE);
    expect(getDefaultApiErrorMessage()).toBe(GENERIC_API_ERROR_MESSAGE);
  });

  it('honors a custom fallback', () => {
    expect(getDefaultApiErrorMessage(418, 'No se pudo eliminar el curso')).toBe(
      'No se pudo eliminar el curso',
    );
  });
});
