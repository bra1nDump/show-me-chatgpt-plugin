import { OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'

import * as types from './types'
import { omit } from './utils'

export class MermaidRender extends OpenAPIRoute {
  static schema = {
    tags: ['dexa'],
    summary:
      'Searches the Lex Fridman podcast for any topic and returns the most relevant results as conversation transcripts. Multiple conversation transcripts can be combined to form a summary. Always cite your sources when using this API using the citationUrl.',
    parameters: {
      query: Query(
        new Str({
          description: 'Mermaid diagram to render',
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
              diagramUrl: new Str({
                description:
                  'URL with a mermaid diagram that can be used to visualize the conversation',
                example: 'https://placekitten.com/g/200/300'
              })
            }
          ]
        }
      }
    }
  }

  async handle(request: Request, env: any, _ctx, data: Record<string, any>) {
    console.log(data)

    // const body = types.DexaSearchRequestBodySchema.parse({
    //   data,
    //   topK: 5
    // })

    // Route 1.
    // Get the id from the request, get the mermaid diagram string
    // Put in a map { user_id: mermaid_diagram_string }

    // Return a link to 2. Html with meta tags

    // In a different route to render html page with the meta tags
    // Example of what works
    // <!-- Facebook Meta Tags -->
    // <meta property="og:url" content="https://dexa.ai/lex/episodes/doc_358?sectionSid=sec_5319&chunkSid=chunk_9725">
    // <meta property="og:type" content="website">
    // <meta property="og:title" content="Daniel Negreanu: Poker | Lex Fridman Podcast #324">
    // <meta property="og:description" content="undefined">
    // <meta property="og:image" content="https://dexa.ai/resources/chunk/image/chunk_9725.png">

    // Might be optional, lets try embedding svg in the previous link.
    // 3. Another route to return the actual image content - svg inline

    const responseBody = {
      results: [
        {
          diagramUrl: 'https://placekitten.com/g/200/300'
        }
      ]
    }

    return new Response(JSON.stringify(responseBody, null, 2), {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    })
  }
}
