import { z } from 'zod'

import type { Plugin } from '@zircon/core'

import { loadPlugin } from '#/src/services/config/loadPlugin.ts'
import { parsePluginOptions } from '#/src/services/config/parsePluginOptions.ts'

const PluginConfigSchema = z.object({
  enabled: z.boolean(),
  options: z.unknown().optional(),
})

const ConfigSchema = z.object({
  plugins: z.record(z.string(), PluginConfigSchema).optional(),
})

export type Config = z.infer<typeof ConfigSchema>

export class ConfigService {
  private readonly config: unknown
  private readonly plugins = new Map<string, Plugin>()

  constructor(config: unknown) {
    this.config = config
  }

  getPlugin(pluginName: string): Plugin {
    const plugin = this.plugins.get(pluginName)

    if (!plugin) {
      throw new Error(`Plugin ${pluginName} has not been loaded`)
    }

    return plugin
  }

  async readConfig(): Promise<Config> {
    const config = ConfigSchema.parse(this.config)
    const plugins = Object.fromEntries(await Promise.all(
      Object.entries(config.plugins ?? {}).map(async ([pluginName, pluginConfig]) => {
        const plugin = await loadPlugin(pluginName)
        this.plugins.set(pluginName, plugin)

        return [pluginName, {
          enabled: pluginConfig.enabled,
          options: await parsePluginOptions(plugin, pluginConfig.options),
        }]
      }),
    ))

    return config
  }
}
