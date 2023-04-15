import { OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'

import * as types from './types'
import { omit } from './utils'

export class MermaidRender extends OpenAPIRoute {
  /// 2. Creates /openapi.json route under the hood. Injects this into gpt prompt to teach about how to use the plugin.
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
          required: false
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

  /// 3. Handles the API request
  async handle(request: Request, env: any, _ctx, data: Record<string, any>) {
    console.log(data)

    return new Response(
      JSON.stringify({
        results: [
          {
            diagramUrl: 'https://6e55-12-94-170-82.ngrok-free.app/preview.html'
          }
        ]
      }),
      {
        headers: {
          'Access-Control-Allow-Origin': 'https://chat.openai.com/',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers':
            'Content-Type, Authorization, x-api-key',
          'Access-Control-Allow-Credentials': 'true',
          'content-type': 'application/json;charset=UTF-8'
        }
      }
    )
  }
}

export function previewHandle(request: Request) {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenGraph Image Example</title>
    <meta property="og:url" content="https://dexa.ai/lex/episodes/doc_358?sectionSid=sec_5319&chunkSid=chunk_9725">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Daniel Negreanu: Poker | Lex Fridman Podcast #324">
    <meta property="og:description" content="undefined">
    <meta property="og:image" content="https://dexa.ai/resources/chunk/image/chunk_9725.png">
  </head>
  Lol
  </html>
    `

  return new Response(html, {
    headers: {
      'Access-Control-Allow-Origin': 'https://chat.openai.com/',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
      'Access-Control-Allow-Credentials': 'true',
      'content-type': 'application/html;charset=UTF-8'
    }
  })
}
