import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { serveStatic } from '@hono/node-server/serve-static'
import { OpenAPIHono } from '@hono/zod-openapi'

import { healthHandler, healthRoute } from '#/src/routes/health.ts'
import { createResourceContentHandler, resourceContentRoute } from '#/src/routes/resources/content/get.ts'
import { createWriteResourceContentHandler, writeResourceContentRoute } from '#/src/routes/resources/content/put.ts'
import { createResourcesHandler, resourcesRoute } from '#/src/routes/resources/list.ts'

export const createApp = () => {
	const app = new OpenAPIHono()

	const api = app.basePath('/api')
	api.openapi(healthRoute, healthHandler)
	api.openapi(resourcesRoute, createResourcesHandler())
	api.openapi(resourceContentRoute, createResourceContentHandler())
	api.openapi(writeResourceContentRoute, createWriteResourceContentHandler())
	
	const currentDirectory = dirname(fileURLToPath(import.meta.url))
	const webRoot = resolve(currentDirectory, '../dist/web')
	app.use('/assets/*', serveStatic({ root: webRoot }))
	app.get('*', serveStatic({ root: webRoot, path: './index.html' }))

	return app
}
