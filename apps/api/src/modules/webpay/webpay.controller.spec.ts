/* eslint-disable @typescript-eslint/unbound-method -- Reflecting on decorator metadata requires the unbound method reference. */
import { SetMetadata } from '@nestjs/common';

import {
  mapCommitToRedirectStatus,
  WebPayController,
} from './webpay.controller';

jest.mock('@thallesp/nestjs-better-auth', () => ({
  Roles: (roles: string[]) => SetMetadata('ROLES', roles),
  Session: () => () => undefined,
}));

describe('WebPayController roles', () => {
  it('restricts the payments list to admins', () => {
    expect(
      Reflect.getMetadata('ROLES', WebPayController.prototype.findPayments),
    ).toEqual(['admin']);
  });
});

describe('mapCommitToRedirectStatus', () => {
  it('maps ok to success', () => {
    expect(
      mapCommitToRedirectStatus(
        { paymentStatus: 'ok' },
        { tokenNormal: 'token', tokenReject: undefined },
      ),
    ).toBe('success');
  });

  it('maps canceled with tokens to rejected', () => {
    expect(
      mapCommitToRedirectStatus(
        { paymentStatus: 'canceled' },
        { tokenNormal: 'token', tokenReject: undefined },
      ),
    ).toBe('rejected');
    expect(
      mapCommitToRedirectStatus(
        { paymentStatus: 'canceled' },
        { tokenNormal: undefined, tokenReject: 'tbk-token' },
      ),
    ).toBe('rejected');
  });

  it('maps canceled without tokens and pending to timeout', () => {
    expect(
      mapCommitToRedirectStatus(
        { paymentStatus: 'canceled' },
        { tokenNormal: undefined, tokenReject: undefined },
      ),
    ).toBe('timeout');
    expect(
      mapCommitToRedirectStatus(
        { paymentStatus: 'pending' },
        { tokenNormal: undefined, tokenReject: undefined },
      ),
    ).toBe('timeout');
  });
});
