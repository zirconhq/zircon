import { createRoute, type RouteHandler, z } from '@hono/zod-openapi'
import { resourceProviders } from '#/src/bootstrap.ts'

const ResourceContentParamsSchema = z
  .object({
    providerName: z.string().openapi({
      example: 'docs',
    }),
    resourcePath: z.string().openapi({
      example: 'Development.md',
    }),
  })
  .openapi('WriteResourceContentParams')

const ResourceContentRequestSchema = z.string().openapi({
  example: '# Development',
})

const ResourceContentErrorResponseSchema = z
  .object({
    message: z.string().openapi({
      example: 'Resource could not be written',
    }),
  })
  .openapi('WriteResourceContentErrorResponse')

export const writeResourceContentRoute = createRoute({
  method: 'put',
  path: '/resources/{providerName}/{resourcePath}{.+}',
  request: {
    params: ResourceContentParamsSchema,
    body: {
      content: {
        'text/plain': {
          schema: ResourceContentRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    204: {
      description: 'Resource content written',
    },
    404: {
      content: {
        'application/json': {
          schema: ResourceContentErrorResponseSchema,
        },
      },
      description: 'Resource not found',
    },
    500: {
      content: {
        'application/json': {
          schema: ResourceContentErrorResponseSchema,
        },
      },
      description: 'Resource content could not be written',
    },
  },
})

export const createWriteResourceContentHandler = (): RouteHandler<typeof writeResourceContentRoute> => async (c) => {
  const { providerName, resourcePath } = c.req.valid('param')
  const resourceProvider = resourceProviders.find(provider => provider.name === providerName)

  if (resourceProvider === undefined) {
    return c.json({ message: 'Resource provider not found' }, 404)
  }

  try {
    if (await resourceProvider.read(resourcePath) === null) {
      return c.json({ message: 'Resource not found' }, 404)
    }

    await resourceProvider.write(resourcePath, await c.req.text())

    return c.body(null, 204)
  } catch {
    return c.json({ message: 'Resource content could not be written' }, 500)
  }
}
