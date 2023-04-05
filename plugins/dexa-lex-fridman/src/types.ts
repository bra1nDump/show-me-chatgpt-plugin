import z from 'zod'

export const DexaSearchRequestBodySchema = z.object({
  query: z.string().min(1).max(500),
  topK: z.number().min(1).max(100).default(10)
})

export type DexaSearchRequestBody = z.infer<typeof DexaSearchRequestBodySchema>

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
  chunks: Chunk[]
}

export const DexaAskRequestBodySchema = z.object({
  query: z.string().min(1).max(500)
})

export type DexaAskRequestBody = z.infer<typeof DexaAskRequestBodySchema>

/** An answer from a specific person */
export type Answer = {
  /** The answer text */
  answer: string
  /** The person that answered the question */
  personName: string
  personSid: string
  /** Context used to answer the question */
  context: string
  sectionName: string
  docName: string
  chunkSid: string
  sectionSid: string
  docSid: string
}

/** Answers from all people that answered the question */
export type DexaAskResponseBody = {
  answers: Answer[]
}
