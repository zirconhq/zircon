import { createRoute, type RouteHandler, z } from '@hono/zod-openapi'

const HealthResponseSchema = z
  .object({
    status: z.literal('ok').openapi({
      example: 'ok',
    }),
  })
  .openapi('HealthResponse')

export const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: HealthResponseSchema,
        },
      },
      description: 'Health check',
    },
  },
})

export const healthHandler: RouteHandler<typeof healthRoute> = (c) => c.json({ status: 'ok' }, 200)
