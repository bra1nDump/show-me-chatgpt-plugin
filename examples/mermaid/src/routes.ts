import { OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'

import * as types from './types'
import { omit } from './utils'

export class Mermaid extends OpenAPIRoute {
  /// 2. Creates /openapi.json route under the hood. Injects this into gpt prompt to teach about how to use the plugin.
  static schema = {
    tags: ['dexa'],
    summary:
      'Searches the Lex Fridman podcast for any topic and returns the most relevant results as conversation transcripts. Multiple conversation transcripts can be combined to form a summary. Always cite your sources when using this API using the citationUrl.',
    parameters: {
      mermaid: Query(
        new Str({
          description: 'Mermaid diagram to render',
          example: 'graph TD; A-->B; A-->C; B-->D; C-->D;'
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

export class MermaidRender extends OpenAPIRoute {
  /// 2. Creates /openapi.json route under the hood. Injects this into gpt prompt to teach about how to use the plugin.
  static schema = {
    tags: ['dexa'],
    summary:
      'Searches the Lex Fridman podcast for any topic and returns the most relevant results as conversation transcripts. Multiple conversation transcripts can be combined to form a summary. Always cite your sources when using this API using the citationUrl.',
    parameters: {
      mermaid: Query(
        new Str({
          description: 'Mermaid diagram to render',
          example: 'graph TD; A-->B; A-->C; B-->D; C-->D;'
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
  <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    </script>
    <body>
      <pre class="mermaid" style="width: 100vw">
          ${data.mermaid.replace(/\+/g, ' ')}
      </pre>
    </body>
    <style>svg {
     max-width: none !important;
     max-height: 100vh !important;
    }</style>
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
}

``


export function renderHandle(request: Request, data: Record<string, any>) {

  
    // response.setHeader()
    // response.setHeader(
    //   'Access-Control-Allow-Methods',
    //   'GET, POST, PUT, DELETE, OPTIONS'
    // )
    // response.setHeader(
    //
    //   'Content-Type, Authorization, x-api-key'
    // )
    // response.setHeader('Access-Control-Allow-Credentials', 'true')
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
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, x-api-key',
        'Access-Control-Allow-Credentials': 'true',
        'content-type': 'text/html;charset=UTF-8'
      }
    })
    // response.setHeader()
    // response.setHeader(
    //   'Access-Control-Allow-Methods',
    //   'GET, POST, PUT, DELETE, OPTIONS'
    // )
    // response.setHeader(
    //
    //   'Content-Type, Authorization, x-api-key'
    // )
    // response.setHeader('Access-Control-Allow-Credentials', 'true')
  }
