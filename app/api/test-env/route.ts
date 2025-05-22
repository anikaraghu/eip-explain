import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    host: process.env.NEXT_PUBLIC_HOST || 'not set',
    hasOpenAI: !!process.env.OPENAI_API_KEY,
  });
} 