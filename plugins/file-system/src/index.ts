import type { Plugin } from '@zircon/core'

import { FileProvider } from './FileProvider.ts'
import { FileSystemPluginOptionsSchema, type FileSystemPluginOptions } from './FileSystemPluginOptions.ts'

export const fileSystemPlugin: Plugin<FileSystemPluginOptions> = {
  name: '@zircon/plugin-file-system',
  optionsSchema: FileSystemPluginOptionsSchema,

  setup(app, options) {
    for (const resource of options?.resources ?? []) {
      app.addResourceProvider(new FileProvider(resource.name, resource.directoryPath))
    }
  },
}
