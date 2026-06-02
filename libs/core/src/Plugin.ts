import type { ResourceProvider } from './ResourceProvider.ts'

export interface PluginApp {
  addResourceProvider(provider: ResourceProvider): void
}

export interface Plugin<TOptions = unknown> {
  name: string

  setup(app: PluginApp, options: TOptions): void | Promise<void>
}
