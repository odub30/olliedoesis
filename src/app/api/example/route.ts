import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ExampleBody } from '@/lib/schemas/example'

// Minimal API route template for this repo.
// - Shows GET and POST handlers
// - Uses Zod for input validation
// - Demonstrates requireAdmin() pattern (commented)

// Example: GET /api/example
export async function GET() {
  return NextResponse.json({ ok: true, message: 'Example GET response' })
}

// Example schema for POST body

// Example: POST /api/example
export async function POST(request: Request) {
  try {
    // If you need admin protection, follow the project pattern:
    // import { requireAdmin } from '@/lib/admin'
    // await requireAdmin()

    const body = await request.json()
    const parsed = ExampleBody.parse(body)

    // Implement business logic here (DB calls, validation, etc.)
    return NextResponse.json({ ok: true, data: parsed })
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Use Zod's format() to produce a serializable error structure
      return NextResponse.json({ ok: false, errors: err.format() }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal error' }, { status: 500 })
  }
}
