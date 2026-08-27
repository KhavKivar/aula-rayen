/* eslint-disable @typescript-eslint/unbound-method -- Transbank SDK methods are replaced with Jest mocks. */
import { BadRequestException, NotFoundException } from '@nestjs/common';

import type { WebPaySession } from '@/db/types';
import { CourseService } from '../course/course.service';
import { webpayTransaction } from './infrastructure/transbank.client';
import { WebPayRepository } from './webpay.repository';
import { WebPayService } from './webpay.service';

jest.mock('./infrastructure/transbank.client', () => ({
  webpayTransaction: {
    commit: jest.fn(),
  },
}));

const buyOrderId = 'buy-order';
const amount = 25000;

const webpaySession = {
  buyOrderId,
  userId: 'user-id',
  courseId: 1,
  amount,
} as WebPaySession;

const commitResponse = {
  buy_order: buyOrderId,
  vci: 'TSY',
  amount,
  status: 'AUTHORIZED',
  card_detail: { card_number: '6623' },
  accounting_date: '08192026',
  transaction_date: '2026-08-19T12:00:00.000Z',
  authorization_code: '123456',
  payment_type_code: 'VN',
  response_code: 0,
  installments_amount: 0,
  installments_number: 0,
};

describe('WebPayService', () => {
  const repository = {
    findById: jest.fn(),
    completeAuthorizedPayment: jest.fn(),
  };
  const service = new WebPayService(
    repository as unknown as WebPayRepository,
    {} as CourseService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores the authorized commit and grants access to the course', async () => {
    repository.findById.mockResolvedValue(webpaySession);
    repository.completeAuthorizedPayment.mockResolvedValue(webpaySession);
    jest.mocked(webpayTransaction.commit).mockResolvedValue(commitResponse);

    await expect(service.checkCommit(buyOrderId, 'token')).resolves.toEqual({
      payment: true,
    });
    expect(repository.completeAuthorizedPayment).toHaveBeenCalledWith(
      buyOrderId,
      webpaySession.userId,
      webpaySession.courseId,
      expect.objectContaining({
        tbAmount: amount,
        tbStatus: 'AUTHORIZED',
        transactionDate: new Date(commitResponse.transaction_date),
      }),
    );
  });

  it('does not grant access when Transbank rejects the payment', async () => {
    repository.findById.mockResolvedValue(webpaySession);
    jest.mocked(webpayTransaction.commit).mockResolvedValue({
      ...commitResponse,
      status: 'FAILED',
      response_code: -1,
    });

    await expect(service.checkCommit(buyOrderId, 'token')).resolves.toEqual({
      payment: false,
    });
    expect(repository.completeAuthorizedPayment).not.toHaveBeenCalled();
  });

  it('does not grant access when the committed amount differs', async () => {
    repository.findById.mockResolvedValue(webpaySession);
    jest.mocked(webpayTransaction.commit).mockResolvedValue({
      ...commitResponse,
      amount: 1000,
    });

    await expect(service.checkCommit(buyOrderId, 'token')).resolves.toEqual({
      payment: false,
    });
    expect(repository.completeAuthorizedPayment).not.toHaveBeenCalled();
  });

  it('rejects malformed Transbank responses', async () => {
    repository.findById.mockResolvedValue(webpaySession);
    jest.mocked(webpayTransaction.commit).mockResolvedValue({});

    await expect(service.checkCommit(buyOrderId, 'token')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects Transbank responses with an invalid transaction date', async () => {
    repository.findById.mockResolvedValue(webpaySession);
    jest.mocked(webpayTransaction.commit).mockResolvedValue({
      ...commitResponse,
      transaction_date: 'not-a-date',
    });

    await expect(service.checkCommit(buyOrderId, 'token')).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.completeAuthorizedPayment).not.toHaveBeenCalled();
  });

  it('rejects callbacks without a matching Webpay session', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.checkCommit(buyOrderId, 'token')).rejects.toThrow(
      NotFoundException,
    );
    expect(webpayTransaction.commit).not.toHaveBeenCalled();
  });
});
