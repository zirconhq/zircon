import type { Resource } from './Resource.ts'

export interface ResourceProvider {
  name: string

  content(resourcePath: string): Promise<string | null>
  list(): Promise<Resource[]>
}
