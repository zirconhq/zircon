import type { Resource } from './Resource.ts'

export interface ResourceProvider {
  name: string

  read(resourcePath: string): Promise<string | null>
  write(resourcePath: string, content: string): Promise<void>
  list(): Promise<Resource[]>
}
