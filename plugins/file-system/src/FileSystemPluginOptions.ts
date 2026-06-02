import { z } from 'zod'

const FileSystemResourceConfigSchema = z.object({
  name: z.string(),
  directoryPath: z.string(),
})

export type FileSystemResourceConfig = z.infer<typeof FileSystemResourceConfigSchema>

export const FileSystemPluginOptionsSchema = z.object({
  resources: z.array(FileSystemResourceConfigSchema).optional(),
}).optional()

export type FileSystemPluginOptions = z.infer<typeof FileSystemPluginOptionsSchema>
