import type { Plugin } from '@zircon/core'

import { FileProvider } from './FileProvider.ts'
import { FileSystemPluginOptionsSchema, type FileSystemPluginOptions } from './FileSystemPluginOptions.ts'

const plugin: Plugin<FileSystemPluginOptions> = {
  name: '@zircon/plugin-file-system',
  optionsSchema: FileSystemPluginOptionsSchema,

  setup(app, options) {
    for (const collection of options?.collections ?? []) {
      app.addResourceProvider(new FileProvider(collection.name, collection.directoryPath))
    }
  },
}

export default plugin
