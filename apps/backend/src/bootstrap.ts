import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

import type { ResourceProvider } from '@zircon/core'
import { createFileSystemResourceProviders } from '@zircon/plugin-file-system'

import { ConfigService } from '#/src/services/ConfigService.ts'

const configFilePath = resolve(homedir(), '.zircon/config.json')
const configFile = JSON.parse(readFileSync(configFilePath, 'utf8'))
const configService = new ConfigService(configFile)

const config = configService.readConfig()

export const resourceProviders: ResourceProvider[] = (config.plugins ?? [])
  .filter((plugin) => plugin.name === '@zircon/plugin-file-system')
  .flatMap((plugin) => createFileSystemResourceProviders(plugin.options?.resources ?? []))
