import { NextResponse } from 'next/server';
import metadata from '../../../frame-metadata.json';

export async function GET() {
  return NextResponse.json(metadata);
} 