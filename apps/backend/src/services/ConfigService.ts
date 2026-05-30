import { z } from 'zod'

const ResourceConfigSchema = z.object({
  name: z.string(),
  directoryPath: z.string(),
})

const ConfigSchema = z.object({
  plugins: z.array(
    z.object({
      name: z.string(),
      options: z.object({
        resources: z.array(ResourceConfigSchema).optional(),
      }).optional(),
    }),
  ).optional(),
})

export type Config = z.infer<typeof ConfigSchema>

export class ConfigService {
  private readonly config: unknown

  constructor(config: unknown) {
    this.config = config
  }

  readConfig(): Config {
    return ConfigSchema.parse(this.config)
  }
}