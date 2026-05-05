import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit } from '@/lib/ratelimit';
import { forwardToBackend } from '@/lib/fastapi';
import { ChatRequestSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  // 1. Rate limit check
  const rateLimitResponse = await checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();

    // 2. Schema validation — returns 400 with readable errors on failure
    const { message, sessionId } = ChatRequestSchema.parse(body);

    // 3. Forward to FastAPI backend
    return await forwardToBackend(message, sessionId);

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? 'Invalid request.' },
        { status: 400 },
      );
    }

    console.error('Unhandled error in /api/chat:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with the backend service.' },
      { status: 500 },
    );
  }
}
