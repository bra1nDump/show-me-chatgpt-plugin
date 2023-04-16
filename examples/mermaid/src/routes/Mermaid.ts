import { OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'

import * as types from '../types'
import { omit } from '../utils'

export class MermaidRoute extends OpenAPIRoute {
  /// 2. Creates /openapi.json route under the hood. Injects this into gpt prompt to teach about how to use the plugin.
  static schema = {
    tags: ['dexa'],
    summary: `Taking in a mermaid diagram, renders it and returns a link to the rendered image.`,
    parameters: {
      mermaid: Query(
        new Str({
          description: 'Mermaid diagram to render',
          example: `
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
          `
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

  /// 3. Handles the API request
  async handle(request: Request, env: any, _ctx, data: Record<string, any>) {
    console.log(data)
    const imageGen = encodeURIComponent("https://chatgpt-plugin-mermaid.accounts8547.workers.dev/render?mermaid=") + encodeURIComponent(data.mermaid)
    const apiResponse = await fetch(`https://v2.convertapi.com/convert/web/to/jpg?Secret=VrvzgfsXZmsQy80d&Url=${imageGen}&StoreFile=true&ConversionDelay=2`)
    const jsonResponse: any = await apiResponse.json()

    // Get the URL from the API response
    const imageUrl = jsonResponse.Files[0].Url
    return new Response(
      JSON.stringify({
        results: [
          {
            image: imageUrl,
            url: `https://chatgpt-plugin-mermaid.accounts8547.workers.dev/render?mermaid=${encodeURIComponent(data.mermaid)}`
          }
        ]
      }),
      {
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      }
    )
  }
}

// Currently unused
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
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, x-api-key',
        'Access-Control-Allow-Credentials': 'true',
        'content-type': 'text/html;charset=UTF-8'
      }
    })
  }
