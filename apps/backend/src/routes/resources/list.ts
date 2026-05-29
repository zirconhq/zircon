import { createRoute, type RouteHandler, z } from '@hono/zod-openapi'
import { resourceProviders } from '#/src/bootstrap.js'

const ResourceSchema = z
  .object({
    name: z.string().openapi({
      example: 'meeting-notes.md',
    }),
    providerName: z.string().openapi({
      example: 'docs',
    }),
    path: z.string().openapi({
      example: 'notes/meeting-notes.md',
    }),
    uri: z.string().openapi({
      example: 'james://resources/docs/notes/meeting-notes.md',
    }),
  })
  .openapi('Resource')

const ErrorResponseSchema = z
  .object({
    message: z.string().openapi({
      example: 'Resources could not be read',
    }),
  })
  .openapi('ErrorResponse')

const ResourcesResponseSchema = z.array(ResourceSchema).openapi('ResourcesResponse')

export const resourcesRoute = createRoute({
  method: 'get',
  path: '/resources',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResourcesResponseSchema,
        },
      },
      description: 'Resources from all resource providers',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Resources could not be read',
    },
  },
})

export const createResourcesHandler = (): RouteHandler<typeof resourcesRoute> => async (c) => {
  try {
    const resourceLists = await Promise.all(
      resourceProviders.map((resourceProvider) => resourceProvider.list()),
    )
    const resources = resourceLists.flat()

    return c.json(resources, 200)
  } catch {
    return c.json({ message: 'Resources could not be read' }, 500)
  }
}
