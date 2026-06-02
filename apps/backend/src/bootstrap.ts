import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

import type { Plugin, PluginApp, ResourceProvider } from '@zircon/core'
import { fileSystemPlugin } from '@zircon/plugin-file-system'

import { ConfigService } from '#/src/services/ConfigService.ts'

const configFilePath = resolve(homedir(), '.zircon/config.json')
const configFile = JSON.parse(readFileSync(configFilePath, 'utf8'))
const configService = new ConfigService(configFile)

const config = configService.readConfig()

const installedPlugins: Plugin[] = [
  fileSystemPlugin,
]

export const resourceProviders: ResourceProvider[] = []

const app: PluginApp = {
  addResourceProvider(resourceProvider) {
    resourceProviders.push(resourceProvider)
  },
}

for (const configuredPlugin of config.plugins ?? []) {
  const plugin = installedPlugins.find((installedPlugin) => installedPlugin.name === configuredPlugin.name)
  await plugin?.setup(app, configuredPlugin.options)
}
