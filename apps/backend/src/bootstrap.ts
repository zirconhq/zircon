import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

import { z } from 'zod'

import { ConfigService, type PluginApp, type ResourceProvider } from '@zircon/core'
import { createPluginLoader } from '#/src/services/config/loadPlugin.ts'

const optionsSchema = z.object({
  configDir: z.string().min(1).default(resolve(homedir(), '.zircon')),
})

const options = optionsSchema.parse({
  configDir: process.env.ZIRCON_CONFIG_DIR
})

const configFilePath = resolve(options.configDir, 'config.json')
const configFile = JSON.parse(readFileSync(configFilePath, 'utf8'))
const configService = new ConfigService(configFile, createPluginLoader(options.configDir))

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
