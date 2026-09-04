/* eslint-disable @typescript-eslint/unbound-method -- Reflecting on decorator metadata requires the unbound method reference. */
import { SetMetadata } from '@nestjs/common';

import { WebPayController } from './webpay.controller';

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
