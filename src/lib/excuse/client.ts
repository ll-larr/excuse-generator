import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources/messages";
import { EFFORT, MAX_TOKENS, MODEL, THINKING_MODE } from "@/lib/config";
import { buildPrompt } from "@/lib/excuse/prompt";
import {
  ExcuseSchema,
  type Excuse,
  type GenerateRequest,
} from "@/lib/excuse/schema";

export type ExcuseErrorKind = "upstream" | "refusal" | "unparsable";

export class ExcuseError extends Error {
  readonly kind: ExcuseErrorKind;

  constructor(kind: ExcuseErrorKind, message: string) {
    super(message);
    this.name = "ExcuseError";
    this.kind = kind;
  }
}

interface ParseResponse {
  stop_reason: string | null;
  parsed_output: unknown;
}

export interface MessagesClient {
  messages: {
    parse: (params: MessageCreateParamsNonStreaming) => Promise<ParseResponse>;
  };
}

let cached: MessagesClient | null = null;

export function getAnthropicClient(): MessagesClient {
  if (!cached) {
    cached = new Anthropic() as unknown as MessagesClient;
  }
  return cached;
}

export async function generateExcuse(
  input: GenerateRequest,
  client: MessagesClient,
): Promise<Excuse> {
  const { system, userMessage } = buildPrompt(input);

  let response: ParseResponse;
  try {
    response = await client.messages.parse({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      thinking: { type: THINKING_MODE },
      output_config: {
        effort: EFFORT,
        format: zodOutputFormat(ExcuseSchema),
      },
      system,
      messages: [{ role: "user", content: userMessage }],
    });
  } catch (cause) {
    const status =
      typeof cause === "object" && cause !== null && "status" in cause
        ? (cause as { status?: unknown }).status
        : undefined;
    console.error("anthropic request failed", {
      name: cause instanceof Error ? cause.name : typeof cause,
      status,
    });
    throw new ExcuseError("upstream", "Anthropic вернул ошибку");
  }

  if (response.stop_reason === "refusal") {
    throw new ExcuseError("refusal", "Модель отказалась отвечать");
  }

  const parsed = ExcuseSchema.safeParse(response.parsed_output);
  if (!parsed.success) {
    throw new ExcuseError("unparsable", "Ответ модели не прошёл схему");
  }

  return parsed.data;
}
