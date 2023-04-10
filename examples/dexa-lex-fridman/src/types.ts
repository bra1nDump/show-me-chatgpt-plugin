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

export type DexaSearchResponseBody = {
  results: DexaSearchResult[]
}
