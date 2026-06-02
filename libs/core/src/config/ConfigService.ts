import type { Plugin, PluginLoader } from '../plugin/Plugin.ts'
import { ConfigSchema, type Config } from './Config.ts'

const parsePluginOptions = async <TOptions>(
  plugin: Plugin<TOptions>,
  options: unknown,
): Promise<TOptions> => {
  const result = await plugin.optionsSchema['~standard'].validate(options)

  if (result.issues) {
    const issues = result.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join('; ')

    throw new Error(`Invalid options for plugin ${plugin.name}: ${issues}`)
  }

  return result.value
}

export class ConfigService {
  private readonly config: unknown
  private readonly loadPlugin: PluginLoader
  private readonly plugins = new Map<string, Plugin>()

  constructor(config: unknown, loadPlugin: PluginLoader) {
    this.config = config
    this.loadPlugin = loadPlugin
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
        const plugin = await this.loadPlugin(pluginName)
        this.plugins.set(pluginName, plugin)

        return [pluginName, {
          enabled: pluginConfig.enabled,
          options: await parsePluginOptions(plugin, pluginConfig.options),
        }]
      }),
    ))

    return {
      ...config,
      plugins,
    }
  }
}
