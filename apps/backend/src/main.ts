import { serve } from '@hono/node-server'
import { app } from './app.ts'

const port = Number.parseInt(process.env.PORT ?? '3000', 10)

serve({
  fetch: app.fetch,
  port,
})

console.log(`Backend listening on http://localhost:${port}`)
