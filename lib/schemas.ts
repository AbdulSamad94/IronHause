/**
 * Zod schemas for all IronHaus API interactions.
 *
 * Defines the shape of data flowing between the frontend and the Next.js
 * BFF, providing runtime validation and TypeScript inference in one place.
 */
import { z } from 'zod';

export const MAX_MESSAGE_LENGTH = 1000;

// ── Outbound ──────────────────────────────────────────────────────────────────

export const ChatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty.')
    .max(MAX_MESSAGE_LENGTH, `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`),
  sessionId: z.string().uuid().optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// ── Inbound ───────────────────────────────────────────────────────────────────

export const ChatResponseSchema = z.object({
  response: z.string(),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;
