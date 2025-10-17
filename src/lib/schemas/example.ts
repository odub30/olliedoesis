import { z } from 'zod'

export const ExampleBody = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
})

export type ExampleBodyType = z.infer<typeof ExampleBody>
