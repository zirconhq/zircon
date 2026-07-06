import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { PluginSchema, type Plugin } from '@zircon/core'

const isPlugin = (value: unknown): value is Plugin => PluginSchema.safeParse(value).success

const importPluginModule = async (configDir: string, pluginName: string): Promise<Record<string, unknown>> => {
  const require = createRequire(resolve(configDir, 'package.json'))
  const pluginPath = require.resolve(pluginName)

  return await import(/* @vite-ignore */ pathToFileURL(pluginPath).href) as Record<string, unknown>
}

export const createPluginLoader = (configDir: string) => async (pluginName: string): Promise<Plugin> => {
  const pluginModule = await importPluginModule(configDir, pluginName)
  const plugin = pluginModule.default

  if (!isPlugin(plugin)) {
    throw new Error(`Plugin module ${pluginName} does not export a default plugin`)
  }

  return plugin
}
