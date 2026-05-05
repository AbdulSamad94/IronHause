import { NextResponse } from 'next/server';

export async function forwardToBackend(message: string): Promise<NextResponse> {
  const backendUrl = process.env.FASTAPI_BACKEND_URL;

  if (!backendUrl) {
    console.error('FastAPI Backend URL not configured in .env');
    return NextResponse.json(
      { error: 'Server configuration error: Backend URL is missing.' },
      { status: 500 }
    );
  }

  const response = await fetch(`${backendUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    console.error(`FastAPI Error: Backend returned status ${response.status}`);
    return NextResponse.json(
      { error: 'The backend service encountered an error.' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
