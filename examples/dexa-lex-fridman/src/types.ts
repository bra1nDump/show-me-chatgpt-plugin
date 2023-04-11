import z from 'zod'

export const DexaSearchRequestBodySchema = z.object({
  query: z.string().min(1).max(500),
  topK: z.number().min(1).max(100).default(10)
})

export type DexaSearchRequestBody = z.infer<typeof DexaSearchRequestBodySchema>

export const DexaSearchResultSchema = z.object({
  content: z.string(),
  episodeTitle: z.string(),
  chapterTitle: z.string(),
  citationUrl: z.string()
})

export const DexaSearchResponseBodySchema = z.object({
  results: z.array(DexaSearchResultSchema)
})

export type DexaSearchResult = z.infer<typeof DexaSearchResultSchema>
export type DexaSearchResponseBody = z.infer<
  typeof DexaSearchResponseBodySchema
>
