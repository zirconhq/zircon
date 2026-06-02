import z from "zod"

const PluginConfigSchema = z.object({
  enabled: z.boolean(),
  options: z.unknown().optional(),
})

export const ConfigSchema = z.object({
  plugins: z.record(z.string(), PluginConfigSchema).optional(),
})

export type Config = z.infer<typeof ConfigSchema>
