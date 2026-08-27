import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import { env } from '@/config/env';

const SUBJECT = 'Restablece tu contraseña de Aula Rayen';

type ResendClient = Pick<Resend, 'emails'>;

export class PasswordResetDeliveryError extends Error {
  constructor() {
    super('Password reset email delivery failed');
    this.name = 'PasswordResetDeliveryError';
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function createPasswordResetMailer(
  client: ResendClient = new Resend(env.RESEND_API_KEY),
) {
  return {
    async send({
      recipient,
      resetUrl,
      token,
    }: {
      recipient: string;
      resetUrl: string;
      token: string;
    }) {
      const safeResetUrl = escapeHtml(resetUrl);
      const idempotencyKey = `password-reset/${createHash('sha256').update(token).digest('hex')}`;
      const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${SUBJECT}</title>
    <style>
      @media only screen and (max-width: 620px) {
        .email-shell { width: 100% !important; }
        .email-content { padding: 32px 24px !important; }
        .email-header { padding: 24px !important; }
        .email-footer { padding: 24px !important; }
        .reset-button { display: block !important; text-align: center !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f0; color:#1c1c1a; font-family:Arial,Helvetica,sans-serif; -webkit-font-smoothing:antialiased;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
      Crea una nueva contraseña para tu cuenta de Aula Rayen. El enlace vence en una hora.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; background-color:#f4f4f0;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="email-shell" style="width:600px; max-width:600px; background-color:#ffffff; border:1px solid #e4e4de; border-radius:20px; overflow:hidden; box-shadow:0 10px 30px rgba(28,28,26,0.08);">
            <tr>
              <td class="email-header" style="padding:28px 40px; background-color:#1c1c1a;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="42" height="42" align="center" valign="middle" style="width:42px; height:42px; border-radius:12px; background-color:#f4b942; color:#1c1c1a; font-size:18px; font-weight:700;">AR</td>
                    <td style="padding-left:14px; color:#ffffff; font-size:18px; font-weight:700; letter-spacing:-0.2px;">Aula Rayen</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-content" style="padding:44px 40px 40px;">
                <p style="margin:0 0 12px; color:#9a6500; font-size:12px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase;">Seguridad de tu cuenta</p>
                <h1 style="margin:0 0 20px; color:#1c1c1a; font-size:30px; line-height:1.2; letter-spacing:-0.7px;">Crea una nueva contraseña</h1>
                <p style="margin:0 0 28px; color:#575751; font-size:16px; line-height:1.65;">Recibimos una solicitud para restablecer la contraseña de tu cuenta. Usa el siguiente botón para elegir una nueva.</p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 30px;">
                  <tr>
                    <td bgcolor="#f4b942" style="border-radius:999px;">
                      <a href="${safeResetUrl}" class="reset-button" style="display:inline-block; padding:15px 26px; border-radius:999px; background-color:#f4b942; color:#1c1c1a; font-size:15px; font-weight:700; line-height:1; text-decoration:none;">Restablecer contraseña</a>
                    </td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 30px; width:100%; background-color:#faf7ed; border-left:4px solid #f4b942; border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px; color:#575751; font-size:14px; line-height:1.55;"><strong style="color:#1c1c1a;">Este enlace vence en una hora</strong> y solo puede usarse una vez. Por seguridad, tus sesiones activas se cerrarán después del cambio.</td>
                  </tr>
                </table>
                <p style="margin:0 0 10px; color:#777770; font-size:13px; line-height:1.55;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                <p style="margin:0; word-break:break-all; color:#575751; font-size:12px; line-height:1.55;"><a href="${safeResetUrl}" style="color:#875c00; text-decoration:underline;">${safeResetUrl}</a></p>
              </td>
            </tr>
            <tr>
              <td class="email-footer" style="padding:26px 40px; background-color:#f8f8f5; border-top:1px solid #e9e9e3;">
                <p style="margin:0 0 8px; color:#575751; font-size:13px; line-height:1.55;"><strong style="color:#1c1c1a;">¿No solicitaste este cambio?</strong> Puedes ignorar este correo. Tu contraseña seguirá siendo la misma.</p>
                <p style="margin:0; color:#92928b; font-size:12px; line-height:1.5;">Este es un mensaje automático de Aula Rayen. No respondas a este correo.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

      const { data, error } = await client.emails.send(
        {
          from: env.RESEND_FROM_EMAIL,
          to: recipient,
          subject: SUBJECT,
          html,
          text: `Aula Rayen\n\nCrea una nueva contraseña\n\nRecibimos una solicitud para restablecer la contraseña de tu cuenta.\n\nRestablece tu contraseña aquí:\n${resetUrl}\n\nEste enlace vence en una hora y solo puede usarse una vez. Por seguridad, tus sesiones activas se cerrarán después del cambio.\n\n¿No solicitaste este cambio? Puedes ignorar este correo. Tu contraseña seguirá siendo la misma.`,
        },
        { idempotencyKey },
      );

      if (error || !data) {
        throw new PasswordResetDeliveryError();
      }

      return data.id;
    },
  };
}

export const passwordResetMailer = createPasswordResetMailer();
