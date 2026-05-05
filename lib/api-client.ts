export interface ChatResponse {
  response?: string;
  error?: string;
}

const MAX_MESSAGE_LENGTH = 1000;

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  if (!message.trim()) throw new Error('Message cannot be empty.');
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message too long. Max ${MAX_MESSAGE_LENGTH} characters.`);
  }

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `Request failed with status ${res.status}`);
  }

  return res.json();
}
