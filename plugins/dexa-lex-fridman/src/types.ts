import z from 'zod'

export const DexaSearchRequestBodySchema = z.object({
  query: z.string().min(1).max(500),
  topK: z.number().min(1).max(100).default(10)
})

export type DexaSearchRequestBody = z.infer<typeof DexaSearchRequestBodySchema>

export type DexaSearchResult = {
  episodeTitle: string
  chapterTitle: string
  content: string
  citationUrl: string
}

export type Chunk = {
  /** The text content of the chunk */
  content: string
  /** GPT generated summary of the chunk content */
  chunkSummary?: string | null
  /** Names and short IDs of the people that speak in the chunk */
  peopleSids: string[]
  peopleNames: string[]
  /** Titles for the chunk, section (chapter), and document (episode) */
  chunkName: string
  sectionName: string
  docName: string
  /** The short IDs are used in route URLs and dynamic image URLs */
  docSid: string
  sectionSid: string
  chunkSid: string
}

export type DexaSearchResponseBody = {
  results: DexaSearchResult[]
}
