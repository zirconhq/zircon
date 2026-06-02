import type { Plugin } from '@zircon/core'

export const parsePluginOptions = async <TOptions>(
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
