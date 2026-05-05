import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { forwardToBackend } from '@/lib/fastapi';

interface ChatRequest {
  message: string;
}

export async function POST(request: Request) {
  try {
    // 1. Check Rate Limits
    const rateLimitResponse = await checkRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;

    // 2. Parse & Validate Input
    const body: Partial<ChatRequest> = await request.json();
    if (!body?.message) {
      return NextResponse.json(
        { error: 'Message is required' }, 
        { status: 400 }
      );
    }

    // 3. Process Request
    return await forwardToBackend(body.message);

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with backend service' },
      { status: 500 }
    );
  }
}
