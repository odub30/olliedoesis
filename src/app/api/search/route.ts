import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Search API coming soon' }, { status: 501 });
}
