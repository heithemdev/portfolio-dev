// apps/web/lib/email/contact-mailer.ts
// Purpose: Sends portfolio contact form emails through SMTP using server-only environment variables.
// Linked files: apps/web/app/api/contact/route.ts, apps/web/.env.local

import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

export type ContactEmailInput = Readonly<{
  name: string;
  email: string;
  project: string;
  message: string;
}>;

const globalForContactMailer = globalThis as typeof globalThis & {
  __portfolioContactTransporter__?: Transporter;
};

function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required email environment variable: ${key}`);
  }

  return value.trim();
}

function getSmtpPort(): number {
  const rawPort = getRequiredEnv("SMTP_PORT");
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a positive integer.");
  }

  return port;
}

function getSmtpSecure(): boolean {
  return getRequiredEnv("SMTP_SECURE").toLowerCase() === "true";
}

function getTransporter(): Transporter {
  if (globalForContactMailer.__portfolioContactTransporter__) {
    return globalForContactMailer.__portfolioContactTransporter__;
  }

  const transporter = nodemailer.createTransport({
    host: getRequiredEnv("SMTP_HOST"),
    port: getSmtpPort(),
    secure: getSmtpSecure(),
    auth: {
      user: getRequiredEnv("SMTP_USER"),
      pass: getRequiredEnv("SMTP_PASS"),
    },
  });

  // Keep one transporter in dev so hot reload does not recreate SMTP config every time.
  globalForContactMailer.__portfolioContactTransporter__ = transporter;

  return transporter;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeOptionalProject(project: string): string {
  const trimmedProject = project.trim();

  return trimmedProject.length > 0 ? trimmedProject : "Not specified";
}

function buildPlainTextEmail(input: ContactEmailInput): string {
  return [
    "New portfolio contact message",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Project: ${normalizeOptionalProject(input.project)}`,
    "",
    "Message:",
    input.message,
  ].join("\n");
}

function buildHtmlEmail(input: ContactEmailInput): string {
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeProject = escapeHtml(normalizeOptionalProject(input.project));
  const safeMessage = escapeHtml(input.message).replaceAll("\n", "<br />");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>New portfolio message</title>
  </head>
  <body style="margin:0;background:#F4EFE8;padding:32px;font-family:Arial,sans-serif;color:#111318;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;border:1px solid rgba(17,19,24,0.14);background:#F4EFE8;">
      <tr>
        <td style="padding:28px 28px 20px;border-bottom:1px solid rgba(17,19,24,0.12);">
          <p style="margin:0 0 10px;color:#B8792E;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;">
            Portfolio inquiry
          </p>
          <h1 style="margin:0;font-size:34px;line-height:0.95;letter-spacing:-0.05em;font-weight:400;color:#111318;">
            New contact message
          </h1>
        </td>
      </tr>

      <tr>
        <td style="padding:24px 28px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding:14px 0;border-bottom:1px solid rgba(17,19,24,0.1);width:130px;color:rgba(17,19,24,0.48);font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">
                Name
              </td>
              <td style="padding:14px 0;border-bottom:1px solid rgba(17,19,24,0.1);font-size:16px;color:#111318;">
                ${safeName}
              </td>
            </tr>

            <tr>
              <td style="padding:14px 0;border-bottom:1px solid rgba(17,19,24,0.1);width:130px;color:rgba(17,19,24,0.48);font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">
                Email
              </td>
              <td style="padding:14px 0;border-bottom:1px solid rgba(17,19,24,0.1);font-size:16px;color:#111318;">
                <a href="mailto:${safeEmail}" style="color:#B8792E;text-decoration:none;">${safeEmail}</a>
              </td>
            </tr>

            <tr>
              <td style="padding:14px 0;border-bottom:1px solid rgba(17,19,24,0.1);width:130px;color:rgba(17,19,24,0.48);font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">
                Project
              </td>
              <td style="padding:14px 0;border-bottom:1px solid rgba(17,19,24,0.1);font-size:16px;color:#111318;">
                ${safeProject}
              </td>
            </tr>
          </table>

          <div style="margin-top:24px;">
            <p style="margin:0 0 10px;color:rgba(17,19,24,0.48);font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">
              Message
            </p>
            <div style="border:1px solid rgba(17,19,24,0.12);background:rgba(17,19,24,0.025);padding:18px;font-size:16px;line-height:1.6;color:#111318;">
              ${safeMessage}
            </div>
          </div>

          <p style="margin:24px 0 0;color:rgba(17,19,24,0.45);font-size:13px;line-height:1.5;">
            Reply directly to this email. The visitor email is set as Reply-To.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendPortfolioContactEmail(
  input: ContactEmailInput,
): Promise<void> {
  const transporter = getTransporter();

  const smtpUser = getRequiredEnv("SMTP_USER");
  const toEmail = getRequiredEnv("CONTACT_TO_EMAIL");
  const fromName = process.env.CONTACT_FROM_NAME?.trim() || "portfolio";

  await transporter.sendMail({
    from: `"${fromName}" <${smtpUser}>`,
    to: toEmail,
    replyTo: `"${input.name}" <${input.email}>`,
    subject: `New portfolio message from ${input.name}`,
    text: buildPlainTextEmail(input),
    html: buildHtmlEmail(input),
  });
}