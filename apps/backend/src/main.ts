import { serve } from '@hono/node-server'

import { createApp } from '#/src/app.ts'

const app = createApp()

const port = 3000

const server = serve({
  fetch: app.fetch,
  port,
})

const shutdown = () => {
  console.log('Shutting down server gracefully...')
  server.close(() => {
    process.exit(0)
  })
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)

console.log(`Backend listening on http://localhost:${port}`)
