import { serve } from '@hono/node-server'

import { createApp } from '#/src/app.ts'

const app = createApp()

const hostname = '0.0.0.0'
const port = 3000

const server = serve({
  fetch: app.fetch,
  hostname,
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

console.log(`Backend listening on http://${hostname}:${port}`)
