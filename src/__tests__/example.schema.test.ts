import { strict as assert } from 'assert'
import { ExampleBody } from '@/lib/schemas/example'

describe('ExampleBody schema', () => {
  it('parses valid input', () => {
    const input = { title: 'Hello', description: 'desc' }
    const parsed = ExampleBody.parse(input)
    assert.equal(parsed.title, 'Hello')
  })

  it('throws on invalid input', () => {
    const input = { description: 'no title' }
    // parse should throw; use Zod's safeParse to avoid casting
    const result = ExampleBody.safeParse(input)
    assert.equal(result.success, false)
  })
})
