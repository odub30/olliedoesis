import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Sitemap API coming soon' }, { status: 501 });
}
