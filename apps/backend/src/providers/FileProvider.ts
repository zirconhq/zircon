import { readdir, readFile } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'

import type { Resource, ResourceProvider } from '@zircon/core'

const hasHiddenPathSegment = (path: string): boolean =>
  path
    .split('/')
    .some((segment) => segment.startsWith('.'))

export class FileProvider implements ResourceProvider {
  readonly name: string

  private readonly directoryPath: string

  constructor(name: string, directoryPath: string) {
    this.name = name
    this.directoryPath = directoryPath
  }

  async content(resourcePath: string): Promise<string | null> {
    const absolutePath = resolve(this.directoryPath, resourcePath)
    return await readFile(absolutePath, 'utf8')
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
        name: entry.name,
        path: entry.path,
        providerName: this.name,
        uri: `/resources/${this.name}/${entry.path}`,
      }))
  }
}
