// components/landing/how-i-work.tsx
// Purpose: Localized portfolio process section shown as a calm client conversation with a shared booking modal CTA.
// Linked files: app/[locale]/page.tsx, components/landing/projects.tsx, components/booking-modal.tsx, lib/lang/config.ts, public/assets/Heithem profile picture.jpg.

"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CheckCheck,
  Clock3,
  FileText,
  Mic,
  PhoneCall,
  Video,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import BookingModal, { type BookingModalCopy } from "@/components/booking-modal";
import type { TextDirection } from "@/lib/lang/config";

import heithemProfilePicture from "../../public/assets/Heithem profile picture.jpg";

const BOOK_CALL_HREF = "https://calendar.app.google/LAyuzM8fSjE5ezvH7";

type ChatAuthor = "client" | "heithem";

type TextMessage = Readonly<{
  id: string;
  type: "text";
  author: ChatAuthor;
  body: string;
}>;

type CallMessage = Readonly<{
  id: string;
  type: "call";
  duration: string;
  note: string;
}>;

type FileMessage = Readonly<{
  id: string;
  type: "file";
  fileName: string;
  meta: string;
}>;

type ChatItem = TextMessage | CallMessage | FileMessage;

type ProcessNote = Readonly<{
  label: string;
  value: string;
}>;

type HowIWorkCopy = Readonly<{
  eyebrow: string;
  title: string;
  intro: string;
  reserveCall: string;
  voiceCall: string;
  chatHeaderName: string;
  chatHeaderStatus: string;
  avatarAlt: string;
  notes: ReadonlyArray<ProcessNote>;
  chatItems: ReadonlyArray<ChatItem>;
}>;

type HowIWorkProps = Readonly<{
  copy: HowIWorkCopy;
  bookingModalCopy: BookingModalCopy;
  textDirection: TextDirection;
}>;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function MessageAvatar({
  author,
  avatarAlt,
}: {
  author: ChatAuthor;
  avatarAlt: string;
}) {
  if (author === "client") {
    return (
      <div
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#111318]/14 bg-[#111318]/[0.035] text-[0.68rem] font-medium uppercase tracking-[-0.03em] text-[#111318]/56"
      >
        C
      </div>
    );
  }

  return (
    <div className="relative h-8 w-8 shrink-0 overflow-hidden border border-[#111318]/14 bg-[#F4EFE8]">
      <Image
        src={heithemProfilePicture}
        alt={avatarAlt}
        placeholder="blur"
        sizes="32px"
        className="h-full w-full object-cover grayscale"
      />
    </div>
  );
}

function ChatBubble({
  message,
  index,
  avatarAlt,
  textDirection,
}: {
  message: TextMessage;
  index: number;
  avatarAlt: string;
  textDirection: TextDirection;
}) {
  const isClient = message.author === "client";
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "flex w-full items-end gap-3",
        isClient ? "justify-end" : "justify-start",
      )}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{
        delay: shouldReduceMotion ? 0 : index * 0.045,
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {!isClient ? (
        <MessageAvatar author={message.author} avatarAlt={avatarAlt} />
      ) : null}

      <div
        className={cn(
          "max-w-[min(31rem,82%)] border px-4 py-3",
          isClient
            ? "border-[#111318]/16 bg-[#111318]/[0.035]"
            : "border-[#B8792E]/20 bg-[#F4EFE8]",
        )}
      >
        <p
          dir={textDirection}
          className="text-[0.94rem] font-normal leading-[1.5] tracking-[-0.025em] text-[#111318]/74"
        >
          {message.body}
        </p>
      </div>

      {isClient ? (
        <MessageAvatar author={message.author} avatarAlt={avatarAlt} />
      ) : null}
    </motion.div>
  );
}

function CallBubble({
  item,
  index,
  voiceCall,
  avatarAlt,
  textDirection,
}: {
  item: CallMessage;
  index: number;
  voiceCall: string;
  avatarAlt: string;
  textDirection: TextDirection;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex w-full justify-start gap-3"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{
        delay: shouldReduceMotion ? 0 : index * 0.045,
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <MessageAvatar author="heithem" avatarAlt={avatarAlt} />

      <div className="w-full max-w-[min(31rem,82%)] border border-[#111318]/14 bg-[#111318] p-4 text-[#F4EFE8]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4EFE8]/12">
            <PhoneCall className="h-5 w-5" strokeWidth={1.8} />
          </div>

          <div className="min-w-0" dir={textDirection}>
            <p className="text-[1rem] font-medium leading-none tracking-[-0.03em]">
              {voiceCall}
            </p>

            <div className="mt-2 flex items-center gap-2 text-[0.82rem] text-[#F4EFE8]/58">
              <Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>{item.duration}</span>
            </div>
          </div>
        </div>

        <p
          dir={textDirection}
          className="mt-4 text-[0.82rem] leading-[1.45] tracking-[-0.02em] text-[#F4EFE8]/62"
        >
          {item.note}
        </p>
      </div>
    </motion.div>
  );
}

function FileBubble({
  item,
  index,
  avatarAlt,
  textDirection,
}: {
  item: FileMessage;
  index: number;
  avatarAlt: string;
  textDirection: TextDirection;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex w-full justify-start gap-3"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{
        delay: shouldReduceMotion ? 0 : index * 0.045,
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <MessageAvatar author="heithem" avatarAlt={avatarAlt} />

      <div className="w-full max-w-[min(31rem,82%)] border border-[#111318]/14 bg-[#111318]/[0.025] p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#B8792E]/26 bg-[#B8792E]/[0.06] text-[#B8792E]">
            <FileText className="h-5 w-5" strokeWidth={1.8} />
          </div>

          <div className="min-w-0" dir={textDirection}>
            <p className="truncate text-[0.96rem] font-medium leading-none tracking-[-0.03em] text-[#111318]">
              {item.fileName}
            </p>

            <p className="mt-2 text-[0.78rem] leading-none tracking-[-0.02em] text-[#111318]/46">
              {item.meta}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChatItemRenderer({
  item,
  index,
  copy,
  textDirection,
}: {
  item: ChatItem;
  index: number;
  copy: HowIWorkCopy;
  textDirection: TextDirection;
}) {
  if (item.type === "call") {
    return (
      <CallBubble
        item={item}
        index={index}
        voiceCall={copy.voiceCall}
        avatarAlt={copy.avatarAlt}
        textDirection={textDirection}
      />
    );
  }

  if (item.type === "file") {
    return (
      <FileBubble
        item={item}
        index={index}
        avatarAlt={copy.avatarAlt}
        textDirection={textDirection}
      />
    );
  }

  return (
    <ChatBubble
      message={item}
      index={index}
      avatarAlt={copy.avatarAlt}
      textDirection={textDirection}
    />
  );
}

function ChatHeader({
  copy,
  textDirection,
}: {
  copy: HowIWorkCopy;
  textDirection: TextDirection;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#111318]/12 px-4 py-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden border border-[#111318]/14 bg-[#F4EFE8]">
          <Image
            src={heithemProfilePicture}
            alt={copy.avatarAlt}
            placeholder="blur"
            sizes="44px"
            className="h-full w-full object-cover grayscale"
          />
        </div>

        <div className="min-w-0" dir={textDirection}>
          <p className="truncate text-[0.96rem] font-medium leading-none tracking-[-0.03em] text-[#111318]">
            {copy.chatHeaderName}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B8792E]" />
            <p className="text-[0.72rem] leading-none tracking-[-0.02em] text-[#111318]/48">
              {copy.chatHeaderStatus}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[#111318]/50">
        <Mic className="h-4 w-4" strokeWidth={1.7} />
        <Video className="h-4 w-4" strokeWidth={1.7} />
      </div>
    </div>
  );
}

function ProcessNote({
  label,
  value,
  index,
  textDirection,
}: {
  label: string;
  value: string;
  index: number;
  textDirection: TextDirection;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      className="border border-[#111318]/12 bg-[#111318]/[0.025] p-5"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        delay: shouldReduceMotion ? 0 : index * 0.08,
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1],
      }}
      dir={textDirection}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center border border-[#B8792E]/24 bg-[#B8792E]/[0.055] text-[#B8792E]">
          <CheckCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
        </span>

        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#111318]/42">
          {label}
        </p>
      </div>

      <p className="mt-4 text-[0.95rem] leading-[1.5] tracking-[-0.025em] text-[#111318]/66">
        {value}
      </p>
    </motion.article>
  );
}

export default function HowIWork({
  copy,
  bookingModalCopy,
  textDirection,
}: HowIWorkProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <section
        id="how-i-work"
        aria-labelledby="how-i-work-title"
        className="relative isolate overflow-hidden bg-[#F4EFE8] py-[clamp(5rem,9vw,8rem)] text-[#111318]"
        dir="ltr"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#111318]/10" />

        <div className="mx-auto grid w-full max-w-[1920px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.56fr)_minmax(34rem,0.74fr)] lg:items-start lg:gap-16 lg:px-10">
          <div className="lg:sticky lg:top-[6rem]" dir={textDirection}>
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#B8792E]">
              {copy.eyebrow}
            </p>

            <h2
              id="how-i-work-title"
              className="mt-4 text-[clamp(3rem,7vw,7.4rem)] font-normal leading-[0.86] tracking-[-0.095em] text-[#111318]"
            >
              {copy.title}
            </h2>

            <p className="mt-6 max-w-[36rem] text-[clamp(1rem,1.2vw,1.14rem)] font-normal leading-[1.58] tracking-[-0.025em] text-[#111318]/62">
              {copy.intro}
            </p>

            <div className="mt-9 grid gap-3">
              {copy.notes.map((note, index) => (
                <ProcessNote
                  key={note.label}
                  label={note.label}
                  value={note.value}
                  index={index}
                  textDirection={textDirection}
                />
              ))}
            </div>

            <div className="mt-9">
              <button
                type="button"
                onClick={() => {
                  setIsBookingOpen(true);
                }}
                className="inline-flex items-center gap-2 border-b border-[#111318] pb-1 text-[0.9rem] font-medium leading-none tracking-[-0.025em] text-[#111318] transition duration-200 hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
                aria-haspopup="dialog"
                aria-expanded={isBookingOpen}
              >
                {copy.reserveCall}
                <PhoneCall className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          <motion.div
            className="overflow-hidden border border-[#111318]/14 bg-[#F4EFE8] shadow-[0_34px_100px_rgba(17,19,24,0.08)]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <ChatHeader copy={copy} textDirection={textDirection} />

            <div className="flex flex-col gap-4 px-4 py-5 sm:px-5 sm:py-6">
              {copy.chatItems.map((item, index) => (
                <ChatItemRenderer
                  key={item.id}
                  item={item}
                  index={index}
                  copy={copy}
                  textDirection={textDirection}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
        }}
        bookingUrl={BOOK_CALL_HREF}
        copy={bookingModalCopy}
        textDirection={textDirection}
      />
    </>
  );
}