import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import packageJson from '#/package.json' with { type: 'json' }
import { createApp } from '#/src/app.ts'

const app = createApp()

const document = app.getOpenAPI31Document({
  openapi: '3.1.0',
  info: {
    title: 'James Backend API',
    version: packageJson.version,
  },
})

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const outputPath = resolve(currentDirectory, '../../dist/openapi.json')

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8')
