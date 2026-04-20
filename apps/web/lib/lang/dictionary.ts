// lib/lang/dictionary.ts
// Purpose: Server-only dictionary loader and translation helper for localized App Router routes.
// Linked files: lib/lang/config.ts, messages/en.json, messages/fr.json, messages/ar.json, app/[locale]/page.tsx.

import "server-only";

import type { Locale } from "@/lib/lang/config";

export type Messages = {
  readonly [key: string]: string | Messages;
};

export type TranslationValues = Readonly<
  Record<string, string | number | null | undefined>
>;

const dictionaries = {
  en: async () => (await import("@/messages/en.json")).default as Messages,
  fr: async () => (await import("@/messages/fr.json")).default as Messages,
  ar: async () => (await import("@/messages/ar.json")).default as Messages,
} satisfies Record<Locale, () => Promise<Messages>>;

export async function getMessages(locale: Locale): Promise<Messages> {
  return dictionaries[locale]();
}

function readNestedMessage(
  messages: Messages,
  key: string,
): string | undefined {
  return key.split(".").reduce<string | Messages | undefined>(
    (current, segment) => {
      if (!current || typeof current === "string") {
        return undefined;
      }

      return current[segment];
    },
    messages,
  ) as string | undefined;
}

export function translate(
  messages: Messages,
  key: string,
  values?: TranslationValues,
): string {
  const rawMessage = readNestedMessage(messages, key);

  if (typeof rawMessage !== "string") {
    return key;
  }

  if (!values) {
    return rawMessage;
  }

  return rawMessage.replace(/\{(\w+)\}/g, (fullMatch, variableName: string) => {
    if (!Object.prototype.hasOwnProperty.call(values, variableName)) {
      return fullMatch;
    }

    const value = values[variableName];

    return value == null ? "" : String(value);
  });
}

export async function getTranslator(locale: Locale) {
  const messages = await getMessages(locale);

  return {
    messages,
    t: (key: string, values?: TranslationValues) =>
      translate(messages, key, values),
  } as const;
}