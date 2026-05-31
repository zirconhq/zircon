import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { homedir } from 'node:os'

import type { ResourceProvider } from '@zircon/core'

import { FileProvider } from '#/src/providers/FileProvider.ts'
import { ConfigService } from '#/src/services/ConfigService.ts'

const configFilePath = resolve(homedir(), '.zircon/config.json')
const configFile = JSON.parse(readFileSync(configFilePath, 'utf8'))
const configService = new ConfigService(configFile)

const config = configService.readConfig()

export const resourceProviders: ResourceProvider[] = (config.plugins ?? [])
  .filter((plugin) => plugin.name === '@zircon/plugin-file')
  .flatMap((plugin) => plugin.options?.resources ?? [])
  .map((resource) => new FileProvider(resource.name, resource.directoryPath))
