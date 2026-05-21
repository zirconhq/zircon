import { OpenAPIHono } from '@hono/zod-openapi'

import { healthRoute } from './routes/health.ts'

export const app = new OpenAPIHono()

app.openapi(healthRoute, (c) => c.json({ status: 'ok' }, 200))
