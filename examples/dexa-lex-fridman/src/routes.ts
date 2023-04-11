import { OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'

import * as types from './types'
import { omit } from './utils'

export class DexaSearch extends OpenAPIRoute {
  static schema = {
    tags: ['dexa'],
    summary:
      'Searches the Lex Fridman podcast for any topic and returns the most relevant results as conversation transcripts. Multiple conversation transcripts can be combined to form a summary. Always cite your sources when using this API using the citationUrl.',
    parameters: {
      query: Query(
        new Str({
          description: 'Search query',
          example: 'elon musk tesla'
        }),
        {
          required: true
        }
      )
    },
    responses: {
      '200': {
        schema: {
          results: [
            {
              content: new Str({
                description:
                  'The main content of this conversation transcript with speaker labels'
              }),
              episodeTitle: new Str({
                description:
                  'Title of the podcast episode this conversation is from'
              }),
              chapterTitle: new Str({
                description: 'Title of the chapter this conversation is from'
              }),
              // peopleNames: [
              //   new Str({
              //     description:
              //       'Names of the person (or people) present in the conversation'
              //   })
              // ],
              citationUrl: new Str({
                description:
                  'URL citation linking to the source of this conversation. Use this URL to cite this conversation in answers.',
                example:
                  'https://dexa.ai/lex/episodes/doc_358?sectionSid=sec_5319&chunkSid=chunk_9725'
              })
            }
          ]
        }
      }
    }
  }

  async handle(request: Request, env: any, _ctx, data: Record<string, any>) {
    const dexaApiBaseUrl = env.DEXA_API_BASE_URL
    if (!dexaApiBaseUrl) {
      return new Response('DEXA_API_BASE_URL not set', { status: 500 })
    }

    const ip = request.headers.get('Cf-Connecting-Ip')
    if (!ip) {
      console.warn('search error missing IP address')
      return new Response('invalid source IP', { status: 500 })
    }

    if (!isValidChatGPTIPAddress(ip)) {
      // console.warn('search error invalid IP address', ip)
      return new Response(`Forbidden`, { status: 403 })
    }

    const openaiUserLocaleInfo = request.headers.get(
      'openai-subdivision-1-iso-code'
    )
    const { query } = data
    console.log()
    console.log()
    console.log('>>> search', `${query} (${openaiUserLocaleInfo}, ${ip})`)
    console.log()

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
    console.log('<<< search', `${query} (${openaiUserLocaleInfo}, ${ip})`)

    const responseBody = {
      results
    }

    return new Response(JSON.stringify(responseBody, null, 2), {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    })
  }
}
