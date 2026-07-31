"use client";

import { useState } from "react";
import { CHANNEL_LABELS, ERROR_MESSAGES, type Channel } from "@/lib/config";
import type { Excuse } from "@/lib/excuse/schema";

export function ExcuseCard({
  excuse,
  madness,
  channel,
}: {
  excuse: Excuse;
  madness?: number;
  channel?: Channel;
}) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(excuse.excuse);
      setCopyFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
  }

  return (
    <section className="anim-pop overflow-hidden rounded-[18px] border-[3px] border-line bg-paper shadow-[0_6px_0_var(--line)]">
      <div className="flex items-center justify-between gap-2.5 bg-line px-4 py-2.5 font-mono text-[11px]/none tracking-[0.1em] text-background uppercase">
        <span>отмазка готова</span>
        {madness !== undefined && channel !== undefined && (
          <span>
            уровень {madness} · {CHANNEL_LABELS[channel]}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <p className="m-0 text-xl/relaxed text-pretty">{excuse.excuse}</p>

        <dl className="mt-5 border-t-2 border-dashed border-[color-mix(in_oklab,var(--line)_25%,transparent)] pt-4">
          <div className="flex items-baseline justify-between gap-2.5">
            <dt className="font-mono text-xs tracking-wide opacity-65">
              Правдоподобность:
            </dt>
            <dd className="m-0 font-mono text-[15px] font-bold">
              {excuse.plausibility} из 100
            </dd>
          </div>
          <div
            aria-hidden="true"
            className="mt-2.5 h-3 overflow-hidden rounded-full border-2 border-line bg-background"
          >
            <div
              className="h-full border-r-2 border-line bg-accent"
              style={{ width: `${excuse.plausibility}%` }}
            />
          </div>
          <div className="mt-3.5 flex items-start gap-2">
            <dt className="font-mono text-xs/relaxed tracking-wide whitespace-nowrap opacity-65">
              Чем рискуешь:
            </dt>
            <dd className="m-0 text-[13px]/relaxed">{excuse.risk_note}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copy}
            className="cursor-pointer rounded-xl border-2 border-line bg-background px-5 py-3 text-sm font-semibold shadow-[0_4px_0_var(--line)] transition hover:-translate-y-px hover:shadow-[0_5px_0_var(--line)] active:translate-y-0.5 active:shadow-[0_2px_0_var(--line)]"
          >
            Скопировать
          </button>
          {copied && (
            <span className="anim-pop rounded-full border-2 border-line bg-accent px-3 py-2 text-[13px] font-semibold text-[#141210]">
              Скопировано
            </span>
          )}
          {copyFailed && (
            <span role="alert" className="text-[13px]/relaxed font-medium">
              {ERROR_MESSAGES.copy_failed}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
