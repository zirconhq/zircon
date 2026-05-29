import { readdir, readFile } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'

import type { Resource, ResourceProvider } from '@appcited/james-core'

const buildResourceUri = (providerName: string, path: string): string =>
  `/resources/${providerName}/${path}`

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
    const entries = await readdir(directoryPath, {
      recursive: true,
      withFileTypes: true,
    });

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const path = relative(this.directoryPath, join(entry.parentPath, entry.name)).split(sep).join('/')
        return {
          name: entry.name,
          path,
          providerName: this.name,
          uri: buildResourceUri(this.name, path),
        }
      })
    };
}
