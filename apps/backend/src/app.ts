import { OpenAPIHono } from '@hono/zod-openapi'

import { healthHandler, healthRoute } from '#/src/routes/health.js'
import { createResourceContentHandler, resourceContentRoute } from '#/src/routes/resources/content/get.js'
import { createResourcesHandler, resourcesRoute } from '#/src/routes/resources/list.js'

export const createApp = () => {
	const app = new OpenAPIHono()

	app.openapi(healthRoute, healthHandler)
	app.openapi(resourcesRoute, createResourcesHandler())
	app.openapi(resourceContentRoute, createResourceContentHandler())

	return app
}
