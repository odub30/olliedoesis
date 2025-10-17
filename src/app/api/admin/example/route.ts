import { z } from 'zod'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { ExampleBody } from '@/lib/schemas/example'

// Admin-protected example route. Mirrors project patterns.
export async function POST(request: Request) {
  await requireAdmin() // throws/redirects if not admin

  try {
    const body = await request.json()
    const parsed = ExampleBody.parse(body)

    // TODO: perform admin-only action (create resource, run migration step, etc.)
    return NextResponse.json({ ok: true, data: parsed })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, errors: err.format() }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal error' }, { status: 500 })
  }
}
