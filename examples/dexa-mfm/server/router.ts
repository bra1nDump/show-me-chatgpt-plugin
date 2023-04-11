import * as z from 'zod'
import { TRPCError, initTRPC } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'
// import { ipAddress } from '@vercel/edge'
import { type OpenApiMeta } from 'trpc-openapi'

import * as config from './config'
import * as types from './types'
import { omit } from './utils'

export type Context = { ip: string | null; openaiUserLocaleInfo: string | null }

export const createContext = async ({
  req,
  res
}: CreateNextContextOptions): Promise<Context> => {
  let ip: string | null
  let openaiUserLocaleInfo: string | null

  try {
    ip = req.headers['x-forwarded-for'] as string
    openaiUserLocaleInfo = req.headers[
      'openai-subdivision-1-iso-code'
    ] as string
  } catch (err) {
    console.error(err)
  }

  return { ip, openaiUserLocaleInfo }
}

const t = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    defaultMeta: {
      title: config.aiPlugin.name,
      version: config.pkg.version
    }
  })

export const appRouter = t.router({
  search: t.procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/search',
        description:
          'Searches the MFM podcast for any topic and returns the most relevant results as conversation transcripts. Multiple conversation transcripts can be combined to form a summary. Always cite your sources when using this API via the citationUrl.'
      }
    })
    .input(z.object({ query: z.string() }))
    .output(types.DexaSearchResponseBodySchema)
    .query(async ({ input, ctx }) => {
      const dexaApiBaseUrl = process.env.DEXA_API_BASE_URL
      if (!dexaApiBaseUrl) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'DEXA_API_BASE_URL not set'
        })
      }

      if (!config.isDev && !isValidChatGPTIPAddress(ctx.ip)) {
        console.warn('search error invalid IP address', ctx.ip)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Forbidden'
        })
      }

      const detail = config.isDev
        ? ' (dev)'
        : `(${ctx.openaiUserLocaleInfo}, ${ctx.ip})`
      const { query } = input

      console.log(ctx)
      console.log()
      console.log()
      console.log('>>> search', query, detail)
      console.log()

      const url = `${dexaApiBaseUrl}/api/query-mfm`
      const body = types.DexaSearchRequestBodySchema.parse({
        query,
        // NOTE: I tried testing with returning 10 results, but ChatGPT would frequently
        // stop generating it's response in the middle of an answer, so I'm guessing the
        // returned results were too long and ChatGPT was hitting the max token limit
        // abruptly. I haven't been able to reproduce this but for `topK: 5` so far.
        topK: 5
      })

      const { results }: types.DexaSearchResponseBody = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json'
        }
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Dexa API error: ${res.statusText}`)
        }

        return res.json()
      })

      console.log(
        `search results for query "${query}"`,
        results.map((r) => ({
          ...omit(r, 'content')
        }))
      )
      console.log()
      console.log()
      console.log('<<< search', query, detail)

      return { results }
    })
})

export type AppRouter = typeof appRouter
