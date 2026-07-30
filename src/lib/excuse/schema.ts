import { z } from "zod";
import { MADNESS_MAX, MADNESS_MIN, MAX_SITUATION_LENGTH } from "@/lib/config";

export const GenerateRequestSchema = z.object({
  situation: z.string().trim().min(1).max(MAX_SITUATION_LENGTH),
  madness: z.number().int().min(MADNESS_MIN).max(MADNESS_MAX),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

export const ExcuseSchema = z.object({
  excuse: z.string(),
  plausibility: z.number().int().min(0).max(100),
  risk_note: z.string(),
});

export type Excuse = z.infer<typeof ExcuseSchema>;
