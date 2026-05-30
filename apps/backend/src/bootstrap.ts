import { readFileSync } from 'node:fs'
import { cwd } from 'node:process'
import { resolve } from 'node:path'

import type { ResourceProvider } from '@appcited/james-core'

import { FileProvider } from '#/src/providers/FileProvider.js'
import { ConfigService } from '#/src/services/ConfigService.js'

const configFilePath = resolve(cwd(), '.james/config.json')
const configFile = JSON.parse(readFileSync(configFilePath, 'utf8'))
const configService = new ConfigService(configFile)

const config = configService.readConfig()

export const resourceProviders: ResourceProvider[] = (config.plugins ?? [])
  .filter((plugin) => plugin.name === '@james/plugin-file')
  .flatMap((plugin) => plugin.options?.resources ?? [])
  .map((resource) => new FileProvider(resource.name, resource.directoryPath))
