import type { StandardSchemaV1 } from '@standard-schema/spec'
import { z } from 'zod'

import type { ResourceProvider } from '../resource/ResourceProvider.ts'

export interface PluginApp {
  addResourceProvider(provider: ResourceProvider): void
}

export interface Plugin<TOptions = unknown> {
  name: string

  optionsSchema: StandardSchemaV1<unknown, TOptions>

  setup(app: PluginApp, options: TOptions): void | Promise<void>
}

export const PluginSchema = z.looseObject({
  name: z.string(),
  optionsSchema: z.looseObject({
    '~standard': z.looseObject({
      validate: z.function(),
    }),
  }),
  setup: z.function(),
})
