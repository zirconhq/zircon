import { PluginSchema, type Plugin } from '@zircon/core'

const isPlugin = (value: unknown): value is Plugin => PluginSchema.safeParse(value).success

export const loadPlugin = async (pluginName: string): Promise<Plugin> => {
  const pluginModule = await import(/* @vite-ignore */ pluginName) as Record<string, unknown>

  for (const value of Object.values(pluginModule)) {
    if (isPlugin(value) && value.name === pluginName) {
      return value
    }
  }

  throw new Error(`Plugin module ${pluginName} does not export a plugin named ${pluginName}`)
}
