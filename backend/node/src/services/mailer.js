import nodemailer from 'nodemailer';

export const mailConfigured = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

let transport;
export function mailTransport() {
  const port = Number(process.env.SMTP_PORT) || 465;
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
  });
  return transport;
}

export const sendResetCode = (to, code) => mailTransport().sendMail({
  from: `CuraSense <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
  to,
  subject: 'Your CuraSense password reset code',
  text: `Your CuraSense password reset code is ${code}.\n\nIt works for 15 minutes. If you did not ask for it, ignore this email: your password has not changed.`,
});
