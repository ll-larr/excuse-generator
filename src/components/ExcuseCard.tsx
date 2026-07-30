"use client";

import { useState } from "react";
import { ERROR_MESSAGES } from "@/lib/config";
import type { Excuse } from "@/lib/excuse/schema";

export function ExcuseCard({ excuse }: { excuse: Excuse }) {
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
    <section className="mt-8 rounded-lg border p-6">
      <p className="text-lg">{excuse.excuse}</p>

      <dl className="mt-4 space-y-1 text-sm opacity-80">
        <div className="flex gap-2">
          <dt>Правдоподобность:</dt>
          <dd>{excuse.plausibility} из 100</dd>
        </div>
        <div className="flex gap-2">
          <dt>Чем рискуешь:</dt>
          <dd>{excuse.risk_note}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={copy}
        className="mt-4 rounded border px-4 py-2"
      >
        Скопировать
      </button>
      {copied && <span className="ml-3 text-sm">Скопировано</span>}
      {copyFailed && (
        <span role="alert" className="ml-3 text-sm">
          {ERROR_MESSAGES.copy_failed}
        </span>
      )}
    </section>
  );
}
