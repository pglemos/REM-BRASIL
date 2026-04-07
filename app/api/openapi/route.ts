import { NextResponse } from 'next/server';
import { openapiSpecification } from '@/lib/openapi';

export async function GET() {
  return NextResponse.json(openapiSpecification);
}
