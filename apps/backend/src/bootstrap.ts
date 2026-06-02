import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

import { ConfigService, type PluginApp, type ResourceProvider } from '@zircon/core'

import { loadPlugin } from '#/src/services/config/loadPlugin.ts'

const configFilePath = resolve(homedir(), '.zircon/config.json')
const configFile = JSON.parse(readFileSync(configFilePath, 'utf8'))
const configService = new ConfigService(configFile, loadPlugin)

const config = await configService.readConfig()

export const resourceProviders: ResourceProvider[] = []

const app: PluginApp = {
  addResourceProvider(resourceProvider) {
    resourceProviders.push(resourceProvider)
  },
}

for (const [pluginName, pluginConfig] of Object.entries(config.plugins ?? {})) {
  if (!pluginConfig.enabled) {
    continue
  }

  await configService.getPlugin(pluginName).setup(app, pluginConfig.options)
}
