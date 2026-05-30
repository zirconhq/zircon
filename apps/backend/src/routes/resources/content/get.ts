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
  .openapi('ResourceContentParams')

const ResourceContentResponseSchema = z.string().openapi({
  example: '# Development',
})

const ResourceContentErrorResponseSchema = z
  .object({
    message: z.string().openapi({
      example: 'Resource not found',
    }),
  })
  .openapi('ResourceContentErrorResponse')

export const resourceContentRoute = createRoute({
  method: 'get',
  path: '/resources/{providerName}/{resourcePath}{.+}',
  request: {
    params: ResourceContentParamsSchema,
  },
  responses: {
    200: {
      content: {
        'text/plain': {
          schema: ResourceContentResponseSchema,
        },
      },
      description: 'Resource content',
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
      description: 'Resource content could not be read',
    },
  },
})

export const createResourceContentHandler = (): RouteHandler<typeof resourceContentRoute> => async (c) => {
  const { providerName, resourcePath } = c.req.valid('param')
  const resourceProvider = resourceProviders.find(provider => provider.name === providerName)

  if (resourceProvider === undefined) {
    return c.json({ message: 'Resource provider not found' }, 404)
  }

  try {
    const content = await resourceProvider.content(resourcePath)

    if (content === null) {
      return c.json({ message: 'Resource not found' }, 404)
    }

    return c.text(content, 200)
  } catch {
    return c.json({ message: 'Resource content could not be read' }, 500)
  }
}
