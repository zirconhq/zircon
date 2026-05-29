import { resolve } from 'node:path'

import type { ResourceProvider } from '@appcited/james-core'

import { FileProvider } from '#/src/providers/FileProvider.js'

export const resourceProviders: ResourceProvider[] = [
  new FileProvider('docs', resolve('/workspaces/james/docs')),
]
