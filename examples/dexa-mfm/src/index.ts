import * as z from 'zod'
import { TRPCError, initTRPC } from '@trpc/server'
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
// import { ipAddress } from '@vercel/edge'
import { defineAIPluginManifest } from 'chatgpt-plugin'
import dotenv from 'dotenv-safe'
import http from 'http'
import {
  type OpenApiMeta,
  createOpenApiHttpHandler,
  generateOpenApiDocument
} from 'trpc-openapi'

import * as types from './types'
import pkg from '../package.json'
import { omit } from './utils'

export type Context = { ip: string | null; openaiUserLocaleInfo: string | null }

export const createContext = async ({
  req,
  res
}: CreateHTTPContextOptions): Promise<Context> => {
  let ip: string | null
  let openaiUserLocaleInfo: string | null

  try {
    openaiUserLocaleInfo = req.headers[
      'openai-subdivision-1-iso-code'
    ] as string
  } catch (err) {
    console.error(err)
  }

  console.log({ ip, openaiUserLocaleInfo })

  return { ip, openaiUserLocaleInfo }
}

dotenv.config()

const t = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    defaultMeta: {
      title: pkg.aiPlugin.name,
      version: pkg.version
    }
  })

export const appRouter = t.router({
  search: t.procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/search',
        description:
          'Searches the MFM podcast for any topic and returns the most relevant results as conversation transcripts. Multiple conversation transcripts can be combined to form a summary. Always cite your sources when using this API using the citationUrl.'
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

      const { query } = input
      const url = `${dexaApiBaseUrl}/api/query`
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
      console.log(
        '<<< search',
        `${query} (${ctx.openaiUserLocaleInfo}, ${ctx.ip})`
      )

      return { results }
    })
})

// export const openApiDocument = generateOpenApiDocument(appRouter, {
//   title: pkg.aiPlugin.name,
//   version: pkg.version,
//   baseUrl: 'http://localhost:3000' // TODO
// })

// router.get('/.well-known/ai-plugin.json', (request: Request) => {
//   const host = request.headers.get('host')
//   const pluginManifest = defineAIPluginManifest(
//     {
//       description_for_human: pkg.description,
//       ...pkg.aiPlugin
//     },
//     { host }
//   )

//   return new Response(JSON.stringify(pluginManifest, null, 2), {
//     headers: {
//       'content-type': 'application/json;charset=UTF-8'
//     }
//   })
// })

export type AppRouter = typeof appRouter

const server = http.createServer(
  createOpenApiHttpHandler({ router: appRouter, createContext })
)

server.listen(3000)
