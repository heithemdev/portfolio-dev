// apps/web/app/api/contact/route.ts
// Purpose: Handles portfolio contact form submissions and sends them through the server SMTP mailer.
// Linked files: apps/web/lib/email/contact-mailer.ts, apps/web/components/landing/contact-section.tsx, apps/web/.env.local

import { NextResponse, type NextRequest } from "next/server";
import {
  sendPortfolioContactEmail,
  type ContactEmailInput,
} from "@/lib/email/contact-mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;

const rateLimitStore = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

type ContactRequestBody = Readonly<{
  name?: unknown;
  email?: unknown;
  project?: unknown;
  message?: unknown;
  company?: unknown;
}>;

function jsonResponse(
  status: number,
  payload: Readonly<{
    ok: boolean;
    message: string;
  }>,
) {
  return NextResponse.json(payload, { status });
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return realIp?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(ip);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  rateLimitStore.set(ip, {
    count: current.count + 1,
    resetAt: current.resetAt,
  });

  return false;
}

function getStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateContactBody(body: ContactRequestBody):
  | {
      ok: true;
      data: ContactEmailInput;
      honeypotFilled: boolean;
    }
  | {
      ok: false;
      message: string;
    } {
  const name = getStringValue(body.name);
  const email = getStringValue(body.email);
  const project = getStringValue(body.project);
  const message = getStringValue(body.message);
  const company = getStringValue(body.company);

  if (company.length > 0) {
    return {
      ok: true,
      honeypotFilled: true,
      data: {
        name: "Hidden field",
        email: "hidden@example.com",
        project: "",
        message: "",
      },
    };
  }

  if (name.length < 2 || name.length > 80) {
    return {
      ok: false,
      message: "Write a valid name.",
    };
  }

  if (!isValidEmail(email) || email.length > 120) {
    return {
      ok: false,
      message: "Write a valid email.",
    };
  }

  if (project.length > 120) {
    return {
      ok: false,
      message: "Keep the project field shorter.",
    };
  }

  if (message.length < 10 || message.length > 2000) {
    return {
      ok: false,
      message: "Write a message between 10 and 2000 characters.",
    };
  }

  return {
    ok: true,
    honeypotFilled: false,
    data: {
      name,
      email,
      project,
      message,
    },
  };
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse(413, {
      ok: false,
      message: "Message is too large.",
    });
  }

  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return jsonResponse(429, {
      ok: false,
      message: "Too many messages. Try again in a minute.",
    });
  }

  let body: ContactRequestBody;

  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return jsonResponse(400, {
      ok: false,
      message: "Invalid request body.",
    });
  }

  const validation = validateContactBody(body);

  if (!validation.ok) {
    return jsonResponse(400, {
      ok: false,
      message: validation.message,
    });
  }

  if (validation.honeypotFilled) {
    return jsonResponse(200, {
      ok: true,
      message: "Message sent.",
    });
  }

  try {
    await sendPortfolioContactEmail(validation.data);

    return jsonResponse(200, {
      ok: true,
      message: "Message sent. I will reply through email.",
    });
  } catch {
    return jsonResponse(500, {
      ok: false,
      message: "Email could not be sent right now.",
    });
  }
}