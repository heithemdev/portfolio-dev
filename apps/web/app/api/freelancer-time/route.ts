// app/api/freelancer-time/route.ts
// Purpose: Return server-synced Algeria time so the contact section does not depend on the visitor's computer clock.
// Linked files: components/landing/contact-section.tsx.

import { NextResponse } from "next/server";

const ALGERIA_TIME_ZONE = "Africa/Algiers";

function getAlgeriaSnapshot(serverUtcMs: number) {
  const serverDate = new Date(serverUtcMs);

  return {
    serverUtcMs,
    timeZone: ALGERIA_TIME_ZONE,
    time: new Intl.DateTimeFormat("en-GB", {
      timeZone: ALGERIA_TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(serverDate),
    date: new Intl.DateTimeFormat("en-GB", {
      timeZone: ALGERIA_TIME_ZONE,
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(serverDate),
  };
}

export async function GET() {
  const snapshot = getAlgeriaSnapshot(Date.now());

  return NextResponse.json(snapshot, {
    headers: {
      // The clock must always start from a fresh server timestamp.
      "Cache-Control": "no-store, max-age=0",
    },
  });
}