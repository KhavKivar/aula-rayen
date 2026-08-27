const envMock = {
  RESEND_API_KEY: 'test-api-key',
  RESEND_FROM_EMAIL: 'Aula Rayen <no-reply@verified.example>',
};

jest.mock('@/config/env', () => ({ env: envMock }));

import {
  createPasswordResetMailer,
  PasswordResetDeliveryError,
} from './password-reset-mailer';

type EmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};

type SendOptions = { idempotencyKey?: string };
type SendResult = { data: { id: string } | null; error: unknown };

describe('password reset mailer', () => {
  const send = jest.fn<Promise<SendResult>, [EmailPayload, SendOptions]>();
  const mailer = createPasswordResetMailer({
    emails: { send } as never,
  });

  beforeEach(() => {
    send.mockReset();
  });

  it('sends Spanish HTML and text from the verified sender', async () => {
    send.mockResolvedValue({ data: { id: 'email-id' }, error: null });

    await expect(
      mailer.send({
        recipient: 'person@example.com',
        resetUrl: 'https://app.example/reset?token=secret-token',
        token: 'secret-token',
      }),
    ).resolves.toBe('email-id');

    const [payload, options] = send.mock.calls[0];
    expect(payload.from).toBe(envMock.RESEND_FROM_EMAIL);
    expect(payload.to).toBe('person@example.com');
    expect(payload.subject).toContain('Aula Rayen');
    expect(payload.html).toMatch(/Aula Rayen.*https:\/\/app\.example\/reset/s);
    expect(payload.text).toMatch(/Aula Rayen.*https:\/\/app\.example\/reset/s);
    expect(payload.html).toContain('<!doctype html>');
    expect(payload.html).toContain('class="reset-button"');
    expect(payload.html).toContain('Este enlace vence en una hora');
    expect(payload.html).toContain('tus sesiones activas se cerrarán');
    expect(payload.html.match(/https:\/\/app\.example\/reset/g)).toHaveLength(
      3,
    );
    expect(options).toEqual({
      idempotencyKey:
        'password-reset/930bbdc51b6aed5c2a5678fd6e28dee7a05e8a4b643cfc0b4427c3efb86c0d94',
    });
  });

  it('escapes the reset URL in HTML', async () => {
    send.mockResolvedValue({ data: { id: 'email-id' }, error: null });

    await mailer.send({
      recipient: 'person@example.com',
      resetUrl: 'https://app.example/reset?token=a&next="bad"',
      token: 'token',
    });

    expect(send.mock.calls[0][0].html).toContain(
      'token=a&amp;next=&quot;bad&quot;',
    );
  });

  it('uses the same idempotency key when a token is retried', async () => {
    send.mockResolvedValue({ data: { id: 'email-id' }, error: null });
    const message = {
      recipient: 'person@example.com',
      resetUrl: 'https://app.example/reset',
      token: 'same-token',
    };

    await mailer.send(message);
    await mailer.send(message);

    expect(send.mock.calls[0][1]).toEqual(send.mock.calls[1][1]);
    expect(send.mock.calls[0][1].idempotencyKey).not.toContain('same-token');
  });

  it('throws an internal error when Resend rejects the message', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'rejected' } });

    await expect(
      mailer.send({
        recipient: 'private@example.com',
        resetUrl: 'https://app.example/reset?token=private-token',
        token: 'private-token',
      }),
    ).rejects.toEqual(new PasswordResetDeliveryError());
  });

  it('does not intercept network failures or log sensitive input', async () => {
    const networkError = new Error('network unavailable');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    send.mockRejectedValue(networkError);

    await expect(
      mailer.send({
        recipient: 'private@example.com',
        resetUrl: 'https://app.example/reset?token=private-token',
        token: 'private-token',
      }),
    ).rejects.toBe(networkError);
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
