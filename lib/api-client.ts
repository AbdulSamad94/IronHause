/**
 * Client-side API functions for the IronHaus chat interface.
 *
 * All calls go through the Next.js BFF route (`/api/chat`), which
 * forwards to the FastAPI backend with the auth token attached.
 */
import {
  ChatRequestSchema,
  ChatResponseSchema,
  MAX_MESSAGE_LENGTH,
  type ChatResponse,
} from '@/lib/schemas';

export type { ChatResponse };
export { MAX_MESSAGE_LENGTH };

export async function sendChatMessage(
  message: string,
  sessionId?: string,
): Promise<ChatResponse> {
  // Validate outbound data before sending — throws ZodError on failure
  ChatRequestSchema.parse({ message, sessionId });

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `Request failed with status ${res.status}`);
  }

  // Validate inbound data — throws ZodError if backend shape changes
  const data = await res.json();
  return ChatResponseSchema.parse(data);
}
