import { serve } from '@hono/node-server'

import { createApp } from '#/src/app.ts'

const app = createApp()

const port = 3000

serve({
  fetch: app.fetch,
  port,
})

console.log(`Backend listening on http://localhost:${port}`)
