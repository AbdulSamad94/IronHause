import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit } from '@/lib/ratelimit';
import { ChatRequestSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const rateLimitResponse = await checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { message, sessionId } = ChatRequestSchema.parse(body);

    const backendUrl = process.env.FASTAPI_BACKEND_URL;
    const authToken  = process.env.BACKEND_API_TOKEN;

    if (!backendUrl || !authToken) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const upstream = await fetch(`${backendUrl}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': authToken,
      },
      body: JSON.stringify({ message, session_id: sessionId }),
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: 'Backend stream error.' },
        { status: upstream.status },
      );
    }

    // Pipe the FastAPI SSE stream directly to the browser
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? 'Invalid request.' },
        { status: 400 },
      );
    }
    console.error('Unhandled error in /api/chat/stream:', error);
    return NextResponse.json({ error: 'Failed to start stream.' }, { status: 500 });
  }
}
