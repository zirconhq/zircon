import { OpenAPIHono } from '@hono/zod-openapi'

import { healthHandler, healthRoute } from '#/src/routes/health.ts'
import { createResourceContentHandler, resourceContentRoute } from '#/src/routes/resources/content/get.ts'
import { createResourcesHandler, resourcesRoute } from '#/src/routes/resources/list.ts'

export const createApp = () => {
	const app = new OpenAPIHono()

	app.openapi(healthRoute, healthHandler)
	app.openapi(resourcesRoute, createResourcesHandler())
	app.openapi(resourceContentRoute, createResourceContentHandler())

	return app
}
