import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'
import mime from 'mime'

import type { Plugin, Resource, ResourceProvider } from '@zircon/core'

export type FileSystemResourceConfig = {
  name: string
  directoryPath: string
}

export type FileSystemPluginOptions = {
  resources?: FileSystemResourceConfig[]
}

const hasHiddenPathSegment = (path: string): boolean =>
  path
    .split('/')
    .some((segment) => segment.startsWith('.'))

const fallbackContentType = 'application/octet-stream'

export const createFileSystemResourceProviders = (
  resources: FileSystemResourceConfig[],
): ResourceProvider[] =>
  resources.map((resource) => new FileProvider(resource.name, resource.directoryPath))

export const fileSystemPlugin: Plugin<FileSystemPluginOptions | undefined> = {
  name: '@zircon/plugin-file-system',

  setup(app, options) {
    for (const resourceProvider of createFileSystemResourceProviders(options?.resources ?? [])) {
      app.addResourceProvider(resourceProvider)
    }
  },
}

export class FileProvider implements ResourceProvider {
  readonly name: string

  private readonly directoryPath: string

  constructor(name: string, directoryPath: string) {
    this.name = name
    this.directoryPath = directoryPath
  }

  async read(resourcePath: string): Promise<string | null> {
    const absolutePath = this.absoluteResourcePath(resourcePath)

    try {
      return await readFile(absolutePath, 'utf8')
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return null
      }

      throw error
    }
  }

  async write(resourcePath: string, content: string): Promise<void> {
    const absolutePath = this.absoluteResourcePath(resourcePath)
    await writeFile(absolutePath, content, 'utf8')
  }

  async list(): Promise<Resource[]> {
    const resources = await this.recursiveFiles(this.directoryPath)
    return resources.sort((leftResource, rightResource) => leftResource.path.localeCompare(rightResource.path))
  }

  private async recursiveFiles(directoryPath: string): Promise<Resource[]> {
    const directoryEntries = await readdir(directoryPath, {
      recursive: true,
      withFileTypes: true,
    })

    const entries = directoryEntries.map((entry) => ({
      name: entry.name,
      path: relative(this.directoryPath, join(entry.parentPath, entry.name)).split(sep).join('/'),
      parentPath: entry.parentPath,
      type: entry.isFile() ? 'file' : entry.isDirectory() ? 'directory' : 'unknown',
    }))

    return entries
      .filter((entry) => !hasHiddenPathSegment(entry.path))
      .map((entry) => ({
        contentType: mime.getType(entry.path) ?? fallbackContentType,
        name: entry.name,
        path: entry.path,
        providerName: this.name,
        uri: `/resources/${this.name}/${entry.path}`,
      }))
  }

  private absoluteResourcePath(resourcePath: string): string {
    const absolutePath = resolve(this.directoryPath, resourcePath)
    const relativePath = relative(this.directoryPath, absolutePath)

    if (relativePath === '' || relativePath === '..' || relativePath.startsWith(`..${sep}`)) {
      throw new Error('Resource path is outside the provider directory')
    }

    return absolutePath
  }
}
